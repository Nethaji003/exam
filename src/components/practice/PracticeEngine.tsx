import React, { useState, useEffect } from 'react';
import { Question, PreviousYearQuestion, TestAttemptResult } from '../../types/database';
import { Timer, Bookmark, ChevronLeft, ChevronRight, CheckCircle, Flag, RotateCcw, AlertTriangle, Send, Sparkles, BookOpen } from 'lucide-react';
import { DBService } from '../../services/dbService';
import { saveTNPSCAttempt } from '../../services/tnpscPaperData';
import { TestResultModal } from './TestResultModal';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

interface PracticeEngineProps {
  title: string;
  testType: 'Practice' | 'PYQ Paper' | 'Mock Test' | 'Daily Challenge' | 'Revision';
  questions: (Question | PreviousYearQuestion)[];
  timeLimitMinutes?: number;
  negativeMarking?: number;
  languageMode?: 'Tamil' | 'English' | 'Both';
  onExit: () => void;
}

/** Resolve the display question text based on language mode */
function resolveQuestionText(q: Question | PreviousYearQuestion, mode: 'Tamil' | 'English' | 'Both'): { en: string; ta: string } {
  const asQ = q as Question;
  const en = asQ.question_text_en || asQ.question_text || '';
  const ta = asQ.question_text_ta || '';

  if (mode === 'Tamil') return { en: '', ta: ta || en };
  if (mode === 'English') return { en: en, ta: '' };
  return { en: en || asQ.question_text, ta: ta };
}

/** Resolve explanation based on language mode */
function resolveExplanation(q: Question | PreviousYearQuestion, mode: 'Tamil' | 'English' | 'Both'): { en: string; ta: string } {
  const asQ = q as Question;
  const en = asQ.explanation || '';
  const ta = asQ.explanation_ta || '';
  if (mode === 'Tamil') return { en: '', ta: ta || en };
  if (mode === 'English') return { en, ta: '' };
  return { en, ta };
}

