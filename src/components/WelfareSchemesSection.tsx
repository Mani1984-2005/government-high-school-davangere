import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { WELFARE_SCHEMES } from '../data/schoolData';

interface WelfareSchemesSectionProps {
  lang: Language;
}

export const WelfareSchemesSection: React.FC<WelfareSchemesSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  return (
    <section id="schemes" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>GOVERNMENT ENTITLEMENTS</span>
            <span>·</span>
            <span>ವಿದ್ಯಾರ್ಥಿ ಸವಲತ್ತುಗಳು</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.welfare_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.welfare_sub}
          </p>
        </div>

        {/* 6 Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WELFARE_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                    {scheme.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    {lang === 'kn' ? scheme.badgeKn : scheme.badgeEn}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#13325e] leading-snug">
                  {lang === 'kn' ? scheme.titleKn : scheme.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'kn' ? scheme.descKn : scheme.descEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">{t.beneficiaries_label} </span>
                  <span className="font-bold text-slate-800">
                    {lang === 'kn' ? scheme.beneficiariesKn : scheme.beneficiariesEn}
                  </span>
                </div>

                {scheme.officialLink && (
                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#13325e] hover:text-amber-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{scheme.portalName || 'Portal'}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
