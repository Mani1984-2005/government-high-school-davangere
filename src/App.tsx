import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { PortalProvider, usePortal } from './context/AuthContext';
import { GovHeader } from './components/GovHeader';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { HeroSection } from './components/HeroSection';
import { QuickAccessSection } from './components/QuickAccessSection';
import { AboutSection } from './components/AboutSection';
import { NoticesSection } from './components/NoticesSection';
import { FAQSection } from './components/FAQSection';
import { MidDayMealSection } from './components/MidDayMealSection';
import { WelfareSchemesSection } from './components/WelfareSchemesSection';
import { AcademicsSection } from './components/AcademicsSection';
import { StudentProgressTracker } from './components/StudentProgressTracker';
import { SdmcSection } from './components/SdmcSection';
import { FacultySection } from './components/FacultySection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OnlineServicesModal } from './components/OnlineServicesModal';
import { AdminVerificationModal } from './components/AdminVerificationModal';
import { StudentLoginPage } from './components/portals/StudentLoginPage';
import { StudentDashboard } from './components/portals/StudentDashboard';
import { StaffLoginPage } from './components/portals/StaffLoginPage';
import { StaffDashboard } from './components/portals/StaffDashboard';
import { UnauthorizedView } from './components/portals/UnauthorizedView';
import { SelfRegistrationPage } from './components/portals/SelfRegistrationPage';
import { RegistrationStatusPage } from './components/portals/RegistrationStatusPage';

const PortalShell: React.FC = () => {
  const { route, hasRole, navigateToHomeSection } = usePortal();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const renderMainContent = () => {
    if (route === '/student-portal') {
      return <StudentLoginPage />;
    }
    if (route === '/student-register') {
      return <SelfRegistrationPage mode="student" />;
    }
    if (route === '/parent-register') {
      return <SelfRegistrationPage mode="parent" />;
    }
    if (route === '/student-dashboard') {
      return hasRole('student') ? (
        <StudentDashboard />
      ) : (
        <UnauthorizedView requiredRole="student" />
      );
    }
    if (route === '/staff-portal') {
      return <StaffLoginPage />;
    }
    if (route === '/staff-register') {
      return <SelfRegistrationPage mode="staff" />;
    }
    if (route === '/staff-dashboard') {
      return hasRole('staff') ? (
        <StaffDashboard />
      ) : (
        <UnauthorizedView requiredRole="staff" />
      );
    }
    if (route === '/registration-status') {
      return <RegistrationStatusPage />;
    }

    return (
      <>
        <HeroSection onOpenServiceModal={() => setIsServiceModalOpen(true)} />
        <QuickAccessSection onOpenServiceModal={() => setIsServiceModalOpen(true)} />
        <AboutSection />
        <NoticesSection />
        <FAQSection />
        <AcademicsSection />
        <MidDayMealSection />
        <WelfareSchemesSection />
        <StudentProgressTracker />
        <SdmcSection />
        <FacultySection />
        <GallerySection />
        <ContactSection />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      <GovHeader onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <Navbar onOpenServiceModal={() => setIsServiceModalOpen(true)} />

      {route === '/' && (
        <LiveTicker onNoticeClick={() => navigateToHomeSection('notices')} />
      )}

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {renderMainContent()}
      </main>

      <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <OnlineServicesModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />

      <AdminVerificationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PortalProvider>
        <PortalShell />
      </PortalProvider>
    </AppProvider>
  );
}
