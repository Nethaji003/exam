import { UserStreak } from '../types/database';
import { getEndpointUrl } from '../config/apiConfig';

const STREAK_STORAGE_KEY = 'examprep_user_streak_v2';
const STREAK_ACTIVITIES_KEY = 'examprep_streak_activities_v2';

/**
 * Format current or provided date as YYYY-MM-DD in Asia/Kolkata (IST, UTC+05:30)
 * Completely eliminates UTC shift errors across midnight.
 */
export function getISTDateString(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);
}

/**
 * Calculate difference in calendar days between two YYYY-MM-DD dates in Asia/Kolkata
 */
export function getDaysBetweenIST(fromDateStr: string, toDateStr: string): number {
  const d1 = new Date(`${fromDateStr}T00:00:00+05:30`);
  const d2 = new Date(`${toDateStr}T00:00:00+05:30`);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format a dynamic human-readable relative date (e.g. "Today", "Yesterday", "23 Nov 2026")
 * Never returns fake static values.
 */
export function formatISTDisplayDate(dateStr: string | null): string {
  if (!dateStr) return 'No activity yet';
  const today = getISTDateString();
  const diff = getDaysBetweenIST(dateStr, today);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1 && diff <= 7) return `${diff} days ago`;
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(month, 10) - 1;
  return `${day} ${months[monthIdx] || month} ${year}`;
}

type StreakListener = (streak: UserStreak) => void;
const listeners: Set<StreakListener> = new Set();

export class StreakService {
  /**
   * Subscribe to live streak updates
   */
  static addListener(listener: StreakListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  private static notifyListeners(streak: UserStreak): void {
    listeners.forEach((fn) => {
      try {
        fn(streak);
      } catch (e) {
        console.error('Streak listener error:', e);
      }
    });
  }

  /**
   * Get cached streak synchronously from memory/localStorage
   */
  static getStoredStreak(userId: string = 'student-1'): UserStreak {
    const today = getISTDateString();
    try {
      const raw = localStorage.getItem(`${STREAK_STORAGE_KEY}_${userId}`);
      if (raw) {
        const parsed: UserStreak = JSON.parse(raw);
        // Verify if a day was missed since last check
        if (parsed.last_activity_date) {
          const daysBetween = getDaysBetweenIST(parsed.last_activity_date, today);
          if (daysBetween === 0) {
            parsed.today_completed = true;
            parsed.days_since_last_activity = 0;
          } else if (daysBetween === 1) {
            parsed.today_completed = false;
            parsed.days_since_last_activity = 1;
          } else if (daysBetween > 1) {
            // Missed a full day: reset streak to 0
            parsed.current_streak = 0;
            parsed.today_completed = false;
            parsed.days_since_last_activity = daysBetween;
            localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(parsed));
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read stored streak', e);
    }

    return {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      today_completed: false,
      total_active_days: 0,
      days_since_last_activity: null,
      status_message: 'No active streak. Complete a test today to start your streak!',
      week_progress: this.buildDefaultWeekProgress(today),
    };
  }

  /**
   * Fetch live streak from Spring Boot backend API with local calculation fallback
   */
  static async fetchStreak(userId: string = 'student-1'): Promise<UserStreak> {
    try {
      const endpoint = getEndpointUrl(`/api/streak/${encodeURIComponent(userId)}`);
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        const streak: UserStreak = {
          user_id: data.userId || userId,
          current_streak: data.currentStreak ?? 0,
          longest_streak: data.longestStreak ?? 0,
          last_activity_date: data.lastActivityDate || null,
          today_completed: Boolean(data.todayCompleted),
          total_active_days: data.totalActiveDays ?? 0,
          days_since_last_activity: data.daysSinceLastActivity ?? null,
          status_message: data.statusMessage || '',
          week_progress: data.weekProgress || this.buildDefaultWeekProgress(getISTDateString()),
        };

        localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(streak));
        this.notifyListeners(streak);
        return streak;
      }
    } catch (err) {
      console.warn('Backend streak endpoint offline, using local IST streak engine:', err);
    }

    // Fallback: return verified local streak
    const local = this.getStoredStreak(userId);
    this.notifyListeners(local);
    return local;
  }

  /**
   * Record a qualifying activity (completing a test with answered questions)
   * Prevents multiple increments on the same calendar day (Asia/Kolkata).
   */
  static async recordActivity(
    userId: string = 'student-1',
    activityType: string = 'TEST_COMPLETED',
    activityDetails: string = 'Completed examination'
  ): Promise<UserStreak> {
    const today = getISTDateString();

    // 1. First attempt to record in Spring Boot backend
    try {
      const endpoint = getEndpointUrl('/api/streak/record-activity');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          activityType,
          activityDetails,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const streak: UserStreak = {
          user_id: data.userId || userId,
          current_streak: data.currentStreak ?? 1,
          longest_streak: data.longestStreak ?? 1,
          last_activity_date: data.lastActivityDate || today,
          today_completed: true,
          total_active_days: data.totalActiveDays ?? 1,
          days_since_last_activity: 0,
          status_message: data.statusMessage || "Streak Active! You've completed today's practice 🔥",
          week_progress: data.weekProgress || this.buildDefaultWeekProgress(today, true),
        };

        localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(streak));
        this.recordLocalActivityEntry(userId, today, activityType);
        this.notifyListeners(streak);
        return streak;
      }
    } catch (err) {
      console.warn('Backend streak API offline, recording activity in local IST engine:', err);
    }

