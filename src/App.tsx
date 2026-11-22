import React, { useState } from 'react';
import { Language } from './types';
import { GovHeader } from './components/GovHeader';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { HeroSection } from './components/HeroSection';
import { NoticesSection } from './components/NoticesSection';
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

export default function App() {
  const [lang, setLang] = useState<Language>('kn');
  const [contrast, setContrast] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const handleOpenServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
  };

  const handleOpenAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  const scrollToNotices = () => {
    const el = document.getElementById('notices');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      {/* Official Government Accessibility Top Ribbon & Header */}
      <GovHeader
        lang={lang}
        setLang={setLang}
        contrast={contrast}
        setContrast={setContrast}
        fontScale={fontScale}
        setFontScale={setFontScale}
        onOpenServiceModal={handleOpenServiceModal}
        onOpenAdminModal={handleOpenAdminModal}
      />

      {/* Main Navigation Bar */}
      <Navbar lang={lang} onOpenServiceModal={handleOpenServiceModal} />

      {/* Live Notice / Circular Ticker */}
      <LiveTicker lang={lang} onNoticeClick={scrollToNotices} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 focus:outline-none">
        {/* Hero Section */}
        <HeroSection lang={lang} onOpenServiceModal={handleOpenServiceModal} />

        {/* Notices & Circulars with Headmaster Message */}
        <NoticesSection lang={lang} />

        {/* Akshara Dasoha (Mid-Day Meal) & Ksheera Bhagya */}
        <MidDayMealSection lang={lang} />

        {/* Government Welfare Schemes & Entitlements */}
        <WelfareSchemesSection lang={lang} />

        {/* Academics, Daily Bell Schedule & SSLC Desk */}
        <AcademicsSection lang={lang} />

        {/* Secure Student Progress & Attendance Tracker (SATS) */}
        <StudentProgressTracker lang={lang} />

        {/* SDMC (School Development & Monitoring Committee) & Transparency */}
        <SdmcSection lang={lang} />

        {/* Faculty & Staff Directory */}
        <FacultySection lang={lang} />

        {/* Campus Photo Gallery */}
        <GallerySection lang={lang} />

        {/* Address, Location Guidance, Helplines & Grievance Box */}
        <ContactSection lang={lang} />
      </main>

      {/* Official Footer */}
      <Footer lang={lang} onOpenAdminModal={handleOpenAdminModal} />

      {/* Online Service / Admissions / TC Modal */}
      <OnlineServicesModal
        lang={lang}
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
      />

      {/* School Pre-Deployment Verification Checklist Modal */}
      <AdminVerificationModal
        lang={lang}
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
      />
    </div>
  );
}
