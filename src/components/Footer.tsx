import React from 'react';
import { ExternalLink, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';
import { SCHOOL_INFO } from '../data/schoolData';

interface FooterProps {
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal }) => {
  const { t, pick } = useApp();
  const { navigate, navigateToHomeSection } = usePortal();

  const govtPortals = [
    {
      href: 'https://schooleducation.karnataka.gov.in',
      labelKn: 'ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ ಕರ್ನಾಟಕ',
      labelEn: 'Dept. of School Education, Karnataka',
    },
    {
      href: 'https://kseab.karnataka.gov.in',
      labelKn: 'KSEAB (SSLC ಪರೀಕ್ಷಾ ಮಂಡಳಿ)',
      labelEn: 'KSEAB (SSLC Examination Board)',
    },
    {
      href: 'https://ssp.postmatric.karnataka.gov.in',
      labelKn: 'ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP)',
      labelEn: 'State Scholarship Portal (SSP)',
    },
    {
      href: 'https://sts.karnataka.gov.in',
      labelKn: 'ವಿದ್ಯಾರ್ಥಿ ಟ್ರ್ಯಾಕಿಂಗ್ ವ್ಯವಸ್ಥೆ (SATS)',
      labelEn: 'Student Achievement Tracking (SATS)',
    },
  ];

  const importantLinks = [
    { label: t.nav_about, action: () => navigateToHomeSection('about') },
    { label: t.nav_academics, action: () => navigateToHomeSection('academics') },
    { label: t.nav_notices, action: () => navigateToHomeSection('notices') },
    { label: t.nav_faq, action: () => navigateToHomeSection('faq') },
    { label: t.nav_schemes, action: () => navigateToHomeSection('schemes') },
    { label: t.nav_contact, action: () => navigateToHomeSection('contact') },
  ];

  return (
    <footer className="bg-[#0b1f3c] text-slate-300 text-xs border-t-4 border-amber-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: School Identity & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">{t.footer_desc}</p>
            <div className="text-xs font-mono text-slate-300 space-y-0.5 tabular-nums">
              <div>UDISE: {SCHOOL_INFO.udise}</div>
              <div>
                {pick('ಶಾಲಾ ಕೋಡ್:', 'School Code:')} {SCHOOL_INFO.schoolCode}
              </div>
              <div>
                {pick('ಸ್ಥಾಪನೆ:', 'Estd:')} {SCHOOL_INFO.estd}
              </div>
            </div>
          </div>

          {/* Col 2: Important Links & Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {pick('ಪ್ರಮುಖ ಲಿಂಕ್‌ಗಳು & ಪೋರ್ಟಲ್‌ಗಳು', 'Important Links & Portals')}
            </h4>
            <ul className="space-y-1.5 text-xs">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={link.action}
                    className="hover:text-amber-300 hover:underline transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/student-portal')}
                  className="text-amber-300 hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.nav_student_portal}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/staff-portal')}
                  className="text-amber-300 hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.nav_staff_portal}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Govt of Karnataka Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">{t.footer_portals_title}</h4>
            <ul className="space-y-2 text-xs">
              {govtPortals.map((portal) => (
                <li key={portal.href}>
                  <a
                    href={portal.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 hover:underline transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{pick(portal.labelKn, portal.labelEn)}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Verified Office Contact & Governance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {pick('ಕಚೇರಿ ಸಂಪರ್ಕ & ಪಾರದರ್ಶಕತೆ', 'Office Contact & Compliance')}
            </h4>
            <div className="text-xs text-slate-300 space-y-1.5">
              <p>{pick(SCHOOL_INFO.addressKn, SCHOOL_INFO.addressEn)}</p>
              <p>
                <strong>{pick('ದೂರವಾಣಿ:', 'Phone:')}</strong>{' '}
                <a href={`tel:${SCHOOL_INFO.phone}`} className="font-mono hover:underline">
                  {SCHOOL_INFO.phone}
                </a>
              </p>
              <p>
                <strong>{pick('ಇಮೇಲ್:', 'Email:')}</strong>{' '}
                <a href={`mailto:${SCHOOL_INFO.email}`} className="font-mono hover:underline break-all">
                  {SCHOOL_INFO.email}
                </a>
              </p>
              <p>
                <strong>{pick('ಸಮಯ:', 'Hours:')}</strong> 09:45 AM – 04:30 PM
              </p>
            </div>
            {onOpenAdminModal && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="text-amber-300 hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.admin_verify_btn}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {t.footer_rights}
          </p>
          <p className="text-slate-400">{t.footer_fast}</p>
        </div>
      </div>
    </footer>
  );
};
