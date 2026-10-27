import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeTab } from './components/tabs/HomeTab';
import { QuizTab } from './components/tabs/QuizTab';
import { MatchingTab } from './components/tabs/MatchingTab';
import { LiveTab } from './components/tabs/LiveTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { UniversityDetailModal } from './components/modals/UniversityDetailModal';
import { CompareModal } from './components/modals/CompareModal';
import { ChatBotModal } from './components/modals/ChatBotModal';
import { CareerPathModal } from './components/modals/CareerPathModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ApplyDemoModal } from './components/modals/ApplyDemoModal';
import { ViewApplicationModal } from './components/modals/ViewApplicationModal';
import { AllApplicationsModal } from './components/modals/AllApplicationsModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { Toast } from './components/common/UI';
import './App.css';

const TAB_NAMES = [
  'Trang chủ',
  'Khảo sát RIASEC',
  'AI Matching 2026',
  'Unipath LIVE',
  'Hồ sơ cá nhân',
];

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toastMessage,
    isChatBotOpen,
    isNotificationsOpen,
    selectedUniIdForDetail,
    isCompareModalOpen,
    isCareerPathOpen,
    isEditProfileOpen,
    isSettingsOpen,
    isAuthModalOpen,
    isApplyDemoOpen,
    selectedAppForDetail,
    isAllApplicationsOpen,
    isLoggedIn,
  } = useApp();

  // Onboarding state: defaults to true every time user re-enters the app (no device persistence as requested)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  // Swipe gesture animation HUD feedback
  const [swipeFeedback, setSwipeFeedback] = useState<{
    direction: 'left' | 'right';
    targetTabName: string;
  } | null>(null);

  // Touch Swipe on Main screen to seamlessly switch between tabs with animated feedback
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    setTouchStart(null);

    // Only trigger if horizontal swipe is dominant and significant (> 45px)
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && activeTab < 4) {
        // Swiped left (finger moved right-to-left) -> Next Tab
        const nextTab = activeTab + 1;
        setSwipeFeedback({
          direction: 'left',
          targetTabName: TAB_NAMES[nextTab],
        });
        setTimeout(() => {
          setActiveTab(nextTab);
          setSwipeFeedback(null);
        }, 320);
      } else if (dx > 0 && activeTab > 0) {
        // Swiped right (finger moved left-to-right) -> Previous Tab
        const prevTab = activeTab - 1;
        setSwipeFeedback({
          direction: 'right',
          targetTabName: TAB_NAMES[prevTab],
        });
        setTimeout(() => {
          setActiveTab(prevTab);
          setSwipeFeedback(null);
        }, 320);
      }
    }
  };

  // Mobile Body Scroll Lock: Prevents background scrolling when any modal/drawer is open
  const isAnyModalOpen =
    showOnboarding ||
    isChatBotOpen ||
    isNotificationsOpen ||
    selectedUniIdForDetail !== null ||
    isCompareModalOpen ||
    isCareerPathOpen ||
    isEditProfileOpen ||
    isSettingsOpen ||
    isAuthModalOpen ||
    isApplyDemoOpen ||
    selectedAppForDetail !== null ||
    isAllApplicationsOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // 1. GATEWAY: MANDATORY AUTHENTICATION BEFORE ENTERING APP
  if (!isLoggedIn) {
    return (
      <>
        {/* Onboarding Flow: Shown every time app is opened, with "Bỏ qua" at top */}
        <OnboardingModal
          isOpen={showOnboarding}
          onFinish={handleFinishOnboarding}
        />

        {/* Full Authentication Screen (Login, Register & Demo account Tran Cong Quy) */}
        <AuthScreen />

        {/* System Toast Notification */}
        <Toast message={toastMessage} />
      </>
    );
  }

  // 2. MAIN APPLICATION (Accessible once logged in)
  return (
    <>
      {/* Onboarding if opened in session */}
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={handleFinishOnboarding}
      />

      {/* Swipe Directional Animation HUD Feedback */}
      {swipeFeedback && (
        <div
          style={{
            position: 'fixed',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            padding: '14px 22px',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          {swipeFeedback.direction === 'right' && (
            <div style={{ fontSize: '22px', color: '#60A5FA' }}>
              ⬅
            </div>
          )}
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.8, color: '#93C5FD' }}>
              {swipeFeedback.direction === 'left' ? 'Đang chuyển tiếp' : 'Đang quay lại'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>
              {swipeFeedback.targetTabName}
            </div>
          </div>
          {swipeFeedback.direction === 'left' && (
            <div style={{ fontSize: '22px', color: '#60A5FA' }}>
              ➔
            </div>
          )}
        </div>
      )}

      {/* Main Tab Screen View with Horizontal Swipe Gestures */}
      <main
        style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 0 && <HomeTab />}
        {activeTab === 1 && <QuizTab />}
        {activeTab === 2 && <MatchingTab />}
        {activeTab === 3 && <LiveTab />}
        {activeTab === 4 && <ProfileTab />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />

      {/* Global Modals & Dialogs (Zero 1-1 consultation, 100% AI powered) */}
      <UniversityDetailModal />
      <CompareModal />
      <ChatBotModal />
      <CareerPathModal />
      <EditProfileModal />
      <SettingsModal />
      <ApplyDemoModal />
      <ViewApplicationModal />
      <AllApplicationsModal />
      <NotificationsModal />
      <AuthModal />

      {/* System Toast Notification */}
      <Toast message={toastMessage} />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
