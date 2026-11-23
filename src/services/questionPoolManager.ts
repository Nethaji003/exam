// Question Pool Manager with Non-Repetition, Exhaustion Tracking, and Option Randomization

import { Question, QuestionOption } from '../types/database';
import { TNPSCQuestion } from './tnpscPaperData';

const SERVED_QUESTIONS_PREFIX = 'tnpsc_served_ids_v1_';

export class QuestionPoolManager {
  /**
   * Get previously served question IDs for a specific test context
   */
  static getServedIds(contextKey: string): Set<string> {
    try {
      const data = localStorage.getItem(`${SERVED_QUESTIONS_PREFIX}${contextKey}`);
      if (!data) return new Set<string>();
      return new Set<string>(JSON.parse(data));
    } catch {
      return new Set<string>();
    }
  }

  /**
   * Mark question IDs as served for a specific test context
   */
  static markServed(contextKey: string, ids: string[]): void {
    try {
      const served = this.getServedIds(contextKey);
      ids.forEach((id) => served.add(id));
      localStorage.setItem(`${SERVED_QUESTIONS_PREFIX}${contextKey}`, JSON.stringify([...served]));
    } catch (e) {
      console.warn('Failed to persist served question IDs', e);
    }
  }

  /**
   * Clear served question IDs (reset pool)
   */
  static clearServed(contextKey: string): void {
    try {
      localStorage.removeItem(`${SERVED_QUESTIONS_PREFIX}${contextKey}`);
    } catch (e) {
      console.warn('Failed to clear served question IDs', e);
    }
  }

  /**
   * Fisher-Yates array shuffle
   */
  static shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Select a non-repeating subset of questions from a candidate pool.
   * Avoids repeating questions until the available pool is exhausted.
   */
  static selectNonRepeating<T extends { id: string }>(
    candidatePool: T[],
    requestedCount: number,
    contextKey: string
  ): T[] {
    if (!candidatePool || candidatePool.length === 0) return [];
    if (requestedCount <= 0) return [];

    const count = Math.min(requestedCount, candidatePool.length);
    const served = this.getServedIds(contextKey);

    // Candidates not yet served in this cycle
    const unserved = candidatePool.filter((q) => !served.has(q.id));

    let selected: T[] = [];

    if (unserved.length >= count) {
      // Sufficient unserved questions available in pool
      const shuffled = this.shuffle(unserved);
      selected = shuffled.slice(0, count);
      this.markServed(contextKey, selected.map((q) => q.id));
    } else {
      // Pool is exhausted or nearly exhausted:
      // 1. Take all remaining unserved questions
      selected = [...unserved];

      // 2. Clear served history (recycle the pool)
      this.clearServed(contextKey);

      // 3. Draw the remaining needed questions from the recycled pool
      const needed = count - selected.length;
      const selectedIds = new Set(selected.map((q) => q.id));
      const recycledCandidates = candidatePool.filter((q) => !selectedIds.has(q.id));
      const shuffledRecycled = this.shuffle(recycledCandidates);

      const additional = shuffledRecycled.slice(0, needed);
      selected = [...selected, ...additional];

      // Mark the newly chosen ones as served in the new cycle
      this.markServed(contextKey, selected.map((q) => q.id));
    }

    // Final shuffle to avoid any ordering bias
    return this.shuffle(selected);
  }

  /**
   * Randomize multiple choice options (A, B, C, D) while maintaining correct answer mapping
   */
  static randomizeQuestionOptions(q: Question): Question {
    if (!q.options || q.options.length < 2) return q;

    const optionKeys = ['A', 'B', 'C', 'D'];
    const originalOptions = [...q.options];

    // Find the currently correct option text
    const correctOpt = originalOptions.find((o) => o.is_correct || o.option_key === q.correct_answer);
    if (!correctOpt) return q;

    // Shuffle options
    const shuffled = this.shuffle(originalOptions);

    let newCorrectKey = q.correct_answer;
    const remappedOptions: QuestionOption[] = shuffled.map((opt, idx) => {
      const key = optionKeys[idx] || opt.option_key;
      const isCorrect = opt.id === correctOpt.id;
      if (isCorrect) {
        newCorrectKey = key;
      }
      return {
        ...opt,
        option_key: key,
        is_correct: isCorrect,
      };
    });

    return {
      ...q,
      options: remappedOptions,
      correct_answer: newCorrectKey,
    };
  }
}
