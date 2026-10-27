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
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { Toast } from './components/common/UI';
import './App.css';

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
    isLoggedIn,
  } = useApp();

  // Onboarding state: defaults to true on first visit, never prompts again once finished or skipped
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('unipath_onboarding_done') !== 'true';
  });

  const handleFinishOnboarding = () => {
    localStorage.setItem('unipath_onboarding_done', 'true');
    setShowOnboarding(false);
  };

  // Touch Swipe on Main screen to seamlessly switch between tabs
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    setTouchStart(null);

    // Only trigger if horizontal swipe is dominant and significant (> 50px)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        // Swiped left (finger moved right-to-left) -> Next Tab
        setActiveTab(Math.min(4, activeTab + 1));
      } else {
        // Swiped right (finger moved left-to-right) -> Previous Tab
        setActiveTab(Math.max(0, activeTab - 1));
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
    selectedAppForDetail !== null;

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
        {/* Onboarding Flow: Shown on first visit with "Bỏ qua" on top; saved to localStorage */}
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
      {/* Onboarding if triggered in session */}
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={handleFinishOnboarding}
      />

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
