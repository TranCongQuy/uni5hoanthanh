import React from 'react';
import { useApp } from '../../context/AppContext';
import { HomeTab } from '../tabs/HomeTab';
import { QuizTab } from '../tabs/QuizTab';
import { MatchingTab } from '../tabs/MatchingTab';
import { LiveTab } from '../tabs/LiveTab';
import { ProfileTab } from '../tabs/ProfileTab';
import { BottomNavigation } from '../navigation/BottomNavigation';

export const MobileView: React.FC = () => {
  const { activeTab } = useApp();

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


