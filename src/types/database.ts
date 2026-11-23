export type ExamCategory = 'Banking' | 'Railway' | 'SSC' | 'TNPSC';

export type QuestionType = 
  | 'Multiple Choice'
  | 'True/False'
  | 'Numerical Answer'
  | 'Fill in the Blank'
  | 'Assertion & Reason'
  | 'Data Interpretation'
  | 'Puzzles'
  | 'Reading Comprehension';

export type QuestionSource = 'Previous Year Question' | 'AI Generated';

export type MainDifficultyLevel = 'Easy' | 'Medium' | 'Intermediate' | 'Hard' | 'Expert';
export type SubLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type DifficultyLevelId = number; // 1 to 25

export interface Exam {
  id: string;
  code: string;
  name: string;
  category: ExamCategory;
  description: string;
  icon?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  code: string;
  description?: string;
}

export interface DifficultyLevel {
  id: DifficultyLevelId; // 1 to 25
  main_level: MainDifficultyLevel;
  sub_level: SubLevel;
  display_name: string; // e.g. "Medium L3"
  sort_order: number;
  required_questions: number;
  required_accuracy: number;
  description: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_key: string; // 'A', 'B', 'C', 'D', 'E'
  option_text: string;
  option_text_en?: string;
  option_text_ta?: string;
  is_correct: boolean;
}

export type LanguageMode = 'Tamil' | 'English' | 'Both';

export interface Question {
  id: string;
  exam_id?: string;
  subject_id: string;
  topic_id: string;
  difficulty: DifficultyLevelId; // 1..25
  main_level?: MainDifficultyLevel;
  sub_level?: SubLevel;
  question_text: string;
  question_text_ta?: string;   // Tamil version of the question
  question_text_en?: string;   // English version of the question (for bilingual PYQ)
  question_type: QuestionType;
  passage_text?: string;
  options?: QuestionOption[];
  options_ta?: QuestionOption[]; // Tamil options (if separate from English)
  correct_answer: string;
  explanation: string;
  explanation_ta?: string;     // Tamil explanation
  shortcut?: string;
  concept?: string;
  estimated_time: number; // Seconds
  language: string;
  is_ai_generated: boolean;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  created_at?: string;

  // Joined names for UI
  exam_name?: string;
  subject_name?: string;
  topic_name?: string;
}

export interface QuestionPaper {
  id: string;
  exam_group: 'Group 2' | 'Group 4';
  exam_year: number;
  exam_type: 'Prelims' | 'Mains' | 'Objective';
  language: 'Tamil' | 'English' | 'Bilingual';
  title: string;
  total_questions: number;
  duration_minutes: number;
  total_marks: number;
  pdf_file_path: string;
  file_size_bytes?: number;
  publication_status: 'Ready' | 'Incomplete' | 'Draft';
  created_at?: string;
}

export type MockTestType = 'PYQ' | 'AI_GENERATED' | 'MIXED';

export interface AdvancedMockTestConfig {
  testType: MockTestType;
  examGroup: 'Group 2' | 'Group 4' | 'Banking' | 'SSC' | 'Railway';
  examYear?: number;
  subject?: string;
  topic?: string;
  questionCount: number;
  pyqPercentage?: number; // 0 to 100 for MIXED
  durationMinutes: number;
}

export interface PreviousYearPaper {
  id: string;
  exam_id: string;
  exam_code?: string;
  exam_name?: string;
  year: number; // 2021-2025
  stage: string; // Prelims, Mains, Tier 1, Tier 2, CBT-1, CBT-2
  shift: string; // Shift 1, Shift 2, Shift 3
  exam_date: string;
  duration: number; // Minutes
  total_questions: number;
  expected_questions: number; // For paper health validation
  actual_questions_count?: number; // Computed dynamically from linked paper_id questions
  total_marks: number;
  negative_marking: number; // e.g., 0.25 or 0.33
  source: string;
  publication_status: 'Ready' | 'Incomplete' | 'Draft';
}

export interface PreviousYearQuestion {
  id: string;
  paper_id: string;
  subject_id: string;
  topic_id?: string;
  question_number: number;
  question_text: string;
  question_text_ta?: string;
  question_text_en?: string;
  question_type?: QuestionType;
  passage_text?: string;
  options?: QuestionOption[];
  correct_answer: string;
  explanation: string;
  explanation_ta?: string;
  shortcut?: string;
  concept?: string;
  difficulty: DifficultyLevelId; // 1..25
  main_level?: MainDifficultyLevel;
  sub_level?: SubLevel;
  source_reference: string;

  // Joined names
  paper_title?: string;
  subject_name?: string;
  topic_name?: string;
}

export interface MockTest {
  id: string;
  title: string;
  exam_id: string;
  exam_name?: string;
  description: string;
  duration: number;
  total_questions: number;
  total_marks: number;
  negative_marking: number;
  difficulty_level: DifficultyLevelId;
  main_level?: MainDifficultyLevel;
  sub_level?: SubLevel;
  is_published: boolean;
  questions?: Question[];
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id?: string;
  pyq_question_id?: string;
  user_answer: string;
  is_correct: boolean;
  time_taken: number;
  attempted_at: string;
}

