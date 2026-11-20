import React from 'react';
import { DBService } from '../services/dbService';
import { 
  Award, Clock, CheckCircle2, XCircle, AlertCircle, 
  RotateCcw, Eye, ArrowRight, TrendingUp, Calendar, 
  HelpCircle, Sparkles, Trophy 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultsViewProps {
  onRetakeTest?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onRetakeTest }) => {
  const { t, isTamil, isBoth } = useLanguage();
  const testAttempts = DBService.getTestAttempts();
  const userProgress = DBService.getUserProgress();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1a160b 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <Award className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              Examination History & Scorecards
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'தேர்வு முடிவுகள் & மதிப்பீடு' : isBoth ? 'Test Results & Performance / தேர்வு முடிவுகள்' : 'Test Results & Performance'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'உங்கள் அனைத்து மாதிரி தேர்வுகள், முந்தைய வினாத்தாள்கள் மற்றும் விரிவான மதிப்பெண் அறிக்கைகள்.'
                : 'Track your mock test submissions, accuracy breakdown, scorecards, and question-by-question solutions.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <Trophy className="w-5 h-5 mb-2" style={{ color: '#D4AF37' }} />
          <div className="text-2xl font-extrabold text-white">{testAttempts.length}</div>
          <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>{t.testsCompleted}</div>
        </div>

        <div className="stat-card">
          <CheckCircle2 className="w-5 h-5 mb-2 text-emerald-400" />
          <div className="text-2xl font-extrabold text-emerald-400">{userProgress.overall_accuracy}%</div>
          <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>{t.accuracy}</div>
        </div>

        <div className="stat-card">
          <TrendingUp className="w-5 h-5 mb-2" style={{ color: '#E6C66D' }} />
          <div className="text-2xl font-extrabold" style={{ color: '#D4AF37' }}>{userProgress.total_correct}</div>
          <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>{t.correct}</div>
        </div>

        <div className="stat-card">
          <XCircle className="w-5 h-5 mb-2 text-rose-400" />
          <div className="text-2xl font-extrabold text-rose-400">{userProgress.total_wrong}</div>
          <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>{t.incorrect}</div>
        </div>
      </div>

      {/* ── Recent Attempts Table ──────────────────────────────────── */}
      <div className="gold-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: '#D4AF37' }} />
          {t.recentResults}
        </h3>

        {testAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#393326] text-[#A7A7A7] uppercase tracking-wider">
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Time Taken</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#393326]/60">
                {testAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {attempt.test_title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="gold-badge">
                        {attempt.test_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold" style={{ color: '#D4AF37' }}>
                      {attempt.score} / {attempt.max_score || (attempt as any).total_marks || 300}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${(attempt.accuracy_percentage || (attempt as any).accuracy || 0) >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {attempt.accuracy_percentage || (attempt as any).accuracy || 0}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {Math.floor((attempt.total_time_taken || (attempt as any).time_taken_seconds || 0) / 60)}m {(attempt.total_time_taken || (attempt as any).time_taken_seconds || 0) % 60}s
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={onRetakeTest}
                        className="btn-gold-outline text-[11px] px-2.5 py-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t.retryTest}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#D4AF37' }} />
            <p className="text-sm font-semibold text-white mb-1">No test attempts recorded yet.</p>
            <p className="text-xs text-slate-400">Complete a mock test or practice sprint to view your scorecards here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
