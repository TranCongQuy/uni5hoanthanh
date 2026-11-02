import React from 'react';
import { Laptop, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ViewModeToggleProps {
  variant?: 'floating' | 'navbar' | 'banner';
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ variant = 'floating', className = '' }) => {
  const { viewMode, toggleViewMode } = useApp();
  const isDesktop = viewMode === 'desktop';

  // 1. Navbar compact pill variant (used inside Desktop topbar or mobile headers)
  if (variant === 'navbar') {
    return (
      <button
        onClick={toggleViewMode}
        title={isDesktop ? 'Chuyển sang giao diện Điện thoại' : 'Chuyển sang giao diện Laptop'}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '999px',
          backgroundColor: isDesktop ? '#EFF6FF' : '#1E293B',
          color: isDesktop ? '#2563EB' : '#FFFFFF',
          border: isDesktop ? '1px solid #BFDBFE' : '1px solid #334155',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.2s ease',
        }}
      >
        {isDesktop ? (
          <>
            <Smartphone size={16} />
            <span>Chuyển sang Mobile 📱</span>
          </>
        ) : (
          <>
            <Laptop size={16} />
            <span>Chuyển sang Desktop 💻</span>
          </>
        )}
      </button>
    );
  }

  // 2. Big Banner Callout variant (used in hero cards or test screens)
  if (variant === 'banner') {
    return (
      <button
        onClick={toggleViewMode}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 24px',
          borderRadius: '14px',
          background: isDesktop
            ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(37,99,235,0.25)',
          transition: 'all 0.2s ease',
        }}
      >
        {isDesktop ? (
          <>
            <Smartphone size={18} />
            <span>📱 Nhấn vào đây để quay lại giao diện Điện thoại</span>
          </>
        ) : (
          <>
            <Laptop size={18} />
            <span>💻 Nhấn vào đây để chuyển sang giao diện Laptop / Desktop</span>
          </>
        )}
      </button>
    );
  }

  // 3. Floating Quick-Switch Widget (Always available on screen)
  return (
    <aside
      aria-label="Chuyển đổi giao diện"
      style={{
        position: 'fixed',
        bottom: isDesktop ? '24px' : '82px', // above bottom navigation on mobile
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      <button
        onClick={toggleViewMode}
        title={isDesktop ? 'Chuyển về giao diện Mobile' : 'Chuyển sang giao diện Desktop'}
        aria-label={isDesktop ? 'Chuyển về giao diện Mobile' : 'Chuyển sang giao diện Desktop'}
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: isDesktop ? '10px 18px' : '9px 15px',
          borderRadius: '999px',
          background: isDesktop
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          border: '2px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.22)',
          fontSize: '13px',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
          animation: 'bounceIn 0.4s ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0px)';
        }}
      >
        {isDesktop ? (
          <>
            <Smartphone size={17} strokeWidth={2.5} />
            <span>📱 Chuyển sang Mobile</span>
          </>
        ) : (
          <>
            <Laptop size={17} strokeWidth={2.5} />
            <span>💻 Chuyển sang Desktop</span>
          </>
        )}
      </button>
    </aside>
  );
};

