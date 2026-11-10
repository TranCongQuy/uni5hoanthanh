import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileView } from './components/mobile/MobileView';
import { DesktopView } from './components/desktop/DesktopView';
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

const MainApp: React.FC = () => {
  const {
    viewMode,
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

  // Mobile Body Scroll Lock: Prevents background scrolling when any modal/drawer is open
  const isAnyModalOpen =
    (viewMode === 'mobile' && showOnboarding) ||
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

  // 1. DESKTOP / LAPTOP INTERFACE (When user clicks switch to desktop mode)
  if (viewMode === 'desktop') {
    return (
      <>
        {/* Dedicated Desktop View with requested 'Hello' test screen */}
        <DesktopView />

        {/* Global Modals & Dialogs */}
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
  }

  // 2. MOBILE INTERFACE: GATEWAY (Mandatory auth on mobile before entering full tabs)
  if (!isLoggedIn) {
    return (
      <>
        {/* Onboarding Flow */}
        <OnboardingModal
          isOpen={showOnboarding}
          onFinish={handleFinishOnboarding}
        />

        {/* Full Authentication Screen */}
        <AuthScreen />

        {/* System Toast Notification */}
        <Toast message={toastMessage} />
      </>
    );
  }

  // 3. MOBILE INTERFACE: MAIN APP (When logged in on mobile)
  return (
    <>
      {/* Onboarding if opened in session */}
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={handleFinishOnboarding}
      />

      {/* Main Tab Screen View */}
      <MobileView />

      {/* Global Modals & Dialogs */}
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
