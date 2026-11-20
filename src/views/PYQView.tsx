import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { PreviousYearPaper, PreviousYearQuestion, QuestionPaper } from '../types/database';
import { 
  FileText, Search, Filter, Calendar, Clock, ShieldCheck, Play, 
  BookOpen, Eye, Download, Award, ChevronRight, Layers, Sparkles 
} from 'lucide-react';
import { PDFViewerModal } from '../components/common/PDFViewerModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PYQViewProps {
  onStartPYQPaper: (paper: PreviousYearPaper, questions: PreviousYearQuestion[]) => void;
  onStartTNPSCTest?: (config: any) => void;
}

export const PYQView: React.FC<PYQViewProps> = ({ onStartPYQPaper, onStartTNPSCTest }) => {
  const { t, isTamil, isBoth } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'tnpsc-g4' | 'tnpsc-g2' | 'other'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected paper for viewing in embedded PDF viewer modal
  const [viewingPaper, setViewingPaper] = useState<QuestionPaper | null>(null);

  // Retrieve official question papers from storage/seed
  const questionPapers = DBService.getQuestionPapers();
  const legacyPapers = DBService.getPYQPapers();

  // Category filtering
  let displayPapers = questionPapers;
  if (activeCategory === 'tnpsc-g4') {
    displayPapers = displayPapers.filter((p) => p.exam_group === 'Group 4');
  } else if (activeCategory === 'tnpsc-g2') {
    displayPapers = displayPapers.filter((p) => p.exam_group === 'Group 2');
  }

  // Filter criteria
  const filteredPapers = displayPapers.filter((paper) => {
    if (selectedGroup !== 'All' && paper.exam_group !== selectedGroup) return false;
    if (selectedYear !== 'All' && paper.exam_year.toString() !== selectedYear) return false;
    if (selectedLanguage !== 'All' && paper.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    if (selectedStage !== 'All' && paper.exam_type.toLowerCase() !== selectedStage.toLowerCase()) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        paper.title.toLowerCase().includes(term) ||
        paper.exam_group.toLowerCase().includes(term) ||
        paper.exam_year.toString().includes(term) ||
        paper.language.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleDownload = (paper: QuestionPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = paper.pdf_file_path;
    link.download = `${paper.exam_group.replace(/\s+/g, '_')}_${paper.exam_year}_${paper.language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartPaperTest = (paper: QuestionPaper) => {
    if (onStartTNPSCTest) {
      onStartTNPSCTest({
        mode: 'full',
        questionCount: paper.total_questions || 200,
        durationMinutes: paper.duration_minutes || 180,
        examGroup: paper.exam_group,
        examYear: paper.exam_year,
      });
    } else {
      const convertedPaper: PreviousYearPaper = {
        id: paper.id,
        exam_id: paper.exam_group === 'Group 4' ? 'exam-tnpsc-group4' : 'exam-tnpsc-group2',
        exam_name: `TNPSC ${paper.exam_group}`,
        year: paper.exam_year,
        stage: paper.exam_type,
        shift: 'Main',
        exam_date: `${paper.exam_year}-06-15`,
        duration: paper.duration_minutes,
        total_questions: paper.total_questions,
        expected_questions: paper.total_questions,
        total_marks: paper.total_marks,
        negative_marking: 0,
        source: 'Official TNPSC Archive',
        publication_status: 'Ready'
      };
      const questions = DBService.getPYQQuestions(paper.id);
      onStartPYQPaper(convertedPaper, questions);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1c170c 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <BookOpen className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              Official Previous Year Question Paper Archives
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'TNPSC முந்தைய ஆண்டு வினாத்தாள்கள்' : isBoth ? 'Previous Year Questions / முந்தைய வினாத்தாள்கள்' : 'Previous Year Question Papers'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'TNPSC குரூப் 4 (2011, 2012, 2018, 2019, 2022, 2024) மற்றும் குரூப் 2 (2022, 2024) அதிகாரப்பூர்வ வினாத்தாள்கள்.'
                : 'Browse, read, and download official previous year question papers for TNPSC Group 4 (2011-2024) and Group 2 (2022-2024). Read in embedded PDF viewer or launch full tests.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Category Tabs ─────────────────────────────────────── */}
      <div className="flex border-b border-[#393326] pb-1 gap-2 overflow-x-auto">
        {[
          { id: 'all', label: `All Papers (${questionPapers.length})`, icon: Layers },
          { id: 'tnpsc-g4', label: 'TNPSC Group 4 (2011 – 2024)', icon: FileText },
          { id: 'tnpsc-g2', label: 'TNPSC Group 2 (Prelims & Mains)', icon: FileText },
          { id: 'other', label: 'Central Exams (SBI PO, RRB, SSC)', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                if (tab.id === 'tnpsc-g4') setSelectedGroup('Group 4');
                else if (tab.id === 'tnpsc-g2') setSelectedGroup('Group 2');
                else setSelectedGroup('All');
              }}
              className="px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap"
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #D4AF37, #E6C66D)', color: '#0B0B0D', boxShadow: '0 0 16px -4px rgba(212,175,55,0.4)' }
                  : { background: '#19191C', color: '#A7A7A7', border: '1px solid #393326' }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────── */}
      <div className="gold-card p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
            <Filter className="w-4 h-4" /> {t.filter}
          </div>
          <span className="text-xs" style={{ color: '#A7A7A7' }}>
            Showing <strong className="text-white">{filteredPapers.length}</strong> matching papers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isTamil ? 'வினாத்தாளைத் தேடுங்கள்...' : 'Search title, year, group...'}
              className="input-gold w-full text-xs"
            />
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="input-gold text-xs"
          >
            <option value="All">All Groups (Group 2 & 4)</option>
            <option value="Group 4">TNPSC Group 4</option>
            <option value="Group 2">TNPSC Group 2</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-gold text-xs"
          >
            <option value="All">All Years</option>
            <option value="2024">2024 Papers</option>
            <option value="2022">2022 Papers</option>
            <option value="2019">2019 Papers</option>
            <option value="2018">2018 Papers</option>
            <option value="2012">2012 Papers</option>
            <option value="2011">2011 Papers</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="input-gold text-xs"
          >
            <option value="All">{t.all} Languages</option>
            <option value="Bilingual">Bilingual (Tamil & English)</option>
            <option value="Tamil">General Tamil</option>
            <option value="English">General English</option>
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="input-gold text-xs"
          >
            <option value="All">All Exam Types</option>
            <option value="Objective">Objective (Full Paper)</option>
            <option value="Prelims">Prelims</option>
            <option value="Mains">Mains</option>
          </select>
        </div>
      </div>

      {/* ── Papers Grid ────────────────────────────────────────────── */}
      {activeCategory === 'other' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legacyPapers.map((paper) => (
            <div key={paper.id} className="gold-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="gold-badge">
                    {paper.exam_name} {paper.year}
                  </span>
                  <span className="text-xs" style={{ color: '#A7A7A7' }}>{paper.stage} • {paper.shift}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{paper.exam_name} Official Paper</h3>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center my-3 p-2 rounded-xl" style={{ background: '#121214', border: '1px solid #393326' }}>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>Questions</span>
                    <strong className="text-white">{paper.total_questions}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>Duration</span>
                    <strong className="text-white">{paper.duration} m</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>Marks</span>
                    <strong style={{ color: '#D4AF37' }}>{paper.total_marks}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onStartPYQPaper(paper, DBService.getPYQQuestions(paper.id))}
                className="btn-gold w-full text-xs justify-center py-2.5"
              >
                <Play className="w-3.5 h-3.5" /> Start Practice Paper
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="gold-card p-6 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="gold-badge">
                      TNPSC {paper.exam_group}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: '#121214', border: '1px solid #393326' }}>
                      {paper.exam_year}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {paper.language}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition leading-snug mb-2">
                  {paper.title}
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center my-4 p-2.5 rounded-xl text-xs" style={{ background: '#121214', border: '1px solid #393326' }}>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.questions}</span>
                    <strong className="text-white">{paper.total_questions} Qs</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.duration}</span>
                    <strong className="text-white">{paper.duration_minutes} Mins</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block" style={{ color: '#A7A7A7' }}>{t.marks}</span>
                    <strong style={{ color: '#D4AF37' }}>{paper.total_marks}</strong>
                  </div>
                </div>

                <div className="text-xs flex items-center justify-between pt-1" style={{ color: '#A7A7A7' }}>
                  <span>Type: <strong className="text-white">{paper.exam_type}</strong></span>
                  <span className="text-[11px] flex items-center gap-1 font-semibold" style={{ color: '#27AE60' }}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified PDF
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#393326]/60">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewingPaper(paper)}
                    className="btn-gold-outline text-xs px-2.5 py-2 justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" /> {t.viewPDF}
                  </button>

                  <button
                    onClick={(e) => handleDownload(paper, e)}
                    className="btn-dark text-xs px-2.5 py-2 justify-center"
                  >
                    <Download className="w-3.5 h-3.5" /> {t.downloadPDF}
                  </button>
                </div>

                <button
                  onClick={() => handleStartPaperTest(paper)}
                  className="btn-gold w-full text-xs justify-center py-2.5 font-bold"
                >
                  <Play className="w-3.5 h-3.5" /> {isTamil ? 'மாதிரி தேர்வு தொடங்கு' : 'Start Mock Test'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded PDF Viewer Modal */}
      {viewingPaper && (
        <PDFViewerModal
          paper={viewingPaper}
          onClose={() => setViewingPaper(null)}
        />
      )}
    </div>
  );
};
