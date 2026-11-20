import {
  Exam,
  Subject,
  Topic,
  DifficultyLevel,
  Question,
  PreviousYearPaper,
  PreviousYearQuestion,
  MockTest,
  TestAttemptResult,
  Bookmark,
  RevisionItem,
  UserProgress,
  TopicProgress,
  DifficultyLevelId,
  MainDifficultyLevel,
  SubLevel,
  PYQDataHealth,
  QuestionPaper,
} from '../types/database';
import {
  SEED_EXAMS,
  SEED_SUBJECTS,
  SEED_TOPICS,
  SEED_DIFFICULTY_LEVELS,
  SEED_QUESTIONS,
  SEED_PYQ_PAPERS,
  SEED_PYQ_QUESTIONS,
  SEED_MOCK_TESTS,
  SEED_QUESTION_PAPERS,
} from './seedData';

const STORAGE_KEYS = {
  EXAMS: 'examprep_exams',
  SUBJECTS: 'examprep_subjects',
  TOPICS: 'examprep_topics',
  QUESTIONS: 'examprep_questions',
  QUESTION_PAPERS: 'examprep_question_papers',
  PYQ_PAPERS: 'examprep_pyq_papers',
  PYQ_QUESTIONS: 'examprep_pyq_questions',
  MOCK_TESTS: 'examprep_mock_tests',
  TEST_ATTEMPTS: 'examprep_test_attempts',
  BOOKMARKS: 'examprep_bookmarks',
  REVISION: 'examprep_revision',
  USER_PROGRESS: 'examprep_user_progress',
  TOPIC_PROGRESS: 'examprep_topic_progress',
};

