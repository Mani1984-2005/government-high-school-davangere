import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GovHeader } from './components/GovHeader';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { HeroSection } from './components/HeroSection';
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

const PortalShell: React.FC = () => {
  const { lang } = useApp();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const scrollToNotices = () => {
    const el = document.getElementById('notices');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      <GovHeader onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <Navbar onOpenServiceModal={() => setIsServiceModalOpen(true)} />

      <LiveTicker onNoticeClick={scrollToNotices} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroSection lang={lang} onOpenServiceModal={() => setIsServiceModalOpen(true)} />
        <AboutSection />
        <NoticesSection lang={lang} />
        <FAQSection />
        <MidDayMealSection lang={lang} />
        <WelfareSchemesSection lang={lang} />
        <AcademicsSection lang={lang} />
        <StudentProgressTracker lang={lang} />
        <SdmcSection lang={lang} />
        <FacultySection lang={lang} />
        <GallerySection lang={lang} />
        <ContactSection lang={lang} />
      </main>

      <Footer lang={lang} onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <OnlineServicesModal
        lang={lang}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />

      <AdminVerificationModal
        lang={lang}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PortalShell />
    </AppProvider>
  );
}
