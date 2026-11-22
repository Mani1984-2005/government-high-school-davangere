import React from 'react';
import {
  ArrowRight,
  GraduationCap,
  Users,
  FileText,
  Utensils,
  Info,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';
import { SCHOOL_INFO, MID_DAY_MEAL_WEEK } from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';
import { Button, SafeImage } from './ui';

interface HeroSectionProps {
  onOpenServiceModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenServiceModal }) => {
  const { lang, t, pick } = useApp();
  const { navigate, navigateToHomeSection } = usePortal();

  const todayDayIndex = new Date().getDay();
  const dayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayId = todayDayIndex === 0 ? 'mon' : dayIds[todayDayIndex];
  const todayMeal =
    MID_DAY_MEAL_WEEK.find((m) => m.dayId === currentDayId) || MID_DAY_MEAL_WEEK[0];

  return (
    <section
      id="home"
      aria-labelledby="hero-main-heading"
      className="bg-[#102b54] text-white py-10 sm:py-14 border-b-4 border-amber-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Official School Identity, Mission & Portal Entry */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Quiet unboxed kicker metadata (zero-pill rule) */}
              <p className="text-xs font-semibold text-amber-300 tracking-wide flex flex-wrap items-center gap-2">
                <span>{t.hero_pill}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">UDISE {SCHOOL_INFO.udise}</span>
              </p>

              {/* Bilingual School Identity + Mission Title */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold text-slate-100">
                  {SCHOOL_INFO.nameKn}{' '}
                  <span className="text-slate-400 mx-1" aria-hidden="true">
                    /
                  </span>{' '}
                  {SCHOOL_INFO.nameEn}
                </p>
                <h2
                  id="hero-main-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
                >
                  {t.hero_title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {t.hero_desc}
              </p>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigateToHomeSection('about')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.hero_explore_school}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/student-portal')}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  {t.hero_btn_student_portal}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/staff-portal')}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  {t.hero_btn_staff_portal}
                </Button>

                <button
                  type="button"
                  onClick={onOpenServiceModal}
                  className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white border border-emerald-400/50 hover:border-emerald-300 rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>{t.btn_online_service}</span>
                </button>
              </div>
            </div>

            {/* Institutional Draft Highlights Strip (Preserving exact verified values) */}
            <div className="pt-5 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums">
                  {SCHOOL_INFO.estd}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {pick('ಸ್ಥಾಪಿತ ವರ್ಷ', 'Year Established')}
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums">
                  {SCHOOL_INFO.studentCount}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {pick('ವಿದ್ಯಾರ್ಥಿಗಳು (ಕರಡು)', 'Students (Draft)')}
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums">
                  {SCHOOL_INFO.passRate}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {pick('SSLC ಫಲಿತಾಂಶ (ಕರಡು)', 'SSLC Result (Draft)')}
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums">
                  {SCHOOL_INFO.staffCount}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {pick('ಮಂಜೂರಾದ ಹುದ್ದೆ (ಕರಡು)', 'Sanctioned Staff')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Photograph & Quick Institutional Summary Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden border border-slate-600 shadow-lg bg-slate-900">
              <SafeImage
                src={SCHOOL_MEDIA.campus}
                alt={pick(
                  'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ದಾವಣಗೆರೆ ಶಾಲಾ ಆವರಣ',
                  'Government High School Davangere Campus'
                )}
                loading="eager"
                className="w-full h-52 sm:h-60 object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent p-3.5 flex items-center gap-2 text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold">
                  {pick(SCHOOL_INFO.addressKn, SCHOOL_INFO.addressEn)}
                </span>
              </div>
            </div>

            <div className="bg-white text-slate-900 rounded-lg p-4 sm:p-5 border border-slate-200 flex-1 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-[#13325e] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>{t.hero_quick_title}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                  {SCHOOL_INFO.schoolCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">
                    {t.hero_stat_classes}
                  </span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_classes_val}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">
                    {t.hero_stat_medium}
                  </span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_medium_val}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">
                    {t.hero_stat_timing}
                  </span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_timing_val}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="block text-[11px] text-slate-500 font-medium">
                    {t.hero_stat_board}
                  </span>
                  <span className="font-bold text-[#13325e]">{t.hero_stat_board_val}</span>
                </div>
              </div>

              {/* Dynamic Today's Akshara Dasoha Preview */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-950 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="font-bold text-amber-900 inline-flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                    <span>
                      {todayDayIndex === 0 ? t.sunday_holiday : t.hero_today_meal_title}
                    </span>
                  </strong>
                  <span className="font-semibold text-amber-900">
                    {todayDayIndex === 0
                      ? lang === 'kn'
                        ? 'ಸೋಮವಾರದ ಮೆನು'
                        : 'Monday Menu'
                      : pick(todayMeal.dayKn, todayMeal.dayEn)}
                  </span>
                </div>
                <p className="font-medium text-slate-800 leading-snug">
                  {pick(todayMeal.mainMenuKn, todayMeal.mainMenuEn)} +{' '}
                  {pick(todayMeal.supplementKn, todayMeal.supplementEn)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
