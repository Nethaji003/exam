import React, { useState } from 'react';
import { Question } from '../../types/database';
import { AIApiClient } from '../../services/aiApiClient';
import { Sparkles, X, Clock, Brain, AlertCircle, Layers, CheckCircle2, Loader2, Play } from 'lucide-react';

interface AIGenerateMockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: string;
  defaultTopic?: string;
  onTestGenerated: (title: string, questions: Question[], timeLimitMinutes: number) => void;
}

export const AIGenerateMockTestModal: React.FC<AIGenerateMockTestModalProps> = ({
  isOpen,
  onClose,
  defaultSection = 'Quantitative Aptitude',
  defaultTopic = 'Arithmetic & Percentage',
  onTestGenerated,
}) => {
  const [section, setSection] = useState(defaultSection);
  const [topic, setTopic] = useState(defaultTopic);
  const [questionCount, setQuestionCount] = useState<10 | 20 | 30>(20);
  const [difficulty, setDifficulty] = useState<'BALANCED' | 'EASY' | 'MEDIUM' | 'HARD'>('BALANCED');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const weakSections = [
    { name: 'Quantitative Aptitude', weakTopics: 'Percentage, Profit & Loss, Speed Time Distance' },
    { name: 'English Language', weakTopics: 'Reading Comprehension, Error Spotting, Cloze Test' },
    { name: 'Reasoning Ability', weakTopics: 'Seating Arrangements, Syllogisms, Inequalities' },
    { name: 'General Knowledge', weakTopics: 'Current Affairs, Monetary Policy, Static GK' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await AIApiClient.generateAIMockTest({
        studentId: 'student-1',
        sectionName: section,
        topicName: topic,
        questionCount,
        difficulty,
      });

      if (!res.questions || res.questions.length === 0) {
        throw new Error('No questions generated. Please try again.');
      }

      const timeLimit = questionCount === 10 ? 12 : (questionCount === 20 ? 25 : 35);
      onTestGenerated(
        `AI Personalized ${section} Mock Test (${questionCount} Qs)`,
        res.questions,
        timeLimit
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate AI Mock Test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Strict Weak Section Targeting
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">Generate AI Mock Test</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          {/* Target Section (Restricted strictly) */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select Weak Section (Questions strictly restricted to this section)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {weakSections.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    setSection(s.name);
                    setTopic(s.weakTopics.split(',')[0].trim());
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    section === s.name
                      ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xs block">{s.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{s.weakTopics}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Number of Questions & Timer
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { count: 10, time: 12, label: 'Sprint' },
                { count: 20, time: 25, label: 'Standard' },
                { count: 30, time: 35, label: 'Comprehensive' },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setQuestionCount(item.count as any)}
                  className={`p-3 rounded-xl border text-center transition ${
                    questionCount === item.count
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-lg font-extrabold block text-indigo-400">{item.count} Qs</span>
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {item.time} mins
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Strategy */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Difficulty Mix
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'BALANCED', label: 'Balanced Mix' },
                { id: 'EASY', label: 'Easy (Confidence)' },
                { id: 'MEDIUM', label: 'Medium (Exam)' },
                { id: 'HARD', label: 'Hard (Mains)' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id as any)}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    difficulty === d.id
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating AI Test...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start AI Mock Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

