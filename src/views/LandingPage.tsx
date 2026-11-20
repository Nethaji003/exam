import React from 'react';
import {
  Target, FileText, Clock, Award, TrendingUp, ArrowRight,
  Zap, Layers, Brain, BookOpen, Shield, Star,
  Users, CheckCircle, Trophy, Sparkles,
} from 'lucide-react';
import { DBService } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenPYQ: () => void;
  onTakeMockTest: () => void;
}

const STATS = [
  { label: 'Questions', labelTa: 'வினாக்கள்', value: '10,000+', icon: BookOpen },
  { label: 'Mock Tests', labelTa: 'மாதிரி தேர்வு', value: '500+', icon: Clock },
  { label: 'Students', labelTa: 'மாணவர்கள்', value: '25,000+', icon: Users },
  { label: 'Success Rate', labelTa: 'வெற்றி விகிதம்', value: '87%', icon: Trophy },
];

const FEATURES = [
  {
    icon: Layers,
    color: '#D4AF37',
    title: 'Five Difficulty Levels',
    titleTa: 'ஐந்து நிலை கேள்விகள்',
    desc: 'Progress from Beginner to Expert with structured level-up rules and adaptive difficulty.',
    descTa: 'ஆரம்பர் முதல் வல்லுனர் வரை படிப்படியாக முன்னேறுங்கள்.',
  },
  {
    icon: Sparkles,
    color: '#E6C66D',
    title: 'AI Practice Tests',
    titleTa: 'AI பயிற்சி தேர்வுகள்',
    desc: 'OpenAI-powered question generation matching TNPSC pattern with Tamil and English support.',
    descTa: 'TNPSC முறையில் AI உருவாக்கும் புதிய கேள்விகள்.',
  },
  {
    icon: FileText,
    color: '#D4AF37',
    title: 'Previous Year Papers',
    titleTa: 'முந்தைய வினாத்தாள்கள்',
    desc: 'Authentic TNPSC Group 2 & 4 papers (2011–2024) with bilingual questions and solutions.',
    descTa: 'TNPSC குரூப் 2 & 4 வினாத்தாள்கள் 2011 முதல் 2024 வரை.',
  },
  {
    icon: Brain,
    color: '#E6C66D',
    title: 'Adaptive Learning',
    titleTa: 'தனிப்பயன் படிப்பு',
    desc: 'Personalized weak-topic analysis and AI tutor sessions to target your gaps.',
    descTa: 'உங்கள் பலவீன தலைப்புகளை AI கண்டறிந்து வழிகாட்டும்.',
  },
  {
    icon: TrendingUp,
    color: '#D4AF37',
    title: 'Deep Analytics',
    titleTa: 'ஆழமான பகுப்பாய்வு',
    desc: 'Visual performance charts, accuracy radar, speed metrics and improvement trends.',
    descTa: 'காட்சி செயல்திறன் வரைபடங்கள் மற்றும் முன்னேற்ற புள்ளிவிவரங்கள்.',
  },
  {
    icon: Zap,
    color: '#E6C66D',
    title: 'Daily Challenges',
    titleTa: 'தினசரி சவால்கள்',
    desc: 'Keep preparation sharp with daily mixed question sprints across all TNPSC subjects.',
    descTa: 'தினமும் அனைத்து பாடங்களிலும் வினா சவால் எழுதுங்கள்.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPractice,
  onOpenPYQ,
  onTakeMockTest,
}) => {
  const { t, isTamil, isBoth } = useLanguage();

  return (
    <div
      className="min-h-screen flex flex-col animate-fade-in"
      style={{ background: '#0B0B0D', color: '#F5F5F5' }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:py-28">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,175,55,0.1) 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: '#E6C66D',
            }}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            {isTamil || isBoth
              ? 'TNPSC குரூப் 2 & 4 தேர்வு தயாரிப்பு மேடை'
              : 'Premium TNPSC Group 2 & 4 Exam Preparation Platform'}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {isTamil ? (
              <>
                <span style={{ color: '#F5F5F5' }}>உங்கள் வெற்றி, </span>
                <span className="text-gold-gradient">எங்கள் குறிக்கோள்</span>
              </>
            ) : isBoth ? (
              <>
                <span style={{ color: '#F5F5F5' }}>Your Success, </span>
                <span className="text-gold-gradient">Our Mission</span>
                <br />
                <span className="text-2xl sm:text-3xl" style={{ color: '#A7A7A7' }}>
                  உங்கள் வெற்றி, எங்கள் குறிக்கோள்
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#F5F5F5' }}>Your Success, </span>
                <span className="text-gold-gradient">Our Mission</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed"
            style={{ color: '#A7A7A7' }}
          >
            {isTamil
              ? 'TNPSC குரூப் 2 மற்றும் குரூப் 4 தேர்வுகளுக்கான AI-சக்தி வாய்ந்த தயாரிப்பு மேடை. தமிழ் மற்றும் ஆங்கிலத்தில் பயிற்சி பெறுங்கள்.'
              : isBoth
              ? 'AI-powered preparation for TNPSC Group 2 & 4 — Tamil & English bilingual support, previous year papers, mock tests and adaptive analytics.\nTNPSC குரூப் 2 & 4 — தமிழ் & ஆங்கிலத்தில் AI தயாரிப்பு.'
              : 'AI-powered preparation for TNPSC Group 2 and Group 4 examinations. Practice with previous year papers, generate mock tests and track your performance.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <button onClick={onStartPractice} className="btn-gold text-sm px-7 py-3.5">
              <Target className="w-4 h-4" />
              {t.startPractice}
            </button>
            <button onClick={onOpenPYQ} className="btn-gold-outline text-sm px-7 py-3.5">
              <FileText className="w-4 h-4" />
              {t.explorePapers}
            </button>
            <button onClick={onTakeMockTest} className="btn-dark text-sm px-7 py-3.5">
              <Clock className="w-4 h-4" />
              {t.takeMockTest}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                  <div className="text-2xl font-extrabold" style={{ color: '#D4AF37' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#A7A7A7' }}>
                    {isTamil ? stat.labelTa : stat.label}
                    {isBoth && <><br /><span className="tamil-text">{stat.labelTa}</span></>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Exam Categories ───────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#121214', borderTop: '1px solid #2a2515', borderBottom: '1px solid #2a2515' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: '#F5F5F5' }}>
              {isTamil ? 'தேர்வு பிரிவுகள்' : isBoth ? 'Exam Categories / தேர்வு பிரிவுகள்' : 'Exam Categories'}
            </h2>
            <div className="gold-divider max-w-xs mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Group 4 Card */}
            <div
              className="gold-card p-6 cursor-pointer"
              onClick={onStartPractice}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold" style={{ color: '#F5F5F5' }}>TNPSC Group 4</h3>
                    <span className="gold-badge">Popular</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#A7A7A7' }}>
                    {isTamil
                      ? 'குரூப் 4 தேர்வுக்கான முழுமையான தயாரிப்பு — GK, தமிழ், ஆங்கிலம், கணிதம்'
                      : 'Complete preparation for Group 4 — GK, Tamil, English & Mental Ability'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GK', isTamil ? 'தமிழ்' : 'Tamil', isTamil ? 'ஆங்கிலம்' : 'English', isTamil ? 'கணிதம்' : 'Maths'].map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        style={{ background: '#19191C', border: '1px solid #393326', color: '#A7A7A7' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: '#D4AF37' }}>
                {isTamil ? 'தயாரிப்பு தொடங்கு' : 'Start Preparation'} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Group 2 Card */}
            <div className="gold-card p-6 cursor-pointer" onClick={onOpenPYQ}>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <Shield className="w-6 h-6" style={{ color: '#E6C66D' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold" style={{ color: '#F5F5F5' }}>TNPSC Group 2</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.25)', color: '#27AE60' }}>
                      {isTamil ? 'புதிய வினாக்கள்' : 'New Papers'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#A7A7A7' }}>
                    {isTamil
                      ? 'குரூப் 2 தொடக்க & முக்கிய தேர்வுகளுக்கான ஆண்டு வாரியான வினாத்தாள்கள்'
                      : 'Year-wise papers for Group 2 Prelims & Mains with Tamil/English support'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['2022', '2024', isTamil ? 'தொடக்க' : 'Prelims', isTamil ? 'முக்கிய' : 'Mains'].map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        style={{ background: '#19191C', border: '1px solid #393326', color: '#A7A7A7' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: '#D4AF37' }}>
                {isTamil ? 'வினாத்தாள் பார்க்க' : 'View Papers'} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#0B0B0D' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="gold-badge mb-4 inline-flex">
              <Sparkles className="w-3 h-3" />
              {isTamil ? 'தனிச்சிறப்பு அம்சங்கள்' : 'Platform Features'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-3">
              {isTamil
                ? 'வெற்றிக்கு தேவையான அனைத்தும்'
                : isBoth
                ? <>Everything You Need to <span className="text-gold-gradient">Rank #1</span><br /><span className="text-xl" style={{ color: '#A7A7A7' }}>வெற்றிக்கு தேவையான அனைத்தும்</span></>
                : <>Everything You Need to <span className="text-gold-gradient">Rank #1</span></>
              }
            </h2>
            <div className="gold-divider max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="gold-card p-6 group">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition group-hover:scale-110"
                    style={{
                      background: `rgba(212,175,55,0.1)`,
                      border: `1px solid rgba(212,175,55,0.2)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: '#F5F5F5' }}>
                    {isTamil ? f.titleTa : f.title}
                    {isBoth && <span className="block text-xs mt-0.5 tamil-text" style={{ color: '#A7A7A7' }}>{f.titleTa}</span>}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#A7A7A7' }}>
                    {isTamil ? f.descTa : f.desc}
                    {isBoth && <span className="block text-xs mt-1 tamil-text">{f.descTa}</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────────── */}
      <footer
        className="py-20"
        style={{
          background: 'linear-gradient(180deg, #121214 0%, #0B0B0D 100%)',
          borderTop: '1px solid #2a2515',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E6C66D)', boxShadow: '0 0 30px -6px rgba(212,175,55,0.5)' }}
          >
            <Award className="w-7 h-7 text-black" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {isTamil
              ? 'இன்றே தயாரிப்பு தொடங்குங்கள்!'
              : isBoth
              ? <>Ready to Crack Your Exam?<br /><span className="text-xl tamil-text" style={{ color: '#A7A7A7' }}>இன்றே தயாரிப்பு தொடங்குங்கள்!</span></>
              : 'Ready to Crack Your Exam?'
            }
          </h3>
          <p className="mb-8 text-sm" style={{ color: '#A7A7A7' }}>
            {isTamil
              ? '25,000+ மாணவர்களுடன் இணைந்து TNPSC குரூப் 2 & 4 வெற்றி பெறுங்கள்.'
              : 'Join 25,000+ aspirants preparing smarter with AI-driven adaptive questions and authentic PYQ papers.'}
          </p>
          <button onClick={onStartPractice} className="btn-gold text-sm px-8 py-3.5">
            <CheckCircle className="w-4 h-4" />
            {isTamil ? 'இப்போதே தொடங்கு' : 'Start Preparing Now'}
          </button>
        </div>
      </footer>
    </div>
  );
};
