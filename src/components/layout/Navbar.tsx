import React, { useState } from 'react';
import {
  GraduationCap,
  Flame,
  ShieldAlert,
  User,
  ChevronDown,
  LayoutDashboard,
  Target,
  FileText,
  Clock,
  Zap,
  BookMarked,
  BarChart3,
  BookOpen,
  Globe,
  Menu,
  X,
  Shield,
  HelpCircle,
  Library,
  Newspaper,
  Award,
  LogIn,
  LogOut,
} from 'lucide-react';
import { DBService } from '../../services/dbService';
import { useLanguage, LanguageMode } from '../../contexts/LanguageContext';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  selectedExamId: string;
  onExamChange: (examId: string) => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  selectedExamId,
  onExamChange,
  isAdminMode,
  onToggleAdminMode,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const userProgress = DBService.getUserProgress();

  // Complete navigation array matching all requirements
  const primaryNavItems = [
    { id: 'dashboard',       label: t.dashboard,       icon: LayoutDashboard },
    { id: 'group2',          label: t.group2,          icon: Shield, isGold: false },
    { id: 'tnpsc',           label: t.group4,          icon: BookOpen, isGold: true },
    { id: 'pyq',             label: t.previousPapers,  icon: FileText },
    { id: 'question-bank',   label: t.questionBank,    icon: HelpCircle },
    { id: 'mock-tests',      label: t.mockTests,       icon: Clock },
    { id: 'study-materials', label: t.studyMaterials,  icon: Library },
    { id: 'current-affairs', label: t.currentAffairs,  icon: Newspaper },
    { id: 'results',         label: t.results,         icon: Award },
    { id: 'performance',     label: t.performance,     icon: BarChart3 },
  ];

  return (
    <header
      className="sticky top-0 z-40 transition-colors"
      style={{
        background: 'rgba(11,11,13,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #393326',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo with Gold Accent ─────────────────────────────────── */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div
              className="p-2 rounded-xl flex items-center justify-center transition group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #E6C66D 100%)',
                boxShadow: '0 0 16px -4px rgba(212,175,55,0.45)',
              }}
            >
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight leading-tight text-gold-gradient flex items-center gap-1">
                TNPSC <span style={{ color: '#F5F5F5' }}>Prep</span>
              </div>
              <div className="text-[10px] font-medium hidden sm:block" style={{ color: '#A7A7A7' }}>
                Group 2 & 4 Master Portal
              </div>
            </div>
          </button>

          {/* ── Desktop Navigation Links ──────────────────────────────── */}
          <nav className="hidden 2xl:flex items-center gap-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/40 shadow-sm'
                      : item.isGold
                      ? 'text-yellow-400/80 hover:text-yellow-300 hover:bg-yellow-900/15 border-yellow-800/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                  style={isActive ? { color: '#D4AF37', borderColor: '#D4AF37' } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Medium screen compact nav */}
          <nav className="hidden lg:flex 2xl:hidden items-center gap-1">
            {[
              { id: 'dashboard',     label: t.dashboard,      icon: LayoutDashboard },
              { id: 'group2',        label: t.group2,         icon: Shield },
              { id: 'tnpsc',         label: t.group4,         icon: BookOpen },
              { id: 'pyq',           label: t.previousPapers, icon: FileText },
              { id: 'mock-tests',    label: t.mockTests,      icon: Clock },
              { id: 'question-bank', label: t.questionBank,   icon: HelpCircle },
              { id: 'results',       label: t.results,        icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 border ${
                    isActive
                      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                  style={isActive ? { color: '#D4AF37' } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ────────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Streak Counter */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#E6C66D',
              }}
            >
              <Flame className="w-3.5 h-3.5" style={{ fill: '#D4AF37' }} />
              <span>{userProgress.streak_count} {t.daysStreak}</span>
            </div>

            {/* Global Language Selector */}
            <div className="relative">
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                style={{
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: '#E6C66D',
                }}
              >
                <Globe className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageMode)}
                  className="bg-transparent border-none outline-none cursor-pointer text-xs font-bold pr-1"
                  style={{ color: '#E6C66D' }}
                  aria-label="Select Global Language"
                >
                  <option value="Tamil"   className="bg-[#0B0B0D] text-yellow-300">தமிழ் (Tamil)</option>
                  <option value="English" className="bg-[#0B0B0D] text-yellow-300">English</option>
                  <option value="Both"    className="bg-[#0B0B0D] text-yellow-300">இரண்டும் / Both</option>
                </select>
              </div>
            </div>

            {/* Admin Suite Toggle */}
            <button
              onClick={onToggleAdminMode}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border hidden sm:flex ${
                isAdminMode
                  ? 'bg-purple-900/60 text-purple-300 border-purple-500/50'
                  : 'text-slate-400 border-slate-700/50 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {isAdminMode ? t.adminSuiteOn : t.adminPanel}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onTabChange('profile')}
              className="w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #E6C66D)',
                borderColor: 'rgba(212,175,55,0.4)',
                color: '#0B0B0D',
              }}
              title={t.profile}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Login / Logout Button */}
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition"
              style={{
                background: isLoggedIn ? '#19191C' : 'rgba(39,174,96,0.1)',
                borderColor: isLoggedIn ? '#393326' : 'rgba(39,174,96,0.3)',
                color: isLoggedIn ? '#A7A7A7' : '#27AE60',
              }}
              title={isLoggedIn ? t.logout : t.login}
            >
              {isLoggedIn ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span>{isLoggedIn ? t.logout : t.login}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center transition"
              style={{
                background: '#19191C',
                border: '1px solid #393326',
                color: '#D4AF37',
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Hamburger Drawer ───────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden pb-4 pt-2 border-t animate-fade-in"
            style={{ borderColor: '#393326' }}
          >
            <div className="grid grid-cols-2 gap-1.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition text-left border"
                    style={
                      isActive
                        ? { background: 'rgba(212,175,55,0.12)', color: '#D4AF37', borderColor: 'rgba(212,175,55,0.35)' }
                        : { background: '#19191C', color: '#A7A7A7', borderColor: '#393326' }
                    }
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
