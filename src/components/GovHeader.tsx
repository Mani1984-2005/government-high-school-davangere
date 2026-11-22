import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_INFO } from '../data/schoolData';

interface GovHeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  contrast: boolean;
  setContrast: (c: boolean) => void;
  fontScale: number;
  setFontScale: (s: number | ((prev: number) => number)) => void;
  onOpenServiceModal: () => void;
  onOpenAdminModal: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  lang,
  setLang,
  contrast,
  setContrast,
  fontScale,
  setFontScale,
  onOpenServiceModal,
  onOpenAdminModal,
}) => {
  const t = UI_STRINGS[lang];

  const handleFontChange = (delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(1.25, Math.max(0.85, Number((prev + delta).toFixed(2))));
      document.documentElement.style.setProperty('--font-scale', `${next}rem`);
      return next;
    });
  };

  const handleFontReset = () => {
    setFontScale(1);
    document.documentElement.style.setProperty('--font-scale', '1rem');
  };

  const toggleContrast = () => {
    const next = !contrast;
    setContrast(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header className="w-full">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-400 focus:text-slate-900 focus:px-4 focus:py-2 focus:font-bold focus:rounded focus:shadow-lg focus:outline-none"
      >
        {t.skip_to_main}
      </a>

      {/* Top Government Accessibility & Language Ribbon */}
      <div className="bg-[#0b1f3c] text-slate-100 text-xs border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <svg
              className="w-4 h-4 text-amber-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="tracking-wide">{t.gov_dept}</span>
          </div>

          {/* Accessibility Controls */}
          <div className="flex items-center gap-3 ml-auto" role="region" aria-label="Accessibility and Language Settings">
            <div className="flex items-center gap-1">
              <span className="text-slate-300 hidden sm:inline mr-1">{t.font_size}</span>
              <button
                onClick={() => handleFontChange(-0.05)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-900 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
                title="Decrease font size"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                onClick={handleFontReset}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-900 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
                title="Reset font size"
                aria-label="Reset text size to standard"
              >
                A
              </button>
              <button
                onClick={() => handleFontChange(0.05)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-900 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
                title="Increase font size"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={toggleContrast}
              className={`px-2.5 py-0.5 border rounded text-[11px] font-bold transition-colors cursor-pointer ${
                contrast
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
              }`}
              title="Toggle High Contrast for low-vision accessibility"
              aria-pressed={contrast}
            >
              {t.contrast}
            </button>

            {/* Bilingual Switcher */}
            <div className="inline-flex rounded border border-slate-600 p-0.5 bg-slate-900" role="group" aria-label="Language switcher">
              <button
                onClick={() => setLang('kn')}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  lang === 'kn'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={lang === 'kn'}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={lang === 'en'}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main School Brand Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Karnataka Emblem & Ashoka Chakra Stylized Motif */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-amber-400 p-1 flex items-center justify-center shadow-xs shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Outer Karnataka Gold and Crimson Ring */}
                <circle cx="50" cy="50" r="46" fill="#f8c01c" stroke="#d32f2f" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#13325e" strokeWidth="2" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#13325e" strokeWidth="2" />
                {/* 24 Spoke Chakra Lines */}
                <line x1="50" y1="15" x2="50" y2="85" stroke="#13325e" strokeWidth="1.5" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#13325e" strokeWidth="1.5" />
                <line x1="25" y1="25" x2="75" y2="75" stroke="#13325e" strokeWidth="1.5" />
                <line x1="25" y1="75" x2="75" y2="25" stroke="#13325e" strokeWidth="1.5" />
                {/* Emblem Symbol */}
                <path d="M50 24 L54 36 L66 36 L56 44 L60 56 L50 48 L40 56 L44 44 L34 36 L46 36 Z" fill="#d32f2f" />
                <circle cx="50" cy="50" r="5" fill="#13325e" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-800">
                  {lang === 'kn' ? SCHOOL_INFO.divisionKn : SCHOOL_INFO.divisionEn}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {t.estd_label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#13325e] leading-tight">
                {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {lang === 'kn' ? 'GOVERNMENT HIGH SCHOOL, DAVANGERE' : 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ದಾವಣಗೆರೆ'}
              </p>
            </div>
          </div>

          {/* Quick Official Badges */}
          <div className="flex flex-wrap items-center md:flex-col md:items-end gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded text-[11px] border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                title="Inspect school administrative confirmation items"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                <span>{t.admin_verify_btn}</span>
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded border border-slate-300">
                <span className="text-slate-500 font-normal">{t.udise_label}</span>
                <span className="font-mono font-bold text-slate-900">{SCHOOL_INFO.udise}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
              <span>{t.medium_badge}</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">{t.pass_rate_badge}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
