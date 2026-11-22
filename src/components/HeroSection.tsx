import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_INFO, MID_DAY_MEAL_WEEK } from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';

interface HeroSectionProps {
  lang: Language;
  onOpenServiceModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onOpenServiceModal }) => {
  const t = UI_STRINGS[lang];

  // Determine today's day of week to highlight real-time mid-day meal
  const todayDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
  const dayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayId = todayDayIndex === 0 ? 'mon' : dayIds[todayDayIndex];
  const todayMeal = MID_DAY_MEAL_WEEK.find((m) => m.dayId === currentDayId) || MID_DAY_MEAL_WEEK[0];

  return (
    <section id="home" className="relative bg-gradient-to-br from-[#102b54] to-[#0c1f3c] text-white overflow-hidden py-8 sm:py-12 border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{t.hero_pill}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {t.hero_title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {t.hero_desc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#notices"
                className="px-4 py-2.5 bg-amber-400 text-slate-950 font-bold rounded text-xs sm:text-sm hover:bg-amber-300 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero_cta_notices}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="#meals"
                className="px-4 py-2.5 bg-slate-800/80 text-white font-semibold rounded text-xs sm:text-sm border border-slate-600 hover:bg-slate-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero_cta_schemes}</span>
              </a>

              <a
                href="#progress"
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>🛡️ {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರಗತಿ (SATS)' : 'Student Progress (SATS)'}</span>
              </a>

              <button
                onClick={onOpenServiceModal}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                <span>{t.hero_cta_admission}</span>
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/80 max-w-lg text-center sm:text-left">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">540+</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {lang === 'kn' ? 'ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Enrolled Students'}
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">98.4%</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {lang === 'kn' ? 'SSLC ಫಲಿತಾಂಶ' : 'SSLC Pass Rate'}
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">18</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {lang === 'kn' ? 'ನುರಿತ ಶಿಕ್ಷಕರು' : 'Dedicated Faculty'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: School Campus Photo & Quick Facts Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Campus Image Frame */}
            <div className="relative rounded-lg overflow-hidden border-2 border-slate-600 shadow-xl group">
              <img
                src={SCHOOL_MEDIA.campus}
                alt="Government High School Davangere Campus"
                className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-semibold text-white drop-shadow-md">
                  {lang === 'kn'
                    ? 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ವಿದ್ಯಾನಗರ ಮುಖ್ಯ ರಸ್ತೆ, ದಾವಣಗೆರೆ'
                    : 'GHS Campus, Vidyanagar Main Road, Davangere'}
                </span>
              </div>
            </div>

            {/* Key Information & Mid-Day Meal Card */}
            <div className="bg-white text-slate-900 rounded-lg p-4 shadow-lg border-t-4 border-amber-400">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-[#13325e] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>{t.hero_quick_title}</span>
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  {SCHOOL_INFO.schoolCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">{t.hero_stat_classes}</span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_classes_val}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">{t.hero_stat_medium}</span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_medium_val}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">{t.hero_stat_timing}</span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_timing_val}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">{t.hero_stat_board}</span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_board_val}</span>
                </div>
              </div>

              {/* Dynamic Today's Mid-day Meal preview */}
              <div className="bg-amber-50/80 border border-amber-200 rounded p-2.5 text-xs text-amber-950">
                <div className="flex items-center justify-between mb-1">
                  <strong className="font-bold text-amber-900 flex items-center gap-1">
                    <span>🍲</span>
                    <span>
                      {todayDayIndex === 0
                        ? t.sunday_holiday
                        : t.hero_today_meal_title}
                    </span>
                  </strong>
                  <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-[10px]">
                    {todayDayIndex === 0
                      ? lang === 'kn' ? 'ಸೋಮವಾರದ ಮೆನು' : 'Monday Menu'
                      : lang === 'kn' ? todayMeal.dayKn : todayMeal.dayEn}
                  </span>
                </div>
                <p className="font-medium text-slate-800 line-clamp-2">
                  {lang === 'kn' ? todayMeal.mainMenuKn : todayMeal.mainMenuEn} + {lang === 'kn' ? todayMeal.supplementKn : todayMeal.supplementEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
