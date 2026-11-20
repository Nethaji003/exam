import React, { useState } from 'react';
import { 
  X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, 
  Maximize2, Minimize2, FileText, ExternalLink, RotateCcw
} from 'lucide-react';
import { QuestionPaper } from '../../types/database';

interface PDFViewerModalProps {
  paper: QuestionPaper | null;
  onClose: () => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ paper, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!paper) return null;

  const totalPages = paper.total_questions ? Math.ceil(paper.total_questions / 4) : 40;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 20));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(50, z - 20));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = paper.pdf_file_path;
    link.download = `${paper.exam_group.replace(/\s+/g, '_')}_${paper.exam_year}_${paper.language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  {paper.exam_group}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {paper.exam_year}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {paper.language}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {paper.title}
              </h2>
            </div>
          </div>

          {/* Navigation & Zoom Utilities */}
          <div className="flex items-center gap-3">
            {/* Page navigation */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-300 px-1 font-mono">
                Page <strong className="text-amber-400">{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
              title="Download Original PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition hidden md:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Render Body */}
        <div className="flex-1 bg-slate-950 overflow-auto p-4 flex justify-center items-start relative">
          <div 
            style={{ 
              width: `${zoomLevel}%`, 
              maxWidth: zoomLevel <= 100 ? '900px' : 'none',
              minHeight: '100%' 
            }}
            className="w-full h-full bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col"
          >
            {/* Embedded Native PDF Viewer */}
            <iframe
              src={`${paper.pdf_file_path}#page=${currentPage}&zoom=${zoomLevel}`}
              title={paper.title}
              className="w-full h-full min-h-[75vh] border-0 rounded-xl bg-slate-950"
            />
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Duration: <strong className="text-white">{paper.duration_minutes} Mins</strong></span>
            <span>•</span>
            <span>Questions: <strong className="text-white">{paper.total_questions}</strong></span>
            <span>•</span>
            <span>Marks: <strong className="text-emerald-400">{paper.total_marks}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={paper.pdf_file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 flex items-center gap-1 text-[11px] font-medium transition"
            >
              <ExternalLink className="w-3 h-3" /> Open in New Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

