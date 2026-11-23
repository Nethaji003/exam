import React, { useState, useEffect } from 'react';
import { DBService } from '../services/dbService';
import { Question, UserStreak } from '../types/database';
import { StreakService, formatISTDisplayDate } from '../services/streakService';
import { Zap, Flame, Award, Calendar, CheckCircle2, Play, Trophy, Check, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DailyChallengeViewProps {
  onStartChallenge: (questions: Question[]) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({ onStartChallenge }) => {
  const { t, isTamil } = useLanguage();
  const [streak, setStreak] = useState<UserStreak>(StreakService.getStoredStreak('student-1'));
  const allQuestions = DBService.getQuestions();

  useEffect(() => {
    // Fetch latest verified streak from database and update
    StreakService.fetchStreak('student-1').then(setStreak).catch(() => {});

    // Subscribe to real-time streak updates across the application
    const unsubscribe = StreakService.addListener((updated) => {
      setStreak(updated);
    });

    return () => unsubscribe();
  }, []);

  // Pick 20 mixed daily challenge questions
  const challengeQuestions = allQuestions.slice(0, 20);

  const handleLaunch = () => {
    onStartChallenge(challengeQuestions.length > 0 ? challengeQuestions : allQuestions);
  };

  const nextMilestone = streak.today_completed
    ? streak.current_streak
    : streak.current_streak + 1;

  const displayLastCompleted = formatISTDisplayDate(streak.last_activity_date);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Daily Power Sprint
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Daily Challenge</h1>
        <p className="text-slate-400 text-sm mt-1">
          Solve 20 high-yield questions daily (5 Quant + 5 Reasoning + 5 English + 5 GA) in Asia/Kolkata timezone to build your streak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Counter Box */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500 animate-pulse" /> Active Streak
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Best: {streak.longest_streak} Days
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-white">{streak.current_streak}</p>
              <span className="text-lg font-bold text-amber-400">Days</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {streak.today_completed ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4" /> Today&apos;s goal achieved! Streak locked in.
                </span>
              ) : (
                <span>
                  Complete today&apos;s challenge to extend your streak to <strong className="text-amber-400">{nextMilestone} Days</strong>!
                </span>
              )}
            </p>
          </div>

          {/* 7-Day Weekly Progress Bar */}
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              This Week (Mon – Sun)
            </span>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {(streak.week_progress || []).map((day) => (
                <div
                  key={day.date}
                  className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center border text-[10px] transition ${
                    day.completed
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : day.isToday
                      ? 'bg-white/5 border-amber-400 text-amber-200 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                  title={`${day.dayOfWeek} (${day.date}): ${day.completed ? 'Completed' : 'Pending'}`}
                >
                  <span className="text-[9px] uppercase">{day.dayOfWeek}</span>
                  <div className="mt-0.5">
                    {day.completed ? (
                      <Check className="w-3 h-3 text-amber-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 block my-1"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Last Completed: <strong className="text-slate-200">{displayLastCompleted}</strong></span>
            {streak.today_completed ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Completed Today 🔥
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                Pending Today ⏳
              </span>
            )}
          </div>
        </div>

        {/* Daily Set Breakdown */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Today&apos;s Mixed Challenge Set (20 Qs)
              </h3>
              <span className="text-xs text-slate-400">Total Active Days: <strong className="text-amber-400">{streak.total_active_days}</strong></span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-400 block">5 Quant Qs</span>
                <span className="text-slate-400 text-[10px]">Percentage & Arithmetic</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-purple-400 block">5 Reasoning Qs</span>
                <span className="text-slate-400 text-[10px]">Mental Ability & Logic</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-sky-400 block">5 English / Tamil Qs</span>
                <span className="text-slate-400 text-[10px]">Grammar & Vocabulary</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-emerald-400 block">5 GA & TNPSC Qs</span>
                <span className="text-slate-400 text-[10px]">Polity, History & Economy</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" /> {streak.today_completed ? "Retake Today's Challenge (20 Mins)" : "Start Today's Challenge (20 Mins)"}
          </button>
        </div>
      </div>
    </div>
  );
};