export interface TestAttemptResult {
  id: string;
  test_title: string;
  test_type: 'Practice' | 'PYQ Paper' | 'Mock Test' | 'Daily Challenge' | 'Revision';
  score: number;
  max_score: number;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  accuracy_percentage: number;
  total_time_taken: number;
  completed_at: string;

  // PYQ Metadata
  paper_id?: string;
  exam_name?: string;
  year?: number;
  stage?: string;
  shift?: string;
  weak_topics?: { topic_id: string; topic_name: string; subject_name: string; accuracy: number }[];
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id?: string;
  pyq_question_id?: string;
  user_notes?: string;
  created_at: string;
  question?: Question | PreviousYearQuestion;
}

export interface RevisionItem {
  id: string;
  user_id: string;
  question_id?: string;
  pyq_question_id?: string;
  wrong_count: number;
  next_revision_date: string;
  revision_stage: 1 | 2 | 3; // 1-day, 3-day, 7-day
  is_resolved: boolean;
  question?: Question | PreviousYearQuestion;
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null; // YYYY-MM-DD in Asia/Kolkata
  today_completed: boolean;
  total_active_days: number;
  days_since_last_activity?: number | null;
  status_message?: string;
  week_progress?: {
    dayOfWeek: string;
    date: string;
    completed: boolean;
    isToday: boolean;
  }[];
}

export interface UserProgress {
  total_questions_solved: number;
  total_correct: number;
  total_wrong: number;
  total_study_time_seconds: number;
  overall_accuracy: number;
  current_main_level: MainDifficultyLevel;
  current_sub_level: SubLevel;
  current_difficulty_level: DifficultyLevelId; // 1..25
  streak_count: number;
  longest_streak?: number;
  last_activity_date?: string | null;
  today_completed?: boolean;
  pyqs_completed_count: number;
}

export interface TopicProgress {
  topic_id: string;
  topic_name: string;
  subject_name: string;
  unlocked_main_level: MainDifficultyLevel;
  unlocked_sub_level: SubLevel;
  questions_attempted: number;
  questions_correct: number;
  accuracy_percentage: number;
}

export interface AIGenerationRequest {
  exam_id: string;
  subject_id: string;
  topic_id: string;
  main_level: MainDifficultyLevel;
  sub_level: SubLevel;
  question_count: number;
  question_type: QuestionType;
  language: string;
  isExplicitAITest?: boolean;
}

export interface PYQDataHealth {
  total_papers: number;
  complete_papers: number; // expected == actual
  incomplete_papers: number; // 0 < actual < expected
  empty_papers: number; // actual == 0
  total_pyq_questions: number;
  papers: {
    paper_id: string;
    paper_name: string;
    expected_questions: number;
    actual_questions: number;
    missing_count: number;
    status: 'Ready' | 'Incomplete' | 'Empty';
    has_duplicate_numbers: boolean;
  }[];
}

// ============= AI OPENAI INTEGRATION TYPES =============

export type WeaknessLevel = 'Weak' | 'Needs Improvement' | 'Good' | 'Excellent';

export interface WeakSection {
  id?: number;
  sectionName: string;
  topicName: string;
  accuracy: number;
  weaknessLevel: WeaknessLevel;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  recommendations: string;
}

export interface SectionAnalysis {
  sectionName: string;
  topicName: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  accuracyPercentage: number;
  weaknessLevel: WeaknessLevel;
  recommendations: string;
}

export interface PerformanceAnalysisResult {
  id: number;
  studentId: string;
  overallAccuracy: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  createdAt: string;
  sections: SectionAnalysis[];
  repeatedMistakes?: string[];
  weakConcepts?: string;
  strongConcepts?: string;
}

export interface AIMockTestQuestion {
  id: number;
  questionText: string;
  options: { key: string; text: string; isCorrect: boolean }[];
  difficultyLevel: string;
  estimatedTime: number;
  correctAnswer: string;
  explanation: string;
  shortcut?: string;
  concept?: string;
}

export interface AIMockTestResponse {
  testId: number;
  questions: {
    id: number;
    questionText: string;
    options: string[];
    difficultyLevel: string;
    estimatedTime: number;
  }[];
  errorMessage?: string;
}

export interface AITutorData {
  sectionName: string;
  topicName: string;
  conceptExplanation: string;
  examples: string[];
  shortcuts: string[];
  formulas: string[];
  practiceQuestions: {
    questionText: string;
    options: { key: string; text: string; isCorrect?: boolean }[];
    correctAnswer: string;
    explanation: string;
  }[];
  studyOrder: string[];
}

export interface AIImprovementHistory {
  id: number;
  testAttemptId: string;
  overallAccuracy: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  repeatedMistakeTopics?: string;
  strongConcepts?: string;
  weakConcepts?: string;
  createdAt: string;
}

