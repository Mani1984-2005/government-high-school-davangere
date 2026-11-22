import React, { useState } from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onOpenServiceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onOpenServiceModal }) => {
  const t = UI_STRINGS[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: t.nav_home },
    { href: '#notices', label: t.nav_notices },
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
    <nav className="sticky top-0 z-40 bg-[#13325e] text-white shadow-md border-b-2 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-13 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded text-slate-200 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span className="ml-2 text-xs font-bold uppercase tracking-wider">{t.menu}</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs lg:text-sm font-semibold text-slate-100 hover:text-amber-300 hover:bg-slate-800/60 rounded transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onOpenServiceModal}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span>{t.btn_online_service}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0c2242] border-t border-slate-700 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded text-sm font-medium text-slate-200 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenServiceModal();
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-xs"
            >
              {t.btn_online_service}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
