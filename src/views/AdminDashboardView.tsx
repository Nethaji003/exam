import React, { useState, useEffect } from 'react';
import { DBService } from '../services/dbService';
import { AIGeneratorService } from '../services/aiGenerator';
import { AIApiClient } from '../services/aiApiClient';
import { Question, QuestionType, MainDifficultyLevel, SubLevel, PreviousYearPaper, QuestionPaper } from '../types/database';
import { 
  ShieldAlert, Sparkles, CheckCircle2, XCircle, Plus, FileText, Database, 
  Layers, Check, Loader2, AlertTriangle, Activity, Edit3, UserCheck, 
  BarChart3, Save, BookOpen, Eye, Download, Trash2, Edit2, Upload, Search, 
  AlertCircle, RefreshCw 
} from 'lucide-react';
import { TNPSCAdminOCRModal } from '../components/tnpsc/TNPSCAdminOCRModal';
import { PDFViewerModal } from '../components/common/PDFViewerModal';
import { getTNPSCStats } from '../services/tnpscPaperData';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai-gen' | 'approval-queue' | 'student-reports' | 'pyq-health' | 'pyq-manager' | 'tnpsc-ocr'>('ai-gen');
  const [isTNPSCModalOpen, setIsTNPSCModalOpen] = useState(false);

  const exams = DBService.getExams();
  const subjects = DBService.getSubjects();
  const pyqHealth = DBService.getPYQDataHealth();

  // AI Generator Form state
  const [genExamId, setGenExamId] = useState(exams[0]?.id || '');
  const [genSubjectId, setGenSubjectId] = useState(subjects[0]?.id || '');
  const topics = DBService.getTopics(genSubjectId);
  const [genTopicId, setGenTopicId] = useState(topics[0]?.id || '');
  const [genMainLevel, setGenMainLevel] = useState<MainDifficultyLevel>('Medium');
  const [genSubLevel, setGenSubLevel] = useState<SubLevel>('L3');
  const [genCount, setGenCount] = useState<number>(3);
  const [genType, setGenType] = useState<QuestionType>('Multiple Choice');
  const [apiKey, setApiKey] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<Question[]>([]);
  const [genSuccessMsg, setGenSuccessMsg] = useState<string | null>(null);

  // Approval Queue & Edit state
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>(
    DBService.getQuestions({ status: 'pending_approval' })
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [studentReports, setStudentReports] = useState<any[]>([]);

  useEffect(() => {
    AIApiClient.getImprovementHistory('student-1')
      .then((res) => setStudentReports(res))
      .catch(() => {});
  }, [activeTab]);

  // Official Question Papers Archive state
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(DBService.getQuestionPapers());
  const [paperToDelete, setPaperToDelete] = useState<QuestionPaper | null>(null);
  const [paperToEdit, setPaperToEdit] = useState<QuestionPaper | null>(null);
  const [paperToViewPDF, setPaperToViewPDF] = useState<QuestionPaper | null>(null);
  const [paperSearchTerm, setPaperSearchTerm] = useState('');

  // Upload New Paper form state
  const [newTitle, setNewTitle] = useState('');
  const [newGroup, setNewGroup] = useState<'Group 2' | 'Group 4'>('Group 4');
  const [newYear, setNewYear] = useState<number>(2024);
  const [newLanguage, setNewLanguage] = useState<'Tamil' | 'English' | 'Bilingual'>('Bilingual');
  const [newExamType, setNewExamType] = useState<'Prelims' | 'Mains' | 'Objective'>('Objective');
  const [newTotalQuestions, setNewTotalQuestions] = useState<number>(200);
  const [newDuration, setNewDuration] = useState<number>(180);
  const [newPdfPath, setNewPdfPath] = useState<string>('/pdfs/tnpsc_group4_2024.pdf');
  const [paperActionMsg, setPaperActionMsg] = useState<string | null>(null);

  // PYQ Form state
  const [pyqExamId, setPyqExamId] = useState(exams[0]?.id || '');
  const [pyqYear, setPyqYear] = useState<number>(2025);
  const [pyqStage, setPyqStage] = useState<string>('Prelims');
  const [pyqShift, setPyqShift] = useState<string>('Shift 1');
  const [pyqExpected, setPyqExpected] = useState<number>(100);
  const [pyqSuccessMsg, setPyqSuccessMsg] = useState<string | null>(null);

  const handleTriggerAIGeneration = async () => {
    setIsGenerating(true);
    setGenSuccessMsg(null);

    try {
      const generated = await AIGeneratorService.generateQuestions(
        {
          exam_id: genExamId,
          subject_id: genSubjectId,
          topic_id: genTopicId,
          main_level: genMainLevel,
          sub_level: genSubLevel,
          question_count: genCount,
          question_type: genType,
          language: 'English',
        },
        apiKey
      );

      setGeneratedPreview(generated);
      setGenSuccessMsg(`Generated ${generated.length} questions for ${genMainLevel} ${genSubLevel} in structured JSON format!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedToDb = (question: Question) => {
    DBService.saveQuestion(question);
    setGeneratedPreview((prev) => prev.filter((q) => q.id !== question.id));
    setPendingQuestions(DBService.getQuestions({ status: 'pending_approval' }));
  };

  const handleApproveQuestion = (id: string) => {
    DBService.updateQuestionStatus(id, 'approved');
    setPendingQuestions(DBService.getQuestions({ status: 'pending_approval' }));
  };

  const handleRejectQuestion = (id: string) => {
    DBService.updateQuestionStatus(id, 'rejected');
    setPendingQuestions(DBService.getQuestions({ status: 'pending_approval' }));
  };

  const handleCreatePYQPaper = () => {
    const targetExam = exams.find((e) => e.id === pyqExamId);
    const paperObj: PreviousYearPaper = {
      id: `pyq-paper-${Date.now()}`,
      exam_id: pyqExamId,
      exam_code: targetExam?.code,
      exam_name: targetExam?.name,
      year: pyqYear,
      stage: pyqStage,
      shift: pyqShift,
      exam_date: new Date().toISOString().split('T')[0],
      duration: 60,
      total_questions: pyqExpected,
      expected_questions: pyqExpected,
      total_marks: pyqExpected,
      negative_marking: 0.25,
      source: 'Admin Verified Memory-Based Sourced Paper',
      publication_status: 'Incomplete'
    };

    DBService.savePYQPaper(paperObj, []);
    setPyqSuccessMsg(`PYQ Paper "${targetExam?.name} ${pyqYear} ${pyqStage} ${pyqShift}" created! Expected: ${pyqExpected} Qs.`);
    setTimeout(() => setPyqSuccessMsg(null), 3000);
  };

  const handleUploadNewPaper = () => {
    if (!newTitle.trim()) {
      alert('Please enter a question paper title.');
      return;
    }

    const newPaper: QuestionPaper = {
      id: `paper-${newGroup.toLowerCase().replace(/\s+/g, '')}-${newYear}-${Date.now()}`,
      exam_group: newGroup,
      exam_year: newYear,
      exam_type: newExamType,
      language: newLanguage,
      title: newTitle,
      pdf_file_path: newPdfPath,
      total_questions: newTotalQuestions,
      total_marks: newTotalQuestions * 1.5,
      duration_minutes: newDuration,
      publication_status: 'Ready',
      created_at: new Date().toISOString(),
    };

    DBService.saveQuestionPaper(newPaper);
    setQuestionPapers(DBService.getQuestionPapers());
    setPaperActionMsg(`Question Paper "${newTitle}" registered successfully!`);
    setNewTitle('');
    setTimeout(() => setPaperActionMsg(null), 4000);
  };

  const handleSaveEditPaper = () => {
    if (!paperToEdit) return;
    DBService.saveQuestionPaper(paperToEdit);
    setQuestionPapers(DBService.getQuestionPapers());
    setPaperToEdit(null);
    setPaperActionMsg('Question paper updated successfully!');
    setTimeout(() => setPaperActionMsg(null), 4000);
  };

  const handleConfirmDeletePaper = () => {
    if (!paperToDelete) return;
    DBService.deleteQuestionPaper(paperToDelete.id);
    setQuestionPapers(DBService.getQuestionPapers());
    setPaperToDelete(null);
    setPaperActionMsg('Question paper deleted permanently.');
    setTimeout(() => setPaperActionMsg(null), 4000);
  };

  const handleDownloadPaper = (paper: QuestionPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = paper.pdf_file_path;
    link.download = `${paper.exam_group.replace(/\s+/g, '_')}_${paper.exam_year}_${paper.language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Protected Admin Command Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Content & AI Question Management</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl p-1 max-w-3xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('ai-gen')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'ai-gen' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Question Generator
        </button>

        <button
          onClick={() => setActiveTab('approval-queue')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'approval-queue' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Approval Queue ({pendingQuestions.length})
        </button>

        <button
          onClick={() => setActiveTab('student-reports')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'student-reports' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-sky-400" /> Student Reports ({studentReports.length})
        </button>

        <button
          onClick={() => setActiveTab('pyq-health')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pyq-health' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" /> PYQ Data Health Audit
        </button>

        <button
          onClick={() => setActiveTab('pyq-manager')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'pyq-manager' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          PYQ Paper Manager
        </button>

        <button
          onClick={() => setActiveTab('tnpsc-ocr')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tnpsc-ocr' ? 'bg-amber-600 text-slate-950 font-black shadow' : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> TNPSC Group 4 OCR Manager
        </button>
      </div>

      {/* AI Question Generator Tab */}
      {activeTab === 'ai-gen' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> AI Question Generator Service
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Exam</label>
                <select
                  value={genExamId}
                  onChange={(e) => setGenExamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
                <select
                  value={genSubjectId}
                  onChange={(e) => {
                    setGenSubjectId(e.target.value);
                    const newT = DBService.getTopics(e.target.value);
                    if (newT.length > 0) setGenTopicId(newT[0].id);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Topic</label>
                <select
                  value={genTopicId}
                  onChange={(e) => setGenTopicId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Main Level</label>
                <select
                  value={genMainLevel}
                  onChange={(e) => setGenMainLevel(e.target.value as MainDifficultyLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Sublevel</label>
                <select
                  value={genSubLevel}
                  onChange={(e) => setGenSubLevel(e.target.value as SubLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="L4">L4</option>
                  <option value="L5">L5</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Question Type</label>
                <select
                  value={genType}
                  onChange={(e) => setGenType(e.target.value as QuestionType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Numerical Answer">Numerical Answer</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                  <option value="Assertion & Reason">Assertion & Reason</option>
                  <option value="Data Interpretation">Data Interpretation</option>
                  <option value="Puzzles">Puzzles</option>
                  <option value="Reading Comprehension">Reading Comprehension</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Count</label>
                <select
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={1}>1 Question</option>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <button
              disabled={isGenerating}
              onClick={handleTriggerAIGeneration}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Generating Structured JSON...' : `Generate AI Questions (${genMainLevel} ${genSubLevel})`}
            </button>

            {genSuccessMsg && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                {genSuccessMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PYQ Data Health Audit System Tab */}
      {activeTab === 'pyq-health' && (
        <div className="space-y-6">
          {/* Top Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Papers</span>
              <p className="text-3xl font-extrabold text-white mt-1">{pyqHealth.total_papers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Complete (Ready)</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{pyqHealth.complete_papers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Incomplete</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{pyqHealth.incomplete_papers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total PYQ Questions</span>
              <p className="text-3xl font-extrabold text-sky-400 mt-1">{pyqHealth.total_pyq_questions}</p>
            </div>
          </div>

          {/* Paper Health Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> PYQ Paper-to-Question Data Health Audit Table
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Paper Title</th>
                    <th className="p-3">Expected Qs</th>
                    <th className="p-3">Actual Linked Qs</th>
                    <th className="p-3">Missing Qs</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pyqHealth.papers.map((p) => (
                    <tr key={p.paper_id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{p.paper_name}</td>
                      <td className="p-3 font-mono">{p.expected_questions}</td>
                      <td className="p-3 font-mono font-bold text-sky-400">{p.actual_questions}</td>
                      <td className="p-3 font-mono text-rose-400">{p.missing_count}</td>
                      <td className="p-3">
                        {p.status === 'Ready' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ Ready (Published)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            ⚠️ Incomplete ({p.missing_count} Missing)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Approval Queue Tab */}
      {activeTab === 'approval-queue' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Pending AI Questions Approval Queue</h3>

          {pendingQuestions.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">Queue Empty</h4>
              <p className="text-xs text-slate-400 mt-1">All generated AI questions have been reviewed and published!</p>
            </div>
          ) : (
            pendingQuestions.map((q) => (
              <div key={q.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Review
                    </span>
                    <span className="text-xs font-semibold text-indigo-400">{q.exam_name} — {q.main_level} {q.sub_level}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleApproveQuestion(q.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                    </button>
                    <button
                      onClick={() => handleRejectQuestion(q.id)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-100 whitespace-pre-line">{q.question_text}</p>

                {q.options && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.option_key}
                        className={`p-2 rounded-lg text-xs border ${
                          opt.is_correct
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.option_key}. {opt.option_text} {opt.is_correct && '✓ (Correct Key)'}
                      </div>
                    ))}
                  </div>
                )}

                {q.explanation && (
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300">
                    <strong className="text-indigo-400 block mb-0.5">Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Student Reports Tab */}
      {activeTab === 'student-reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" /> Student Performance & Diagnostic Reports
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated test performance evaluations generated by OpenAI and recorded in MySQL.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Test Title</th>
                    <th className="p-3">Completed Date</th>
                    <th className="p-3">Score / Total</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Weak Concepts</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {studentReports.map((report, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{report.testAttemptId}</td>
                      <td className="p-3 text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-mono text-slate-200">{report.correctCount} / {report.totalQuestions}</td>
                      <td className="p-3 font-mono font-bold text-indigo-400">{report.overallAccuracy}%</td>
                      <td className="p-3 text-amber-300 max-w-xs truncate">{report.weakConcepts || 'None'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Audited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PYQ & PDF Paper Archive Manager Tab */}
      {activeTab === 'pyq-manager' && (
        <div className="space-y-6">
          {paperActionMsg && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{paperActionMsg}</span>
            </div>
          )}

          {/* Upload / Register New Question Paper PDF */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Upload & Register Question Paper PDF
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">PDF Store: /public/pdfs/</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Paper Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. TNPSC Group 4 – 2024 General Studies & General Tamil"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exam Group</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as 'Group 2' | 'Group 4')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Group 4">TNPSC Group 4</option>
                  <option value="Group 2">TNPSC Group 2 & 2A</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exam Year</label>
                <select
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011].map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value as 'Tamil' | 'English' | 'Bilingual')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Bilingual">Bilingual (Tamil & English)</option>
                  <option value="Tamil">General Tamil</option>
                  <option value="English">General English</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exam Type / Stage</label>
                <select
                  value={newExamType}
                  onChange={(e) => setNewExamType(e.target.value as 'Prelims' | 'Mains' | 'Objective')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Objective">Objective (General Studies & Language)</option>
                  <option value="Prelims">Prelims</option>
                  <option value="Mains">Mains</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Total Questions</label>
                <input
                  type="number"
                  value={newTotalQuestions}
                  onChange={(e) => setNewTotalQuestions(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="text-xs font-semibold text-slate-400 block mb-1">PDF File Path or Select File</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPdfPath}
                    onChange={(e) => setNewPdfPath(e.target.value)}
                    placeholder="/pdfs/tnpsc_group4_2024.pdf"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setNewPdfPath(e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                  >
                    <option value="">Preset PDF Files</option>
                    <option value="/pdfs/tnpsc_group4_2011.pdf">tnpsc_group4_2011.pdf (Original Scanned)</option>
                    <option value="/pdfs/tnpsc_group4_2012.pdf">tnpsc_group4_2012.pdf</option>
                    <option value="/pdfs/tnpsc_group4_2018.pdf">tnpsc_group4_2018.pdf</option>
                    <option value="/pdfs/tnpsc_group4_2019.pdf">tnpsc_group4_2019.pdf</option>
                    <option value="/pdfs/tnpsc_group4_2022.pdf">tnpsc_group4_2022.pdf</option>
                    <option value="/pdfs/tnpsc_group4_2024.pdf">tnpsc_group4_2024.pdf</option>
                    <option value="/pdfs/tnpsc_group2_2022.pdf">tnpsc_group2_2022.pdf</option>
                    <option value="/pdfs/tnpsc_group2_2024.pdf">tnpsc_group2_2024.pdf</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUploadNewPaper}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Register & Save Paper PDF
              </button>
            </div>
          </div>

          {/* Registered Question Papers Archive Table / Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Official Question Papers Archive ({questionPapers.length} Papers)
                </h3>
                <p className="text-xs text-slate-400">
                  Manage, preview, edit metadata, and delete question papers with confirmation popup.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={paperSearchTerm}
                  onChange={(e) => setPaperSearchTerm(e.target.value)}
                  placeholder="Search papers..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-48 sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionPapers
                .filter(
                  (p) =>
                    !paperSearchTerm ||
                    p.title.toLowerCase().includes(paperSearchTerm.toLowerCase()) ||
                    p.exam_group.toLowerCase().includes(paperSearchTerm.toLowerCase()) ||
                    p.exam_year.toString().includes(paperSearchTerm)
                )
                .map((paper) => (
                  <div
                    key={paper.id}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between space-y-3 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {paper.exam_group} • {paper.exam_year}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {paper.language}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">{paper.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Type: <span className="text-slate-200">{paper.exam_type}</span> • Questions:{' '}
                        <span className="text-emerald-400 font-bold">{paper.total_questions}</span> • Duration:{' '}
                        <span className="text-sky-400">{paper.duration_minutes}m</span>
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                        File: {paper.pdf_file_path}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPaperToViewPDF(paper)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View PDF
                        </button>
                        <button
                          onClick={(e) => handleDownloadPaper(paper, e)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPaperToEdit(paper)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400 hover:text-purple-300 rounded-lg transition"
                          title="Edit Paper Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPaperToDelete(paper)}
                          className="p-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-rose-400 rounded-lg transition"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Legacy PYQ Entity Creator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Create Legacy PYQ Mock Entity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exam</label>
                <select
                  value={pyqExamId}
                  onChange={(e) => setPyqExamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Year</label>
                <select
                  value={pyqYear}
                  onChange={(e) => setPyqYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                  <option value={2021}>2021</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Stage</label>
                <input
                  type="text"
                  value={pyqStage}
                  onChange={(e) => setPyqStage(e.target.value)}
                  placeholder="Prelims / CBT-1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Shift</label>
                <input
                  type="text"
                  value={pyqShift}
                  onChange={(e) => setPyqShift(e.target.value)}
                  placeholder="Shift 1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Expected Questions</label>
                <input
                  type="number"
                  value={pyqExpected}
                  onChange={(e) => setPyqExpected(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleCreatePYQPaper}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              Create PYQ Paper Entity
            </button>

            {pyqSuccessMsg && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                {pyqSuccessMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TNPSC Group 4 OCR Manager Tab */}
      {activeTab === 'tnpsc-ocr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> TNPSC Group 4 (2011 Official Memory Paper)
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  52 Pages • OCR Verified
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">Scanned PDF Optical Character Recognition Center</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Inspect scanned pages side-by-side with recognized text, correct OCR discrepancies, verify answer keys, and manage subject/topic taxonomies.
              </p>
            </div>

            <button
              onClick={() => setIsTNPSCModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
            >
              <Edit3 className="w-4 h-4" /> Open Full-Screen OCR Workspace
            </button>
          </div>

          {/* Quick Metrics */}
          {(() => {
            const stats = getTNPSCStats();
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Total Scanned Pages</div>
                  <div className="text-2xl font-black text-white mt-1">52</div>
                  <div className="text-[11px] text-amber-400 mt-1">ques pap1.pdf</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Questions Extracted</div>
                  <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% Extracted</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">General Knowledge</div>
                  <div className="text-2xl font-black text-sky-400 mt-1">{stats.gkCount + stats.mentalCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Bilingual Tamil & Eng</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">General English</div>
                  <div className="text-2xl font-black text-purple-400 mt-1">{stats.englishCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Grammar & Vocab</div>
                </div>
              </div>
            );
          })()}

          {/* Scanned Pages Carousel Gallery */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Scanned Pages Archive (52 Pages)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {Array.from({ length: 52 }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setIsTNPSCModalOpen(true)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-lg text-center transition group flex flex-col items-center"
                >
                  <img
                    src={`/tnpsc_pages/page_${pageNum}.png`}
                    alt={`P${pageNum}`}
                    className="w-10 h-14 object-cover rounded border border-slate-700 mb-1 group-hover:scale-105 transition"
                  />
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400">P{pageNum}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TNPSC OCR Modal */}
      <TNPSCAdminOCRModal
        isOpen={isTNPSCModalOpen}
        onClose={() => setIsTNPSCModalOpen(false)}
      />

      {/* Admin Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" /> Edit Question & Answer Key
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Question Text</label>
              <textarea
                value={editingQuestion.question_text}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Correct Answer Key</label>
                <select
                  value={editingQuestion.correct_answer}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Estimated Time (sec)</label>
                <input
                  type="number"
                  value={editingQuestion.estimated_time || 60}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, estimated_time: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Step-by-Step Explanation</label>
              <textarea
                value={editingQuestion.explanation}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  DBService.saveQuestion(editingQuestion);
                  setPendingQuestions(DBService.getQuestions({ status: 'pending_approval' }));
                  setEditingQuestion(null);
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {paperToViewPDF && (
        <PDFViewerModal
          paper={paperToViewPDF}
          onClose={() => setPaperToViewPDF(null)}
        />
      )}

      {/* Delete Question Paper Confirmation Modal */}
      {paperToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Question Paper?</h3>
                <p className="text-xs text-slate-400">Confirmation required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{paperToDelete.title}"</strong> ({paperToDelete.exam_group} {paperToDelete.exam_year})?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPaperToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletePaper}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Yes, Delete Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Paper Details Modal */}
      {paperToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" /> Edit Question Paper Details
              </h3>
              <button
                onClick={() => setPaperToEdit(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Paper Title</label>
                <input
                  type="text"
                  value={paperToEdit.title}
                  onChange={(e) => setPaperToEdit({ ...paperToEdit, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Exam Group</label>
                  <select
                    value={paperToEdit.exam_group}
                    onChange={(e) => setPaperToEdit({ ...paperToEdit, exam_group: e.target.value as 'Group 2' | 'Group 4' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Group 4">Group 4</option>
                    <option value="Group 2">Group 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={paperToEdit.exam_year}
                    onChange={(e) => setPaperToEdit({ ...paperToEdit, exam_year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Language</label>
                  <select
                    value={paperToEdit.language}
                    onChange={(e) => setPaperToEdit({ ...paperToEdit, language: e.target.value as 'Tamil' | 'English' | 'Bilingual' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Bilingual">Bilingual</option>
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={paperToEdit.total_questions}
                    onChange={(e) => setPaperToEdit({ ...paperToEdit, total_questions: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">PDF File Path</label>
                <input
                  type="text"
                  value={paperToEdit.pdf_file_path}
                  onChange={(e) => setPaperToEdit({ ...paperToEdit, pdf_file_path: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPaperToEdit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPaper}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
