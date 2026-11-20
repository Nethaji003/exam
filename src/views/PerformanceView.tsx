import React, { useEffect, useState } from 'react';
import { DBService } from '../services/dbService';
import { BarChart3, Clock, Award, Target, TrendingUp, ShieldCheck, Sparkles, Brain, AlertTriangle, ArrowUpRight, History } from 'lucide-react';
import { AIApiClient } from '../services/aiApiClient';
import { AIImprovementHistory } from '../types/database';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export const PerformanceView: React.FC = () => {
  const userProgress = DBService.getUserProgress();
  const [history, setHistory] = useState<AIImprovementHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    AIApiClient.getImprovementHistory('student-1')
      .then((data) => {
        setHistory(data);
        setLoadingHistory(false);
      })
      .catch(() => setLoadingHistory(false));
  }, []);

  const accuracyBreakdownData = [
    { name: 'Correct', value: userProgress.total_correct, color: '#10b981' },
    { name: 'Wrong', value: userProgress.total_wrong, color: '#f43f5e' },
  ];

  const subjectPerformanceData = [
    { subject: 'Quant', accuracy: 78, speedSeconds: 52 },
    { subject: 'Reasoning', accuracy: 85, speedSeconds: 42 },
    { subject: 'English', accuracy: 72, speedSeconds: 30 },
    { subject: 'GA', accuracy: 65, speedSeconds: 25 },
    { subject: 'Banking', accuracy: 80, speedSeconds: 38 },
  ];

  const difficultyLevelsData = [
    { level: 'Lvl 1 (Beginner)', accuracy: 92, questions: 40 },
    { level: 'Lvl 2 (Easy)', accuracy: 86, questions: 35 },
    { level: 'Lvl 3 (Intermediate)', accuracy: 78, questions: 28 },
    { level: 'Lvl 4 (Hard)', accuracy: 64, questions: 12 },
    { level: 'Lvl 5 (Expert)', accuracy: 48, questions: 5 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" /> Advanced Performance Engine
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Performance Analytics & Speed Insights</h1>
        <p className="text-slate-400 text-sm mt-1">
          In-depth diagnostics on speed, subject strengths, time per question, and 5-level difficulty accuracy.
        </p>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Overall Accuracy</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{userProgress.overall_accuracy}%</p>
          <span className="text-[11px] text-slate-400">Based on {userProgress.total_questions_solved} solved Qs</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Speed / Question</span>
          <p className="text-3xl font-extrabold text-sky-400 mt-1">
            {Math.round(userProgress.total_study_time_seconds / (userProgress.total_questions_solved || 1))}s
          </p>
          <span className="text-[11px] text-slate-400">Target benchmark: &lt;55s</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Strongest Subject</span>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">Reasoning Ability</p>
          <span className="text-[11px] text-purple-300 font-semibold">85% Accuracy</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Unlocked Difficulty</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">Level {userProgress.current_difficulty_level}</p>
          <span className="text-[11px] text-slate-400">Intermediate Tier</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Accuracy vs Speed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-4">Subject Accuracy Breakdown (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="accuracy" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Difficulty Level Progression */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-4">Accuracy Across 5 Difficulty Levels (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyLevelsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <YAxis dataKey="level" type="category" stroke="#94a3b8" fontSize={10} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="accuracy" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Continuous Improvement & Score Comparison Tracker */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" /> AI Continuous Improvement Engine
              </span>
              <span className="text-xs text-slate-400">Iterative Adaptive Scoring</span>
            </div>
            <h2 className="text-xl font-bold text-white">Score Progression & Mistake Reduction Trajectory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every completed mock test automatically updates your weakness levels, detects repeated mistakes, and generates adaptive recommendations.
            </p>
          </div>
        </div>

        {/* History Table & Progress Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Tracked Test Iterations</span>
            <p className="text-3xl font-extrabold text-white">{history.length}</p>
            <span className="text-[11px] text-purple-300 font-medium">Automatic OpenAI audits active</span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Repeated Mistakes Reduction</span>
            <p className="text-3xl font-extrabold text-emerald-400">-42%</p>
            <span className="text-[11px] text-slate-400 font-medium">Fewer repeat errors after AI tutoring</span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Next Recommended Focus</span>
            <p className="text-xl font-bold text-amber-400 truncate">Arithmetic & Profit-Loss</p>
            <span className="text-[11px] text-amber-300 font-medium">Weak section targeted test ready</span>
          </div>
        </div>

        {/* Previous Attempts Comparison List */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> Previous Test Comparisons & Weakness Transitions
          </h4>
          <div className="divide-y divide-slate-800/80">
            {history.slice(0, 5).map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.testAttemptId}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span>Qs: {item.totalQuestions}</span>
                    <span className="text-emerald-400 font-semibold">Correct: {item.correctCount}</span>
                    <span className="text-rose-400 font-semibold">Wrong: {item.wrongCount}</span>
                    {item.weakConcepts && (
                      <span className="text-amber-400 truncate max-w-[200px]">Weak: {item.weakConcepts}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-indigo-400 block">{item.overallAccuracy}%</span>
                    <span className="text-[10px] text-slate-400">Accuracy</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      item.overallAccuracy >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : item.overallAccuracy >= 60
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {item.overallAccuracy >= 80 ? 'Mastered' : item.overallAccuracy >= 60 ? 'Improving' : 'Needs Work'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
