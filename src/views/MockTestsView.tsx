import React, { useState, useMemo, useEffect } from 'react';
import { DBService } from '../services/dbService';
import { MockTest, Question } from '../types/database';
import { 
  Clock, Play, Award, Shield, AlertCircle, FileCheck, Layers, 
  Sparkles, Brain, Sliders, CheckCircle2, BookOpen, Shuffle, Filter, 
  ArrowRight, Check, Flame, ChevronRight, RefreshCw, HelpCircle,
  Languages
} from 'lucide-react';
import { AIGenerateMockTestModal } from '../components/ai/AIGenerateMockTestModal';
import { getTNPSCQuestions, convertTNPSCQuestionToQuestion } from '../services/tnpscPaperData';
import { QuestionPoolManager } from '../services/questionPoolManager';
import { AIGeneratorService } from '../services/aiGenerator';
import { useLanguage } from '../contexts/LanguageContext';

interface MockTestsViewProps {
  onStartMockTest: (test: MockTest, questions: Question[], languageMode?: 'Tamil' | 'English' | 'Both') => void;
}

type TestMode = 'pyq' | 'ai_generated' | 'mixed';

const EXAM_SUBJECT_TAXONOMY: Record<string, { name: string; topics: string[] }[]> = {
  'TNPSC Group 4': [
    {
      name: 'General Knowledge',
      topics: [
        'Indian Polity & Constitution',
        'Indian History & Culture',
        'Indian Economy',
        'General Science (Physics & Chemistry)',
        'Botany & Zoology',
        'Geography of India & Tamil Nadu',
        'Current Affairs & National Events',
      ],
    },
    {
      name: 'General Mental Ability',
      topics: [
        'Aptitude & Mental Ability',
        'Simplification',
        'Percentage',
        'Highest Common Factor (HCF) & LCM',
        'Ratio and Proportion',
        'Simple Interest & Compound Interest',
        'Area and Volume',
        'Time and Work',
        'Logical Reasoning',
      ],
    },
    {
      name: 'General English',
      topics: [
        'Grammar & Sentence Correction',
        'Synonyms & Antonyms',
        'Prepositions & Phrasal Verbs',
        'Active & Passive Voice',
        'Reading Comprehension',
        'Figures of Speech',
      ],
    },
    {
      name: 'General Tamil (பொதுத் தமிழ்)',
      topics: [
        'பகுதி அ - இலக்கணம் (Grammar)',
        'பகுதி ஆ - இலக்கியம் (Literature)',
        'பகுதி இ - தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும்',
      ],
    },
  ],
  'TNPSC Group 2': [
    {
      name: 'General Studies (Prelims)',
      topics: [
        'Indian Polity & Administration',
        'History and Culture of India',
        'Indian National Movement',
        'Geography of India',
        'General Science',
        'Socio-Economic Issues in India & TN',
      ],
    },
    {
      name: 'Aptitude & Mental Ability',
      topics: [
        'Simplification',
        'Percentage',
        'Ratio and Proportion',
        'Time and Work',
        'Logical Reasoning & Puzzles',
      ],
    },
    {
      name: 'General Tamil / English',
      topics: [
        'Grammar & Usage',
        'Comprehension & Vocabulary',
        'Translation & Precise Writing',
      ],
    },
  ],
  'SBI PO / Banking': [
    {
      name: 'Quantitative Aptitude',
      topics: [
        'Percentage',
        'Profit and Loss',
        'Time and Work',
        'Simple Interest',
        'Compound Interest',
        'Number System',
        'Average',
        'Ratio and Proportion',
        'Data Interpretation',
      ],
    },
    {
      name: 'Reasoning Ability',
      topics: [
        'Syllogism',
        'Puzzles & Seating Arrangement',
        'Blood Relations',
        'Inequalities',
        'Coding-Decoding',
        'Direction Sense',
      ],
    },
    {
      name: 'English Language',
      topics: [
        'Reading Comprehension',
        'Cloze Test',
        'Error Detection',
        'Para Jumbles',
        'Sentence Improvement',
      ],
    },
    {
      name: 'General Awareness',
      topics: [
        'Current Affairs',
        'Banking & Financial Awareness',
        'Monetary Policy & RBI Guidelines',
        'Static GK',
      ],
    },
  ],
  'SSC CGL': [
    {
      name: 'General Intelligence & Reasoning',
      topics: ['Analogies', 'Series Completion', 'Blood Relations', 'Venn Diagrams', 'Coding-Decoding'],
    },
    {
      name: 'General Awareness',
      topics: ['Indian History', 'Geography', 'Polity', 'Economics', 'General Science', 'Current Affairs'],
    },
    {
      name: 'Quantitative Aptitude',
      topics: ['Algebra', 'Geometry & Mensuration', 'Trigonometry', 'Percentage & Ratio', 'Data Interpretation'],
    },
    {
      name: 'English Comprehension',
      topics: ['Spotting Errors', 'Fill in the Blanks', 'Synonyms & Antonyms', 'Idioms & Phrases', 'Comprehension'],
    },
  ],
};

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 50, 100, 200];
const YEAR_OPTIONS = ['All Years', '2024', '2022', '2019', '2018', '2012', '2011'];

