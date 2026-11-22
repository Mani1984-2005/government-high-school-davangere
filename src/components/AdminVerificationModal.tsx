import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_VERIFICATION_CHECKLIST, SCHOOL_INFO } from '../data/schoolData';

interface AdminVerificationModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const t = UI_STRINGS[lang];
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-verify-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full border-t-4 border-amber-500 overflow-hidden my-6 printable-area">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {lang === 'kn' ? 'ಶಾಲಾ ನಿಯೋಜನೆ ಪೂರ್ವ ಪರಿಶೀಲನೆ' : 'Pre-Deployment Administrative Audit'}
              </span>
            </div>
            <h3 id="admin-verify-title" className="text-sm sm:text-base font-bold text-[#13325e] mt-0.5">
              {t.admin_verify_title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1 text-xl font-bold cursor-pointer"
            aria-label="Close checklist"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Audit Notice Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-950 space-y-1">
            <strong className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>⚠️</span>
              <span>
                {lang === 'kn'
                  ? 'ಶಾಲಾ ಆಡಳಿತ ಹಾಗೂ ತಾಂತ್ರಿಕ ಪರಿಶೀಲಕರಿಗೆ ಪ್ರಮುಖ ಸೂಚನೆ:'
                  : 'Important Note for School Administration & Technical Reviewers:'}
              </span>
            </strong>
            <p className="text-slate-700 leading-relaxed">
              {lang === 'kn'
                ? 'ಈ ಜಾಲತಾಣವು ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ದಾವಣಗೆರೆಯ ಪೂರ್ಣ ಸಿದ್ಧತೆಯುಳ್ಳ ವೆಬ್ ಪೋರ್ಟಲ್ ಆಗಿದ್ದು, ಸಾರ್ವಜನಿಕ ಉತ್ಪಾದನಾ ಸರ್ವರ್‌ಗೆ (Live Server) ನಿಯೋಜಿಸುವ ಮುನ್ನ ಕೆಳಗಿನ 8 ಪ್ರಮುಖ ವಿವರಗಳನ್ನು ಮುಖ್ಯ ಶಿಕ್ಷಕರು ಹಾಗೂ BEO ಕಚೇರಿಯಿಂದ ಪರಿಶೀಲಿಸಿ ದೃಢಪಡಿಸಿಕೊಳ್ಳಬೇಕು.'
                : 'This portal is built for Government High School, Davangere. Before live public server deployment, the following 8 institutional facts must be formally confirmed against BEO/DDPI authorized records.'}
            </p>
          </div>

          {/* Verification Progress Tracker */}
          <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">
              {lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ಐಟಂಗಳು:' : 'Audited Items:'} <strong>{confirmedCount} / {SCHOOL_VERIFICATION_CHECKLIST.length}</strong>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#13325e]">
              UDISE: {SCHOOL_INFO.udise}
            </span>
          </div>

          {/* Checklist Grid */}
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
            {SCHOOL_VERIFICATION_CHECKLIST.map((fact, index) => {
              const isChecked = !!checkedItems[fact.id];

              return (
                <div
                  key={fact.id}
                  className={`p-3.5 transition-colors ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50/70'}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`chk-${fact.id}`}
                      checked={isChecked}
                      onChange={() => toggleCheck(fact.id)}
                      className="mt-1 w-4 h-4 text-[#13325e] rounded border-slate-300 focus:ring-[#13325e] cursor-pointer shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label
                          htmlFor={`chk-${fact.id}`}
                          className="font-bold text-xs sm:text-sm text-[#13325e] cursor-pointer"
                        >
                          {index + 1}. {lang === 'kn' ? fact.itemKn : fact.itemEn}
                        </label>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isChecked
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isChecked
                            ? lang === 'kn' ? 'ದೃಢಪಡಿಸಲಾಗಿದೆ (Verified)' : 'Verified'
                            : lang === 'kn' ? 'ದೃಢೀಕರಣ ಬಾಕಿ (Pending)' : 'Pending Confirmation'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 font-medium">
                          {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಕರಡು ಮೌಲ್ಯ: ' : 'Current Draft Value: '}
                        </span>
                        <strong className="font-mono text-slate-900">{fact.currentValue}</strong>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug">
                        <strong>{lang === 'kn' ? 'ಅಗತ್ಯ ದಾಖಲೆ:' : 'Verification Source:'} </strong>
                        {lang === 'kn' ? fact.requiredDocumentKn : fact.requiredDocumentEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 no-print">
          <span className="text-xs text-slate-500">
            {lang === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು ಅಂಶವನ್ನು ಪರಿಶೀಲಿಸಲು ಚೆಕ್‌ಬಾಕ್ಸ್ ಬಳಸಿ.'
              : 'Use checkboxes to track confirmed institutional facts.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer"
            >
              {lang === 'kn' ? 'ಪಟ್ಟಿ ಮುದ್ರಿಸಿ (Print Checklist)' : 'Print Audit Checklist'}
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 text-slate-800 font-semibold rounded text-xs hover:bg-slate-300 transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
