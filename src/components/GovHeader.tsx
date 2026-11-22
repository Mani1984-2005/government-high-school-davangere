import React from 'react';
import { Landmark, Contrast, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/schoolData';

interface GovHeaderProps {
  onOpenAdminModal: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({ onOpenAdminModal }) => {
  const {
    lang,
    setLang,
    contrast,
    toggleContrast,
    fontScale,
    adjustFontScale,
    resetFontScale,
    t,
    pick,
  } = useApp();

  const scalePct = Math.round(fontScale * 100);

  return (
    <header className="w-full no-print">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-400 focus:text-slate-950 focus:px-4 focus:py-2.5 focus:font-bold focus:rounded-md focus:shadow-lg"
      >
        {t.skip_to_main}
      </a>

      {/* Top Government Accessibility & Language Ribbon */}
      <div className="bg-[#0b1f3c] text-slate-100 text-xs border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium min-w-0">
            <Landmark className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="tracking-wide truncate">{t.gov_dept}</span>
          </div>

          {/* Accessibility & Language Controls */}
          <div
            className="flex flex-wrap items-center gap-2.5 ml-auto"
            role="region"
            aria-label={t.a11y_controls_label}
          >
            <div className="flex items-center gap-1" role="group" aria-label={t.font_size}>
              <span className="text-slate-300 hidden sm:inline mr-1">{t.font_size}</span>
              <button
                type="button"
                onClick={() => adjustFontScale(-0.05)}
                disabled={fontScale <= 0.85}
                className="min-h-[30px] min-w-[30px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                title={t.a11y_font_decrease}
                aria-label={`${t.a11y_font_decrease} (${scalePct}%)`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={resetFontScale}
                className="min-h-[30px] min-w-[30px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
                title={t.a11y_font_reset}
                aria-label={`${t.a11y_font_reset} (${scalePct}%)`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontScale(0.05)}
                disabled={fontScale >= 1.25}
                className="min-h-[30px] min-w-[30px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[11px] font-bold text-white transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                title={t.a11y_font_increase}
                aria-label={`${t.a11y_font_increase} (${scalePct}%)`}
              >
                A+
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              type="button"
              onClick={toggleContrast}
              aria-pressed={contrast}
              aria-label={t.a11y_contrast_toggle}
              className={`min-h-[30px] px-2.5 py-0.5 border rounded text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                contrast
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
              }`}
            >
              <Contrast className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.contrast}</span>
            </button>

            {/* Bilingual Language Switcher */}
            <div
              className="inline-flex rounded border border-slate-600 p-0.5 bg-slate-900"
              role="group"
              aria-label={t.a11y_lang_switcher}
            >
              <button
                type="button"
                onClick={() => setLang('kn')}
                aria-pressed={lang === 'kn'}
                className={`min-h-[28px] px-2.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'kn'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[28px] px-2.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'en'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main School Identity Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Institutional Emblem */}
            <div
              className="w-16 h-16 rounded-full bg-white border-2 border-amber-500 p-1 flex items-center justify-center shadow-2xs shrink-0"
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#f8c01c" stroke="#b91c1c" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#13325e" strokeWidth="2" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#13325e" strokeWidth="2" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="#13325e" strokeWidth="1.5" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#13325e" strokeWidth="1.5" />
                <line x1="25" y1="25" x2="75" y2="75" stroke="#13325e" strokeWidth="1.5" />
                <line x1="25" y1="75" x2="75" y2="25" stroke="#13325e" strokeWidth="1.5" />
                <path
                  d="M50 24 L54 36 L66 36 L56 44 L60 56 L50 48 L40 56 L44 44 L34 36 L46 36 Z"
                  fill="#b91c1c"
                />
                <circle cx="50" cy="50" r="5" fill="#13325e" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-emerald-900">
                  {pick(SCHOOL_INFO.divisionKn, SCHOOL_INFO.divisionEn)}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="text-slate-600 font-medium tabular-nums">{t.estd_label}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#13325e] leading-snug">
                {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {lang === 'kn' ? SCHOOL_INFO.nameEn : SCHOOL_INFO.nameKn}
              </p>
            </div>
          </div>

          {/* Institutional Metadata & Verification Action */}
          <div className="flex flex-wrap items-center md:flex-col md:items-end gap-2 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold rounded-md text-xs border border-amber-300 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>{t.admin_verify_btn}</span>
              </button>
              <div className="min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                <span className="text-slate-600">{t.udise_label}</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {SCHOOL_INFO.udise}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>{t.medium_badge}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-900 font-semibold tabular-nums">{t.pass_rate_badge}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