export const MockTestsView: React.FC<MockTestsViewProps> = ({ onStartMockTest }) => {
  const mockTests = DBService.getMockTests();
  const exams = DBService.getExams();

  // Active Mode State: 'pyq' | 'ai_generated' | 'mixed'
  const [activeMode, setActiveMode] = useState<TestMode>('mixed');

  // Interactive Configurator State
  const [selectedExamGroup, setSelectedExamGroup] = useState<string>('TNPSC Group 4');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [mixedPyqPercentage, setMixedPyqPercentage] = useState<number>(70); // 70% PYQ / 30% AI
  const [isBuildingTest, setIsBuildingTest] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Standard Catalog Modal & Filter State
  const [selectedCatalogExamFilter, setSelectedCatalogExamFilter] = useState('');
  const [selectedTestModal, setSelectedTestModal] = useState<MockTest | null>(null);
  const [showAITestModal, setShowAITestModal] = useState(false);

  const { language: globalLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();

  // Language Mode State (Tamil / English / Both) - synchronized with global language context
  const [languageMode, setLanguageMode] = useState<'Tamil' | 'English' | 'Both'>(globalLanguage || 'Both');

  useEffect(() => {
    if (globalLanguage) {
      setLanguageMode(globalLanguage);
    }
  }, [globalLanguage]);

  const handleSetLanguage = (lang: 'Tamil' | 'English' | 'Both') => {
    setLanguageMode(lang);
    setGlobalLanguage(lang);
  };

  // Subject list based on selected exam group
  const availableSubjects = useMemo(() => {
    const list = EXAM_SUBJECT_TAXONOMY[selectedExamGroup] || [];
    return [{ name: 'All Subjects', topics: [] }, ...list];
  }, [selectedExamGroup]);

  // Topic list based on selected subject
  const availableTopics = useMemo(() => {
    if (selectedSubject === 'All Subjects') {
      const allT = (EXAM_SUBJECT_TAXONOMY[selectedExamGroup] || []).flatMap((s) => s.topics);
      return ['All Topics', ...Array.from(new Set(allT))];
    }
    const subj = (EXAM_SUBJECT_TAXONOMY[selectedExamGroup] || []).find((s) => s.name === selectedSubject);
    return subj ? ['All Topics', ...subj.topics] : ['All Topics'];
  }, [selectedExamGroup, selectedSubject]);

  // Calculate mixed counts
  const pyqTargetCount = useMemo(() => {
    if (activeMode === 'pyq') return questionCount;
    if (activeMode === 'ai_generated') return 0;
    const count = Math.round(questionCount * (mixedPyqPercentage / 100));
    return Math.max(1, Math.min(questionCount - 1, count));
  }, [activeMode, questionCount, mixedPyqPercentage]);

  const aiTargetCount = useMemo(() => {
    if (activeMode === 'ai_generated') return questionCount;
    if (activeMode === 'pyq') return 0;
    return questionCount - pyqTargetCount;
  }, [activeMode, questionCount, pyqTargetCount]);

  // Duration calculation
  const estimatedDuration = useMemo(() => {
    if (questionCount <= 5) return 8;
    if (questionCount <= 10) return 15;
    if (questionCount <= 15) return 22;
    if (questionCount <= 20) return 30;
    if (questionCount <= 25) return 38;
    if (questionCount <= 50) return 60;
    if (questionCount <= 100) return 90;
    return 180; // 200 questions = 3 hours
  }, [questionCount]);

  // Handle Exam Group Change
  const handleExamGroupChange = (exam: string) => {
    setSelectedExamGroup(exam);
    setSelectedSubject('All Subjects');
    setSelectedTopic('All Topics');
  };

  // Handle Subject Change
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedTopic('All Topics');
  };

  // Build and launch custom test with guaranteed question count
  const handleLaunchCustomTest = async () => {
    setIsBuildingTest(true);
    setErrorMessage(null);

    try {
      const isTNPSC = selectedExamGroup.includes('TNPSC');
      let finalQuestions: Question[] = [];

      // 1. Gather PYQ Questions if needed
      let pyqQuestions: Question[] = [];
      if (pyqTargetCount > 0) {
        if (isTNPSC) {
          const normExamGroup = selectedExamGroup.includes('Group 2') ? 'Group 2' : 'Group 4';
          const normYear = selectedYear !== 'All Years' ? Number(selectedYear) : undefined;
          const contextKey = `mock_custom_${normExamGroup}_${selectedYear}_${selectedSubject}_${selectedTopic}`;

          // Fetch from authentic TNPSC questions pool matching group, year, subject and topic
          let candidateTNPSC = getTNPSCQuestions({
            examGroup: normExamGroup,
            examYear: normYear,
            subject: selectedSubject !== 'All Subjects' ? selectedSubject : undefined,
            topic: selectedTopic !== 'All Topics' ? selectedTopic : undefined,
          });

          // If topic has fewer questions than needed, fallback to same subject to fulfill exact count
          if (candidateTNPSC.length < pyqTargetCount) {
            const extra = getTNPSCQuestions({
              examGroup: normExamGroup,
              examYear: normYear,
              subject: selectedSubject !== 'All Subjects' ? selectedSubject : undefined,
            });
            const existingIds = new Set(candidateTNPSC.map((q) => q.id));
            for (const q of extra) {
              if (!existingIds.has(q.id)) {
                candidateTNPSC.push(q);
                existingIds.add(q.id);
                if (candidateTNPSC.length >= pyqTargetCount) break;
              }
            }
          }

          // If still fewer, draw from all papers of this exam group
          if (candidateTNPSC.length < pyqTargetCount) {
            const allGroupRaw = getTNPSCQuestions({ examGroup: normExamGroup });
            const existingIds = new Set(candidateTNPSC.map((q) => q.id));
            for (const q of allGroupRaw) {
              if (!existingIds.has(q.id)) {
                candidateTNPSC.push(q);
                existingIds.add(q.id);
                if (candidateTNPSC.length >= pyqTargetCount) break;
              }
            }
          }

          // If still fewer, draw from all available authentic TNPSC papers
          if (candidateTNPSC.length < pyqTargetCount) {
            const allRaw = getTNPSCQuestions();
            const existingIds = new Set(candidateTNPSC.map((q) => q.id));
            for (const q of allRaw) {
              if (!existingIds.has(q.id)) {
                candidateTNPSC.push(q);
                existingIds.add(q.id);
                if (candidateTNPSC.length >= pyqTargetCount) break;
              }
            }
          }

          // Select non-repeating questions from pool
          const chosenRaw = QuestionPoolManager.selectNonRepeating(candidateTNPSC, pyqTargetCount, contextKey);

          // Convert to Question objects with proper labels
          pyqQuestions = chosenRaw.map((q) => {
            const converted = convertTNPSCQuestionToQuestion(
              q,
              selectedExamGroup,
              q.exam_year || (selectedYear !== 'All Years' ? Number(selectedYear) : 2011)
            );
            return {
              ...converted,
              passage_text: `[Official PYQ Archive • ${q.exam_group || selectedExamGroup} ${q.exam_year || (selectedYear !== 'All Years' ? selectedYear : '2011')}] Page ${q.page_number} • ${q.subject}`,
              is_ai_generated: false,
            };
          });
        } else {
          // Banking / SSC PYQs
          const allDbPYQ = DBService.getPYQQuestions();
          let filtered = allDbPYQ;
          if (selectedSubject !== 'All Subjects') {
            filtered = filtered.filter((q) => q.subject_name?.toLowerCase().includes(selectedSubject.toLowerCase()));
          }
          if (selectedTopic !== 'All Topics') {
            filtered = filtered.filter((q) => q.topic_id?.toLowerCase().includes(selectedTopic.toLowerCase()));
          }
          if (filtered.length === 0) {
            filtered = allDbPYQ;
          }

          const contextKey = `mock_custom_bank_${selectedExamGroup}_${selectedSubject}_${selectedTopic}`;
          const chosenDbPYQ = QuestionPoolManager.selectNonRepeating(filtered, pyqTargetCount, contextKey);

          pyqQuestions = chosenDbPYQ.map((q, idx) => ({
            id: `pyq-${q.id}-${idx}`,
            exam_id: selectedExamGroup.includes('SBI') ? 'exam-sbi-po' : 'exam-ssc-cgl',
            subject_id: q.subject_id || 'subj-quant',
            topic_id: q.topic_id || 'topic-general',
            difficulty: q.difficulty || 8,
            question_text: q.question_text,
            passage_text: `[Official PYQ Paper] ${q.source_reference || 'Previous Year Archive'}`,
            options: q.options || [
              { id: '1', question_id: q.id, option_key: 'A', option_text: 'Option A', is_correct: q.correct_answer === 'A' },
              { id: '2', question_id: q.id, option_key: 'B', option_text: 'Option B', is_correct: q.correct_answer === 'B' },
              { id: '3', question_id: q.id, option_key: 'C', option_text: 'Option C', is_correct: q.correct_answer === 'C' },
              { id: '4', question_id: q.id, option_key: 'D', option_text: 'Option D', is_correct: q.correct_answer === 'D' },
            ],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            estimated_time: 60,
            language: 'English',
            is_ai_generated: false,
            status: 'approved',
            question_type: 'Multiple Choice',
            exam_name: selectedExamGroup,
            subject_name: q.subject_name || selectedSubject,
            topic_name: q.topic_id || selectedTopic,
          }));
        }
      }

      // 2. Gather AI Questions if needed
      let aiQuestions: Question[] = [];
      if (aiTargetCount > 0) {
        aiQuestions = await AIGeneratorService.generateQuestions({
          exam_id: isTNPSC ? (selectedExamGroup.includes('Group 2') ? 'exam-tnpsc-group2' : 'exam-tnpsc-group4') : 'exam-sbi-po',
          subject_id: selectedSubject !== 'All Subjects' ? selectedSubject : 'subj-gs',
          topic_id: selectedTopic !== 'All Topics' ? selectedTopic : 'General Studies',
          main_level: 'Medium',
          sub_level: 'L3',
          question_count: aiTargetCount,
          question_type: 'Multiple Choice',
          language: languageMode,
          isExplicitAITest: activeMode === 'ai_generated',
        });

        // Tag AI questions
        aiQuestions = aiQuestions.map((q, idx) => ({
          ...q,
          id: `ai-gen-${Date.now()}-${idx}`,
          passage_text: `[AI Synthesized Question • Target Pattern: ${selectedTopic !== 'All Topics' ? selectedTopic : selectedSubject}]`,
          is_ai_generated: true,
        }));
      }

      // 3. Assemble and guarantee exact question count
      finalQuestions = [...pyqQuestions, ...aiQuestions];

      // If for any unforeseen reason the combined total is less than requested, supplement from available questions
      if (finalQuestions.length < questionCount) {
        const needed = questionCount - finalQuestions.length;
        const normExamGroup = selectedExamGroup.includes('Group 2') ? 'Group 2' : 'Group 4';
        const backupRaw = getTNPSCQuestions({ examGroup: normExamGroup });
        const unusedBackup = backupRaw.filter((b) => !finalQuestions.some((f) => f.id === b.id));
        const poolToUse = unusedBackup.length >= needed ? unusedBackup : backupRaw;
        const backupConverted = QuestionPoolManager.shuffle(poolToUse).slice(0, needed).map((q, idx) => ({
          ...convertTNPSCQuestionToQuestion(q, selectedExamGroup, q.exam_year || 2011),
          id: `suppl-${Date.now()}-${idx}`,
        }));
        finalQuestions = [...finalQuestions, ...backupConverted];
      }

      // Strictly slice to exact question count
      finalQuestions = finalQuestions.slice(0, questionCount);

      // Randomize question sequence and option order (preserving Tamil + English mappings)
      finalQuestions = QuestionPoolManager.shuffle(finalQuestions).map((q) =>
        QuestionPoolManager.randomizeQuestionOptions(q)
      );

      if (finalQuestions.length !== questionCount) {
        throw new Error(`Expected exactly ${questionCount} questions, but generated ${finalQuestions.length}.`);
      }

      // Create MockTest Entity
      const modeLabel = activeMode === 'pyq' ? 'PYQ Official Mock' : activeMode === 'ai_generated' ? 'AI Targeted Mock' : 'Hybrid Mixed Mock';
      const testTitle = `${selectedExamGroup} – ${modeLabel} (${questionCount} Qs${selectedTopic !== 'All Topics' ? ` • ${selectedTopic}` : selectedSubject !== 'All Subjects' ? ` • ${selectedSubject}` : ''})`;

      const mockTestEntity: MockTest = {
        id: `mock-test-${Date.now()}`,
        title: testTitle,
        exam_id: isTNPSC ? 'exam-tnpsc-group4' : 'exam-sbi-po',
        exam_name: selectedExamGroup,
        description: `${modeLabel}: ${questionCount} questions strictly curated for ${selectedSubject} (${selectedTopic}). Mode: ${activeMode.toUpperCase()}${activeMode === 'mixed' ? ` (${mixedPyqPercentage}% PYQ / ${100 - mixedPyqPercentage}% AI)` : ''}.`,
        duration: estimatedDuration,
        total_questions: questionCount,
        total_marks: isTNPSC ? questionCount * 1.5 : questionCount,
        negative_marking: isTNPSC ? 0 : 0.25,
        difficulty_level: 8,
        is_published: true,
        questions: finalQuestions,
      };

      // Launch in PracticeEngine
      onStartMockTest(mockTestEntity, finalQuestions, languageMode);
    } catch (err: any) {
      console.error('Failed to launch custom mock test:', err);
      setErrorMessage(err.message || 'An error occurred while compiling test questions.');
    } finally {
      setIsBuildingTest(false);
    }
  };

  // Launch standard catalog test
  const handleLaunchCatalogTest = (test: MockTest) => {
    const questions = DBService.getQuestions({ examId: test.exam_id });
    const pool = questions.length >= 5 ? questions : DBService.getQuestions();
    const selected = QuestionPoolManager.selectNonRepeating(pool, test.total_questions || 25, `catalog_${test.id}`);
    const randomized = selected.map((q) => QuestionPoolManager.randomizeQuestionOptions(q));
    onStartMockTest(test, randomized, languageMode);
    setSelectedTestModal(null);
  };

  const filteredCatalogTests = selectedCatalogExamFilter
    ? mockTests.filter((t) => t.exam_id === selectedCatalogExamFilter)
    : mockTests;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> Full-Length & Sectional Mock Tests
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Mock Test Series</h1>
        <p className="text-slate-400 text-sm mt-1">
          Simulate real exam pressure with exact timing, sectional cut-offs, authentic past papers, and AI-powered practice tests.
        </p>
      </div>

      {/* ═══ LANGUAGE SELECTOR — Tamil / English / Both ═══ */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-400 text-lg">🌐</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">மொழி தேர்வு / Language Selection</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your preferred language. TNPSC PYQ original wording is preserved — no AI translations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0B0D] p-1.5 rounded-xl border border-[#393326]">
            <button
              onClick={() => handleSetLanguage('Tamil')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex flex-col items-center gap-0.5 min-w-[76px] ${
                languageMode === 'Tamil'
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'text-slate-400 hover:text-yellow-300 hover:bg-white/5'
              }`}
            >
              <span className="text-base">🇮🇳</span>
              <span className="font-tamil">தமிழ்</span>
            </button>
            <button
              onClick={() => handleSetLanguage('Both')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex flex-col items-center gap-0.5 min-w-[76px] ${
                languageMode === 'Both'
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'text-slate-400 hover:text-yellow-300 hover:bg-white/5'
              }`}
            >
              <span className="text-base">⇄</span>
              <span>Both</span>
            </button>
            <button
              onClick={() => handleSetLanguage('English')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex flex-col items-center gap-0.5 min-w-[76px] ${
                languageMode === 'English'
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'text-slate-400 hover:text-yellow-300 hover:bg-white/5'
              }`}
            >
              <span className="text-base">🔤</span>
              <span>English</span>
            </button>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-400">Active mode:</span>
          {languageMode === 'Tamil' && (
            <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full font-semibold font-tamil">
              தமிழ் — கேள்விகளும் விடைகளும் தமிழில் மட்டும்
            </span>
          )}
          {languageMode === 'English' && (
            <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-semibold">
              English — Questions, options & explanations in English only
            </span>
          )}
          {languageMode === 'Both' && (
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-semibold">
              Bilingual — English first, Tamil below (original wording preserved)
            </span>
          )}
        </div>
      </div>

      {/* THREE MODES SELECTOR HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode 1: PYQ Mock Test */}
        <div
          onClick={() => setActiveMode('pyq')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
            activeMode === 'pyq'
              ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {activeMode === 'pyq' && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> ACTIVE MODE
            </span>
          )}
          <div>
            <div className="p-3 w-fit rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Mode 1</span>
            <h3 className="text-lg font-bold text-white mt-1">Previous Year Questions (PYQ) Mock Test</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              100% authentic questions extracted from official TNPSC (Group 2 & 4), Banking, and SSC exam archives (2011–2024).
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Verified Official Bank</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Mode 2: AI Generated Practice Test */}
        <div
          onClick={() => setActiveMode('ai_generated')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
            activeMode === 'ai_generated'
              ? 'bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950 border-purple-500 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {activeMode === 'ai_generated' && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> ACTIVE MODE
            </span>
          )}
          <div>
            <div className="p-3 w-fit rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400">Mode 2</span>
            <h3 className="text-lg font-bold text-white mt-1">AI Generated Practice Test</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Synthesize brand new questions dynamically targeting your selected topics with adjustable difficulty and varied numerical values.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>OpenAI Dynamic Engine</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Mode 3: Mixed Practice Test (Hybrid) */}
        <div
          onClick={() => setActiveMode('mixed')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
            activeMode === 'mixed'
              ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          {activeMode === 'mixed' && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> ACTIVE MODE
            </span>
          )}
          <div>
            <div className="p-3 w-fit rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-4">
              <Shuffle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">Mode 3 (Recommended)</span>
            <h3 className="text-lg font-bold text-white mt-1">Mixed Practice Test (Hybrid)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Combine authentic previous year questions with fresh AI variations at your chosen custom ratio (e.g., 70% PYQ / 30% AI).
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>Custom Ratio Blending</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* INTERACTIVE MOCK TEST CONFIGURATOR PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Step-by-Step Configurator
              </span>
              <span className="text-xs text-slate-400">
                Mode: <strong className="text-white capitalize">{activeMode.replace('_', ' ')}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Configure Custom Mock Test</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select Exam, Year, Subject, Topic, and exact question count. Zero truncations guaranteed.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-medium">Mode:</span>
            <button
              onClick={() => setActiveMode('pyq')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeMode === 'pyq' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PYQ
            </button>
            <button
              onClick={() => setActiveMode('ai_generated')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeMode === 'ai_generated' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => setActiveMode('mixed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeMode === 'mixed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mixed
            </button>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Exam Group */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">1. Target Exam Group</label>
            <select
              value={selectedExamGroup}
              onChange={(e) => handleExamGroupChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-semibold transition"
            >
              <option value="TNPSC Group 4">TNPSC Group 4 (VAO / Typist)</option>
              <option value="TNPSC Group 2">TNPSC Group 2 & 2A</option>
              <option value="SBI PO / Banking">SBI PO / IBPS Banking</option>
              <option value="SSC CGL">SSC CGL / Tier-1</option>
            </select>
          </div>

          {/* 2. Exam Year */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">2. Paper Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-semibold transition"
            >
              {YEAR_OPTIONS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === 'All Years' ? 'All Archive Years (2011–2024)' : `Year ${yr}`}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Subject */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">3. Subject / Section</label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-semibold transition"
            >
              {availableSubjects.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Topic */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">4. Topic Focus</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-semibold transition"
            >
              {availableTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Question Count Selection Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">
              5. Select Number of Questions (Strict Exact Count)
            </label>
            <span className="text-xs font-bold text-indigo-400">Selected: {questionCount} Questions</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {QUESTION_COUNT_OPTIONS.map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-sm font-black">{count}</span>
                  <span className="text-[10px] font-medium opacity-80">{count === 200 ? 'Full' : 'Qs'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Mixed Mode Ratio Slider (Only shown in Mixed Mode) */}
        {activeMode === 'mixed' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Custom Ratio: Previous Year Questions (PYQ) vs. AI Variations
              </span>
              <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {mixedPyqPercentage}% PYQ : {100 - mixedPyqPercentage}% AI
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={mixedPyqPercentage}
              onChange={(e) => setMixedPyqPercentage(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            {/* Live Count Breakdown Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Official PYQs: <strong>{pyqTargetCount} Qs</strong> ({mixedPyqPercentage}%)
                </span>
              </div>

              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-lg text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  AI Synthesized: <strong>{aiTargetCount} Qs</strong> ({100 - mixedPyqPercentage}%)
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-bold ml-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total: {questionCount} Questions</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Summary Bar & Launch Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Exam</span>
              <span className="font-bold text-white truncate block">{selectedExamGroup}</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Duration</span>
              <span className="font-bold text-sky-400">{estimatedDuration} Minutes</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Questions</span>
              <span className="font-bold text-emerald-400">{questionCount} Qs</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Marking</span>
              <span className="font-bold text-amber-400">
                {selectedExamGroup.includes('TNPSC') ? '+1.5 / 0 Neg' : '+1.0 / -0.25'}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isBuildingTest}
            onClick={handleLaunchCustomTest}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isBuildingTest ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling {questionCount} Questions...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Mock Test ({questionCount} Questions)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STANDARD PRE-BUILT FULL MOCK TESTS CATALOG */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Full-Length Official Mock Catalog</h2>
            <p className="text-xs text-slate-400">
              Standard full-length mock tests mapped strictly to official exam syllabus and duration.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCatalogExamFilter('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCatalogExamFilter === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Exams
            </button>
            {exams.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedCatalogExamFilter(ex.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedCatalogExamFilter === ex.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Tests Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCatalogTests.map((test) => (
            <div
              key={test.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-sky-500/40 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {test.exam_name} Full Mock
                  </span>
                  <span className="text-xs font-semibold text-purple-400">Level {test.difficulty_level}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{test.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{test.description}</p>

                <div className="grid grid-cols-4 gap-2 mt-4 text-[11px] text-center">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block">Duration</span>
                    <span className="font-bold text-white">{test.duration} mins</span>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block">Questions</span>
                    <span className="font-bold text-white">{test.total_questions} Qs</span>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block">Total Marks</span>
                    <span className="font-bold text-emerald-400">{test.total_marks}</span>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block">Neg Mark</span>
                    <span className="font-bold text-rose-400">-{test.negative_marking}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-sky-400" /> Full Solutions Included
                </span>

                <button
                  onClick={() => setSelectedTestModal(test)}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Instructions Modal */}
      {selectedTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">{selectedTestModal.title}</h3>
            <p className="text-xs text-slate-300">
              Read instructions carefully before beginning:
            </p>

            <ul className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <li className="flex items-center gap-2">
                ✓ Total Duration: <strong>{selectedTestModal.duration} Minutes</strong>
              </li>
              <li className="flex items-center gap-2">
                ✓ Marking Scheme: <strong>+{selectedTestModal.exam_id?.includes('tnpsc') ? '1.5' : '1.0'} for correct, -{selectedTestModal.negative_marking} for wrong</strong>
              </li>
              <li className="flex items-center gap-2">
                ✓ Timer starts immediately upon launching.
              </li>
              <li className="flex items-center gap-2">
                ✓ Auto-submit triggers when time expires.
              </li>
              <li className="flex items-center gap-2">
                🌐 Language:{''}
                <strong className={languageMode === 'Tamil' ? 'text-orange-300 font-tamil' : languageMode === 'English' ? 'text-sky-300' : 'text-indigo-300'}>
                  {languageMode === 'Tamil' ? 'தமிழ் மட்டும்' : languageMode === 'English' ? 'English Only' : 'Bilingual (English + Tamil)'}
                </strong>
              </li>
            </ul>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTestModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLaunchCatalogTest(selectedTestModal)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                I Am Ready — Begin Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone AI Weak Section Generator Modal */}
      {showAITestModal && (
        <AIGenerateMockTestModal
          isOpen={true}
          onClose={() => setShowAITestModal(false)}
          onTestGenerated={(title, questions, timeLimit) => {
            const synthTest: MockTest = {
              id: `ai-test-${Date.now()}`,
              title,
              exam_id: 'exam-sbi-po',
              description: `AI-Synthesized Personalized Mock Test based on your weak sections.`,
              duration: timeLimit,
              total_questions: questions.length,
              total_marks: questions.length,
              negative_marking: 0.25,
              difficulty_level: 8,
              is_published: true,
              questions,
            };
            onStartMockTest(synthTest, questions);
          }}
        />
      )}
    </div>
  );
};
