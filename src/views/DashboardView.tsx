import React, { useState } from 'react';
import {
  CheckCircle2, Clock, Flame, Award, TrendingUp, AlertTriangle,
  ArrowRight, BookOpen, Target, Sparkles, ChevronRight, BarChart2,
  Layers, FileCheck, Brain, Shield, Play, Calendar, Star, Users
} from 'lucide-react';
import { DBService } from '../services/dbService';
import { MainDifficultyLevel, SubLevel, Question } from '../types/database';
import { AIWeakSectionsPanel } from '../components/ai/AIWeakSectionsPanel';
import { AIPersonalTutorModal } from '../components/ai/AIPersonalTutorModal';
import { AIGenerateMockTestModal } from '../components/ai/AIGenerateMockTestModal';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface DashboardViewProps {
  onStartTopicPractice: (
    subjectId: string,
    topicId: string,
    mainLevel: MainDifficultyLevel,
    subLevel: SubLevel
  ) => void;
  onOpenPYQ: () => void;
  onOpenRevision: () => void;
  onOpenGroup2?: () => void;
  onOpenGroup4?: () => void;
  onStartAIMockTest?: (title: string, questions: Question[], timeLimitMinutes: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartTopicPractice,
  onOpenPYQ,
  onOpenRevision,
  onOpenGroup2,
  onOpenGroup4,
  onStartAIMockTest,
}) => {
  const { t, isTamil, isBoth } = useLanguage();
  const [tutorSession, setTutorSession] = useState<{ section: string; topic: string } | null>(null);
  const [mockGenSession, setMockGenSession] = useState<{ section: string; topic: string } | null>(null);

  const userProgress = DBService.getUserProgress();
  const testAttempts = DBService.getTestAttempts();

  const hours = Math.floor(userProgress.total_study_time_seconds / 3600);
  const mins = Math.floor((userProgress.total_study_time_seconds % 3600) / 60);

  const recentPYQAttempt = testAttempts.find((a) => a.test_type === 'PYQ Paper');
  const weakTopic = recentPYQAttempt?.weak_topics?.[0] || {
    topic_id: 'top-percentage',
    topic_name: 'Percentage & Ratio',
    subject_name: 'General Mental Ability',
    accuracy: 58,
  };

  const weeklyData = [
    { day: 'Mon', accuracy: 68 },
    { day: 'Tue', accuracy: 72 },
    { day: 'Wed', accuracy: 76 },
    { day: 'Thu', accuracy: 80 },
    { day: 'Fri', accuracy: 79 },
    { day: 'Sat', accuracy: 85 },
    { day: 'Sun', accuracy: userProgress.overall_accuracy || 82 },
  ];

  const radarData = [
    { subject: 'GK', accuracy: 78, fullMark: 100 },
    { subject: 'Maths', accuracy: 85, fullMark: 100 },
    { subject: 'Tamil', accuracy: 88, fullMark: 100 },
    { subject: 'English', accuracy: 74, fullMark: 100 },
    { subject: 'Polity', accuracy: 82, fullMark: 100 },
  ];

  const upcomingTests = [
    { id: 'up-1', title: 'TNPSC Group 4 Full Paper 2024 Series', date: 'Tomorrow, 10:00 AM', questions: 200, marks: 300 },
    { id: 'up-2', title: 'Tamil Nadu Heritage & Culture Sprint', date: 'Sunday, 2:00 PM', questions: 50, marks: 75 },
    { id: 'up-3', title: 'Quantitative Aptitude Daily Power Sprint', date: 'Daily, 9:00 PM', questions: 25, marks: 37.5 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* ── Top Welcome Banner ─────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1c170c 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              TNPSC Premium AI Examination Suite Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isTamil ? 'வணக்கம், TNPSC தேர்வரே! 🎯' : isBoth ? 'Welcome Back, TNPSC Aspirant! / வணக்கம் தேர்வரே! 🎯' : 'Welcome Back, TNPSC Aspirant! 🎯'}
            </h1>
            <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'உங்கள் தற்போதைய நிலை: '
                : 'Current Adaptive Level: '}
              <strong className="text-yellow-400 font-bold">
                {userProgress.current_main_level} {userProgress.current_sub_level} (Level #{userProgress.current_difficulty_level}/25)
              </strong>
              {' • '}
              <span className="text-emerald-400 font-semibold">{userProgress.overall_accuracy}% Overall Accuracy</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartTopicPractice('subj-ga', 'top-percentage', userProgress.current_main_level, userProgress.current_sub_level)}
              className="btn-gold text-xs px-5 py-3"
            >
              <Target className="w-4 h-4" />
              {isTamil ? 'அடுத்த நிலை பயிற்சி' : `Practice ${userProgress.current_main_level} ${userProgress.current_sub_level}`}
            </button>
            <button
              onClick={onOpenRevision}
              className="btn-gold-outline text-xs px-4 py-3"
            >
              <Clock className="w-4 h-4" />
              {t.revision}
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Statistics Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.solvedQuestions}
          </span>
          <p className="text-2xl font-extrabold text-white">{userProgress.total_questions_solved}</p>
          <span className="text-[11px] text-emerald-400 font-medium">+{userProgress.total_correct} correct</span>
        </div>

        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.accuracy}
          </span>
          <p className="text-2xl font-extrabold" style={{ color: '#D4AF37' }}>{userProgress.overall_accuracy}%</p>
          <span className="text-[11px]" style={{ color: '#A7A7A7' }}>Target &gt;85%</span>
        </div>

        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.testsCompleted}
          </span>
          <p className="text-2xl font-extrabold text-white">{testAttempts.length}</p>
          <span className="text-[11px] text-yellow-400/90 font-medium">{userProgress.pyqs_completed_count} PYQ Papers</span>
        </div>

        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.studyTime}
          </span>
          <p className="text-2xl font-extrabold text-white">{hours}h {mins}m</p>
          <span className="text-[11px]" style={{ color: '#A7A7A7' }}>Active Study</span>
        </div>

        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.currentTier}
          </span>
          <p className="text-lg font-extrabold text-yellow-400 truncate">{userProgress.current_main_level} {userProgress.current_sub_level}</p>
          <span className="text-[11px]" style={{ color: '#A7A7A7' }}>Tier #{userProgress.current_difficulty_level}</span>
        </div>

        <div className="stat-card">
          <span className="text-[11px] font-semibold uppercase block mb-1" style={{ color: '#A7A7A7' }}>
            {t.daysStreak}
          </span>
          <p className="text-2xl font-extrabold text-amber-500">{userProgress.streak_count} Days</p>
          <span className="text-[11px] text-amber-400 font-semibold">Streak Active 🔥</span>
        </div>
      </div>

      {/* ── Group 2 & Group 4 Quick-Access Cards ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group 4 Quick Access */}
        <div 
          className="gold-card p-6 cursor-pointer group"
          onClick={onOpenGroup4}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition">
                    TNPSC Group 4 Examination
                  </h3>
                  <span className="gold-badge">Primary</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  General Knowledge • General Tamil • General English • Mental Ability
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {isTamil
              ? 'அனைத்து 52 பக்கங்கள் கொண்ட வினாத்தாள், முழு தேர்வு முறை, மற்றும் தனிப்பயன் பாட பயிற்சி.'
              : 'Official question papers (2011–2024), full 200-question timed mocks, and AI-powered practice.'}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-[#393326]/60 text-xs">
            <span className="text-yellow-400/90 font-semibold">200 Questions • 300 Marks</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
              {t.startTest} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Group 2 Quick Access */}
        <div 
          className="gold-card p-6 cursor-pointer group"
          onClick={onOpenGroup2}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <Shield className="w-6 h-6" style={{ color: '#E6C66D' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition">
                    TNPSC Group 2 & 2A
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    Prelims & Mains
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official 2022 & 2024 Papers • Unit 8 & 9 Tamil Nadu Heritage
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {isTamil
              ? 'குரூப் 2 தொடக்க மற்றும் முதன்மை தேர்வுகள், பாடவாரியான மாதிரி தேர்வுகள்.'
              : 'Prelims & Mains solved question papers with bilingual solutions and subject-wise testing.'}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-[#393326]/60 text-xs">
            <span className="text-yellow-400/90 font-semibold">Prelims (200 Qs) • Mains</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
              {t.explorePapers} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ── AI Weak Sections Panel ─────────────────────────────────── */}
      <AIWeakSectionsPanel
        onImproveSection={(section, topic) => setTutorSession({ section, topic })}
        onGenerateMockTest={(section, topic) => setMockGenSession({ section, topic })}
      />

      {/* ── Upcoming Tests & Recommended Practice ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tests */}
        <div className="gold-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#D4AF37' }} />
              {t.upcomingTests}
            </h3>
            <span className="text-xs text-yellow-400/90 font-semibold">Scheduled</span>
          </div>

          <div className="space-y-3">
            {upcomingTests.map((tst) => (
              <div
                key={tst.id}
                className="p-3.5 rounded-xl flex items-center justify-between gap-3 border transition hover:border-yellow-600/40"
                style={{ background: '#121214', borderColor: '#393326' }}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{tst.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="text-yellow-400/80">{tst.date}</span>
                    <span>•</span>
                    <span>{tst.questions} Qs</span>
                    <span>•</span>
                    <span>{tst.marks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={onOpenGroup4}
                  className="btn-gold-outline text-[11px] px-3 py-1.5 shrink-0"
                >
                  <Play className="w-3 h-3" /> Enroll
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Practice Card */}
        <div className="gold-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
              <Brain className="w-4 h-4" /> {t.recommendedPractice}
            </div>
            <h3 className="text-base font-bold text-white">Targeted Practice Based on Weak Topics</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Based on your recent tests, revising <strong className="text-yellow-400">{weakTopic.topic_name}</strong> will give you the fastest score boost.
            </p>

            <div className="mt-4 p-4 rounded-xl border space-y-2 text-xs" style={{ background: '#121214', borderColor: '#393326' }}>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Subject:</span>
                <span className="font-bold text-white">{weakTopic.subject_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Accuracy:</span>
                <span className="font-bold text-emerald-400">&gt;85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Question Format:</span>
                <span className="font-semibold text-yellow-400/90">20 Bilingual Verified Qs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onOpenPYQ}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              {t.explorePapers}
            </button>
            <button
              onClick={() => onStartTopicPractice('subj-ga', weakTopic.topic_id, userProgress.current_main_level, userProgress.current_sub_level)}
              className="btn-gold text-xs px-4 py-2"
            >
              <Target className="w-3.5 h-3.5" /> Start Practice
            </button>
          </div>
        </div>
      </div>

      {/* ── Recharts Analytics ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gold-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" style={{ color: '#D4AF37' }} /> Weekly Accuracy Trend (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="goldAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#19191C', borderColor: '#393326', borderRadius: '12px', color: '#F5F5F5' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#goldAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="gold-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" style={{ color: '#E6C66D' }} /> Subject Performance Radar
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#393326" />
                <PolarAngleAxis dataKey="subject" stroke="#A7A7A7" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#393326" />
                <Radar name="Accuracy %" dataKey="accuracy" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.35} />
                <Tooltip contentStyle={{ backgroundColor: '#19191C', borderColor: '#393326', borderRadius: '12px', color: '#F5F5F5' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Modals */}
      {tutorSession && (
        <AIPersonalTutorModal
          sectionName={tutorSession.section}
          topicName={tutorSession.topic}
          isOpen={true}
          onClose={() => setTutorSession(null)}
          onStartPractice={() => {
            onStartTopicPractice('subj-ga', 'top-percentage', userProgress.current_main_level, userProgress.current_sub_level);
          }}
        />
      )}

      {mockGenSession && (
        <AIGenerateMockTestModal
          isOpen={true}
          onClose={() => setMockGenSession(null)}
          defaultSection={mockGenSession.section}
          defaultTopic={mockGenSession.topic}
          onTestGenerated={(title, questions, timeLimit) => {
            if (onStartAIMockTest) {
              onStartAIMockTest(title, questions, timeLimit);
            }
          }}
        />
      )}
    </div>
  );
};
