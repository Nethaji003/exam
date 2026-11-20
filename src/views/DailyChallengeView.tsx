import React from 'react';
import { DBService } from '../services/dbService';
import { Question } from '../types/database';
import { Zap, Flame, Award, Calendar, CheckCircle2, Play, Trophy } from 'lucide-react';

interface DailyChallengeViewProps {
  onStartChallenge: (questions: Question[]) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({ onStartChallenge }) => {
  const userProgress = DBService.getUserProgress();
  const allQuestions = DBService.getQuestions();

  // Pick 20 mixed daily challenge questions
  const challengeQuestions = allQuestions.slice(0, 20);

  const handleLaunch = () => {
    onStartChallenge(challengeQuestions.length > 0 ? challengeQuestions : allQuestions);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Daily Power Sprint
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Daily Challenge</h1>
        <p className="text-slate-400 text-sm mt-1">
          Solve 20 high-yield questions daily (5 Quant + 5 Reasoning + 5 English + 5 GA) to build your streak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Counter Box */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-500 animate-pulse" /> Active Streak
            </div>
            <p className="text-5xl font-extrabold text-white">{userProgress.streak_count} <span className="text-sm font-semibold text-amber-400">Days</span></p>
            <p className="text-xs text-slate-400 mt-2">
              Complete today's challenge to extend your streak to <strong>{userProgress.streak_count + 1} Days</strong>!
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Last Completed: Yesterday</span>
            <span className="text-emerald-400 font-semibold">Streak Active 🔥</span>
          </div>
        </div>

        {/* Daily Set Breakdown */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Today's Mixed Challenge Set (20 Qs)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-400 block">5 Quant Qs</span>
                <span className="text-slate-400 text-[10px]">Percentage & DI</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-purple-400 block">5 Reasoning Qs</span>
                <span className="text-slate-400 text-[10px]">Syllogism & Puzzles</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-sky-400 block">5 English Qs</span>
                <span className="text-slate-400 text-[10px]">Grammar & RC</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-emerald-400 block">5 GA & Banking</span>
                <span className="text-slate-400 text-[10px]">Polity & RBI Terms</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" /> Start Today's Challenge (20 Mins)
          </button>
        </div>
      </div>
    </div>
  );
};
