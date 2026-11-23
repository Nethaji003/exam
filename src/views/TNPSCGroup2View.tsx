import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { QuestionPaper } from '../types/database';
import { 
  Shield, BookOpen, Calendar, Clock, FileText, Download, 
  Eye, Play, Award, CheckCircle2, Filter, Search, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PDFViewerModal } from '../components/common/PDFViewerModal';

interface TNPSCGroup2ViewProps {
  onStartPractice?: (subjectId: string, topicId: string) => void;
  onTakeMockTest?: () => void;
  onStartPaperTest?: (paper: QuestionPaper) => void;
}

export const TNPSCGroup2View: React.FC<TNPSCGroup2ViewProps> = ({ onTakeMockTest, onStartPaperTest }) => {
  const { t, isTamil, isBoth } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [viewingPaper, setViewingPaper] = useState<QuestionPaper | null>(null);

  const allPapers = DBService.getQuestionPapers().filter((p) => p.exam_group === 'Group 2');

  const filteredPapers = allPapers.filter((paper) => {
    if (selectedYear !== 'All' && paper.exam_year.toString() !== selectedYear) return false;
    if (selectedStage !== 'All' && paper.exam_type.toLowerCase() !== selectedStage.toLowerCase()) return false;
    if (selectedLanguage !== 'All' && paper.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    return true;
  });

  const handleDownload = (paper: QuestionPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = paper.pdf_file_path;
    link.download = `TNPSC_Group2_${paper.exam_year}_${paper.exam_type}_${paper.language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1f1a0e 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              TNPSC Group 2 & 2A Examination Suite
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'TNPSC குரூப் 2 & 2A தேர்வு தயாரிப்பு' : isBoth ? 'TNPSC Group 2 & 2A Preparation / குரூப் 2 தயாரிப்பு' : 'TNPSC Group 2 & 2A Preparation'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'அதிகாரப்பூர்வ முந்தைய ஆண்டு வினாத்தாள்கள் (Prelims & Mains), மாதிரி தேர்வுகள் மற்றும் தமிழ்/ஆங்கில வினா வங்கி.'
                : 'Official Previous Year Question Papers (Prelims & Mains), interactive mock tests, verified answer keys, and bilingual question banks.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTakeMockTest}
              className="btn-gold text-xs px-5 py-3 shadow-lg"
            >
              <Play className="w-4 h-4" />
              {isTamil ? 'குரூப் 2 தேர்வு தொடங்கு' : 'Start Group 2 Mock Test'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: isTamil ? 'மொத்த வினாத்தாள்கள்' : 'Total Papers', val: `${allPapers.length} Papers`, icon: FileText },
          { label: isTamil ? 'தேர்வு நிலைகள்' : 'Exam Stages', val: 'Prelims & Mains', icon: Award },
          { label: isTamil ? 'ஆண்டுகள்' : 'Years Available', val: '2022, 2024', icon: Calendar },
          { label: isTamil ? 'மொழிகள்' : 'Languages', val: 'தமிழ் / English', icon: BookOpen },
        ].map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="stat-card">
              <Icon className="w-4 h-4 mb-2" style={{ color: '#D4AF37' }} />
              <div className="text-lg font-bold text-white">{st.val}</div>
              <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>{st.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Filter Controls ────────────────────────────────────────── */}
      <div className="gold-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {t.filter}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year */}
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: '#A7A7A7' }}>{t.examYear}:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-gold py-1 px-2.5 text-xs"
            >
              <option value="All">{t.all}</option>
              <option value="2024">2024</option>
              <option value="2022">2022</option>
            </select>
          </div>

          {/* Stage */}
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: '#A7A7A7' }}>Stage:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="input-gold py-1 px-2.5 text-xs"
            >
              <option value="All">{t.all}</option>
              <option value="Prelims">{t.prelims}</option>
              <option value="Mains">{t.mains}</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: '#A7A7A7' }}>{t.language}:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-gold py-1 px-2.5 text-xs"
            >
              <option value="All">{t.all}</option>
              <option value="Tamil">{t.tamil}</option>
              <option value="English">{t.english}</option>
              <option value="Bilingual">{t.bilingual}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Papers Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="gold-card p-6 flex flex-col justify-between cursor-pointer group"
            onClick={() => setViewingPaper(paper)}
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}
                  >
                    <FileText className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: '#A7A7A7' }}>
                      <span>{paper.exam_group}</span>
                      <span>•</span>
                      <span>{paper.exam_year}</span>
                      <span>•</span>
                      <span className="text-yellow-400/90 font-medium">{paper.exam_type}</span>
                    </div>
                  </div>
                </div>

                <span className="gold-badge shrink-0">
                  {paper.language}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl mb-4 text-center text-xs" style={{ background: '#121214', border: '1px solid #393326' }}>
                <div>
                  <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.questions}</span>
                  <span className="font-bold text-white">{paper.total_questions} Qs</span>
                </div>
                <div>
                  <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.marks}</span>
                  <span className="font-bold" style={{ color: '#D4AF37' }}>{paper.total_marks} Marks</span>
                </div>
                <div>
                  <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.duration}</span>
                  <span className="font-bold text-white">{paper.duration_minutes} Mins</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#393326]/60">
              <span className="text-xs flex items-center gap-1.5" style={{ color: '#27AE60' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {paper.publication_status}
              </span>

              <div className="flex items-center gap-2">
                {onStartPaperTest && (
                  <button
                    onClick={() => onStartPaperTest(paper)}
                    className="btn-gold text-xs px-3 py-1.5 font-bold"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isTamil ? 'தேர்வு தொடங்கு' : 'Start Test'}
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setViewingPaper(paper); }}
                  className="btn-gold-outline text-xs px-3 py-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.viewPDF}
                </button>
                <button
                  onClick={(e) => handleDownload(paper, e)}
                  className="btn-dark text-xs px-3 py-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.downloadPDF}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="gold-card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: '#D4AF37' }} />
          <h3 className="text-lg font-bold text-white mb-1">{t.noData}</h3>
          <p className="text-xs" style={{ color: '#A7A7A7' }}>Try adjusting your filter settings above.</p>
        </div>
      )}

      {/* ── Embedded PDF Viewer Modal ──────────────────────────────── */}
      {viewingPaper && (
        <PDFViewerModal
          paper={viewingPaper}
          onClose={() => setViewingPaper(null)}
        />
      )}
    </div>
  );
};
