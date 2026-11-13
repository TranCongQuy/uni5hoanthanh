import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UniversityDetailModal } from './components/modals/UniversityDetailModal';
import { CompareModal } from './components/modals/CompareModal';
import { ChatBotModal } from './components/modals/ChatBotModal';
import { CareerPathModal } from './components/modals/CareerPathModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ApplyDemoModal } from './components/modals/ApplyDemoModal';
import { BookConsultationModal } from './components/modals/BookConsultationModal';
import { ViewApplicationModal } from './components/modals/ViewApplicationModal';
import { AllApplicationsModal } from './components/modals/AllApplicationsModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { Toast } from './components/common/UI';
import './App.css';

const MobileView = lazy(() =>
  import('./components/mobile/MobileView').then((m) => ({ default: m.MobileView }))
);
const DesktopView = lazy(() =>
  import('./components/desktop/DesktopView').then((m) => ({ default: m.DesktopView }))
);
const AdminApp = lazy(() =>
  import('./components/admin/AdminApp').then((m) => ({ default: m.AdminApp }))
);
const UniversityApp = lazy(() =>
  import('./components/university/UniversityApp').then((m) => ({ default: m.UniversityApp }))
);

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
    isBookConsultationOpen,
    selectedAppForDetail,
    isAllApplicationsOpen,
    isLoggedIn,
    user,
  } = useApp();

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !isLoggedIn);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  const isAnyModalOpen =
    (viewMode === 'mobile' && !isLoggedIn && showOnboarding) ||
    isChatBotOpen ||
    isNotificationsOpen ||
    selectedUniIdForDetail !== null ||
    isCompareModalOpen ||
    isCareerPathOpen ||
    isEditProfileOpen ||
    isSettingsOpen ||
    isAuthModalOpen ||
    isApplyDemoOpen ||
    isBookConsultationOpen ||
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

  // 0. DEDICATED ROLE PORTALS (Admin & ĐH Phú Xuân)
  if (isLoggedIn && user.role === 'admin') {
    return (
      <>
        <AdminApp />
        <ViewApplicationModal />
        <NotificationsModal />
        <SettingsModal />
        <Toast message={toastMessage} />
      </>
    );
  }

  if (isLoggedIn && user.role === 'university_pxu') {
    return (
      <>
        <UniversityApp />
        <ViewApplicationModal />
        <NotificationsModal />
        <SettingsModal />
        <Toast message={toastMessage} />
      </>
    );
  }

  // 1. AUTOMATIC DESKTOP INTERFACE (Viewport >= 1024px)
  if (viewMode === 'desktop') {
    return (
      <>
        <DesktopView />
        <UniversityDetailModal />
        <CompareModal />
        <ChatBotModal />
        <CareerPathModal />
        <EditProfileModal />
        <SettingsModal />
        <ApplyDemoModal />
        <BookConsultationModal />
        <ViewApplicationModal />
        <AllApplicationsModal />
        <NotificationsModal />
        <AuthModal />
        <Toast message={toastMessage} />
      </>
    );
  }

  // 2. AUTOMATIC MOBILE INTERFACE (< 1024px): Auth Gateway when not logged in
  if (!isLoggedIn) {
    return (
      <>
        <OnboardingModal isOpen={showOnboarding} onFinish={handleFinishOnboarding} />
        <AuthScreen />
        <Toast message={toastMessage} />
      </>
    );
  }

  // 3. AUTOMATIC MOBILE INTERFACE (< 1024px): Main Student App
  return (
    <>
      <MobileView />
      <UniversityDetailModal />
      <CompareModal />
      <ChatBotModal />
      <CareerPathModal />
      <EditProfileModal />
      <SettingsModal />
      <ApplyDemoModal />
      <BookConsultationModal />
      <ViewApplicationModal />
      <AllApplicationsModal />
      <NotificationsModal />
      <AuthModal />
      <Toast message={toastMessage} />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={null}>
        <MainApp />
      </Suspense>
    </AppProvider>
  );
}
