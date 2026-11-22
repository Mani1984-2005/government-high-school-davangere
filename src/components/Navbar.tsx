import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  FileText,
  GraduationCap,
  Users,
  Home,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';

interface NavbarProps {
  onOpenServiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenServiceModal }) => {
  const { t, pick } = useApp();
  const { route, navigate, navigateToHomeSection, session, logout } = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const primaryDesktopLinks = [
    { id: 'home', label: t.nav_home },
    { id: 'about', label: t.nav_about },
    { id: 'academics', label: t.nav_academics },
    { id: 'notices', label: t.nav_notices },
    { id: 'schemes', label: t.nav_schemes },
    { id: 'contact', label: t.nav_contact },
  ];

  const allDrawerLinks = [
    { id: 'home', label: t.nav_home },
    { id: 'about', label: t.nav_about },
    { id: 'notices', label: t.nav_notices },
    { id: 'faq', label: t.nav_faq },
    { id: 'meals', label: t.nav_meals },
    { id: 'schemes', label: t.nav_schemes },
    { id: 'academics', label: t.nav_academics },
    { id: 'progress', label: t.nav_progress },
    { id: 'sdmc', label: t.nav_sdmc },
    { id: 'faculty', label: t.nav_faculty },
    { id: 'gallery', label: t.nav_gallery },
    { id: 'contact', label: t.nav_contact },
  ];

  const handleSectionClick = (id: string) => {
    setMobileOpen(false);
    if (id === 'home') {
      navigate('/');
      return;
    }
    navigateToHomeSection(id);
  };

  return (
    <nav
      aria-label={t.nav_all_sections}
      className="sticky top-0 z-40 bg-[#13325e] text-white shadow-md border-b-2 border-amber-400 no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[52px] gap-4">
          {/* Mobile menu toggle + compact Home link */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="min-h-[44px] inline-flex items-center justify-center px-2.5 rounded-md text-slate-100 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
              aria-expanded={mobileOpen}
              aria-controls="mobile-primary-menu"
              aria-label={mobileOpen ? t.a11y_close_menu : t.a11y_open_menu}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="ml-2 text-xs font-bold tracking-wide">{t.menu}</span>
            </button>

            {route !== '/' && (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="min-h-[44px] inline-flex items-center gap-1 px-2.5 rounded-md text-xs font-semibold text-amber-300 hover:bg-slate-800/70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.nav_home}</span>
              </button>
            )}
          </div>

          {/* Desktop Primary Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 min-w-0">
            {primaryDesktopLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                className={`px-3 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  route === '/' && link.id === 'home'
                    ? 'text-amber-300 underline underline-offset-4'
                    : 'text-slate-100 hover:text-amber-300 hover:underline underline-offset-4'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Action Zone: Portal Logins / Dashboard & Service Guide */}
          <div className="flex items-center gap-2 shrink-0">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      session.role === 'student' ? '/student-dashboard' : '/staff-dashboard'
                    )
                  }
                  className="min-h-[36px] px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {session.role === 'student' ? t.nav_student_portal : t.nav_staff_portal}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="hidden sm:inline-flex min-h-[36px] px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.auth_logout}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/student-portal')}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                    route === '/student-portal'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/25'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.nav_student_portal}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/staff-portal')}
                  className={`hidden sm:inline-flex min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer ${
                    route === '/staff-portal'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.nav_staff_portal}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onOpenServiceModal}
              className="hidden xl:inline-flex min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-md transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>{t.nav_services_short}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          id="mobile-primary-menu"
          className="lg:hidden bg-[#0b1f3c] border-t border-slate-700 px-4 pt-3 pb-5 space-y-3"
        >
          {/* Portal Quick Login Buttons inside Drawer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate(
                  session?.role === 'student' ? '/student-dashboard' : '/student-portal'
                );
              }}
              className="min-h-[44px] px-3 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              <span>{t.nav_student_portal}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate(session?.role === 'staff' ? '/staff-dashboard' : '/staff-portal');
              }}
              className="min-h-[44px] px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>{t.nav_staff_portal}</span>
            </button>
          </div>

          <div className="pt-1 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {allDrawerLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                className="flex items-center min-h-[44px] px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:text-amber-300 hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenServiceModal();
              }}
              className="w-full min-h-[44px] text-center px-4 py-2.5 text-xs font-bold text-slate-100 bg-emerald-800 hover:bg-emerald-700 rounded-md cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{t.btn_online_service}</span>
            </button>
            {session && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full min-h-[44px] text-center px-4 py-2.5 text-xs font-bold text-red-100 bg-red-900/70 hover:bg-red-800 rounded-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>{pick('ಲಾಗಿನ್ ನಿರ್ಗಮಿಸಿ', 'Logout')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
