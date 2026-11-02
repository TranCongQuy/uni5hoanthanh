import React from 'react';
import { useApp } from '../../context/AppContext';
import { HomeTab } from '../tabs/HomeTab';
import { QuizTab } from '../tabs/QuizTab';
import { MatchingTab } from '../tabs/MatchingTab';
import { LiveTab } from '../tabs/LiveTab';
import { ProfileTab } from '../tabs/ProfileTab';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { Laptop } from 'lucide-react';

export const MobileView: React.FC = () => {
  const { activeTab, setViewMode } = useApp();

  return (
    <div
      className="mobile-view-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Top Quick Notice / Switcher Ribbon for Desktop / Laptop screen testing */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          fontSize: '11px',
          fontWeight: 600,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
            }}
          />
          📱 Chế độ Điện thoại (Mobile)
        </span>
        <button
          onClick={() => setViewMode('desktop')}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            padding: '3px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <Laptop size={13} />
          <span>Sang Desktop 💻</span>
        </button>
      </div>

      {/* Main Tab View */}
      <main style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 0 && <HomeTab />}
        {activeTab === 1 && <QuizTab />}
        {activeTab === 2 && <MatchingTab />}
        {activeTab === 3 && <LiveTab />}
        {activeTab === 4 && <ProfileTab />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

