import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingAssistantButton } from './components/layout/FloatingAssistantButton';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { TestScenariosModal } from './components/common/TestScenariosModal';
import { HomePage } from './pages/HomePage';
import { AnimalAssistant } from './components/assistant/AnimalAssistant';
import { NearbyClinics } from './components/clinics/NearbyClinics';
import { RescueReportForm } from './components/rescue/RescueReportForm';
import { RescueTracker } from './components/rescue/RescueTracker';
import { WellnessResources } from './components/home/WellnessResources';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  // Sync tab with URL hash if present
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['home', 'assistant', 'clinics', 'report', 'track', 'resources', 'admin'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [assistantCategory, setAssistantCategory] = useState<string | undefined>();
  const [trackRefNumber, setTrackRefNumber] = useState<string | undefined>();
  const [showTestRunner, setShowTestRunner] = useState<boolean>(false);

  // Update hash when tab changes
  useEffect(() => {
    window.location.hash = `/${currentTab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Listen to hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'assistant', 'clinics', 'report', 'track', 'resources', 'admin'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToAssistant = (categoryId?: string) => {
    setAssistantCategory(categoryId);
    setCurrentTab('assistant');
  };

  const handleNavigateToTrack = (refNumber: string) => {
    setTrackRefNumber(refNumber);
    setCurrentTab('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-offwhite text-brand-charcoal">
      {/* Top Disclaimer Notice */}
      <DisclaimerBanner />

      {/* Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenTestRunner={() => setShowTestRunner(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigateToAssistant={handleNavigateToAssistant}
            onNavigateToReport={() => setCurrentTab('report')}
            onNavigateToClinics={() => setCurrentTab('clinics')}
          />
        )}

        {currentTab === 'assistant' && (
          <div className="py-4">
            <AnimalAssistant
              initialCategory={assistantCategory}
              onNavigateToClinics={() => setCurrentTab('clinics')}
            />
          </div>
        )}

        {currentTab === 'clinics' && <NearbyClinics />}

        {currentTab === 'report' && (
          <RescueReportForm onSuccessNavigateToTrack={handleNavigateToTrack} />
        )}

        {currentTab === 'track' && <RescueTracker initialRef={trackRefNumber} />}

        {currentTab === 'resources' && (
          <div className="py-8">
            <WellnessResources />
          </div>
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Persistent Floating Assistant Button (Shown on all pages except assistant itself) */}
      <FloatingAssistantButton
        isVisible={currentTab !== 'assistant'}
        onClick={() => {
          setAssistantCategory(undefined);
          setCurrentTab('assistant');
        }}
      />

      {/* Automated Clinical Safety Test Runner Modal */}
      {showTestRunner && (
        <TestScenariosModal onClose={() => setShowTestRunner(false)} />
      )}

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;
