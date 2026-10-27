import React from 'react';
import { Home, Compass, Sparkles, Radio, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 0, label: 'Trang chủ', icon: <Home size={22} /> },
  { id: 1, label: 'Khảo sát', icon: <Compass size={22} /> },
  { id: 2, label: 'AI Match', icon: <Sparkles size={22} /> },
  { id: 3, label: 'Sự kiện', icon: <Radio size={22} /> },
  { id: 4, label: 'Cá nhân', icon: <User size={22} /> },
];

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'auto',
        minHeight: '66px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        zIndex: 80,
        maxWidth: '520px',
        margin: '0 auto',
        paddingTop: '6px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 12px))',
        boxSizing: 'border-box',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={item.label}
            style={{
              flex: 1,
              height: '52px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              backgroundColor: 'transparent',
              color: isActive ? '#2563EB' : '#94A3B8',
              cursor: 'pointer',
              padding: '2px 0',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {/* Sliding / Selected Pill */}
            <div
              style={{
                width: isActive ? '44px' : '32px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {item.icon}
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#2563EB' : '#64748B',
                letterSpacing: '-0.2px',
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
