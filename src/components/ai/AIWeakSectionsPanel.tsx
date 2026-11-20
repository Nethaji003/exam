import React, { useEffect, useState } from 'react';
import { WeakSection, WeaknessLevel } from '../../types/database';
import { AIApiClient } from '../../services/aiApiClient';
import { Sparkles, Brain, AlertTriangle, ArrowRight, Play, Loader2, CheckCircle, TrendingUp } from 'lucide-react';

interface AIWeakSectionsPanelProps {
  onImproveSection: (sectionName: string, topicName: string) => void;
  onGenerateMockTest: (sectionName: string, topicName: string) => void;
}

export const AIWeakSectionsPanel: React.FC<AIWeakSectionsPanelProps> = ({
  onImproveSection,
  onGenerateMockTest,
}) => {
  const [sections, setSections] = useState<WeakSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    AIApiClient.getWeakSections('student-1')
      .then((data) => {
        if (mounted) {
          setSections(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getLevelBadge = (level: WeaknessLevel | string) => {
    switch (level) {
      case 'Weak':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
          label: 'Weak',
        };
      case 'Needs Improvement':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-500',
          label: 'Needs Improvement',
        };
      case 'Good':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          dot: 'bg-sky-500',
          label: 'Good',
        };
      case 'Excellent':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-500',
          label: 'Excellent',
        };
      default:
        return {
          bg: 'bg-slate-700/40 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
          label: level,
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" /> AI Weak Section Detection
            </span>
            <span className="text-xs text-slate-400">OpenAI Automated Diagnostic</span>
          </div>
          <h2 className="text-xl font-bold text-white">Subject Diagnostic & AI Tutor Support</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sections automatically categorized by real performance data. Select a weak section for instant AI tutoring or tailored tests.
          </p>
        </div>

        <button
          onClick={() => onGenerateMockTest(sections[0]?.sectionName || 'Quantitative Aptitude', sections[0]?.topicName || 'Arithmetic')}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" /> Generate AI Mock Test
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8 text-slate-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          <span className="text-sm">Analyzing student test patterns with OpenAI...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((sec, idx) => {
            const badge = getLevelBadge(sec.weaknessLevel);
            const isWeak = sec.weaknessLevel === 'Weak' || sec.weaknessLevel === 'Needs Improvement';

            return (
              <div
                key={idx}
                className={`bg-slate-950/70 border rounded-xl p-4 flex flex-col justify-between transition hover:border-slate-600 ${
                  isWeak ? 'border-rose-500/30 shadow-sm shadow-rose-950/30' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{sec.sectionName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-2xl font-extrabold ${sec.accuracy < 50 ? 'text-rose-400' : (sec.accuracy < 70 ? 'text-amber-400' : 'text-emerald-400')}`}>
                      {sec.accuracy}%
                    </span>
                    <span className="text-xs text-slate-400">accuracy</span>
                  </div>

                  <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-2">Topic: {sec.topicName}</p>
                  <p className="text-[11px] text-slate-400/90 line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    {sec.recommendations}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onImproveSection(sec.sectionName, sec.topicName)}
                    className="flex-1 py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Brain className="w-3.5 h-3.5" /> Improve This Section
                  </button>
                  <button
                    onClick={() => onGenerateMockTest(sec.sectionName, sec.topicName)}
                    title="Generate test specifically for this section"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

