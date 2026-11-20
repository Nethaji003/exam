import React, { useState } from 'react';
import { TestAttemptResult, Question, PreviousYearQuestion } from '../../types/database';
import { Award, Clock, CheckCircle2, XCircle, AlertCircle, Bookmark, Sparkles, BookOpen, ChevronRight, Share2, RotateCcw } from 'lucide-react';
import { DBService } from '../../services/dbService';
import { AIPerformanceAnalysisPanel } from '../ai/AIPerformanceAnalysisPanel';

interface TestResultModalProps {
  result: TestAttemptResult;
  questions: (Question | PreviousYearQuestion)[];
  userAnswers: Record<string, string>;
  timePerQuestion: Record<string, number>;
  onClose: () => void;
  onRetake: () => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  result,
  questions,
  userAnswers,
  timePerQuestion,
  onClose,
  onRetake,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'solutions'>('summary');
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [bookmarkSuccess, setBookmarkSuccess] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const currentQ = questions[selectedQuestionIdx];
  const isAiGen = 'is_ai_generated' in currentQ ? currentQ.is_ai_generated : false;
  const userAns = userAnswers[currentQ?.id] || 'Skipped';
  const isCorrect = userAns === currentQ?.correct_answer;
  const isSkipped = !userAnswers[currentQ?.id];

  const handleBookmark = (qId: string) => {
    const isPyq = !('is_ai_generated' in currentQ);
    DBService.addBookmark(qId, notes || 'Saved from test results', isPyq);
    setBookmarkSuccess(qId);
    setTimeout(() => setBookmarkSuccess(null), 2500);
  };

