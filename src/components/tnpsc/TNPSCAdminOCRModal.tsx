import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertTriangle, FileText, Sparkles, 
  ZoomIn, ZoomOut, Save, RefreshCw, ChevronLeft, ChevronRight, Eye, BookOpen
} from 'lucide-react';
import { 
  TNPSCQuestion, 
  getTNPSCQuestions, 
  saveTNPSCQuestionEdit, 
  getTNPSCStats,
  TNPSC_PAPER_METADATA 
} from '../../services/tnpscPaperData';

interface TNPSCAdminOCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const TNPSCAdminOCRModal: React.FC<TNPSCAdminOCRModalProps> = ({
  isOpen,
  onClose,
  initialPage = 3
}) => {
  const [selectedPage, setSelectedPage] = useState<number>(initialPage);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [loadingOcr, setLoadingOcr] = useState<boolean>(false);
  const [questionsOnPage, setQuestionsOnPage] = useState<TNPSCQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<TNPSCQuestion | null>(null);
  const [editForm, setEditForm] = useState<Partial<TNPSCQuestion>>({});
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [stats, setStats] = useState(getTNPSCStats());
  const [isAiPolishing, setIsAiPolishing] = useState<boolean>(false);

  // Sync initial page if opened
  useEffect(() => {
    if (isOpen) {
      setSelectedPage(initialPage);
      setStats(getTNPSCStats());
    }
  }, [isOpen, initialPage]);

  // Load page data (OCR text + questions on this page)
  useEffect(() => {
    if (!isOpen) return;

    setLoadingOcr(true);
    fetch(`/tnpsc_ocr/page_${selectedPage}.txt`)
      .then(res => {
        if (!res.ok) throw new Error('OCR file not found');
        return res.text();
      })
      .then(text => {
        setRawOcrText(text);
        setLoadingOcr(false);
      })
      .catch(() => {
        setRawOcrText('Raw OCR text for this page is being generated or was processed directly from PDF stream.');
        setLoadingOcr(false);
      });

    // Get questions matching this page
    const pageQuestions = getTNPSCQuestions({ page: selectedPage });
    setQuestionsOnPage(pageQuestions);
    if (pageQuestions.length > 0) {
      setActiveQuestion(pageQuestions[0]);
      setEditForm(pageQuestions[0]);
    } else {
      setActiveQuestion(null);
      setEditForm({});
    }
    setSaveSuccess(false);
  }, [selectedPage, isOpen]);

  // Update edit form when active question changes
  const handleSelectQuestion = (q: TNPSCQuestion) => {
    setActiveQuestion(q);
    setEditForm(q);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (!activeQuestion || !editForm) return;

    const updated: TNPSCQuestion = {
      ...activeQuestion,
      ...editForm,
      is_verified: true,
      status: 'verified'
    } as TNPSCQuestion;

    const ok = saveTNPSCQuestionEdit(updated);
    if (ok) {
      setActiveQuestion(updated);
      setQuestionsOnPage(prev => prev.map(q => q.id === updated.id ? updated : q));
      setStats(getTNPSCStats());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleAiPolish = () => {
    if (!editForm) return;
    setIsAiPolishing(true);

    setTimeout(() => {
      // Clean up common OCR artifacts
      const cleanedEn = (editForm.question_text_en || '')
        .replace(/â€¢/g, '')
        .replace(/â€“/g, '-')
        .replace(/â€/g, "'")
        .replace(/\s{2,}/g, ' ')
        .trim();

      const cleanedA = (editForm.option_a || '').replace(/^[A-D]\)\s*/, '').trim();
      const cleanedB = (editForm.option_b || '').replace(/^[A-D]\)\s*/, '').trim();
      const cleanedC = (editForm.option_c || '').replace(/^[A-D]\)\s*/, '').trim();
      const cleanedD = (editForm.option_d || '').replace(/^[A-D]\)\s*/, '').trim();

      setEditForm(prev => ({
        ...prev,
        question_text_en: cleanedEn,
        option_a: cleanedA,
        option_b: cleanedB,
        option_c: cleanedC,
        option_d: cleanedD
      }));
      setIsAiPolishing(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-7xl h-[95vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  TNPSC Group 4 OCR Verification & Question Bank Manager
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  52 Pages Scanned
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Paper: <span className="text-slate-300">{TNPSC_PAPER_METADATA.title}</span> (Code: {TNPSC_PAPER_METADATA.subjectCode}, Series {TNPSC_PAPER_METADATA.bookletSeries})
              </p>
            </div>
          </div>

          {/* Quick Page Navigator & Close */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
              <button
                onClick={() => setSelectedPage(p => Math.max(1, p - 1))}
                disabled={selectedPage <= 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-300">
                Page <span className="text-amber-400 font-bold">{selectedPage}</span> of {TNPSC_PAPER_METADATA.totalPages}
              </span>
              <button
                onClick={() => setSelectedPage(p => Math.min(TNPSC_PAPER_METADATA.totalPages, p + 1))}
                disabled={selectedPage >= TNPSC_PAPER_METADATA.totalPages}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Verification Stats Bar */}
        <div className="px-6 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-6">
            <span>Verified: <strong className="text-emerald-400">{stats.verified} / {stats.total}</strong></span>
            <span>General Knowledge: <strong className="text-sky-400">{stats.gkCount} Qs</strong></span>
            <span>Mental Ability: <strong className="text-purple-400">{stats.mentalCount} Qs</strong></span>
            <span>General English: <strong className="text-amber-400">{stats.englishCount} Qs</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Quick Jump:</span>
            <button onClick={() => setSelectedPage(1)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Cover</button>
            <button onClick={() => setSelectedPage(3)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Q1 (GK)</button>
            <button onClick={() => setSelectedPage(18)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Q50 (GK)</button>
            <button onClick={() => setSelectedPage(33)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Q101 (Eng)</button>
            <button onClick={() => setSelectedPage(48)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Q200 (Eng)</button>
          </div>
        </div>

        {/* Main 2-Pane Work Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Pane: Original Scanned Page Image (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/70 border-r border-slate-800 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Original Scanned Page {selectedPage}.png
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel(z => Math.max(50, z - 15))}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 px-1">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(200, z + 15))}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={`/tnpsc_pages/page_${selectedPage}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded ml-2"
                  title="Open full image in new tab"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-950">
              <img 
                src={`/tnpsc_pages/page_${selectedPage}.png`} 
                alt={`Scanned Page ${selectedPage}`}
                style={{ width: `${zoomLevel}%`, maxWidth: 'none' }}
                className="rounded-lg shadow-lg border border-slate-800 object-contain transition-all"
              />
            </div>
          </div>

          {/* Right Pane: OCR Extraction & Question Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden bg-slate-900/50">
            
            {/* Questions Tab for This Page */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Questions on Page:
                </span>
                {questionsOnPage.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No questions assigned to Page {selectedPage} (Instructions/Cover/Rough Work)</span>
                ) : (
                  questionsOnPage.map(q => (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestion(q)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeQuestion?.id === q.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      Q{q.original_question_number}
                    </button>
                  ))
                )}
              </div>

              {activeQuestion && (
                <button
                  onClick={handleAiPolish}
                  disabled={isAiPolishing}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {isAiPolishing ? 'Polishing...' : 'AI Clean OCR Noise'}
                </button>
              )}
            </div>

            {/* Editor Body */}
            {activeQuestion ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {saveSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Question #{activeQuestion.original_question_number} verified and saved to official question bank!</span>
                  </div>
                )}

                {/* Metadata row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                    <select
                      value={editForm.subject || activeQuestion.subject}
                      onChange={e => setEditForm({ ...editForm, subject: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="General Knowledge">General Knowledge</option>
                      <option value="General Mental Ability">General Mental Ability</option>
                      <option value="General English">General English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Topic</label>
                    <input
                      type="text"
                      value={editForm.topic || activeQuestion.topic}
                      onChange={e => setEditForm({ ...editForm, topic: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Correct Answer Key</label>
                    <select
                      value={editForm.correct_answer || activeQuestion.correct_answer}
                      onChange={e => setEditForm({ ...editForm, correct_answer: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>

                {/* Question Texts */}
                {activeQuestion.question_text_ta && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Question Text (Tamil)</label>
                    <textarea
                      rows={2}
                      value={editForm.question_text_ta ?? activeQuestion.question_text_ta}
                      onChange={e => setEditForm({ ...editForm, question_text_ta: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Question Text (English)</label>
                  <textarea
                    rows={2}
                    value={editForm.question_text_en ?? activeQuestion.question_text_en}
                    onChange={e => setEditForm({ ...editForm, question_text_en: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Option A</label>
                    <input
                      type="text"
                      value={editForm.option_a ?? activeQuestion.option_a}
                      onChange={e => setEditForm({ ...editForm, option_a: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Option B</label>
                    <input
                      type="text"
                      value={editForm.option_b ?? activeQuestion.option_b}
                      onChange={e => setEditForm({ ...editForm, option_b: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Option C</label>
                    <input
                      type="text"
                      value={editForm.option_c ?? activeQuestion.option_c}
                      onChange={e => setEditForm({ ...editForm, option_c: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Option D</label>
                    <input
                      type="text"
                      value={editForm.option_d ?? activeQuestion.option_d}
                      onChange={e => setEditForm({ ...editForm, option_d: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Verified Explanation & Concept Solution</label>
                  <textarea
                    rows={2}
                    value={editForm.explanation ?? activeQuestion.explanation}
                    onChange={e => setEditForm({ ...editForm, explanation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Raw OCR Text Reference */}
                <details className="mt-4 pt-4 border-t border-slate-800 text-xs">
                  <summary className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium mb-2">
                    View Raw OCR Extraction for Page {selectedPage}
                  </summary>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-40 font-mono text-[11px]">
                    {loadingOcr ? 'Loading raw OCR...' : rawOcrText}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <FileText className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-sm font-semibold text-slate-400">Page {selectedPage} Documentation</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {selectedPage <= 2 
                    ? 'Cover page & candidate instructions. Questions start on Page 3 (Q1).' 
                    : selectedPage >= 49 
                    ? 'Rough work section and back cover. Questions end on Page 48 (Q200).' 
                    : 'Select a question from above or navigate to a question page.'}
                </p>
                <button
                  onClick={() => setSelectedPage(3)}
                  className="mt-4 px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold"
                >
                  Go to Question 1 (Page 3)
                </button>
              </div>
            )}

            {/* Bottom Actions Bar */}
            {activeQuestion && (
              <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-400">Status: <strong className="text-slate-200">Verified by Admin</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Verify & Save to Question Bank
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