export const PracticeEngine: React.FC<PracticeEngineProps> = ({
  title,
  testType,
  questions,
  timeLimitMinutes,
  negativeMarking = 0,
  languageMode = 'Both',
  onExit,
}) => {
  const { t, isTamil, isBoth } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({});
  const [numericalInput, setNumericalInput] = useState('');
  
  // Timer state
  const totalDurationSeconds = timeLimitMinutes ? timeLimitMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDurationSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookmarkSuccess, setBookmarkSuccess] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);

  // Fallback safe index
  const currentQ = questions[currentIdx] || questions[0];

  // Timer Tick
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (timeLimitMinutes && secondsRemaining > 0) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }

      // Track time spent per individual question
      if (currentQ?.id) {
        setTimePerQuestion((prev) => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, timeLimitMinutes, secondsRemaining, currentQ?.id]);

  const handleSelectOption = (optionKey: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const handleNumericalChange = (val: string) => {
    setNumericalInput(val);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setNumericalInput('');
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleBookmark = () => {
    DBService.addBookmark(currentQ.id, 'Bookmarked during exam');
    setBookmarkSuccess(currentQ.id);
    setTimeout(() => setBookmarkSuccess(null), 2000);
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    const answeredCount = Object.keys(userAnswers).length;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (!userAns) {
        unattemptedCount++;
      } else if (String(userAns).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase()) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const marksPerQ = 1.5; // TNPSC Standard
    const rawScore = correctCount * marksPerQ - wrongCount * negativeMarking;
    const score = Math.max(0, Number(rawScore.toFixed(2)));
    const totalMarks = questions.length * marksPerQ;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const percentage = Math.round((correctCount / questions.length) * 100);

    const resultObj: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      test_title: title,
      test_type: testType,
      score: score,
      max_score: totalMarks,
      correct_count: correctCount,
      wrong_count: wrongCount,
      skipped_count: unattemptedCount,
      accuracy_percentage: accuracy,
      total_time_taken: timeLimitMinutes ? totalDurationSeconds - secondsRemaining : secondsElapsed,
      completed_at: new Date().toISOString(),
      weak_topics: [
        { topic_id: 'top-1', topic_name: currentQ.topic_name || 'General Studies', subject_name: currentQ.subject_name || 'TNPSC', accuracy: Math.max(30, accuracy - 15) }
      ],
    };

    DBService.saveTestAttempt(resultObj);

    if (title.includes('TNPSC') || testType === 'Mock Test') {
      saveTNPSCAttempt({
        mode: testType,
        totalQuestions: questions.length,
        attempted: answeredCount,
        correct: correctCount,
        wrong: wrongCount,
        score,
        accuracyPercentage: accuracy,
        timeSpentSeconds: timeLimitMinutes ? totalDurationSeconds - secondsRemaining : secondsElapsed,
      });
    }

    setTestResult(resultObj);
    setIsSubmitted(true);
    setShowConfirmModal(false);

    if (accuracy >= 75) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isAiGen = (currentQ as Question).is_ai_generated;

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{ background: '#0B0B0D', color: '#F5F5F5' }}
    >
      {/* ── Top Practice Header ───────────────────────────────────── */}
      <header
        className="h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md"
        style={{
          background: 'rgba(18,18,20,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #393326',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="btn-dark text-xs py-1.5 px-3"
          >
            <ChevronLeft className="w-4 h-4" /> Exit
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="gold-badge">
                {testType}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-xs md:max-w-md">{title}</h1>
            </div>
          </div>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shadow-inner"
            style={{
              background: '#0B0B0D',
              border: '1px solid #393326',
              color: '#D4AF37',
            }}
          >
            <Timer className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>{timeLimitMinutes ? formatTime(secondsRemaining) : formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn-gold text-xs px-4 py-2"
          >
            <Send className="w-3.5 h-3.5" /> {t.submit}
          </button>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Box & Controls */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          <div className="gold-card p-6 flex-1 flex flex-col justify-between">
            <div>
              {/* Question Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#393326] mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: '#F5F5F5' }}>
                    {isTamil ? `வினா ${currentIdx + 1} / ${questions.length}` : `Question ${currentIdx + 1} of ${questions.length}`}
                  </span>
                  {isAiGen ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Generated
                    </span>
                  ) : (
                    <span className="gold-badge">
                      <BookOpen className="w-3.5 h-3.5" /> Previous Year Question
                    </span>
                  )}
                  {languageMode === 'Tamil' && (
                    <span className="gold-badge font-tamil">
                      தமிழ்
                    </span>
                  )}
                  {languageMode === 'English' && (
                    <span className="gold-badge">
                      English
                    </span>
                  )}
                  {languageMode === 'Both' && (
                    <span className="gold-badge">
                      ⇄ Bilingual
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className="btn-dark text-xs py-1.5 px-3"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-yellow-400" />
                    {bookmarkSuccess === currentQ.id ? 'Saved!' : t.bookmark}
                  </button>

                  <button
                    onClick={handleToggleReview}
                    className={`py-1.5 px-3 rounded-xl border text-xs flex items-center gap-1 transition ${
                      markedForReview[currentQ.id]
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                        : 'bg-[#19191C] border-[#393326] text-[#A7A7A7] hover:border-yellow-600/40'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {markedForReview[currentQ.id] ? t.markedForReview : t.markForReview}
                  </button>
                </div>
              </div>

              {/* Passage text if present */}
              {currentQ.passage_text && (
                <div className="mb-4 p-4 rounded-xl text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed"
                  style={{ background: '#121214', border: '1px solid #393326' }}>
                  <strong className="text-yellow-400 block mb-1">Reference:</strong>
                  {currentQ.passage_text}
                </div>
              )}

              {/* Question Body — Language Aware */}
              {(() => {
                const asQ = currentQ as Question;
                const qEn = asQ.question_text_en || asQ.question_text || '';
                const qTa = asQ.question_text_ta || '';

                if (languageMode === 'Tamil') {
                  return (
                    <div className="text-base md:text-lg font-medium text-white whitespace-pre-line leading-relaxed mb-6 tamil-text">
                      {qTa || qEn}
                    </div>
                  );
                }

                if (languageMode === 'English') {
                  return (
                    <div className="text-base md:text-lg font-medium text-white whitespace-pre-line leading-relaxed mb-6">
                      {qEn}
                    </div>
                  );
                }

                // Both / Bilingual Mode
                return (
                  <div className="mb-6 space-y-4">
                    {/* English Question */}
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-yellow-400/90 block mb-1">
                        ENGLISH QUESTION:
                      </span>
                      <div className="text-base md:text-lg font-medium text-white whitespace-pre-line leading-relaxed">
                        {qEn}
                      </div>
                    </div>

                    {/* Tamil Question immediately underneath */}
                    {qTa && (
                      <div className="pt-3 border-t border-[#393326]/80">
                        <span className="text-[11px] font-bold tracking-wider text-yellow-400/90 block mb-1 font-tamil">
                          தமிழ் கேள்வி:
                        </span>
                        <div className="text-base md:text-lg font-medium text-yellow-100/95 whitespace-pre-line leading-relaxed tamil-text">
                          {qTa}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Options */}
              {currentQ.options && currentQ.options.length > 0 ? (
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.option_key;
                    const optEn = opt.option_text_en || opt.option_text;
                    const optTa = opt.option_text_ta || '';
                    const hasTamilText = Boolean(optTa && optTa.trim() !== optEn.trim());
                    // Pure number / currency check: don't duplicate numbers
                    const isPureNumber = /^[₹$]?\s*[\d,.]+(\s*(%|days|நாட்கள்|m|s|kg|cm|marks|மதிப்பெண்கள்)?)?$/i.test(opt.option_text.trim());
                    const showTamilBelow = (languageMode === 'Both') && hasTamilText && !isPureNumber;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.option_key)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center justify-between group ${
                          isSelected
                            ? 'border-yellow-500 shadow-md'
                            : 'hover:border-yellow-600/40 text-slate-300'
                        }`}
                        style={
                          isSelected
                            ? { background: 'rgba(212,175,55,0.12)', borderColor: '#D4AF37', color: '#F5F5F5' }
                            : { background: '#121214', borderColor: '#393326' }
                        }
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span
                            className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border transition shrink-0 mt-0.5"
                            style={
                              isSelected
                                ? { background: '#D4AF37', color: '#0B0B0D', borderColor: '#D4AF37' }
                                : { background: '#19191C', borderColor: '#393326', color: '#A7A7A7' }
                            }
                          >
                            {opt.option_key}
                          </span>

                          <div className="flex-1 min-w-0">
                            {languageMode === 'Tamil' ? (
                              <span className="font-semibold text-white text-sm tamil-text block leading-relaxed">
                                {optTa || optEn}
                              </span>
                            ) : languageMode === 'English' ? (
                              <span className="font-semibold text-white text-sm block leading-relaxed">
                                {optEn}
                              </span>
                            ) : (
                              /* Both Mode */
                              <div>
                                <span className="font-semibold text-white text-sm block leading-snug">
                                  {optEn}
                                </span>
                                {showTamilBelow && (
                                  <span className="text-xs text-yellow-200/90 tamil-text block mt-1 leading-snug">
                                    {optTa}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 shrink-0 ml-3" style={{ color: '#D4AF37' }} />}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-[#393326] mt-6 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={handleClearResponse}
                className="btn-dark text-xs py-2 px-3"
              >
                {t.clearResponse}
              </button>

              <div className="flex items-center gap-3">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  className="btn-dark disabled:opacity-40 text-xs py-2 px-3 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> {t.previous}
                </button>

                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn-gold text-xs py-2 px-4 flex items-center gap-1"
                >
                  {currentIdx === questions.length - 1 ? 'Save & Finish' : t.next} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="lg:col-span-1 gold-panel p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Question Palette</h3>
              <span className="text-[11px] font-mono text-yellow-400 font-bold">{questions.length} Qs</span>
            </div>

            {/* Live Question Status Counts */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2.5 rounded-xl flex flex-col justify-between min-h-[72px]" style={{ background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)' }}>
                <div>
                  <span className="text-[11px] text-emerald-400 block font-bold leading-tight">Answered</span>
                  <span className="text-[9px] text-emerald-300/80 font-tamil block leading-tight mt-0.5">பதிலளித்தவை</span>
                </div>
                <span className="text-base font-black text-emerald-300 mt-1">{Object.keys(userAnswers).length}</span>
              </div>
              <div className="p-2.5 rounded-xl flex flex-col justify-between min-h-[72px]" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
                <div>
                  <span className="text-[11px] text-purple-400 block font-bold leading-tight">Marked</span>
                  <span className="text-[9px] text-purple-300/80 font-tamil block leading-tight mt-0.5">மறுஆய்வுக்கு</span>
                </div>
                <span className="text-base font-black text-purple-300 mt-1">{Object.values(markedForReview).filter(Boolean).length}</span>
              </div>
              <div className="p-2.5 rounded-xl flex flex-col justify-between min-h-[72px]" style={{ background: '#121214', border: '1px solid #393326' }}>
                <div>
                  <span className="text-[11px] text-slate-300 block font-bold leading-tight">Unanswered</span>
                  <span className="text-[9px] text-slate-400 font-tamil block leading-tight mt-0.5">பதிலளிக்காதவை</span>
                </div>
                <span className="text-base font-black text-slate-200 mt-1">{Math.max(0, questions.length - Object.keys(userAnswers).length)}</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4 pb-4 border-b border-[#393326]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0"></span>
                <span className="leading-tight">Answered <span className="text-[9px] text-slate-400 font-tamil block">பதிலளித்தவை</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-500 shrink-0"></span>
                <span className="leading-tight">Marked <span className="text-[9px] text-slate-400 font-tamil block">மறுஆய்வு</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#121214] border border-[#393326] shrink-0"></span>
                <span className="leading-tight">Unanswered <span className="text-[9px] text-slate-400 font-tamil block">பதிலளிக்காதவை</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ background: '#D4AF37' }}></span>
                <span className="leading-tight">Active <span className="text-[9px] text-slate-400 font-tamil block">தற்போதைய</span></span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAns = Boolean(userAnswers[q.id]);
                const isMrk = Boolean(markedForReview[q.id]);
                const isActive = currentIdx === idx;

                let btnBg = '#121214';
                let btnColor = '#A7A7A7';
                let btnBorder = '#393326';

                if (isMrk) {
                  btnBg = 'rgba(168,85,247,0.2)';
                  btnColor = '#D8B4FE';
                  btnBorder = '#A855F7';
                } else if (isAns) {
                  btnBg = 'rgba(39,174,96,0.2)';
                  btnColor = '#86EFAC';
                  btnBorder = '#27AE60';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 w-full rounded-xl border text-xs font-semibold flex items-center justify-center transition ${
                      isActive ? 'ring-2 ring-yellow-400 scale-105 font-bold' : ''
                    }`}
                    style={{
                      background: btnBg,
                      color: isActive ? '#D4AF37' : btnColor,
                      borderColor: isActive ? '#D4AF37' : btnBorder,
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn-gold w-full text-xs justify-center py-3"
          >
            {t.submit}
          </button>
        </div>
      </div>

      {/* Confirm Submission Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="gold-card p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Confirm Exam Submission</h3>
            <p className="text-sm text-slate-300">
              Are you sure you want to submit your test? You answered{' '}
              <strong className="text-emerald-400">{Object.keys(userAnswers).length}</strong> out of{' '}
              <strong className="text-yellow-400">{questions.length}</strong> questions.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-dark text-xs py-2 px-4"
              >
                Continue Practice
              </button>
              <button
                onClick={handleSubmitTest}
                className="btn-gold text-xs py-2 px-5"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal View after Submission */}
      {isSubmitted && testResult && (
        <TestResultModal
          result={testResult}
          questions={questions}
          userAnswers={userAnswers}
          timePerQuestion={timePerQuestion}
          onClose={onExit}
          onRetake={() => {
            setIsSubmitted(false);
            setUserAnswers({});
            setMarkedForReview({});
            setCurrentIdx(0);
            setSecondsElapsed(0);
            if (timeLimitMinutes) setSecondsRemaining(totalDurationSeconds);
          }}
        />
      )}
    </div>
  );
};
