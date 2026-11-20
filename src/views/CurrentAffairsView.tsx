import React, { useState } from 'react';
import { 
  Newspaper, Calendar, Tag, Search, ArrowRight, 
  ExternalLink, Sparkles, CheckCircle2, Bookmark, Flame 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CurrentAffairsView: React.FC = () => {
  const { t, isTamil, isBoth } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentAffairsList = [
    {
      id: 'ca-1',
      title: 'Kalaignar Magalir Urimai Thogai Scheme — Milestone Expansion',
      titleTa: 'கலைஞர் மகளிர் உரிமைத் திட்டம் — புதிய விரிவாக்கம் மற்றும் சாதனைகள்',
      category: 'Tamil Nadu Schemes',
      date: 'November 2024',
      summary: 'The Government of Tamil Nadu provided financial assistance of ₹1,000 per month to over 1.15 crore eligible women heads of households, marking a milestone in direct benefit transfer welfare.',
      summaryTa: '1.15 கோடிக்கும் அதிகமான குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 வழங்கும் திட்டம் சாதனை படைத்துள்ளது.',
      examRelevance: 'Crucial for TNPSC Group 2 & Group 4 General Studies (Tamil Nadu Socio-Economic Welfare Schemes).',
      examRelevanceTa: 'TNPSC குரூப் 2 & 4 பொது அறிவு பகுதியில் தமிழ்நாடு அரசு திட்டங்கள் தொடர்பான வினாக்களுக்கு முக்கியமானது.',
    },
    {
      id: 'ca-2',
      title: 'Tamil Nadu Global Investors Meet (TNGIM) — Major MoUs Signed',
      titleTa: 'தமிழ்நாடு உலக முதலீட்டாளர்கள் மாநாடு — முக்கிய புரிந்துணர்வு ஒப்பந்தங்கள்',
      category: 'Economy & Industry',
      date: 'October 2024',
      summary: 'MoUs worth over ₹6.64 lakh crore committed across manufacturing, renewable energy, electric vehicles, and semiconductors creating 26 lakh direct and indirect jobs.',
      summaryTa: 'உற்பத்தி, புதுப்பிக்கத்தக்க எரிசக்தி மற்றும் மின்னணு துறைகளில் ₹6.64 லட்சம் கோடி மதிப்பிலான முதலீடுகள்.',
      examRelevance: 'Expected in General Studies: Economic Development & Industrial Growth in Tamil Nadu.',
      examRelevanceTa: 'தமிழ்நாட்டின் தொழில்துறை வளர்ச்சி மற்றும் பொருளாதார குறியீடுகள் தொடர்பான வினாக்களுக்கு உரியது.',
    },
    {
      id: 'ca-3',
      title: 'UNESCO Recognition for Chettinad Heritage & Archaeological Findings',
      titleTa: 'செட்டிநாடு பாரம்பரியம் மற்றும் கீழடி அகழ்வாராய்ச்சி புதிய கண்டுபிடிப்புகள்',
      category: 'Art & Culture',
      date: 'September 2024',
      summary: 'Keezhadi and Porunai valley archaeological excavations carbon-dated artifacts proving an advanced urban civilization in Tamil Nadu dating back over 2,600 years (6th century BCE).',
      summaryTa: 'கீழடி மற்றும் பொருநை ஆற்றுப்படுகை அகழ்வாராய்ச்சிகள் கி.மு. 6-ஆம் நூற்றாண்டைச் சேர்ந்த சங்ககால நாகரிகத்தை உறுதி செய்கின்றன.',
      examRelevance: 'Directly tested under Unit 8: History, Culture, and Heritage of Tamil Nadu.',
      examRelevanceTa: 'அலகு 8: தமிழ்நாட்டின் வரலாறு, மரபு மற்றும் பண்பாடு பிரிவில் கட்டாயம் கேட்கப்படும் பகுதி.',
    },
    {
      id: 'ca-4',
      title: '71st National Film Awards — Tamil Cinema Accolades',
      titleTa: '71-வது தேசிய திரைப்பட விருதுகள் — தமிழ் திரைப்படங்களின் சிறப்புகள்',
      category: 'Awards & Honors',
      date: 'August 2024',
      summary: 'Tamil feature films and technicians bagged multiple prestigious honors celebrating cultural storytelling and technical excellence.',
      summaryTa: 'தமிழ் திரைத்துறை கலைஞர்களுக்கு உயரிய தேசிய விருதுகள் அறிவிக்கப்பட்டன.',
      examRelevance: 'Frequently featured in National & Regional Awards and Honors section.',
      examRelevanceTa: 'தேசிய மற்றும் மாநில விருதுகள் பகுதியில் இடம்பெறும்.',
    },
  ];

  const categories = ['All', 'Tamil Nadu Schemes', 'Economy & Industry', 'Art & Culture', 'Awards & Honors'];

  const filtered = currentAffairsList.filter((ca) => {
    if (selectedCategory !== 'All' && ca.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchEn = ca.title.toLowerCase().includes(term) || ca.summary.toLowerCase().includes(term);
      const matchTa = ca.titleTa.includes(term) || ca.summaryTa.includes(term);
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
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1a160b 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <Newspaper className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              TNPSC Current Affairs & National Events
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'தமிழ்நாடு & தேசிய நடப்பு நிகழ்வுகள்' : isBoth ? 'TNPSC Current Affairs / நடப்பு நிகழ்வுகள்' : 'TNPSC Current Affairs'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'TNPSC குரூப் 2 & 4 தேர்வுகளுக்கான தமிழ்நாடு அரசு திட்டங்கள், பொருளாதாரம் மற்றும் பண்பாட்டு நிகழ்வுகள்.'
                : 'Targeted monthly current affairs focusing on Tamil Nadu government policies, economic milestones, art & culture, and key appointments.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ────────────────────────────────────────── */}
      <div className="gold-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTamil ? 'நடப்பு நிகழ்வுகளைத் தேடுங்கள்...' : 'Search current affairs or topics...'}
            className="input-gold pl-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: '#A7A7A7' }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-gold py-1 px-2.5 text-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── News Articles ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="gold-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="gold-badge">
                {item.category}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: '#A7A7A7' }}>
                <Calendar className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                {item.date}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTamil ? item.titleTa : item.title}
            </h3>
            {isBoth && (
              <p className="text-xs text-yellow-200/80 tamil-text font-medium">
                {item.titleTa}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTamil ? item.summaryTa : item.summary}
            </p>
            {isBoth && (
              <p className="text-xs text-slate-400 tamil-text leading-relaxed">
                {item.summaryTa}
              </p>
            )}

            {/* Exam relevance alert box */}
            <div className="p-3 rounded-xl text-xs space-y-1" style={{ background: '#121214', border: '1px solid #393326' }}>
              <span className="font-bold text-yellow-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Exam High-Yield Point:
              </span>
              <p className="text-slate-300">{isTamil ? item.examRelevanceTa : item.examRelevance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