function getItem<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultData;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage`, err);
  }
}

export class DBService {
  // --- EXAMS, SUBJECTS, TOPICS ---
  static getExams(): Exam[] {
    return getItem<Exam[]>(STORAGE_KEYS.EXAMS, SEED_EXAMS);
  }

  static getSubjects(): Subject[] {
    return getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
  }

  static getTopics(subjectId?: string): Topic[] {
    const stored = getItem<Topic[]>(STORAGE_KEYS.TOPICS, SEED_TOPICS);
    const idSet = new Set(stored.map((t) => t.id));
    for (const seed of SEED_TOPICS) {
      if (!idSet.has(seed.id)) {
        stored.push(seed);
      }
    }
    if (!subjectId) return stored;
    return stored.filter((t) => t.subject_id === subjectId);
  }

  // 25 Data-Driven Difficulty Levels
  static getDifficultyLevels(): DifficultyLevel[] {
    return SEED_DIFFICULTY_LEVELS;
  }

  static getDifficultyLevelByMainAndSub(mainLevel: MainDifficultyLevel, subLevel: SubLevel): DifficultyLevel {
    const found = SEED_DIFFICULTY_LEVELS.find(
      (l) => l.main_level === mainLevel && l.sub_level === subLevel
    );
    return found || SEED_DIFFICULTY_LEVELS[7]; // Default Medium L3
  }

  // --- QUESTIONS (AI Practice) ---
  static getQuestions(filters?: {
    examId?: string;
    subjectId?: string;
    topicId?: string;
    mainLevel?: MainDifficultyLevel;
    subLevel?: SubLevel;
    difficulty?: DifficultyLevelId;
    status?: string;
  }): Question[] {
    let questions = getItem<Question[]>(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);

    if (filters) {
      if (filters.examId) questions = questions.filter((q) => !q.exam_id || q.exam_id === filters.examId);
      if (filters.subjectId) questions = questions.filter((q) => q.subject_id === filters.subjectId);
      if (filters.topicId) questions = questions.filter((q) => q.topic_id === filters.topicId);
      if (filters.mainLevel) questions = questions.filter((q) => q.main_level === filters.mainLevel);
      if (filters.subLevel) questions = questions.filter((q) => q.sub_level === filters.subLevel);
      if (filters.difficulty) questions = questions.filter((q) => q.difficulty === filters.difficulty);
      if (filters.status) questions = questions.filter((q) => q.status === filters.status);
    }
    return questions;
  }

  static saveQuestion(question: Question): void {
    const questions = getItem<Question[]>(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
    const existingIdx = questions.findIndex((q) => q.id === question.id);

    if (existingIdx >= 0) {
      questions[existingIdx] = question;
    } else {
      questions.unshift(question);
    }
    setItem(STORAGE_KEYS.QUESTIONS, questions);
  }

  static updateQuestionStatus(id: string, status: 'approved' | 'rejected'): void {
    const questions = getItem<Question[]>(STORAGE_KEYS.QUESTIONS, SEED_QUESTIONS);
    const target = questions.find((q) => q.id === id);
    if (target) {
      target.status = status;
      setItem(STORAGE_KEYS.QUESTIONS, questions);
    }
  }

  // --- PREVIOUS YEAR PAPERS (PYQ) FIXED DATA RELATIONSHIPS ---
  static getPYQPapers(filters?: {
    examId?: string;
    year?: number;
    stage?: string;
    shift?: string;
  }): PreviousYearPaper[] {
    let papers = getItem<PreviousYearPaper[]>(STORAGE_KEYS.PYQ_PAPERS, SEED_PYQ_PAPERS);
    const allPYQQuestions = getItem<PreviousYearQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, SEED_PYQ_QUESTIONS);

    // Compute actual_questions_count & publication_status dynamically for every paper
    papers = papers.map((paper) => {
      const linkedQuestions = allPYQQuestions.filter((q) => q.paper_id === paper.id);
      const count = linkedQuestions.length;
      const expected = paper.expected_questions || paper.total_questions || 100;
      
      let status: 'Ready' | 'Incomplete' | 'Draft' = 'Incomplete';
      if (count >= expected) status = 'Ready';
      else if (count === 0) status = 'Draft';

      return {
        ...paper,
        actual_questions_count: count,
        total_questions: count > 0 ? count : expected,
        publication_status: status,
      };
    });

    if (filters) {
      if (filters.examId) papers = papers.filter((p) => p.exam_id === filters.examId);
      if (filters.year) papers = papers.filter((p) => p.year === Number(filters.year));
      if (filters.stage) papers = papers.filter((p) => p.stage.toLowerCase() === filters.stage?.toLowerCase());
      if (filters.shift) papers = papers.filter((p) => p.shift.toLowerCase() === filters.shift?.toLowerCase());
    }
    return papers;
  }

  /**
   * CRITICAL FIX: Retrieves ALL questions belonging to exact paper_id ordered by question_number.
   * NO limit(1), slice(0, 1) or array truncations.
   */
  static getPYQQuestions(paperId?: string): PreviousYearQuestion[] {
    const allQuestions = getItem<PreviousYearQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, SEED_PYQ_QUESTIONS);
    if (!paperId) return allQuestions;

    const paperQuestions = allQuestions.filter((q) => q.paper_id === paperId);
    // Sort strictly by question_number ascending (1 to N)
    return paperQuestions.sort((a, b) => a.question_number - b.question_number);
  }

  static savePYQPaper(paper: PreviousYearPaper, questions: PreviousYearQuestion[]): void {
    const papers = getItem<PreviousYearPaper[]>(STORAGE_KEYS.PYQ_PAPERS, SEED_PYQ_PAPERS);
    papers.unshift(paper);
    setItem(STORAGE_KEYS.PYQ_PAPERS, papers);

    if (questions.length > 0) {
      const allQuestions = getItem<PreviousYearQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, SEED_PYQ_QUESTIONS);
      const updatedQuestions = [...questions, ...allQuestions];
      setItem(STORAGE_KEYS.PYQ_QUESTIONS, updatedQuestions);
    }
  }

  // --- PYQ DATA HEALTH AUDIT SYSTEM ---
  static getPYQDataHealth(): PYQDataHealth {
    const papers = this.getPYQPapers();
    const allPYQQuestions = getItem<PreviousYearQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, SEED_PYQ_QUESTIONS);

    let completeCount = 0;
    let incompleteCount = 0;
    let emptyCount = 0;

    const auditedPapers = papers.map((paper) => {
      const linkedQuestions = allPYQQuestions.filter((q) => q.paper_id === paper.id);
      const actualCount = linkedQuestions.length;
      const expectedCount = paper.expected_questions || paper.total_questions || 100;
      const missingCount = Math.max(0, expectedCount - actualCount);

      // Check duplicate question numbers
      const qNumbers = linkedQuestions.map((q) => q.question_number);
      const hasDuplicates = new Set(qNumbers).size !== qNumbers.length;

      let status: 'Ready' | 'Incomplete' | 'Empty' = 'Incomplete';
      if (actualCount >= expectedCount) {
        status = 'Ready';
        completeCount++;
      } else if (actualCount === 0) {
        status = 'Empty';
        emptyCount++;
      } else {
        status = 'Incomplete';
        incompleteCount++;
      }

      return {
        paper_id: paper.id,
        paper_name: `${paper.exam_name || 'Exam'} ${paper.year} (${paper.stage} – ${paper.shift})`,
        expected_questions: expectedCount,
        actual_questions: actualCount,
        missing_count: missingCount,
        status,
        has_duplicate_numbers: hasDuplicates,
      };
    });

    return {
      total_papers: papers.length,
      complete_papers: completeCount,
      incomplete_papers: incompleteCount,
      empty_papers: emptyCount,
      total_pyq_questions: allPYQQuestions.length,
      papers: auditedPapers,
    };
  }

  // --- QUESTION PAPERS (TNPSC Group 2 & Group 4 PDF Archive) ---
  static getQuestionPapers(filters?: {
    examGroup?: string;
    year?: number;
    language?: string;
    type?: string;
  }): QuestionPaper[] {
    let papers = getItem<QuestionPaper[]>(STORAGE_KEYS.QUESTION_PAPERS, SEED_QUESTION_PAPERS);
    if (filters) {
      if (filters.examGroup && filters.examGroup !== 'All') {
        papers = papers.filter((p) => p.exam_group.toLowerCase() === filters.examGroup?.toLowerCase());
      }
      if (filters.year) {
        papers = papers.filter((p) => p.exam_year === Number(filters.year));
      }
      if (filters.language && filters.language !== 'All') {
        papers = papers.filter((p) => p.language.toLowerCase() === filters.language?.toLowerCase());
      }
      if (filters.type && filters.type !== 'All') {
        papers = papers.filter((p) => p.exam_type.toLowerCase() === filters.type?.toLowerCase());
      }
    }
    return papers;
  }

  static saveQuestionPaper(paper: QuestionPaper): void {
    const papers = getItem<QuestionPaper[]>(STORAGE_KEYS.QUESTION_PAPERS, SEED_QUESTION_PAPERS);
    const idx = papers.findIndex((p) => p.id === paper.id);
    if (idx >= 0) {
      papers[idx] = paper;
    } else {
      papers.unshift(paper);
    }
    setItem(STORAGE_KEYS.QUESTION_PAPERS, papers);
  }

  static deleteQuestionPaper(id: string): boolean {
    const papers = getItem<QuestionPaper[]>(STORAGE_KEYS.QUESTION_PAPERS, SEED_QUESTION_PAPERS);
    const filtered = papers.filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.QUESTION_PAPERS, filtered);
    return true;
  }

  // --- MOCK TESTS ---
  static getMockTests(): MockTest[] {
    return getItem<MockTest[]>(STORAGE_KEYS.MOCK_TESTS, SEED_MOCK_TESTS);
  }

  // --- USER PROGRESS & ATTEMPTS ---
  static getUserProgress(): UserProgress {
    return getItem<UserProgress>(STORAGE_KEYS.USER_PROGRESS, {
      total_questions_solved: 38,
      total_correct: 30,
      total_wrong: 8,
      total_study_time_seconds: 5400,
      overall_accuracy: 78.95,
      current_main_level: 'Medium',
      current_sub_level: 'L3',
      current_difficulty_level: 8, // Medium L3
      streak_count: 5,
      pyqs_completed_count: 2,
    });
  }

  static updateUserLevel(mainLevel: MainDifficultyLevel, subLevel: SubLevel): void {
    const progress = this.getUserProgress();
    const lvlObj = this.getDifficultyLevelByMainAndSub(mainLevel, subLevel);
    progress.current_main_level = mainLevel;
    progress.current_sub_level = subLevel;
    progress.current_difficulty_level = lvlObj.id;
    setItem(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  static saveTestAttempt(result: TestAttemptResult): void {
    const attempts = getItem<TestAttemptResult[]>(STORAGE_KEYS.TEST_ATTEMPTS, []);
    attempts.unshift(result);
    setItem(STORAGE_KEYS.TEST_ATTEMPTS, attempts);

    // Update overall user progress
    const progress = this.getUserProgress();
    progress.total_questions_solved += result.correct_count + result.wrong_count;
    progress.total_correct += result.correct_count;
    progress.total_wrong += result.wrong_count;
    progress.total_study_time_seconds += result.total_time_taken;

    if (result.test_type === 'PYQ Paper') {
      progress.pyqs_completed_count += 1;
    }

    if (progress.total_questions_solved > 0) {
      progress.overall_accuracy = Number(
        ((progress.total_correct / progress.total_questions_solved) * 100).toFixed(2)
      );
    }
    setItem(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  static getTestAttempts(): TestAttemptResult[] {
    return getItem<TestAttemptResult[]>(STORAGE_KEYS.TEST_ATTEMPTS, [
      {
        id: 'att-101',
        test_title: 'SBI PO Percentage Medium L3 Practice',
        test_type: 'Practice',
        score: 8,
        max_score: 10,
        correct_count: 8,
        wrong_count: 2,
        skipped_count: 0,
        accuracy_percentage: 80.0,
        total_time_taken: 480,
        completed_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'att-102',
        test_title: 'RRB NTPC 2024 CBT-1 Shift 1 PYQ',
        test_type: 'PYQ Paper',
        score: 84.5,
        max_score: 100,
        correct_count: 88,
        wrong_count: 12,
        skipped_count: 0,
        accuracy_percentage: 88.0,
        total_time_taken: 3200,
        completed_at: new Date(Date.now() - 172800000).toISOString(),
        paper_id: 'pyq-paper-rrb-ntpc-2024',
        exam_name: 'RRB NTPC',
        year: 2024,
        stage: 'CBT-1',
        shift: 'Shift 1',
        weak_topics: [
          { topic_id: 'top-percentage', topic_name: 'Percentage', subject_name: 'Quantitative Aptitude', accuracy: 55.0 }
        ]
      }
    ]);
  }

  // --- BOOKMARKS & REVISION ---
  static getBookmarks(): Bookmark[] {
    return getItem<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, [
      {
        id: 'bm-1',
        user_id: 'default-user',
        question_id: 'q-med-l3-1',
        user_notes: 'Important coding pattern: Split word in half and reverse each part.',
        created_at: new Date().toISOString(),
        question: SEED_QUESTIONS[1]
      }
    ]);
  }

  static addBookmark(questionId: string, notes?: string, isPyq = false): void {
    const bookmarks = this.getBookmarks();
    const existing = bookmarks.find(
      (b) => (isPyq ? b.pyq_question_id === questionId : b.question_id === questionId)
    );

    if (existing) {
      existing.user_notes = notes || existing.user_notes;
    } else {
      const q = isPyq
        ? SEED_PYQ_QUESTIONS.find((item) => item.id === questionId)
        : this.getQuestions().find((item) => item.id === questionId);

      bookmarks.unshift({
        id: `bm-${Date.now()}`,
        user_id: 'default-user',
        question_id: isPyq ? undefined : questionId,
        pyq_question_id: isPyq ? questionId : undefined,
        user_notes: notes || 'Bookmarked for quick revision',
        created_at: new Date().toISOString(),
        question: q
      });
    }
    setItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }

  static getRevisionItems(): RevisionItem[] {
    return getItem<RevisionItem[]>(STORAGE_KEYS.REVISION, [
      {
        id: 'rev-1',
        user_id: 'default-user',
        question_id: 'q-exp-l5-1',
        wrong_count: 1,
        next_revision_date: new Date().toISOString().split('T')[0],
        revision_stage: 1,
        is_resolved: false,
        question: SEED_QUESTIONS[2]
      }
    ]);
  }

  static addOrUpdateRevision(questionId: string, isPyq = false): void {
    const revisions = this.getRevisionItems();
    const target = revisions.find(
      (r) => (isPyq ? r.pyq_question_id === questionId : r.question_id === questionId)
    );

    if (target) {
      target.wrong_count += 1;
      target.is_resolved = false;
      target.revision_stage = 1;
      const d = new Date();
      d.setDate(d.getDate() + 1);
      target.next_revision_date = d.toISOString().split('T')[0];
    } else {
      const q = isPyq
        ? SEED_PYQ_QUESTIONS.find((item) => item.id === questionId)
        : this.getQuestions().find((item) => item.id === questionId);

      const d = new Date();
      d.setDate(d.getDate() + 1);

      revisions.unshift({
        id: `rev-${Date.now()}`,
        user_id: 'default-user',
        question_id: isPyq ? undefined : questionId,
        pyq_question_id: isPyq ? questionId : undefined,
        wrong_count: 1,
        next_revision_date: d.toISOString().split('T')[0],
        revision_stage: 1,
        is_resolved: false,
        question: q
      });
    }
    setItem(STORAGE_KEYS.REVISION, revisions);
  }

  static markRevisionResolved(id: string): void {
    const revisions = this.getRevisionItems();
    const item = revisions.find((r) => r.id === id);
    if (item) {
      item.is_resolved = true;
      setItem(STORAGE_KEYS.REVISION, revisions);
    }
  }

  // --- TOPIC PROGRESS ---
  static getTopicProgress(topicId: string): TopicProgress {
    const topicProgressMap = getItem<Record<string, TopicProgress>>(STORAGE_KEYS.TOPIC_PROGRESS, {});
    if (topicProgressMap[topicId]) {
      return topicProgressMap[topicId];
    }

    const topic = SEED_TOPICS.find((t) => t.id === topicId);
    const subject = SEED_SUBJECTS.find((s) => s.id === topic?.subject_id);

    return {
      topic_id: topicId,
      topic_name: topic?.name || 'Topic',
      subject_name: subject?.name || 'Subject',
      unlocked_main_level: 'Medium',
      unlocked_sub_level: 'L3',
      questions_attempted: 15,
      questions_correct: 12,
      accuracy_percentage: 80.0,
    };
  }
}