    // 2. Offline / local fallback calculation matching exact same IST rules
    const current = this.getStoredStreak(userId);
    let newStreak = current.current_streak;
    let newLongest = current.longest_streak;
    let newTotal = current.total_active_days;

    if (!current.last_activity_date) {
      // First ever activity
      newStreak = 1;
      newLongest = Math.max(newLongest, 1);
      newTotal = 1;
    } else if (current.last_activity_date === today) {
      // Same calendar day: do not increment streak again
      newStreak = current.current_streak;
    } else {
      const daysBetween = getDaysBetweenIST(current.last_activity_date, today);
      if (daysBetween === 1) {
        // Consecutive calendar day
        newStreak = current.current_streak + 1;
        newLongest = Math.max(newLongest, newStreak);
        newTotal += 1;
      } else {
        // Missed one or more days: restart at 1
        newStreak = 1;
        newLongest = Math.max(newLongest, 1);
        newTotal += 1;
      }
    }

    const updatedStreak: UserStreak = {
      user_id: userId,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
      today_completed: true,
      total_active_days: newTotal,
      days_since_last_activity: 0,
      status_message: "Streak Active! You've completed today's practice 🔥",
      week_progress: this.buildDefaultWeekProgress(today, true),
    };

    localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(updatedStreak));
    this.recordLocalActivityEntry(userId, today, activityType);
    this.notifyListeners(updatedStreak);
    return updatedStreak;
  }

  /**
   * Reset streak (for testing and administrative reset)
   */
  static async resetStreak(userId: string = 'student-1'): Promise<UserStreak> {
    try {
      const endpoint = getEndpointUrl(`/api/streak/reset/${encodeURIComponent(userId)}`);
      await fetch(endpoint, { method: 'POST' }).catch(() => {});
    } catch {}

    const today = getISTDateString();
    const reset: UserStreak = {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      today_completed: false,
      total_active_days: 0,
      days_since_last_activity: null,
      status_message: 'No active streak. Complete a test today to start your streak!',
      week_progress: this.buildDefaultWeekProgress(today),
    };

    localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(reset));
    localStorage.removeItem(`${STREAK_ACTIVITIES_KEY}_${userId}`);
    this.notifyListeners(reset);
    return reset;
  }

  private static recordLocalActivityEntry(userId: string, dateStr: string, type: string): void {
    try {
      const key = `${STREAK_ACTIVITIES_KEY}_${userId}`;
      const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!existing.includes(dateStr)) {
        existing.push(dateStr);
        localStorage.setItem(key, JSON.stringify(existing.slice(-30)));
      }
    } catch {}
  }

  private static buildDefaultWeekProgress(
    todayDateStr: string,
    isTodayCompleted: boolean = false
  ): { dayOfWeek: string; date: string; completed: boolean; isToday: boolean }[] {
    const today = new Date(`${todayDateStr}T00:00:00+05:30`);
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
    const distanceToMonday = (dayOfWeek + 6) % 7; // days since Monday

    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = getISTDateString(d);
      const isToday = dStr === todayDateStr;

      result.push({
        dayOfWeek: dayNames[i],
        date: dStr,
        completed: isToday ? isTodayCompleted : false,
        isToday,
      });
    }

    return result;
  }
}
