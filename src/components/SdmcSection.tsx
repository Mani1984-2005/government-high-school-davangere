import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SDMC_MEMBERS } from '../data/schoolData';

interface SdmcSectionProps {
  lang: Language;
}

export const SdmcSection: React.FC<SdmcSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  return (
    <section id="sdmc" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>PUBLIC ACCOUNTABILITY · SOCIAL AUDIT</span>
            <span>·</span>
            <span>ಶಾಲಾ ಅಭಿವೃದ್ಧಿ ಸಮಿತಿ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.sdmc_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.sdmc_sub}
          </p>
        </div>

        {/* Mandate & Governance Banner */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-5 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#13325e] text-white text-[11px] font-bold rounded">
              {t.sdmc_badge_text}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಶಿಕ್ಷಣ ಕಾಯಿದೆ 1983' : 'Karnataka Education Act 1983'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {t.sdmc_mandate}
          </p>
        </div>

        {/* SDMC Member Roster Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
              {lang === 'kn' ? 'ಪ್ರಸ್ತುತ SDMC ಸದಸ್ಯರ ವಿವರ (2024-2027 ರ ಅವಧಿ)' : 'Current SDMC Executive Roster (2024-2027)'}
            </h3>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded">
              {lang === 'kn' ? 'ಶೇ.50 ಮಹಿಳಾ ಪ್ರಾತಿನಿಧ್ಯ' : '50% Women Representation'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/60 text-[#13325e] border-b border-slate-200 font-bold">
                  <th className="py-3 px-4">{t.col_name}</th>
                  <th className="py-3 px-4">{t.col_designation}</th>
                  <th className="py-3 px-4">{t.col_role}</th>
                  <th className="py-3 px-4">{t.col_area}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {SDMC_MEMBERS.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#13325e]">
                      {lang === 'kn' ? member.nameKn : member.nameEn}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {lang === 'kn' ? member.designationKn : member.designationEn}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {lang === 'kn' ? member.roleKn : member.roleEn}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {member.wardOrRepresent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Resolutions & Social Audit */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-[#13325e] mb-3">
            {t.recent_resolutions_title}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-[#13325e] font-bold">1.</span>
              <span>{t.res_1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#13325e] font-bold">2.</span>
              <span>{t.res_2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#13325e] font-bold">3.</span>
              <span>{t.res_3}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
