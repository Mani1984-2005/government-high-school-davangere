import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { FACULTY_MEMBERS } from '../data/schoolData';

interface FacultySectionProps {
  lang: Language;
}

export const FacultySection: React.FC<FacultySectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  return (
    <section id="faculty" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>DEDICATED EDUCATORS</span>
            <span>·</span>
            <span>ಬೋಧಕ ವೃಂದ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.faculty_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.faculty_sub}
          </p>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACULTY_MEMBERS.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#13325e]">
                      {lang === 'kn' ? fac.nameKn : fac.nameEn}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800">
                      {lang === 'kn' ? fac.designationKn : fac.designationEn}
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                    {(lang === 'kn' ? fac.nameKn : fac.nameEn).slice(0, 2)}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-800 font-medium">
                    <span className="text-slate-500">{lang === 'kn' ? 'ಬೋಧನಾ ವಿಷಯ:' : 'Subject:'} </span>
                    <span>{lang === 'kn' ? fac.subjectKn : fac.subjectEn}</span>
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-500">{t.qualification_label} </span>
                    <span className="font-mono font-medium">{fac.qualification}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono font-bold text-[#13325e]">{fac.expYears}+ {t.years_exp}</span>
                <span className="text-emerald-700 font-medium">{lang === 'kn' ? 'ಸರ್ಕಾರಿ ಸೇವೆ' : 'Govt Service'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
