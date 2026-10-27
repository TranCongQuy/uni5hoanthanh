import React, { useState } from 'react';
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
import { BookConsultationModal } from './components/modals/BookConsultationModal';
import { ApplyDemoModal } from './components/modals/ApplyDemoModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { Toast } from './components/common/UI';
import './App.css';

const MainApp: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('unipath_onboarding_done') !== 'true';
  });

  const handleFinishOnboarding = () => {
    localStorage.setItem('unipath_onboarding_done', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      {/* Onboarding Flow for First-time visitors */}
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={handleFinishOnboarding}
      />

      {/* Main Tab Screen View */}
      <main style={{ flex: 1 }}>
        {activeTab === 0 && <HomeTab />}
        {activeTab === 1 && <QuizTab />}
        {activeTab === 2 && <MatchingTab />}
        {activeTab === 3 && <LiveTab />}
        {activeTab === 4 && <ProfileTab />}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Global Modals & Dialogs */}
      <UniversityDetailModal />
      <CompareModal />
      <ChatBotModal />
      <CareerPathModal />
      <EditProfileModal />
      <SettingsModal />
      <BookConsultationModal />
      <ApplyDemoModal />
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
