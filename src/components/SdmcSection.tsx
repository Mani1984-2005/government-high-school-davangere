import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SDMC_MEMBERS } from '../data/schoolData';
import { Alert, Badge, Card, SectionHeading } from './ui';

export const SdmcSection: React.FC = () => {
  const { lang, t, pick } = useApp();

  return (
    <section
      id="sdmc"
      aria-labelledby="sdmc-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <SectionHeading
          headingId="sdmc-section-heading"
          kickerEn="PUBLIC ACCOUNTABILITY · SOCIAL AUDIT"
          kickerKn="ಶಾಲಾ ಅಭಿವೃದ್ಧಿ ಸಮಿತಿ"
          title={t.sdmc_heading}
          subtitle={t.sdmc_sub}
          action={
            <Badge tone="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {lang === 'kn' ? 'ಶೇ.50 ಮಹಿಳಾ ಪ್ರಾತಿನಿಧ್ಯ' : '50% Women Representation'}
            </Badge>
          }
        />

        {/* Mandate & Governance Banner */}
        <Alert tone="info" title={`${t.sdmc_badge_text} · ${pick('ಕರ್ನಾಟಕ ಶಿಕ್ಷಣ ಕಾಯಿದೆ 1983', 'Karnataka Education Act 1983')}`}>
          {t.sdmc_mandate}
        </Alert>

        {/* SDMC Member Roster Table */}
        <Card surface="white" padding="none" className="overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
              {lang === 'kn'
                ? 'ಪ್ರಸ್ತುತ SDMC ಸದಸ್ಯರ ವಿವರ (2024-2027 ರ ಅವಧಿ · ಕರಡು ಪಟ್ಟಿ)'
                : 'Current SDMC Executive Roster (2024–2027 Term · Draft)'}
            </h3>
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              {SDMC_MEMBERS.length} {pick('ಸದಸ್ಯರು', 'Members')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-[#13325e] border-b border-slate-200 font-bold">
                  <th scope="col" className="py-3 px-4">{t.col_name}</th>
                  <th scope="col" className="py-3 px-4">{t.col_designation}</th>
                  <th scope="col" className="py-3 px-4">{t.col_role}</th>
                  <th scope="col" className="py-3 px-4">{t.col_area}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {SDMC_MEMBERS.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#13325e]">
                      {pick(member.nameKn, member.nameEn)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-900">
                      {pick(member.designationKn, member.designationEn)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {pick(member.roleKn, member.roleEn)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{member.wardOrRepresent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Resolutions & Social Audit */}
        <Card surface="muted" padding="md" className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
            {t.recent_resolutions_title}
          </h3>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-700 list-decimal pl-5">
            <li>{t.res_1}</li>
            <li>{t.res_2}</li>
            <li>{t.res_3}</li>
          </ol>
        </Card>
      </div>
    </section>
  );
};
