import React, { useState } from 'react';
import { DBService } from '../services/dbService';
import { 
  HelpCircle, Search, Filter, BookOpen, Layers, CheckCircle2, 
  Sparkles, ArrowRight, Bookmark, ShieldCheck, Play 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTNPSCQuestions } from '../services/tnpscPaperData';

interface QuestionBankViewProps {
  onStartPracticeQuestion?: (q: any) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onStartPracticeQuestion }) => {
  const { t, isTamil, isBoth, language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedExamGroup, setSelectedExamGroup] = useState<string>('All');

  // Pull bilingual TNPSC questions from curated dataset
  const questions = getTNPSCQuestions();

  const subjects = ['All', 'General Knowledge', 'General Mental Ability', 'General English', 'General Tamil (பொதுத் தமிழ்)'];

  const filtered = questions.filter((q) => {
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchEn = q.question_text_en?.toLowerCase().includes(term);
      const matchTa = q.question_text_ta?.includes(term);
      const matchTopic = q.topic?.toLowerCase().includes(term);
      if (!matchEn && !matchTa && !matchTopic) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div 
        className="gold-panel p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #19191C 0%, #121214 60%, #1c180d 100%)',
          borderColor: '#393326',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#E6C66D' }}>
              <HelpCircle className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              TNPSC Group 2 & Group 4 Question Repository
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isTamil ? 'அதிகாரப்பூர்வ TNPSC வினா வங்கி' : isBoth ? 'Official TNPSC Question Bank / வினா வங்கி' : 'Official TNPSC Question Bank'}
            </h1>
            <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#A7A7A7' }}>
              {isTamil
                ? 'தமிழ் மற்றும் ஆங்கிலத்தில் சரிபார்க்கப்பட்ட வினாக்கள், விளக்கங்கள் மற்றும் பாடவாரியான வகைப்பாடு.'
                : '100% verified bilingual previous-year and syllabus questions with complete step-by-step solutions.'}
            </p>
          </div>

          <div className="stat-card text-center min-w-[160px]">
            <span className="text-xs block" style={{ color: '#A7A7A7' }}>{isTamil ? 'கிடைக்கும் வினாக்கள்' : 'Available Questions'}</span>
            <div className="text-3xl font-extrabold" style={{ color: '#D4AF37' }}>{questions.length}+</div>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Bilingual Verified</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────── */}
      <div className="gold-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D4AF37' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTamil ? 'வினா அல்லது தலைப்பைத் தேடுங்கள்...' : 'Search questions or topics in Tamil or English...'}
            className="input-gold pl-9 w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
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
      </div>

      {/* ── Question Cards ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div
            key={q.id || idx}
            className="gold-card p-6 space-y-4 hover:border-yellow-600/40 transition"
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                  #{q.original_question_number || idx + 1}
                </span>
                <span className="font-semibold text-white">{q.subject}</span>
                <span style={{ color: '#393326' }}>•</span>
                <span style={{ color: '#A7A7A7' }}>{q.topic}</span>
              </div>
              <span className="gold-badge">
                Page {q.page_number}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              {(language === 'Tamil' || language === 'Both') && q.question_text_ta && (
                <p className="text-sm font-semibold tamil-text text-yellow-100/95 leading-relaxed">
                  {q.question_text_ta}
                </p>
              )}
              {(language === 'English' || language === 'Both') && q.question_text_en && (
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {q.question_text_en}
                </p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { k: 'A', text: q.option_a },
                { k: 'B', text: q.option_b },
                { k: 'C', text: q.option_c },
                { k: 'D', text: q.option_d },
              ].map((opt) => {
                const isCorrect = q.correct_answer === opt.k;
                return (
                  <div
                    key={opt.k}
                    className="p-2.5 rounded-xl flex items-center gap-2 border transition"
                    style={
                      isCorrect
                        ? { background: 'rgba(39,174,96,0.12)', borderColor: 'rgba(39,174,96,0.35)', color: '#27AE60' }
                        : { background: '#121214', borderColor: '#393326', color: '#A7A7A7' }
                    }
                  >
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={
                        isCorrect
                          ? { background: '#27AE60', color: '#0B0B0D' }
                          : { background: '#19191C', color: '#A7A7A7', border: '1px solid #393326' }
                      }>
                      {opt.k}
                    </span>
                    <span className="font-medium text-slate-200">{opt.text}</span>
                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {q.explanation && (
              <div className="p-3 rounded-xl text-xs space-y-1" style={{ background: '#121214', border: '1px solid #393326' }}>
                <span className="text-[11px] font-bold text-yellow-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> {t.explanation}:
                </span>
                <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                {q.explanation_ta && (language === 'Tamil' || language === 'Both') && (
                  <p className="tamil-text text-yellow-200/80 pt-1 leading-relaxed">{q.explanation_ta}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="gold-card p-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: '#D4AF37' }} />
            <h3 className="text-lg font-bold text-white mb-1">{t.noData}</h3>
            <p className="text-xs" style={{ color: '#A7A7A7' }}>No questions match your current search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
