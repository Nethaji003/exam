import React, { useState } from 'react';
import { 
  BookOpen, Award, Clock, CheckCircle2, ChevronRight, Play, 
  Settings, History, BarChart2, ShieldCheck, Sparkles, Filter, AlertCircle, FileText
} from 'lucide-react';
import { 
  TNPSC_PAPER_METADATA, 
  getTNPSCStats, 
  getTNPSCTopics, 
  getTNPSCAttempts, 
  TNPSCExamConfig,
  TNPSCAttemptRecord 
} from '../services/tnpscPaperData';
import { TNPSCAdminOCRModal } from '../components/tnpsc/TNPSCAdminOCRModal';

interface TNPSCGroup4ViewProps {
  onStartTest: (config: TNPSCExamConfig) => void;
  isAdmin?: boolean;
}

export const TNPSCGroup4View: React.FC<TNPSCGroup4ViewProps> = ({
  onStartTest,
  isAdmin = true
}) => {
  const [selectedMode, setSelectedMode] = useState<'full' | 'subject' | 'topic'>('full');
  const [selectedSubject, setSelectedSubject] = useState<string>('General Knowledge');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedCount, setSelectedCount] = useState<number>(20);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  
  const stats = getTNPSCStats();
  const topics = getTNPSCTopics();
  const attempts = getTNPSCAttempts();

  // Filter topics for the currently selected subject
  const currentSubjectTopics = topics.filter(t => t.subject === selectedSubject);

  const handleLaunch = () => {
    let count = 200;
    let duration = 180;

    if (selectedMode === 'full') {
      count = 200;
      duration = 180;
    } else if (selectedMode === 'subject') {
      count = selectedSubject === 'General Knowledge' ? stats.gkCount + stats.mentalCount : stats.englishCount;
      duration = 90;
    } else if (selectedMode === 'topic') {
      count = selectedCount;
      duration = Math.max(10, Math.round(selectedCount * 0.9)); // ~54 secs per question
    }

    onStartTest({
      mode: selectedMode,
      subject: selectedMode === 'full' ? undefined : selectedSubject,
      topic: selectedMode === 'topic' && selectedTopic !== 'All' ? selectedTopic : undefined,
      questionCount: count,
      durationMinutes: duration,
      examGroup: 'Group 4',
      examYear: 2011,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Official TNPSC Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm">
                  Official Memory Paper
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Booklet Series {TNPSC_PAPER_METADATA.bookletSeries} • Subject Code: {TNPSC_PAPER_METADATA.subjectCode}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Verified OCR Source
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                TNPSC Group 4 Examination
              </h1>
              <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-2xl">
                Combined Civil Services Examination – IV (Group IV Services & VAO)
              </p>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Extracted directly from your uploaded 52-page official question paper <strong className="text-amber-400 font-semibold">{TNPSC_PAPER_METADATA.pdfFilename}</strong>. Every single question is strictly authentic, preserving original question numbers, bilingual Tamil and English questions, options, verified answer keys, and detailed solutions.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">300 <span className="text-xs text-amber-400 font-normal">Marks</span></div>
                  <div className="text-xs text-slate-400">200 Questions • 1.5 Marks Each</div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">3 <span className="text-xs text-blue-400 font-normal">Hours</span></div>
                  <div className="text-xs text-slate-400">180 Mins • No Negative Marks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Statistics & Section Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Section 1 (Bilingual)</span>
              <span className="px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-300 font-bold">Q1 – Q100</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">General Knowledge & Mental Ability</h3>
            <p className="text-xs text-slate-400 mb-3">
              Bilingual Tamil & English. Physics, Chemistry, Biology, History, Polity, Economy, Geography, and Aptitude.
            </p>
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 pt-3 border-t border-slate-800/80">
              <span>Total Questions: <strong>100</strong></span>
              <span>Marks: <strong>150</strong></span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 2</span>
              <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-300 font-bold">Q101 – Q200</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">General English</h3>
            <p className="text-xs text-slate-400 mb-3">
              Grammar, Synonyms, Antonyms, Prepositions, Voice, Tenses, Sentence Patterns, Reading Comprehension.
            </p>
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 pt-3 border-t border-slate-800/80">
              <span>Total Questions: <strong>100</strong></span>
              <span>Marks: <strong>150</strong></span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">OCR & Question Bank</span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-300 font-bold">52 Pages</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Admin Verification Hub</h3>
              <p className="text-xs text-slate-400 mb-3">
                Side-by-side original scanned PDF page preview with interactive question editor & OCR cleanup tools.
              </p>
            </div>
            <button
              onClick={() => setIsOcrModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold rounded-xl text-xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Open OCR & Question Manager
            </button>
          </div>

        </div>

        {/* Practice & Mock Test Configuration Launcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                Custom Mock Test Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Launch TNPSC Group 4 Practice Test
              </h2>
            </div>
            <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Exclusively from: <span className="text-slate-200 font-mono">ques pap1.pdf</span>
            </div>
          </div>

          {/* Test Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              onClick={() => setSelectedMode('full')}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selectedMode === 'full'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Full Official Paper</span>
                <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 font-extrabold">200 Qs</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Exact replica of the 2011 TNPSC Group 4 paper in original chronological order.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> 180 Mins</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> 300 Marks</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('subject')}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selectedMode === 'subject'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Subject-wise Practice</span>
                <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 font-extrabold">100 Qs</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Practice either General Knowledge & Mental Ability or General English exclusively.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> 90 Mins</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-blue-400" /> 150 Marks</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('topic')}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selectedMode === 'topic'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Targeted Topic Practice</span>
                <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 font-extrabold">Custom Qs</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Laser-focused drill on high-yield topics like Science, Polity, Maths, or Grammar.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1"><Filter className="w-3.5 h-3.5 text-purple-400" /> Topic-Filtered</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> Flexible</span>
              </div>
            </button>

          </div>

          {/* Conditional Controls based on Mode */}
          {selectedMode === 'subject' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Subject (Strictly Isolated Questions)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedSubject('General Knowledge')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSubject === 'General Knowledge'
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm">General Knowledge & Mental Ability</div>
                  <div className="text-xs text-slate-400">Questions 1 to 100 • Tamil & English bilingual</div>
                </button>

                <button
                  onClick={() => setSelectedSubject('General English')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSubject === 'General English'
                      ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm">General English</div>
                  <div className="text-xs text-slate-400">Questions 101 to 200 • Grammar, Vocab, Passages</div>
                </button>
              </div>
            </div>
          )}

          {selectedMode === 'topic' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={e => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic('All');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="General Knowledge">General Knowledge & Mental Ability</option>
                    <option value="General English">General English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={e => setSelectedTopic(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Topics ({selectedSubject})</option>
                    {currentSubjectTopics.map(t => (
                      <option key={t.topic} value={t.topic}>
                        {t.topic} ({t.count} Qs)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Question Count</label>
                  <div className="flex items-center gap-2">
                    {[5, 10, 15, 20, 25, 50].map(cnt => (
                      <button
                        key={cnt}
                        onClick={() => setSelectedCount(cnt)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedCount === cnt
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Launch Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Selected: <strong className="text-white">
                {selectedMode === 'full' 
                  ? 'All 200 Questions (Full Mock Test)' 
                  : selectedMode === 'subject' 
                  ? `${selectedSubject} (100 Questions)` 
                  : `${selectedTopic === 'All' ? selectedSubject : selectedTopic} (${selectedCount} Questions)`}
              </strong>
            </div>

            <button
              onClick={handleLaunch}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              Start TNPSC Group 4 Mock Test
            </button>
          </div>

        </div>

        {/* Previous Attempts & Performance History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Your TNPSC Test History</h3>
            </div>
            <span className="text-xs text-slate-400">{attempts.length} attempts recorded</span>
          </div>

          {attempts.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800/80 text-slate-400 text-sm">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p>No TNPSC Group 4 test attempts recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Complete a Full Paper or Topic practice test above to see your detailed accuracy and score breakdown!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Mode / Subject</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Score (Max 300)</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attempts.map(att => (
                    <tr key={att.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-slate-400">{att.date}</td>
                      <td className="p-3 font-medium text-white">
                        {att.mode === 'full' ? 'Full 2011 Question Paper' : (att.topic || att.subject || att.mode)}
                      </td>
                      <td className="p-3">{att.attempted} / {att.totalQuestions}</td>
                      <td className="p-3 font-bold text-amber-400">{att.score.toFixed(1)} / {(att.totalQuestions * 1.5).toFixed(0)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          att.accuracyPercentage >= 70 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : att.accuracyPercentage >= 50 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {att.accuracyPercentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{Math.round(att.timeSpentSeconds / 60)} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Admin OCR Verification Modal */}
      <TNPSCAdminOCRModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
      />
    </div>
  );
};

