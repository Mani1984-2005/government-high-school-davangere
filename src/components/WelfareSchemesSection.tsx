import React from 'react';
import {
  Utensils,
  BookOpen,
  GraduationCap,
  Laptop,
  Award,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WELFARE_SCHEMES } from '../data/schoolData';
import { Card, SectionHeading } from './ui';

const SCHEME_ICONS: Record<string, React.ReactNode> = {
  'w-01': <Utensils className="w-5 h-5 text-[#13325e]" />,
  'w-02': <BookOpen className="w-5 h-5 text-[#13325e]" />,
  'w-03': <GraduationCap className="w-5 h-5 text-[#13325e]" />,
  'w-04': <Laptop className="w-5 h-5 text-[#13325e]" />,
  'w-05': <Award className="w-5 h-5 text-[#13325e]" />,
  'w-06': <Stethoscope className="w-5 h-5 text-[#13325e]" />,
};

export const WelfareSchemesSection: React.FC = () => {
  const { t, pick } = useApp();

  return (
    <section
      id="schemes"
      aria-labelledby="schemes-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          headingId="schemes-section-heading"
          kickerEn="GOVERNMENT ENTITLEMENTS"
          kickerKn="ವಿದ್ಯಾರ್ಥಿ ಸವಲತ್ತುಗಳು"
          title={t.welfare_heading}
          subtitle={t.welfare_sub}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WELFARE_SCHEMES.map((scheme) => (
            <Card
              key={scheme.id}
              surface="muted"
              padding="md"
              interactive
              className="flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {SCHEME_ICONS[scheme.id] || <Award className="w-5 h-5 text-[#13325e]" />}
                  </div>
                  <span className="text-xs font-semibold text-emerald-900">
                    {pick(scheme.badgeKn, scheme.badgeEn)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#13325e] leading-snug">
                  {pick(scheme.titleKn, scheme.titleEn)}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pick(scheme.descKn, scheme.descEn)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">{t.beneficiaries_label} </span>
                  <span className="font-bold text-slate-800">
                    {pick(scheme.beneficiariesKn, scheme.beneficiariesEn)}
                  </span>
                </div>

                {scheme.officialLink && (
                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t.welfare_external_note}
                    className="font-bold text-[#13325e] hover:text-amber-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>{scheme.portalName || 'Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
