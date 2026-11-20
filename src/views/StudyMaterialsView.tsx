import React, { useState } from 'react';
import { 
  BookOpen, Download, Eye, FileText, CheckCircle2, 
  Search, Filter, Sparkles, Award, Star, BookMarked 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const StudyMaterialsView: React.FC = () => {
  const { t, isTamil, isBoth, language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const studyGuides = [
    {
      id: 'mat-1',
      title: 'Indian Polity & Constitution Handbook',
      titleTa: 'இந்திய அரசியல் அமைப்பு மற்றும் நிர்வாகம்',
      subject: 'General Studies',
      group: 'Group 2 & 4',
      pages: 142,
      format: 'PDF',
      description: 'Comprehensive notes covering Preamble, Fundamental Rights, Directive Principles, Union & State Executives, and Judiciary with recent amendments.',
      descriptionTa: 'முகப்புரை, அடிப்படை உரிமைகள், மத்திய & மாநில அரசு, நீதிமன்றங்கள் குறித்த முழுமையான குறிப்புகள்.',
      tags: ['Polity', 'Samacheer Kalvi', 'Official Syllabus'],
    },
    {
      id: 'mat-2',
      title: 'Tamil Nadu History, Culture & Heritage (Unit 8 & 9)',
      titleTa: 'தமிழ்நாடு வரலாறு, பண்பாடு மற்றும் மரபு (அலகு 8 & 9)',
      subject: 'Tamil Nadu Heritage',
      group: 'Group 2 & 4',
      pages: 186,
      format: 'PDF',
      description: 'In-depth coverage of Thirukkural, Sangam Age to contemporary Tamil literature, Dravidian movement, and socio-religious reform movements in TN.',
      descriptionTa: 'திருக்குறள், சங்க காலம், திராவிட இயக்கம் மற்றும் தமிழ்நாட்டின் சீர்திருத்த இயக்கங்கள் பற்றிய முழுமையான தொகுப்பு.',
      tags: ['Unit 8', 'Unit 9', 'Thirukkural'],
    },
    {
      id: 'mat-3',
      title: 'General Mental Ability & Quantitative Formulas',
      titleTa: 'கணிதம் மற்றும் பொது நுண்ணறிவு சூத்திரங்கள்',
      subject: 'Aptitude & Mental Ability',
      group: 'Group 2 & 4',
      pages: 94,
      format: 'PDF',
      description: 'All formulas, shortcut tricks, and solved model questions for HCF, LCM, Ratio, Percentage, Simple & Compound Interest, and Time & Work.',
      descriptionTa: 'மீ.பொ.வ, மீ.சி.ம, விகிதம், சதவீதம், தனிவட்டி, கூட்டுவட்டி மற்றும் வேலை-காலம் ஆகியவற்றிற்கான குறுக்குவழிகள்.',
      tags: ['Maths', 'Aptitude Tricks', 'Formulas'],
    },
    {
      id: 'mat-4',
      title: 'General Science — Physics, Chemistry & Biology Summary',
      titleTa: 'பொது அறிவியல் — இயற்பியல், வேதியியல், உயிரியல் குறிப்புகள்',
      subject: 'General Science',
      group: 'Group 4',
      pages: 120,
      format: 'PDF',
      description: 'Concise summary from Standard 6 to 10 Samacheer Kalvi science textbooks with high-yield exam points and diagrams.',
      descriptionTa: '6 முதல் 10-ஆம் வகுப்பு வரையிலான சமச்சீர் கல்வி அறிவியல் புத்தகங்களின் முக்கியமான தேர்வு புள்ளிகள்.',
      tags: ['Science', 'Samacheer 6-10', 'High Yield'],
    },
    {
      id: 'mat-5',
      title: 'General Tamil (பொதுத்தமிழ்) இலக்கணம் & இலக்கியம்',
      titleTa: 'பொதுத்தமிழ் இலக்கணம் மற்றும் இலக்கிய பகுதி முழு தொகுப்பு',
      subject: 'General Tamil',
      group: 'Group 4',
      pages: 210,
      format: 'PDF',
      description: 'Part A (இலக்கணம்), Part B (இலக்கியம்), and Part C (தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும்) structured per the latest 2024 syllabus.',
      descriptionTa: 'பகுதி அ (இலக்கணம்), பகுதி ஆ (இலக்கியம்), பகுதி இ (தமிழ் அறிஞர்களும் தொண்டும்) முழுமையான பாடக்குறிப்பு.',
      tags: ['General Tamil', 'Part A, B, C', '2024 Pattern'],
    },
  ];

  const subjects = ['All', 'General Studies', 'Tamil Nadu Heritage', 'Aptitude & Mental Ability', 'General Science', 'General Tamil'];

  const filtered = studyGuides.filter((mat) => {
    if (selectedSubject !== 'All' && mat.subject !== selectedSubject) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchEn = mat.title.toLowerCase().includes(term) || mat.description.toLowerCase().includes(term);
      const matchTa = mat.titleTa.includes(term) || mat.descriptionTa.includes(term);
      if (!matchEn && !matchTa) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #18150c 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <BookOpen className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              TNPSC Samacheer Kalvi & Standard Study Materials
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'TNPSC பாடக்குறிப்புகள் & குறிப்புகள்' : isBoth ? 'TNPSC Study Materials / பாடக்குறிப்புகள்' : 'TNPSC Study Materials'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'சமச்சீர் கல்வி மற்றும் அதிகாரப்பூர்வ TNPSC பாடத்திட்ட அடிப்படையிலான முழுமையான தரவு தொகுப்புகள்.'
                : 'Curated revision notes, formula cheat-sheets, and comprehensive guides aligned strictly with the official TNPSC syllabus.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="gold-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTamil ? 'பாடக்குறிப்புகளைத் தேடுங்கள்...' : 'Search study materials or topics...'}
            className="input-gold pl-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: '#A7A7A7' }}>{t.selectSubject}:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-gold py-1 px-2.5 text-xs"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Materials Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((mat) => (
          <div key={mat.id} className="gold-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}
                  >
                    <FileText className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition">
                      {isTamil ? mat.titleTa : mat.title}
                    </h3>
                    {isBoth && (
                      <span className="text-xs text-yellow-200/70 block mt-0.5 tamil-text">
                        {mat.titleTa}
                      </span>
                    )}
                    <span className="text-xs text-yellow-400/80 font-medium block mt-1">
                      {mat.subject} • {mat.group}
                    </span>
                  </div>
                </div>

                <span className="gold-badge shrink-0">
                  {mat.pages} Pages
                </span>
              </div>

              <p className="text-xs leading-relaxed mb-4 text-slate-300">
                {isTamil ? mat.descriptionTa : mat.description}
                {isBoth && (
                  <span className="block mt-1 text-[11px] text-slate-400 tamil-text">
                    {mat.descriptionTa}
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {mat.tags.map((tg) => (
                  <span
                    key={tg}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: '#121214', border: '1px solid #393326', color: '#A7A7A7' }}
                  >
                    #{tg}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#393326]/60">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified TNPSC Content
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Opening ${mat.title}...`)}
                  className="btn-gold-outline text-xs px-3 py-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isTamil ? 'பார்வை' : 'Read Now'}
                </button>
                <button
                  onClick={() => alert(`Downloading ${mat.title}...`)}
                  className="btn-gold text-xs px-3 py-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isTamil ? 'பதிவிறக்கம்' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
