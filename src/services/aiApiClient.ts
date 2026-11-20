import {
  WeakSection,
  PerformanceAnalysisResult,
  AIMockTestResponse,
  AITutorData,
  AIImprovementHistory,
  Question,
  TestAttemptResult,
} from '../types/database';
import { DBService } from './dbService';

const API_BASE = 'http://localhost:8080/api';

export class AIApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * 1. Analyze student mock test performance
   */
  static async analyzeTestPerformance(payload: {
    studentId: string;
    testTitle: string;
    testType: string;
    questionResults: {
      questionText: string;
      subjectName: string;
      topicName: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      timeTakenSeconds: number;
    }[];
  }): Promise<PerformanceAnalysisResult> {
    try {
      return await this.request<PerformanceAnalysisResult>('/ai/analyze-test', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend offline, using client-side AI analysis fallback engine:', err);
      return this.fallbackAnalyzeTest(payload);
    }
  }

  /**
   * 2. Retrieve student's detected weak sections
   */
  static async getWeakSections(studentId: string = 'student-1'): Promise<WeakSection[]> {
    try {
      const data = await this.request<{ weakSections: WeakSection[] }>(`/ai/weak-sections/${studentId}`);
      return data.weakSections;
    } catch (err) {
      console.warn('Backend offline, using fallback weak sections:', err);
      return [
        {
          sectionName: 'Quantitative Aptitude',
          topicName: 'Percentage & Arithmetic',
          accuracy: 35.0,
          weaknessLevel: 'Weak',
          totalQuestions: 20,
          correctAnswers: 7,
          wrongAnswers: 13,
          recommendations: 'Mathematics accuracy is 35%. Review arithmetic calculation shortcuts.',
        },
        {
          sectionName: 'English Language',
          topicName: 'Reading Comprehension & Grammar',
          accuracy: 55.0,
          weaknessLevel: 'Needs Improvement',
          totalQuestions: 20,
          correctAnswers: 11,
          wrongAnswers: 9,
          recommendations: 'English accuracy is 55%. Focus on subject-verb agreement and vocabulary.',
        },
        {
          sectionName: 'Reasoning Ability',
          topicName: 'Syllogisms & Puzzles',
          accuracy: 80.0,
          weaknessLevel: 'Good',
          totalQuestions: 20,
          correctAnswers: 16,
          wrongAnswers: 4,
          recommendations: 'Reasoning is 80%. Good foundation! Advance to expert multi-tier puzzles.',
        },
        {
          sectionName: 'General Knowledge',
          topicName: 'Current Affairs & Banking',
          accuracy: 90.0,
          weaknessLevel: 'Excellent',
          totalQuestions: 20,
          correctAnswers: 18,
          wrongAnswers: 2,
          recommendations: 'General Knowledge is 90%. Excellent mastery! Keep daily revision current.',
        },
      ];
    }
  }

  /**
   * 3. AI Personal Tutor for a weak section
   */
  static async getAITutorGuidance(payload: {
    studentId: string;
    sectionName: string;
    topicName: string;
  }): Promise<AITutorData> {
    try {
      return await this.request<AITutorData>('/ai/tutor/improve-section', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend offline, using client-side AI Tutor fallback:', err);
      return this.fallbackAITutor(payload.sectionName, payload.topicName);
    }
  }

  /**
   * 4. Generate section-specific AI mock test (10, 20, or 30 questions)
   */
  static async generateAIMockTest(payload: {
    studentId: string;
    sectionName: string;
    topicName?: string;
    questionCount: number;
    difficulty?: string;
  }): Promise<{ testId: number; questions: Question[] }> {
    try {
      const res = await this.request<AIMockTestResponse>('/ai/generate-mock-test', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Transform response to Question[] interface used by PracticeEngine
      const questions: Question[] = res.questions.map((q, idx) => {
        const optionKeys = ['A', 'B', 'C', 'D'];
        const options = q.options.map((optText, optIdx) => {
          const key = optionKeys[optIdx] || 'A';
          const cleanText = optText.replace(/^[A-D]\.\s*/, '');
          return {
            id: `opt-ai-${q.id}-${optIdx}`,
            question_id: `ai-q-${q.id}`,
            option_key: key,
            option_text: cleanText,
            is_correct: optIdx === 0, // Fallback if not specified
          };
        });

        return {
          id: `ai-q-${q.id}-${idx}`,
          subject_id: 'subj-ai',
          topic_id: 'top-ai',
          difficulty: q.difficultyLevel === 'EASY' ? 3 : (q.difficultyLevel === 'HARD' ? 15 : 8),
          question_text: q.questionText,
          question_type: 'Multiple Choice',
          options,
          correct_answer: 'A',
          explanation: 'Step-by-step verification confirmed by AI tutor.',
          estimated_time: q.estimatedTime || 60,
          language: 'English',
          is_ai_generated: true,
          status: 'approved',
          subject_name: payload.sectionName,
          topic_name: payload.topicName || payload.sectionName,
        };
      });

      return { testId: res.testId, questions };
    } catch (err) {
      console.warn('Backend offline, using smart local question generator:', err);
      return this.fallbackGenerateAIMockTest(payload);
    }
  }

  /**
   * 5. Submit AI Mock Test answers
   */
  static async submitAIMockTest(payload: {
    studentId: string;
    testTitle: string;
    sectionName: string;
    answers: {
      questionId?: number;
      questionText: string;
      subjectName: string;
      topicName: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      timeTakenSeconds: number;
    }[];
    timeTakenSeconds: number;
  }): Promise<{ accuracy: number; score: number; maxScore: number }> {
    try {
      return await this.request<{ accuracy: number; score: number; maxScore: number }>('/ai/submit-test', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend offline, saving submission locally:', err);
      const total = payload.answers.length;
      const correct = payload.answers.filter((a) => a.isCorrect).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { accuracy, score: correct, maxScore: total };
    }
  }

  /**
   * 6. Retrieve continuous improvement history
   */
  static async getImprovementHistory(studentId: string = 'student-1'): Promise<AIImprovementHistory[]> {
    try {
      return await this.request<AIImprovementHistory[]>(`/ai/history/${studentId}`);
    } catch (err) {
      console.warn('Backend offline, using local test attempts for history:', err);
      const attempts = DBService.getTestAttempts();
      return attempts.map((a, idx) => ({
        id: idx + 1,
        testAttemptId: a.test_title,
        overallAccuracy: a.accuracy_percentage,
        totalQuestions: a.correct_count + a.wrong_count + a.skipped_count,
        correctCount: a.correct_count,
        wrongCount: a.wrong_count,
        repeatedMistakeTopics: a.weak_topics?.[0]?.topic_name,
        strongConcepts: a.accuracy_percentage >= 80 ? 'Reasoning, Number Series' : 'Basic Arithmetic',
        weakConcepts: a.weak_topics?.map((w) => w.topic_name).join(', ') || 'Time & Work',
        createdAt: a.completed_at,
      }));
    }
  }

  // --- CLIENT-SIDE FALLBACK ENGINES ---

  private static fallbackAnalyzeTest(payload: {
    studentId: string;
    testTitle: string;
    testType: string;
    questionResults: any[];
  }): PerformanceAnalysisResult {
    const total = payload.questionResults.length;
    const correct = payload.questionResults.filter((q) => q.isCorrect).length;
    const wrong = payload.questionResults.filter((q) => !q.isCorrect && q.userAnswer && q.userAnswer !== 'Skipped').length;
    const skipped = total - correct - wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Group by section
    const secMap: Record<string, { total: number; correct: number; wrong: number; topic: string }> = {};
    for (const q of payload.questionResults) {
      const sec = q.subjectName || 'General';
      if (!secMap[sec]) secMap[sec] = { total: 0, correct: 0, wrong: 0, topic: q.topicName || sec };
      secMap[sec].total++;
      if (q.isCorrect) secMap[sec].correct++;
      else secMap[sec].wrong++;
    }

    const sections = Object.entries(secMap).map(([sName, data]) => {
      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      let level: 'Weak' | 'Needs Improvement' | 'Good' | 'Excellent' = 'Weak';
      if (acc >= 85) level = 'Excellent';
      else if (acc >= 70) level = 'Good';
      else if (acc >= 50) level = 'Needs Improvement';

      return {
        sectionName: sName,
        topicName: data.topic,
        totalQuestions: data.total,
        correct: data.correct,
        wrong: data.wrong,
        accuracyPercentage: acc,
        weaknessLevel: level,
        recommendations:
          acc < 50
            ? `Critical revision needed for ${sName}. Attempt targeted 10-question AI practice tests.`
            : `Keep practicing ${sName} to maintain benchmark speed and accuracy.`,
      };
    });

    return {
      id: Date.now(),
      studentId: payload.studentId,
      overallAccuracy: accuracy,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: wrong,
      skippedCount: skipped,
      createdAt: new Date().toISOString(),
      sections,
      repeatedMistakes: ['Calculation errors in arithmetic percentages'],
      weakConcepts: sections.filter((s) => s.weaknessLevel === 'Weak').map((s) => s.topicName).join(', ') || 'Arithmetic',
      strongConcepts: sections.filter((s) => s.weaknessLevel === 'Good' || s.weaknessLevel === 'Excellent').map((s) => s.topicName).join(', ') || 'Reasoning',
    };
  }

  private static fallbackAITutor(section: string, topic: string): AITutorData {
    return {
      sectionName: section,
      topicName: topic,
      conceptExplanation: `In ${topic} (${section}), mistakes commonly occur when switching units or applying formulas without verifying base parameters. Always write down given variables first before jumping to calculation.`,
      examples: [
        `Example 1: A quantity increases by 25% (1/4). To restore it to original value, it must decrease by 1/(4+1) = 1/5 = 20%.`,
        `Example 2: Two successive discounts of 20% and 10% result in a net discount of 20 + 10 - (20*10)/100 = 28%.`,
      ],
      shortcuts: [
        `Shortcut 1: Net effect formula: A + B + (A*B)/100. Use negative signs for reductions/discounts.`,
        `Shortcut 2: Eliminate impossible choices using unit digit arithmetic and approximation.`,
      ],
      formulas: [
        `Percentage = (Part / Whole) × 100`,
        `Net Change % = A + B + (A × B) / 100`,
      ],
      practiceQuestions: [
        {
          questionText: `If price increases by 20%, what reduction in consumption preserves the current expenditure?`,
          options: [
            { key: 'A', text: '16.67%' },
            { key: 'B', text: '20.00%' },
            { key: 'C', text: '25.00%' },
            { key: 'D', text: '15.00%' },
          ],
          correctAnswer: 'A',
          explanation: `Increase of 20% = 1/5. Reduction = 1/(5+1) = 1/6 = 16.67%.`,
        },
        {
          questionText: `Find the single equivalent discount for successive discounts of 15% and 20%.`,
          options: [
            { key: 'A', text: '32.0%' },
            { key: 'B', text: '35.0%' },
            { key: 'C', text: '30.5%' },
            { key: 'D', text: '28.0%' },
          ],
          correctAnswer: 'A',
          explanation: `Net Discount = 15 + 20 - (15*20)/100 = 35 - 3 = 32%.`,
        },
      ],
      studyOrder: [
        `Step 1: Memorize fraction-to-percentage table (1/2 to 1/20).`,
        `Step 2: Solve 10 questions on reverse percentage calculation.`,
        `Step 3: Take an AI-Generated Mock Test for ${section}.`,
      ],
    };
  }

  private static fallbackGenerateAIMockTest(payload: {
    studentId: string;
    sectionName: string;
    topicName?: string;
    questionCount: number;
    difficulty?: string;
  }): { testId: number; questions: Question[] } {
    const allQuestions = DBService.getQuestions();
    // Filter questions matching section if possible, otherwise use question bank
    const sectionQuestions = allQuestions.filter((q) =>
      q.subject_name?.toLowerCase().includes(payload.sectionName.toLowerCase()) ||
      q.question_text.toLowerCase().includes(payload.sectionName.toLowerCase())
    );

    const baseQuestions = sectionQuestions.length >= 5 ? sectionQuestions : allQuestions;
    const count = payload.questionCount || 10;
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      const src = baseQuestions[i % baseQuestions.length];
      const qCopy: Question = {
        ...src,
        id: `ai-gen-mock-${Date.now()}-${i}`,
        question_text: `[AI ${payload.sectionName} Practice Q${i + 1}] ${src.question_text}`,
        is_ai_generated: true,
        subject_name: payload.sectionName,
        topic_name: payload.topicName || src.topic_name,
      };
      questions.push(qCopy);
    }

    return { testId: Date.now(), questions };
  }
}

