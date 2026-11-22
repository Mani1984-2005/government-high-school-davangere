import React from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MID_DAY_MEAL_WEEK } from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';
import { Alert, Badge, Card, SafeImage, SectionHeading } from './ui';

export const MidDayMealSection: React.FC = () => {
  const { lang, t, pick } = useApp();

  const todayDayIndex = new Date().getDay();
  const dayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayId = dayIds[todayDayIndex];

  return (
    <section
      id="meals"
      aria-labelledby="meals-section-heading"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <SectionHeading
          headingId="meals-section-heading"
          kickerEn="PM POSHAN · AKSHARA DASOHA"
          kickerKn="ಬಿಸಿಯೂಟ ಯೋಜನೆ"
          title={t.mdm_heading}
          subtitle={t.mdm_sub}
        />

        {todayDayIndex === 0 && (
          <Alert tone="warning">
            {lang === 'kn'
              ? 'ಗಮನಿಸಿ: ಇಂದು ಭಾನುವಾರ ಶಾಲಾ ಸಾಪ್ತಾಹಿಕ ರಜೆ (Sunday School Holiday). ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗಿನ ನಿಯಮಿತ ಬಿಸಿಯೂಟ ಮೆನುವನ್ನು ಕೆಳಗೆ ವೀಕ್ಷಿಸಬಹುದು.'
              : 'Notice: Today is Sunday (Weekly School Holiday). Regular hot mid-day meal service resumes on Monday morning as per the schedule below.'}
          </Alert>
        )}

        {/* Feature Overview Card */}
        <Card surface="white" padding="md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative rounded-lg overflow-hidden border border-slate-200">
              <SafeImage
                src={SCHOOL_MEDIA.midDayMeal}
                alt="Akshara Dasoha Mid-Day Meal at Government High School Davangere"
                className="w-full h-64 sm:h-72 object-cover"
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">
                  {lang === 'kn' ? '100% ಉಚಿತ & ಪೌಷ್ಟಿಕ ಆಹಾರ' : '100% Free & Hygienic Food'}
                </Badge>
                <span className="text-xs text-slate-600 font-medium">{t.mdm_serving_badge}</span>
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-center">
                  <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">
                    720 kcal
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {lang === 'kn' ? 'ದೈನಂದಿನ ಶಕ್ತಿ' : 'Daily Energy'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-center">
                  <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">
                    22.5 g
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {lang === 'kn' ? 'ಪ್ರೋಟೀನ್ ಅಂಶ' : 'Protein Content'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-center">
                  <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">
                    150 ml
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {lang === 'kn' ? 'ಕ್ಷೀರಭಾಗ್ಯ ಹಾಲು' : 'Fortified Milk'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-center">
                  <span className="block text-base sm:text-lg font-bold text-[#13325e] font-mono tabular-nums">
                    100%
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {lang === 'kn' ? 'RO ಶುದ್ಧ ನೀರು' : 'RO Purified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 6-Day Weekly Menu Table */}
        <Card surface="white" padding="none" className="overflow-hidden">
          <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#13325e] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>{t.mdm_table_title}</span>
            </h3>
            <span className="text-xs text-slate-600 font-medium">
              {lang === 'kn' ? 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ವೇಳಾಪಟ್ಟಿ' : 'Monday through Saturday Schedule'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[#13325e] border-b border-slate-200 font-bold">
                  <th scope="col" className="py-3 px-4 w-36">{t.th_day}</th>
                  <th scope="col" className="py-3 px-4">{t.th_meal}</th>
                  <th scope="col" className="py-3 px-4">{t.th_supplement}</th>
                  <th scope="col" className="py-3 px-4 font-mono tabular-nums w-28">{t.th_cal_pro}</th>
                  <th scope="col" className="py-3 px-4 hidden md:table-cell">{t.th_notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MID_DAY_MEAL_WEEK.map((row) => {
                  const isCurrentDay = row.dayId === currentDayId;
                  return (
                    <tr
                      key={row.dayId}
                      className={isCurrentDay ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/60'}
                    >
                      <td className="py-3 px-4 font-bold text-[#13325e] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{pick(row.dayKn, row.dayEn)}</span>
                          {isCurrentDay && (
                            <Badge tone="warning">{lang === 'kn' ? 'ಇಂದು' : 'Today'}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-800">{pick(row.mainMenuKn, row.mainMenuEn)}</td>
                      <td className="py-3 px-4 text-emerald-900 font-medium">
                        {pick(row.supplementKn, row.supplementEn)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        <div>{row.calories}</div>
                        <div className="text-[11px] text-slate-500">{row.protein}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 hidden md:table-cell">
                        {pick(row.specialNoteKn, row.specialNoteEn)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Food Safety & Hygiene Protocols */}
        <Card surface="white" padding="md">
          <h4 className="text-sm font-bold text-[#13325e] uppercase tracking-wider mb-3">
            {t.mdm_standards_title}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
            {[t.mdm_std_1, t.mdm_std_2, t.mdm_std_3, t.mdm_std_4].map((std, i) => (
              <div key={i} className="flex gap-2.5 items-start leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{std}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
