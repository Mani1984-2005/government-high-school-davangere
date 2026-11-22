import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_INFO } from '../data/schoolData';

interface FooterProps {
  lang: Language;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdminModal }) => {
  const t = UI_STRINGS[lang];

  return (
    <footer className="bg-[#0b1f3c] text-slate-300 text-xs border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {t.footer_desc}
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              <div>UDISE: {SCHOOL_INFO.udise}</div>
              <div>Estd: {SCHOOL_INFO.estd}</div>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {t.footer_portals_title}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="https://schooleducation.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{lang === 'kn' ? 'ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ ಕರ್ನಾಟಕ' : 'Dept. of School Education'}</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://kseab.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{lang === 'kn' ? 'KSEAB (SSLC ಪರೀಕ್ಷಾ ಮಂಡಳಿ)' : 'KSEAB (SSLC Board)'}</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://ssp.postmatric.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{lang === 'kn' ? 'ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP)' : 'State Scholarship Portal (SSP)'}</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://sts.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಟ್ರ್ಯಾಕಿಂಗ್ ವ್ಯವಸ್ಥೆ (SATS)' : 'Student Tracking System (SATS)'}</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {lang === 'kn' ? 'ಶಾಸನಬದ್ಧ ಮಾರ್ಗಸೂಚಿಗಳು' : 'Statutory Compliance'}
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>{lang === 'kn' ? 'ಉಚಿತ ಮತ್ತು ಕಡ್ಡಾಯ ಶಿಕ್ಷಣ ಹಕ್ಕು (RTE 2009)' : 'Right to Education Act (RTE 2009)'}</li>
              <li>{lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸಕಾಲ ಸೇವೆಗಳು (Sakala Services)' : 'Karnataka Sakala Services'}</li>
              <li>{lang === 'kn' ? 'ಪೋಕ್ಸೋ (POCSO) ಸುರಕ್ಷತಾ ಸಮಿತಿ' : 'POCSO Safety Protocol'}</li>
              <li>{lang === 'kn' ? 'ಶಾಲಾ ಸಾಮಾಜಿಕ ಲೆಕ್ಕಪರಿಶೋಧನೆ (Social Audit)' : 'Social Audit & Transparency'}</li>
              {onOpenAdminModal && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAdminModal}
                    className="text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>📋 {t.admin_verify_btn}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Quick Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">
              {lang === 'kn' ? 'ಕಚೇರಿ ಸಂಪರ್ಕ' : 'Office Contact'}
            </h4>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>
                <strong>{lang === 'kn' ? 'ದೂರವಾಣಿ:' : 'Phone:'}</strong> {SCHOOL_INFO.phone}
              </p>
              <p>
                <strong>{lang === 'kn' ? 'ಇಮೇಲ್:' : 'Email:'}</strong> {SCHOOL_INFO.email}
              </p>
              <p>
                <strong>{lang === 'kn' ? 'ಸಮಯ:' : 'Hours:'}</strong> 09:45 AM - 04:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {t.footer_rights}</p>
          <p className="text-slate-500">{t.footer_fast}</p>
        </div>
      </div>
    </footer>
  );
};
