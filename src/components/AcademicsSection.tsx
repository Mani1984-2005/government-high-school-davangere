import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { BELL_SCHEDULE, SSLC_STUDY_MATERIALS } from '../data/schoolData';

interface AcademicsSectionProps {
  lang: Language;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];
  const [selectedMaterial, setSelectedMaterial] = useState<typeof SSLC_STUDY_MATERIALS[0] | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMaterial) {
        setSelectedMaterial(null);
      }
    };
    if (selectedMaterial) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMaterial]);

  return (
    <section id="academics" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>KSEAB CURRICULUM · SSLC EXCELLENCE</span>
            <span>·</span>
            <span>ಪಠ್ಯಕ್ರಮ & ಪರೀಕ್ಷಾ ವಿಭಾಗ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.academics_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.academics_sub}
          </p>
        </div>

        {/* 2-Column Grid: Bell Schedule & SSLC Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Bell Schedule Table */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#13325e] flex items-center gap-2">
                <span className="text-amber-500">⏰</span>
                <span>{t.bell_title}</span>
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                09:45 AM - 04:30 PM
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {BELL_SCHEDULE.map((slot, index) => {
                const isLunch = slot.type === 'lunch';
                const isPrayer = slot.type === 'prayer';
                const isActivity = slot.type === 'activity';

                return (
                  <div
                    key={index}
                    className={`p-2.5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition-colors ${
                      isLunch
                        ? 'bg-amber-50/80 border-amber-300 font-semibold'
                        : isPrayer
                        ? 'bg-blue-50/60 border-blue-200'
                        : isActivity
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {lang === 'kn' ? slot.slotKn : slot.slotEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-600">
                      <span className="font-mono font-bold text-[#13325e]">{slot.time}</span>
                      <span className="text-[10px] text-slate-500">
                        ({lang === 'kn' ? slot.durationKn : slot.durationEn})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SSLC Excellence Desk & Material Downloads */}
          <div className="lg:col-span-6 space-y-6">
            {/* Science Laboratory Spotlight */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative h-44 sm:h-52">
                <img
                  src="/src/assets/images/school_science_lab_1792079078684.jpg"
                  alt="High School Science Laboratory"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-slate-950 rounded uppercase tracking-wider mb-1 inline-block">
                      {lang === 'kn' ? 'ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆ' : 'Hands-on Science'}
                    </span>
                    <h4 className="text-sm font-bold">
                      {lang === 'kn'
                        ? 'ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ಪ್ರಯೋಗಾಲಯ (DSERT ಮಾನ್ಯತೆ)'
                        : 'Fully Equipped Science & Mathematics Laboratory'}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
                    {t.sslc_desk_title}
                  </h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    SSLC 98.4%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.sslc_desk_desc}
                </p>

                {/* Material list cards */}
                <div className="space-y-2 pt-1">
                  {SSLC_STUDY_MATERIALS.map((mat, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {lang === 'kn' ? mat.titleKn : mat.titleEn}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{lang === 'kn' ? mat.subjectKn : mat.subjectEn}</span>
                          <span>·</span>
                          <span>{lang === 'kn' ? mat.mediumKn : mat.mediumEn}</span>
                          <span>·</span>
                          <span className="font-mono">{mat.fileSize}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedMaterial(mat)}
                        className="px-2.5 py-1 bg-[#13325e] text-white text-[11px] font-bold rounded hover:bg-[#0c1f3c] transition-colors shrink-0 cursor-pointer"
                      >
                        {lang === 'kn' ? 'ವೀಕ್ಷಿಸಿ' : 'View'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Co-Curricular Clubs Strip */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-base font-bold text-[#13325e] mb-4 flex items-center gap-2">
            <span>🏅</span>
            <span>{t.clubs_title}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block font-bold text-emerald-800 mb-1">
                {lang === 'kn' ? 'ಭಾರತ್ ಸ್ಕೌಟ್ಸ್ ಮತ್ತು ಗೈಡ್ಸ್' : 'Bharat Scouts & Guides'}
              </strong>
              <p>{t.club_1}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block font-bold text-emerald-800 mb-1">
                {lang === 'kn' ? 'ಇಕೋ ಕ್ಲಬ್ (Eco Club)' : 'Eco Club'}
              </strong>
              <p>{t.club_2}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block font-bold text-emerald-800 mb-1">
                {lang === 'kn' ? 'ವಿಜ್ಞಾನ ಸಂಘ & ಗಣಿತ ವೇದಿಕೆ' : 'Science & Math Forum'}
              </strong>
              <p>{t.club_3}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <strong className="block font-bold text-emerald-800 mb-1">
                {lang === 'kn' ? 'ಪ್ರತಿಭಾ ಕಾರಂಜಿ' : 'Prathibha Karanji'}
              </strong>
              <p>{t.club_4}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Material Quick Modal */}
      {selectedMaterial && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border-t-4 border-[#13325e] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                SSLC STUDY CAPSULE · 2025-26
              </span>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-[#13325e]">
              {lang === 'kn' ? selectedMaterial.titleKn : selectedMaterial.titleEn}
            </h3>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div><strong>{lang === 'kn' ? 'ವಿಷಯ:' : 'Subject:'}</strong> {lang === 'kn' ? selectedMaterial.subjectKn : selectedMaterial.subjectEn}</div>
              <div><strong>{lang === 'kn' ? 'ಮಾಧ್ಯಮ:' : 'Medium:'}</strong> {lang === 'kn' ? selectedMaterial.mediumKn : selectedMaterial.mediumEn}</div>
              <div><strong>{lang === 'kn' ? 'ಕಡತದ ಗಾತ್ರ:' : 'File Size:'}</strong> {selectedMaterial.fileSize}</div>
              <p className="pt-1 text-slate-600">
                {lang === 'kn'
                  ? 'ಈ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಯನ್ನು ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿಯ (KSEAB) ನೂತನ ಮಾದರಿ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಮತ್ತು ನೀಲನಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ನಮ್ಮ ನುರಿತ ಶಿಕ್ಷಕರು ರೂಪಿಸಿದ್ದಾರೆ.'
                  : 'Structured according to official KSEAB exam blueprint and question bank by subject expert senior faculty of GHS Davangere.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#13325e] text-white text-xs font-bold rounded hover:bg-[#0c1f3c] transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ಮುದ್ರಿಸಿ / PDF ಉಳಿಸಿ' : 'Print / Save PDF'}
              </button>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-3 py-2 bg-slate-200 text-slate-800 text-xs font-semibold rounded hover:bg-slate-300 transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