  const avgTimeSeconds = Math.round(result.total_time_taken / (questions.length || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {result.test_type}
              </span>
              <span className="text-xs text-slate-400">Completed at {new Date(result.completed_at).toLocaleTimeString()}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{result.test_title}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Done
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Performance Summary
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'solutions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Question Solutions ({questions.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'summary' ? (
            <div className="space-y-6">
              {/* Score Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Score</span>
                  <p className="text-3xl font-extrabold text-indigo-400 mt-1">
                    {result.score} <span className="text-sm font-normal text-slate-400">/ {result.max_score}</span>
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accuracy</span>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-1">{result.accuracy_percentage}%</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Taken</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {Math.floor(result.total_time_taken / 60)}m {result.total_time_taken % 60}s
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Time / Q</span>
                  <p className="text-2xl font-bold text-sky-400 mt-1">{avgTimeSeconds}s</p>
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-emerald-300">Correct Answers</span>
                    <p className="text-2xl font-bold text-emerald-400">{result.correct_count}</p>
                  </div>
                </div>

                <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-lg">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-rose-300">Wrong Answers</span>
                    <p className="text-2xl font-bold text-rose-400">{result.wrong_count}</p>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-3 bg-slate-700/30 text-slate-400 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Skipped Questions</span>
                    <p className="text-2xl font-bold text-slate-300">{result.skipped_count}</p>
                  </div>
                </div>
              </div>

              {/* Adaptive Feedback Recommendation */}
              <div className="bg-gradient-to-r from-indigo-900/30 via-slate-800/50 to-slate-900 border border-indigo-500/30 rounded-xl p-5 flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl mt-0.5">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">AI Adaptive Learning Feedback</h4>
                  {result.accuracy_percentage >= 85 ? (
                    <p className="text-sm text-slate-300 mt-1">
                      🔥 Outstanding performance! You achieved <strong className="text-emerald-400">{result.accuracy_percentage}% accuracy</strong>. We recommend upgrading to <strong>Level {Math.min(5, (questions[0]?.difficulty || 3) + 1)} Difficulty</strong> to push your limits further.
                    </p>
                  ) : result.accuracy_percentage >= 60 ? (
                    <p className="text-sm text-slate-300 mt-1">
                      👍 Good attempt! You scored <strong className="text-indigo-400">{result.accuracy_percentage}% accuracy</strong>. Continue practicing at <strong>Level {questions[0]?.difficulty || 3}</strong> until your accuracy exceeds 85%.
                    </p>
                  ) : (
                    <p className="text-sm text-slate-300 mt-1">
                      ⚠️ Needs Revision! Accuracy is <strong className="text-rose-400">{result.accuracy_percentage}%</strong>. Review your wrong answers in <strong>My Revision</strong> and focus on core concepts before attempting higher difficulties.
                    </p>
                  )}
                </div>
              </div>

              {/* OpenAI Real-time Diagnostic Analysis Panel */}
              <AIPerformanceAnalysisPanel
                testResult={result}
                questions={questions}
                userAnswers={userAnswers}
              />
            </div>
          ) : (
            /* Solutions View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question Palette Sidebar */}
              <div className="md:col-span-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Questions Palette</h4>
                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const uAns = userAnswers[q.id];
                    const isRight = uAns === q.correct_answer;
                    const isSkp = !uAns;

                    let bg = 'bg-slate-800 text-slate-400 border-slate-700';
                    if (isRight) bg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                    else if (!isSkp) bg = 'bg-rose-500/20 text-rose-400 border-rose-500/40';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestionIdx(idx)}
                        className={`h-9 w-9 rounded-lg font-semibold text-xs border flex items-center justify-center transition ${bg} ${
                          selectedQuestionIdx === idx ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Question Detail Drawer */}
              <div className="md:col-span-2 space-y-4">
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-indigo-400">Question {selectedQuestionIdx + 1}</span>
                    {isAiGen ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Generated
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Previous Year Question
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleBookmark(currentQ.id)}
                    className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    {bookmarkSuccess === currentQ.id ? 'Bookmarked!' : 'Bookmark'}
                  </button>
                </div>

                {/* Passage Text if present */}
                {currentQ.passage_text && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 whitespace-pre-line">
                    <strong>Passage:</strong> {currentQ.passage_text}
                  </div>
                )}

                {/* Question Text */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-100 text-sm font-medium whitespace-pre-line">
                  {currentQ.question_text}
                </div>

                {/* Options List */}
                {currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((opt) => {
                      const isUserSelected = userAns === opt.option_key;
                      const isCorrectOpt = currentQ.correct_answer === opt.option_key || opt.is_correct;
                      const optEn = opt.option_text_en || opt.option_text;
                      const optTa = opt.option_text_ta || '';
                      const showTamil = optTa && optTa.trim() !== optEn.trim();

                      let optStyle = 'bg-[#121214] border-[#393326] text-slate-300';
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 font-semibold';
                      } else if (isUserSelected && !isCorrectOpt) {
                        optStyle = 'bg-rose-950/30 border-rose-500/60 text-rose-200 font-semibold';
                      }

                      return (
                        <div key={opt.id} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}>
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-[#19191C] border border-[#393326] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {opt.option_key}
                            </span>
                            <div>
                              <span className="block">{optEn}</span>
                              {showTamil && <span className="block text-[11px] text-yellow-200/80 tamil-text mt-0.5">{optTa}</span>}
                            </div>
                          </div>
                          {isCorrectOpt && <span className="text-emerald-400 font-bold text-xs shrink-0 ml-2">✓ Correct</span>}
                          {isUserSelected && !isCorrectOpt && <span className="text-rose-400 font-bold text-xs shrink-0 ml-2">✗ Your Pick</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Solution & Explanation Block */}
                <div className="p-4 rounded-xl space-y-3" style={{ background: '#121214', border: '1px solid #393326' }}>
                  <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Detailed Solution / விரிவான தீர்வு
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{currentQ.explanation}</p>
                  {currentQ.explanation_ta && (
                    <div className="pt-2 border-t border-[#393326]/60">
                      <span className="text-[10px] font-bold text-yellow-400/90 block mb-1 font-tamil">விளக்கம்:</span>
                      <p className="text-xs text-yellow-100/90 tamil-text leading-relaxed whitespace-pre-line">{currentQ.explanation_ta}</p>
                    </div>
                  )}

                  {currentQ.shortcut && (
                    <div className="p-2.5 rounded-lg text-xs" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#E6C66D' }}>
                      ⚡ <strong>Exam Shortcut:</strong> {currentQ.shortcut}
                    </div>
                  )}

                  {currentQ.concept && (
                    <div className="p-2.5 rounded-lg text-xs text-slate-400" style={{ background: '#0B0B0D', border: '1px solid #393326' }}>
                      💡 <strong>Core Concept:</strong> {currentQ.concept}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
