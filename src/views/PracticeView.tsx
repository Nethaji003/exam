import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { MainDifficultyLevel, SubLevel, DifficultyLevelId } from '../types/database';
import { Target, Lock, Unlock, Play, Sparkles, Layers, ChevronRight, Check } from 'lucide-react';

interface PracticeViewProps {
  onStartSession: (
    examId: string,
    subjectId: string,
    topicId: string,
    mainLevel: MainDifficultyLevel,
    subLevel: SubLevel,
    count: number
  ) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onStartSession }) => {
  const exams = DBService.getExams();
  const subjects = DBService.getSubjects();

  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const topics = DBService.getTopics(selectedSubjectId);
  const effectiveTopicId = topics.some((t) => t.id === selectedTopicId) ? selectedTopicId : (topics[0]?.id || '');

  // 2-Tier Compact Level Selector State
  const [mainLevel, setMainLevel] = useState<MainDifficultyLevel>('Medium');
  const [subLevel, setSubLevel] = useState<SubLevel>('L3');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const mainLevels: MainDifficultyLevel[] = ['Easy', 'Medium', 'Intermediate', 'Hard', 'Expert'];
  const subLevels: SubLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

  const levelObj = DBService.getDifficultyLevelByMainAndSub(mainLevel, subLevel);
  const topicProgress = DBService.getTopicProgress(effectiveTopicId);

  const handleStart = () => {
    onStartSession(selectedExamId, selectedSubjectId, effectiveTopicId, mainLevel, subLevel, questionCount);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> 25 Progression Levels Engine (5 Main x 5 Sublevels)
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Data-Driven Adaptive Practice</h1>
        <p className="text-slate-400 text-sm mt-1">
          Select Exam → Subject → Topic → Main Level → Sublevel → Number of Questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Step Configurator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Choose Exam */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              Select Target Exam
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {exams.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-3 rounded-xl border text-left transition ${selectedExamId === ex.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                >
                  <span className="text-xs font-semibold block">{ex.name}</span>
                  <span className="text-[10px] text-slate-400 block">{ex.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Subject */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              Select Subject
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    const newTopics = DBService.getTopics(sub.id);
                    if (newTopics.length > 0) setSelectedTopicId(newTopics[0].id);
                  }}
                  className={`p-3 rounded-xl border text-left transition ${selectedSubjectId === sub.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                >
                  <span className="text-xs font-semibold block">{sub.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Choose Topic */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              Select Topic
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topics.map((top) => (
                <button
                  key={top.id}
                  onClick={() => setSelectedTopicId(top.id)}
                  className={`p-3 rounded-xl border text-left transition ${effectiveTopicId === top.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                >
                  <span className="text-xs font-semibold block truncate">{top.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: 2-Tier Compact Level Selector (Main Level + Sublevel) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
              Select 25-Level Difficulty (Main Level & Sublevel)
            </h3>

            {/* Tier 1: Main Difficulty Tabs */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Main Difficulty Tier:</span>
              <div className="grid grid-cols-5 gap-2">
                {mainLevels.map((ml) => (
                  <button
                    key={ml}
                    onClick={() => setMainLevel(ml)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${mainLevel === ml
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    {ml}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier 2: Sublevel Buttons L1 - L5 */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Sublevel (L1 to L5):</span>
              <div className="grid grid-cols-5 gap-2">
                {subLevels.map((sl) => {
                  const isSelected = subLevel === sl;
                  return (
                    <button
                      key={sl}
                      onClick={() => setSubLevel(sl)}
                      className={`py-3 px-3 rounded-xl text-xs font-extrabold transition border flex flex-col items-center justify-center ${isSelected
                          ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                    >
                      <span>{sl}</span>
                      <span className="text-[9px] opacity-75 mt-0.5">{mainLevel} {sl}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-400">{levelObj.display_name}</span>
                <span className="text-slate-400 block text-[11px]">{levelObj.description}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                Level ID #{levelObj.id} / 25
              </span>
            </div>
          </div>

          {/* Step 5: Question Count */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
              Number of Questions
            </h3>

            <div className="flex items-center gap-3">
              {[5, 10, 15, 20, 25].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition ${questionCount === cnt
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Launch Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl sticky top-24 space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Practice Configuration Summary
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Exam</span>
                <span className="font-bold text-white">{exams.find((e) => e.id === selectedExamId)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Subject</span>
                <span className="font-bold text-white">{subjects.find((s) => s.id === selectedSubjectId)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Topic</span>
                <span className="font-bold text-white">{topics.find((t) => t.id === effectiveTopicId)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Difficulty Tier</span>
                <span className="font-bold text-indigo-400">{mainLevel}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Sublevel</span>
                <span className="font-bold text-purple-400">{subLevel}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Progression Level</span>
                <span className="font-bold text-purple-400">{mainLevel} {subLevel} (Level #{levelObj.id} / 25)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Question Count</span>
                <span className="font-bold text-emerald-400 text-sm">{questionCount} Questions</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Launch Practice Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
