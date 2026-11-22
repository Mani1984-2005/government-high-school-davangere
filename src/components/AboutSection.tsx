import React from 'react';
import { Building2, Compass, Target, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO, SCHOOL_FACILITIES } from '../data/schoolData';
import { SCHOOL_MEDIA } from '../assets/media';
import { Alert, Badge, Card, SafeImage, SectionHeading } from './ui';

export const AboutSection: React.FC = () => {
  const { t, pick } = useApp();

  const profileRows = [
    { label: t.about_lbl_udise, value: SCHOOL_INFO.udise, mono: true },
    { label: t.about_lbl_code, value: SCHOOL_INFO.schoolCode, mono: true },
    { label: t.about_lbl_estd, value: SCHOOL_INFO.estd, mono: true },
    { label: t.about_lbl_grades, value: pick(SCHOOL_INFO.gradesKn, SCHOOL_INFO.gradesEn) },
    { label: t.about_lbl_medium, value: pick(SCHOOL_INFO.mediumKn, SCHOOL_INFO.mediumEn) },
    { label: t.about_lbl_division, value: pick(SCHOOL_INFO.divisionKn, SCHOOL_INFO.divisionEn) },
    { label: t.about_lbl_headmaster, value: pick(SCHOOL_INFO.headmasterKn, SCHOOL_INFO.headmasterEn) },
    { label: t.about_lbl_students, value: String(SCHOOL_INFO.studentCount), mono: true },
    { label: t.about_lbl_staff, value: t.about_staff_note },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <SectionHeading
          headingId="about-section-heading"
          kickerEn={t.about_kicker_en}
          kickerKn={t.about_kicker_kn}
          title={t.about_heading}
          subtitle={t.about_sub}
          action={
            <Badge tone="warning" icon={<Info className="w-3.5 h-3.5" />}>
              {t.about_pending_badge}
            </Badge>
          }
        />

        {/* Heritage & Institutional Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <Card surface="muted" padding="lg" className="space-y-4">
              <div className="flex items-center gap-2 text-[#13325e]">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                <h3 className="text-lg font-bold">{t.about_history_title}</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{t.about_history_p1}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{t.about_history_p2}</p>
            </Card>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card surface="white" padding="md" className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#13325e]">
                  <Compass className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <h3 className="text-base font-bold">{t.about_vision_title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {t.about_vision_desc}
                </p>
              </Card>

              <Card surface="white" padding="md" className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#13325e]">
                  <Target className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
                  <h3 className="text-base font-bold">{t.about_mission_title}</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {[t.about_mission_1, t.about_mission_2, t.about_mission_3].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Right Column: Campus Visual + Institutional Profile Definition List */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={SCHOOL_MEDIA.campus}
                alt={pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
                fallbackLabel={pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
                className="w-full h-48 sm:h-56 object-cover"
              />
            </div>

            <Card surface="white" padding="md" className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-[#13325e] pb-2 border-b border-slate-200">
                  {t.about_profile_title}
                </h3>
                <dl className="divide-y divide-slate-100 text-xs">
                  {profileRows.map((row) => (
                    <div
                      key={row.label}
                      className="py-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                    >
                      <dt className="text-slate-500 font-medium">{row.label}</dt>
                      <dd
                        className={`font-semibold text-slate-900 sm:text-right ${
                          row.mono ? 'font-mono tabular-nums' : ''
                        }`}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Card>
          </div>
        </div>

        {/* Pending Approval Transparency Note */}
        <Alert tone="warning">{t.about_pending_note}</Alert>

        {/* Campus Infrastructure & Facilities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#13325e]">{t.about_facilities_title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHOOL_FACILITIES.map((facility) => (
              <Card key={facility.id} surface="muted" padding="md" interactive className="space-y-2.5">
                {(facility.metricKn || facility.metricEn) && (
                  <p className="text-xs font-semibold text-emerald-900">
                    {pick(facility.metricKn, facility.metricEn)}
                  </p>
                )}
                <h4 className="text-sm sm:text-base font-bold text-[#13325e] leading-snug">
                  {pick(facility.titleKn, facility.titleEn)}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pick(facility.descKn, facility.descEn)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
