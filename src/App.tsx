import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { PracticeView } from './views/PracticeView';
import { PYQView } from './views/PYQView';
import { MockTestsView } from './views/MockTestsView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { RevisionView } from './views/RevisionView';
import { PerformanceView } from './views/PerformanceView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { TNPSCGroup4View } from './views/TNPSCGroup4View';
import { TNPSCGroup2View } from './views/TNPSCGroup2View';
import { QuestionBankView } from './views/QuestionBankView';
import { StudyMaterialsView } from './views/StudyMaterialsView';
import { CurrentAffairsView } from './views/CurrentAffairsView';
import { ResultsView } from './views/ResultsView';
import { PracticeEngine } from './components/practice/PracticeEngine';
import { DBService } from './services/dbService';
import { AIGeneratorService } from './services/aiGenerator';
import { getTNPSCQuestions, convertTNPSCQuestionToQuestion, TNPSCExamConfig } from './services/tnpscPaperData';
import { QuestionPoolManager } from './services/questionPoolManager';
import { Question, PreviousYearQuestion, PreviousYearPaper, MockTest, MainDifficultyLevel, SubLevel, QuestionPaper } from './types/database';
import { Loader2, Sparkles, User, Shield, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

export function App() {
  const { t, language } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-tnpsc-group4');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [practiceStatusMsg, setPracticeStatusMsg] = useState('');

  // Active session state
  const [activeSession, setActiveSession] = useState<{
    title: string;
    testType: 'Practice' | 'PYQ Paper' | 'Mock Test' | 'Daily Challenge' | 'Revision';
    questions: (Question | PreviousYearQuestion)[];
    timeLimitMinutes?: number;
    negativeMarking?: number;
    languageMode?: 'Tamil' | 'English' | 'Both';
  } | null>(null);

  const handleStartTopicPractice = async (
    examId: string,
    subjectId: string,
    topicId: string,
    mainLevel: MainDifficultyLevel,
    subLevel: SubLevel,
    count: number
  ) => {
    const topic = DBService.getTopics().find((t) => t.id === topicId);
    const subject = DBService.getSubjects().find((s) => s.id === subjectId);

    setIsGeneratingPractice(true);
    setPracticeStatusMsg(`Preparing verified questions for ${subject?.name || 'Subject'} - ${topic?.name || 'Topic'} (${mainLevel} ${subLevel})...`);

    try {
      const isTNPSC = examId.toLowerCase().includes('tnpsc');
      let finalQuestions: Question[] = [];

      // 1. If TNPSC, draw authentic questions from paper archive
      if (isTNPSC) {
        const group = examId.includes('group2') ? 'Group 2' : 'Group 4';
        const rawPool = getTNPSCQuestions({
          examGroup: group,
          subject: subject?.name,
          topic: topic?.name,
        });

        if (rawPool.length > 0) {
          const contextKey = `topic_practice_${examId}_${subjectId}_${topicId}`;
          const selected = QuestionPoolManager.selectNonRepeating(rawPool, count, contextKey);
          finalQuestions = selected.map((q) => {
            const converted = convertTNPSCQuestionToQuestion(q, `TNPSC ${group}`, q.exam_year || 2011);
            return QuestionPoolManager.randomizeQuestionOptions(converted);
          });
        }
      }

      // 2. Supplement from database question bank if needed
      if (finalQuestions.length < count) {
        const existing = DBService.getQuestions({
          subjectId,
          topicId,
          mainLevel,
          subLevel,
        });

        if (existing.length > 0) {
          const contextKey = `topic_practice_db_${subjectId}_${topicId}`;
          const needed = count - finalQuestions.length;
          const chosenExisting = QuestionPoolManager.selectNonRepeating(existing, needed, contextKey);
          finalQuestions = [...finalQuestions, ...chosenExisting.map((q) => QuestionPoolManager.randomizeQuestionOptions(q))];
        }
      }

      // 3. Synthesize via AI if still needed
      if (finalQuestions.length < count) {
        const needed = count - finalQuestions.length;
        const generated = await AIGeneratorService.generateQuestions({
          exam_id: examId,
          subject_id: subjectId,
          topic_id: topicId,
          main_level: mainLevel,
          sub_level: subLevel,
          question_count: needed,
          question_type: 'Multiple Choice',
          language: language === 'Tamil' ? 'Tamil' : language === 'Both' ? 'Both' : 'English',
        });

        generated.forEach((q) => DBService.saveQuestion(q));
        finalQuestions = [...finalQuestions, ...generated.map((q) => QuestionPoolManager.randomizeQuestionOptions(q))];
      }

      const sliced = QuestionPoolManager.shuffle(finalQuestions.slice(0, count));

      setActiveSession({
        title: `${subject?.name || 'Subject'} – ${topic?.name || 'Topic'} (${mainLevel} ${subLevel})`,
        testType: 'Practice',
        questions: sliced,
        timeLimitMinutes: Math.max(5, Math.round(count * 1.5)),
        negativeMarking: isTNPSC ? 0 : 0.25,
        languageMode: language,
      });
    } catch (err: any) {
      console.error('Failed to prepare practice session:', err);
      alert(err.message || 'Failed to prepare practice questions. Please check question availability.');
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  const handleStartPYQPaper = (paper: PreviousYearPaper, questions: PreviousYearQuestion[]) => {
    const paperQuestions = questions.length > 0 ? questions : DBService.getPYQQuestions(paper.id);
    const nonRepeating = QuestionPoolManager.selectNonRepeating(paperQuestions, paperQuestions.length, `pyq_paper_${paper.id}`);
    const randomized = nonRepeating.map((q) => QuestionPoolManager.randomizeQuestionOptions(q as any)) as unknown as PreviousYearQuestion[];
    
    setActiveSession({
      title: `${paper.exam_name} ${paper.year} (${paper.stage} – ${paper.shift})`,
      testType: 'PYQ Paper',
      questions: randomized,
      timeLimitMinutes: paper.duration || 60,
      negativeMarking: paper.negative_marking || 0,
      languageMode: language,
    });
  };

  const handleStartMockTest = (test: MockTest, questions: Question[], languageMode?: 'Tamil' | 'English' | 'Both') => {
    const pool = questions.length > 0 ? questions : DBService.getQuestions();
    const count = test.total_questions || pool.length;
    const selected = QuestionPoolManager.selectNonRepeating(pool, count, `mock_test_${test.id}`);
    const randomized = selected.map((q) => QuestionPoolManager.randomizeQuestionOptions(q));

    setActiveSession({
      title: test.title,
      testType: 'Mock Test',
      questions: randomized,
      timeLimitMinutes: test.duration || 60,
      negativeMarking: test.negative_marking || 0,
      languageMode: languageMode || language,
    });
  };

  const handleStartDailyChallenge = (questions: Question[]) => {
    const randomized = QuestionPoolManager.shuffle(questions).map((q) => QuestionPoolManager.randomizeQuestionOptions(q));
    setActiveSession({
      title: "Today's TNPSC Power Sprint (20 Questions)",
      testType: 'Daily Challenge',
      questions: randomized,
      timeLimitMinutes: 20,
      negativeMarking: 0,
      languageMode: language,
    });
  };

  const handlePracticeRevisionItem = (q: any) => {
    setActiveSession({
      title: 'Targeted Revision Practice',
      testType: 'Revision',
      questions: [QuestionPoolManager.randomizeQuestionOptions(q)],
      timeLimitMinutes: 5,
      negativeMarking: 0,
      languageMode: language,
    });
  };

  const handleStartTNPSCTest = (config: TNPSCExamConfig) => {
    const targetGroup = config.examGroup || 'Group 4';
    const targetYear = config.examYear ? Number(config.examYear) : undefined;
    const contextKey = `tnpsc_${targetGroup}_${targetYear || 'all'}_${config.subject || 'all'}_${config.topic || 'all'}`;

    // 1. Fetch authentic questions for the exact examGroup, examYear, subject, and topic
    const rawCandidates = getTNPSCQuestions({
      examGroup: targetGroup,
      examYear: targetYear,
      subject: config.subject,
      topic: config.topic,
    });

    let pool = [...rawCandidates];

    // If candidate pool has fewer questions than requested count, broaden pool
    if (pool.length < config.questionCount) {
      const extra = getTNPSCQuestions({ examGroup: targetGroup, examYear: targetYear });
      const existingIds = new Set(pool.map((q) => q.id));
      for (const q of extra) {
        if (!existingIds.has(q.id)) {
          pool.push(q);
          existingIds.add(q.id);
          if (pool.length >= config.questionCount) break;
        }
      }
    }
    if (pool.length < config.questionCount) {
      const allGroup = getTNPSCQuestions({ examGroup: targetGroup });
      const existingIds = new Set(pool.map((q) => q.id));
      for (const q of allGroup) {
        if (!existingIds.has(q.id)) {
          pool.push(q);
          existingIds.add(q.id);
          if (pool.length >= config.questionCount) break;
        }
      }
    }
    if (pool.length < config.questionCount) {
      const allExtra = getTNPSCQuestions();
      const existingIds = new Set(pool.map((q) => q.id));
      for (const q of allExtra) {
        if (!existingIds.has(q.id)) {
          pool.push(q);
          existingIds.add(q.id);
          if (pool.length >= config.questionCount) break;
        }
      }
    }

    // 2. Select non-repeating questions from pool
    const selectedRaw = QuestionPoolManager.selectNonRepeating(pool, config.questionCount, contextKey);

    // 3. Convert to Question model with proper metadata & randomize options
    const mapped: Question[] = selectedRaw.map((q) => {
      const converted = convertTNPSCQuestionToQuestion(
        q,
        `TNPSC ${targetGroup}`,
        q.exam_year || targetYear || 2011
      );
      return QuestionPoolManager.randomizeQuestionOptions(converted);
    });

    const displayYear = targetYear || selectedRaw[0]?.exam_year || 2011;
    const testTitle = `TNPSC ${targetGroup} (${displayYear}) – ${
      config.mode === 'full' ? 'Full Official Exam' : (config.topic || config.subject || 'Practice')
    }`;

    setActiveSession({
      title: testTitle,
      testType: 'Mock Test',
      questions: mapped,
      timeLimitMinutes: config.durationMinutes,
      negativeMarking: 0,
      languageMode: language,
    });
  };

  if (activeSession) {
    return (
      <PracticeEngine
        title={activeSession.title}
        testType={activeSession.testType}
        questions={activeSession.questions}
        timeLimitMinutes={activeSession.timeLimitMinutes}
        negativeMarking={activeSession.negativeMarking}
        languageMode={activeSession.languageMode}
        onExit={() => setActiveSession(null)}
      />
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{
        backgroundColor: '#0B0B0D',
        color: '#F5F5F5',
      }}
    >
      {/* ── Header & Navigation ─────────────────────────────────────── */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        selectedExamId={selectedExamId}
        onExamChange={(examId) => {
          setSelectedExamId(examId);
          if (examId === 'exam-tnpsc-group4') setCurrentTab('tnpsc');
        }}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => {
          setIsAdminMode(!isAdminMode);
          if (!isAdminMode) setCurrentTab('admin');
          else setCurrentTab('dashboard');
        }}
      />

      {/* ── Main Tab Router ────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {isGeneratingPractice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="gold-card p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Synthesizing Verified Mock Test</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{practiceStatusMsg}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#E6C66D', border: '1px solid rgba(212,175,55,0.25)' }}>
                <Sparkles className="w-3.5 h-3.5" /> Enforcing exact question count & bilingual accuracy
              </div>
            </div>
          </div>
        )}

        {currentTab === 'landing' && (
          <LandingPage
            onStartPractice={() => setCurrentTab('practice')}
            onOpenPYQ={() => setCurrentTab('pyq')}
            onTakeMockTest={() => setCurrentTab('mock-tests')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onStartTopicPractice={(sId, tId, ml, sl) => handleStartTopicPractice(selectedExamId, sId, tId, ml, sl, 10)}
            onOpenPYQ={() => setCurrentTab('pyq')}
            onOpenRevision={() => setCurrentTab('revision')}
            onOpenGroup2={() => setCurrentTab('group2')}
            onOpenGroup4={() => setCurrentTab('tnpsc')}
            onStartAIMockTest={(title, qs, timeLimit) => {
              setActiveSession({
                title,
                testType: 'Mock Test',
                questions: qs,
                timeLimitMinutes: timeLimit,
                negativeMarking: 0,
                languageMode: language,
              });
            }}
          />
        )}

        {currentTab === 'group2' && (
          <TNPSCGroup2View
            onTakeMockTest={() => setCurrentTab('mock-tests')}
            onStartPaperTest={(paper) =>
              handleStartTNPSCTest({
                mode: 'full',
                questionCount: paper.total_questions || 200,
                durationMinutes: paper.duration_minutes || 180,
                examGroup: 'Group 2',
                examYear: paper.exam_year,
              })
            }
          />
        )}

        {currentTab === 'tnpsc' && (
          <TNPSCGroup4View
            onStartTest={handleStartTNPSCTest}
            isAdmin={isAdminMode}
          />
        )}

        {currentTab === 'pyq' && (
          <PYQView
            onStartPYQPaper={(paper, qs) => handleStartPYQPaper(paper, qs)}
            onStartTNPSCTest={(config) => handleStartTNPSCTest(config)}
          />
        )}

        {currentTab === 'question-bank' && (
          <QuestionBankView />
        )}

        {currentTab === 'mock-tests' && (
          <MockTestsView
            onStartMockTest={(test, qs, lang) => handleStartMockTest(test, qs, lang)}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            onStartSession={(eId, sId, tId, ml, sl, cnt) => handleStartTopicPractice(eId, sId, tId, ml, sl, cnt)}
          />
        )}

        {currentTab === 'study-materials' && (
          <StudyMaterialsView />
        )}

        {currentTab === 'current-affairs' && (
          <CurrentAffairsView />
        )}

        {currentTab === 'results' && (
          <ResultsView onRetakeTest={() => setCurrentTab('mock-tests')} />
        )}

        {currentTab === 'daily-challenge' && (
          <DailyChallengeView onStartChallenge={(qs) => handleStartDailyChallenge(qs)} />
        )}

        {currentTab === 'revision' && (
          <RevisionView onPracticeItem={(q) => handlePracticeRevisionItem(q)} />
        )}

        {currentTab === 'performance' && <PerformanceView />}

        {currentTab === 'admin' && <AdminDashboardView />}

        {currentTab === 'profile' && (
          <div className="gold-card p-8 max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E6C66D)', color: '#0B0B0D' }}
              >
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">TNPSC Aspirant Profile</h2>
                <span className="gold-badge mt-1">Verified Candidate</span>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-[#393326]/60">
              <div className="flex justify-between py-2">
                <span style={{ color: '#A7A7A7' }}>Name:</span>
                <span className="font-semibold text-white">Aspirant Candidate</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: '#A7A7A7' }}>Target Examinations:</span>
                <span className="font-semibold" style={{ color: '#D4AF37' }}>TNPSC Group 2, Group 4 & VAO</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: '#A7A7A7' }}>Active Language Preference:</span>
                <span className="font-semibold text-yellow-300">{language}</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: '#A7A7A7' }}>Theme:</span>
                <span className="font-semibold text-yellow-400">Premium Matte Black & Gold (#0B0B0D / #D4AF37)</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: '#A7A7A7' }}>Database Architecture:</span>
                <span className="font-semibold text-emerald-400">MySQL & High-Speed Cache Active</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className="btn-gold w-full text-xs justify-center py-3"
            >
              {t.backToDashboard}
            </button>
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Navigation ──────────────────────────────── */}
      <MobileNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />
    </div>
  );
}

export default App;
