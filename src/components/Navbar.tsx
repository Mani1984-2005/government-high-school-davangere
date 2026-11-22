import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenServiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenServiceModal }) => {
  const { t } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const navLinks = [
    { href: '#home', label: t.nav_home },
    { href: '#about', label: t.nav_about },
    { href: '#notices', label: t.nav_notices },
    { href: '#faq', label: t.nav_faq },
    { href: '#meals', label: t.nav_meals },
    { href: '#schemes', label: t.nav_schemes },
    { href: '#academics', label: t.nav_academics },
    { href: '#progress', label: t.nav_progress },
    { href: '#sdmc', label: t.nav_sdmc },
    { href: '#faculty', label: t.nav_faculty },
    { href: '#gallery', label: t.nav_gallery },
    { href: '#contact', label: t.nav_contact },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-40 bg-[#13325e] text-white shadow-md border-b-2 border-amber-400 no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[52px] gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden min-h-[44px] inline-flex items-center justify-center px-2.5 rounded-md text-slate-100 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 text-xs font-semibold text-slate-100 hover:text-amber-300 hover:underline underline-offset-4 rounded transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenServiceModal}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-md shadow-xs transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.btn_online_service}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          id="mobile-primary-menu"
          className="lg:hidden bg-[#0b1f3c] border-t border-slate-700 px-4 pt-2 pb-4 space-y-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center min-h-[44px] px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:text-amber-300 hover:bg-slate-800/80 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenServiceModal();
              }}
              className="w-full min-h-[44px] text-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-xs cursor-pointer"
            >
              {t.btn_online_service}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
