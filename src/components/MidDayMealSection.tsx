import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { MID_DAY_MEAL_WEEK } from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';

interface MidDayMealSectionProps {
  lang: Language;
}

export const MidDayMealSection: React.FC<MidDayMealSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  // Current day index
  const todayDayIndex = new Date().getDay();
  const dayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayId = dayIds[todayDayIndex];

  return (
    <section id="meals" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>PM POSHAN · AKSHARA DASOHA</span>
            <span>·</span>
            <span>ಬಿಸಿಯೂಟ ಯೋಜನೆ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.mdm_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.mdm_sub}
          </p>
        </div>

        {todayDayIndex === 0 && (
          <div className="mb-6 p-3 bg-amber-100 border border-amber-300 text-amber-950 rounded-lg text-xs font-semibold flex items-center gap-2">
            <span>🏖️</span>
            <span>
              {lang === 'kn'
                ? 'ಗಮನಿಸಿ: ಇಂದು ಭಾನುವಾರ ಶಾಲಾ ಸಾಪ್ತಾಹಿಕ ರಜೆ (Sunday School Holiday). ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗಿನ ನಿಯಮಿತ ಬಿಸಿಯೂಟ ಮೆನುವನ್ನು ಕೆಳಗೆ ವೀಕ್ಷಿಸಬಹುದು.'
                : 'Notice: Today is Sunday (Weekly School Holiday). Regular hot mid-day meal service resumes on Monday morning as per the schedule below.'}
            </span>
          </div>
        )}

        {/* Hero Visual Card with High-Res Meal Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div className="lg:col-span-5 relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={SCHOOL_MEDIA.midDayMeal}
              alt="Akshara Dasoha Mid-Day Meal at Government High School Davangere"
              className="w-full h-64 sm:h-72 object-cover"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent p-3 text-white text-xs">
              <span className="font-semibold">
                {lang === 'kn'
                  ? 'ಶುಚಿ-ರುಚಿಯಾದ ಅನ್ನ, ಬೇಳೆ ತರಕಾರಿ ಸಾಂಬಾರ್, ಕ್ಷೀರಭಾಗ್ಯ ಹಾಲು ಮತ್ತು ಬಾಳೆಹಣ್ಣು'
                  : 'Freshly prepared rice, vegetable sambar, milk & fruits served to students'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded">
                {lang === 'kn' ? '100% ಉಚಿತ & ಪೌಷ್ಟಿಕ ಆಹಾರ' : '100% Free & Hygienic Food'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'kn' ? 'ಪ್ರತಿದಿನ 540 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ' : 'Daily for 540 Students'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#13325e] leading-snug">
              {lang === 'kn'
                ? 'ಮಕ್ಕಳ ದೈಹಿಕ ಬೆಳವಣಿಗೆ ಮತ್ತು ತೀಕ್ಷ್ಣ ಗ್ರಹಿಕೆಗೆ ಅಗತ್ಯವಾದ ಸಮತೋಲಿತ ಪೌಷ್ಟಿಕಾಂಶ'
                : 'Balanced Nutrition Vital for Physical Growth & Academic Excellence'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಕ್ಷರ ದಾಸೋಹ ಯೋಜನೆಯಡಿ ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ಪ್ರತಿದಿನ ನುರಿತ ಮುಖ್ಯ ಅಡುಗೆಯವರು ಹಾಗೂ ಸಹಾಯಕಿಯರು ಶುಚಿ-ರುಚಿಯಾದ ಊಟ ಸಿದ್ಧಪಡಿಸುತ್ತಾರೆ. ವಾರದಲ್ಲಿ 3 ದಿನ ಕ್ಷೀರಭಾಗ್ಯ ಬಿಸಿ ಹಾಲು ಮತ್ತು 2 ದಿನ ಮೊಟ್ಟೆ ಅಥವಾ ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಶೇಂಗಾ ಚಿಕ್ಕಿ ವಿತರಿಸಲಾಗುತ್ತಿದೆ.'
                : 'Under Karnataka’s landmark Akshara Dasoha initiative, trained culinary staff prepare balanced meals adhering strictly to food safety guidelines. High school students receive 700+ kcal calories, 20g protein, and tri-weekly milk rations.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
                <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">720 kcal</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'kn' ? 'ದೈನಂದಿನ ಶಕ್ತಿ' : 'Daily Energy'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
                <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">22.5 g</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'kn' ? 'ಪ್ರೋಟೀನ್ ಅಂಶ' : 'Protein Content'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
                <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">150 ml</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'kn' ? 'ಕ್ಷೀರಭಾಗ್ಯ ಹಾಲು' : 'Fortified Milk'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-center">
                <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">100%</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'kn' ? 'RO ಶುದ್ಧ ನೀರು' : 'RO Purified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Day Weekly Menu Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#13325e] flex items-center gap-2">
              <span>📋</span>
              <span>{t.mdm_table_title}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'kn' ? 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ವೇಳಾಪಟ್ಟಿ' : 'Monday through Saturday Schedule'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[#13325e] border-b border-slate-200 font-bold">
                  <th className="py-3 px-4 w-32">{t.th_day}</th>
                  <th className="py-3 px-4">{t.th_meal}</th>
                  <th className="py-3 px-4">{t.th_supplement}</th>
                  <th className="py-3 px-4 font-mono tabular-nums w-28">{t.th_cal_pro}</th>
                  <th className="py-3 px-4 hidden md:table-cell">{t.th_notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MID_DAY_MEAL_WEEK.map((row) => {
                  const isCurrentDay = row.dayId === currentDayId;
                  return (
                    <tr
                      key={row.dayId}
                      className={isCurrentDay ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-3 px-4 font-bold text-[#13325e] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{lang === 'kn' ? row.dayKn : row.dayEn}</span>
                          {isCurrentDay && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded">
                              {lang === 'kn' ? 'ಇಂದು' : 'Today'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {lang === 'kn' ? row.mainMenuKn : row.mainMenuEn}
                      </td>
                      <td className="py-3 px-4 text-emerald-800 font-medium">
                        {lang === 'kn' ? row.supplementKn : row.supplementEn}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                        <div>{row.calories}</div>
                        <div className="text-[11px] text-slate-500">{row.protein}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">
                        {lang === 'kn' ? row.specialNoteKn : row.specialNoteEn}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Food Safety & Hygiene Protocols */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h4 className="text-sm font-bold text-[#13325e] uppercase tracking-wider mb-3">
            {t.mdm_standards_title}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="flex gap-2.5 items-start">
              <span className="text-emerald-700 font-bold text-base leading-none">✓</span>
              <span>{t.mdm_std_1}</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-emerald-700 font-bold text-base leading-none">✓</span>
              <span>{t.mdm_std_2}</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-emerald-700 font-bold text-base leading-none">✓</span>
              <span>{t.mdm_std_3}</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-emerald-700 font-bold text-base leading-none">✓</span>
              <span>{t.mdm_std_4}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
