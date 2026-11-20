import React, { useEffect, useState } from 'react';
import { TestAttemptResult, Question, PreviousYearQuestion, PerformanceAnalysisResult } from '../../types/database';
import { AIApiClient } from '../../services/aiApiClient';
import { Brain, Sparkles, AlertTriangle, CheckCircle2, XCircle, ArrowUpRight, Loader2, Award, Zap } from 'lucide-react';

interface AIPerformanceAnalysisPanelProps {
  testResult: TestAttemptResult;
  questions: (Question | PreviousYearQuestion)[];
  userAnswers: Record<string, string>;
}

export const AIPerformanceAnalysisPanel: React.FC<AIPerformanceAnalysisPanelProps> = ({
  testResult,
  questions,
  userAnswers,
}) => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const questionResults = questions.map((q) => {
      const uAns = userAnswers[q.id] || 'Skipped';
      const isCorrect = uAns === q.correct_answer;
      return {
        questionText: q.question_text,
        subjectName: q.subject_name || 'General',
        topicName: q.topic_name || 'Core Topic',
        userAnswer: uAns,
        correctAnswer: q.correct_answer,
        isCorrect,
        timeTakenSeconds: 45,
      };
    });

    AIApiClient.analyzeTestPerformance({
      studentId: 'student-1',
      testTitle: testResult.test_title,
      testType: testResult.test_type,
      questionResults,
    })
      .then((res) => {
        if (mounted) {
          setAnalysis(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('AI Analysis failed:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [testResult, questions, userAnswers]);

  if (loading) {
    return (
      <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        <span className="text-xs text-slate-300 font-medium">
          OpenAI is evaluating your attempt: subject accuracy, topic mistakes, and concept diagnosis...
        </span>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              OpenAI Deep Performance Diagnostics
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Analysis
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Continuous feedback saved to MySQL profile</p>
          </div>
        </div>
      </div>

      {/* Subject & Topic Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {analysis.sections.map((sec, idx) => (
          <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{sec.sectionName}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sec.weaknessLevel === 'Weak'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : sec.weaknessLevel === 'Needs Improvement'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {sec.weaknessLevel}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-slate-400">Topic: {sec.topicName}</span>
              <span className="font-extrabold text-indigo-400">{sec.accuracyPercentage}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  sec.accuracyPercentage < 50
                    ? 'bg-rose-500'
                    : sec.accuracyPercentage < 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, sec.accuracyPercentage)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2 rounded-lg">
              💡 {sec.recommendations}
            </p>
          </div>
        ))}
      </div>

      {/* Repeated Mistakes & Concept Mastery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-rose-950/20 border border-rose-800/30 rounded-xl space-y-1">
          <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Weak Concepts Identified
          </span>
          <p className="text-xs text-slate-300">
            {analysis.weakConcepts || 'No critical weak concepts detected in this attempt.'}
          </p>
        </div>

        <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-1">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Strong Concepts Mastered
          </span>
          <p className="text-xs text-slate-300">
            {analysis.strongConcepts || 'Good overall fundamentals across covered questions.'}
          </p>
        </div>
      </div>
    </div>
  );
};

