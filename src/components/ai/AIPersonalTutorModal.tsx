import React, { useEffect, useState } from 'react';
import { AITutorData } from '../../types/database';
import { AIApiClient } from '../../services/aiApiClient';
import {
  Brain,
  X,
  BookOpen,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ListOrdered,
  Lightbulb,
  Loader2,
} from 'lucide-react';

interface AIPersonalTutorModalProps {
  sectionName: string;
  topicName: string;
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: () => void;
}

export const AIPersonalTutorModal: React.FC<AIPersonalTutorModalProps> = ({
  sectionName,
  topicName,
  isOpen,
  onClose,
  onStartPractice,
}) => {
  const [tutorData, setTutorData] = useState<AITutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    AIApiClient.getAITutorGuidance({
      studentId: 'student-1',
      sectionName,
      topicName,
    })
      .then((data) => {
        setTutorData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Tutor loading failed:', err);
        setLoading(false);
      });
  }, [isOpen, sectionName, topicName]);

  if (!isOpen) return null;

  const handleSelectOption = (qIdx: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionKey }));
    setRevealedExplanations((prev) => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OpenAI Personal Tutor
                </span>
                <span className="text-xs text-slate-400">{sectionName}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Targeted Concept Booster: {topicName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium">OpenAI Tutor is preparing personalized lesson plan & shortcuts...</p>
            </div>
          ) : tutorData ? (
            <>
              {/* Concept Breakdown */}
              <div className="bg-slate-950/60 border border-indigo-500/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" /> Concept Breakdown & Common Mistake Traps
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tutorData.conceptExplanation}</p>
              </div>

              {/* Examples */}
              {tutorData.examples && tutorData.examples.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" /> Worked Examples & Real Walkthroughs
                  </div>
                  <div className="space-y-2">
                    {tutorData.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-xs text-slate-300">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shortcuts & Formulas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorData.shortcuts && tutorData.shortcuts.length > 0 && (
                  <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> Exam Speed Shortcuts
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {tutorData.shortcuts.map((sc, idx) => (
                        <li key={idx} className="leading-relaxed">{sc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tutorData.formulas && tutorData.formulas.length > 0 && (
                  <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Formulas & Memory Rules
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                      {tutorData.formulas.map((form, idx) => (
                        <li key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-800">{form}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Interactive Mini Practice Questions */}
              {tutorData.practiceQuestions && tutorData.practiceQuestions.length > 0 && (
                <div className="bg-slate-950/60 border border-purple-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                      <Brain className="w-4 h-4" /> Targeted Practice Questions ({tutorData.practiceQuestions.length})
                    </div>
                    <span className="text-[11px] text-slate-400">Instant feedback enabled</span>
                  </div>

                  <div className="space-y-4">
                    {tutorData.practiceQuestions.map((pq, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const isRevealed = revealedExplanations[qIdx];

                      return (
                        <div key={qIdx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                          <p className="text-sm font-semibold text-white">
                            <span className="text-purple-400 font-bold mr-2">Q{qIdx + 1}.</span>
                            {pq.questionText}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pq.options.map((opt) => {
                              const isSelected = userChoice === opt.key;
                              const isCorrect = opt.key === pq.correctAnswer;
                              let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300';

                              if (isRevealed) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                                } else if (isSelected) {
                                  btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={opt.key}
                                  onClick={() => handleSelectOption(qIdx, opt.key)}
                                  className={`p-2.5 rounded-lg border text-xs text-left transition flex items-center justify-between ${btnClass}`}
                                >
                                  <span>
                                    <strong className="mr-1.5">{opt.key}.</strong> {opt.text}
                                  </span>
                                  {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                  {isRevealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {isRevealed && (
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                              <strong className="text-emerald-400 block mb-0.5">Solution & Explanation:</strong>
                              {pq.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Study Order */}
              {tutorData.studyOrder && tutorData.studyOrder.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ListOrdered className="w-4 h-4" /> Recommended Topics to Study First
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {tutorData.studyOrder.map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">Unable to load tutor session. Please try again.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Close
          </button>

          {onStartPractice && (
            <button
              onClick={() => {
                onClose();
                onStartPractice();
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              Start Practice Session <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

