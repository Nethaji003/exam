import React from 'react';
import { LayoutDashboard, Target, FileText, Clock, BarChart3, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onTabChange }) => {
  const { t } = useLanguage();

  const items = [
    { id: 'dashboard',  label: t.home,       icon: LayoutDashboard },
    { id: 'tnpsc',      label: t.tnpscGroup4, icon: BookOpen },
    { id: 'practice',   label: t.practice,   icon: Target },
    { id: 'pyq',        label: 'PYQ',         icon: FileText },
    { id: 'mock-tests', label: t.mockTests,  icon: Clock },
    { id: 'performance',label: t.performance, icon: BarChart3 },
  ];

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 shadow-2xl"
      style={{
        background: 'rgba(11,11,13,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #2a2515',
      }}
    >
      <div className="flex items-center justify-around px-1 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center py-2 px-2.5 rounded-xl transition"
              style={
                isActive
                  ? { color: '#D4AF37' }
                  : { color: '#A7A7A7' }
              }
            >
              <Icon
                className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}
                style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' } : {}}
              />
              <span className="text-[10px] font-semibold">{item.label}</span>
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: '#D4AF37' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
