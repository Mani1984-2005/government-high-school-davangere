import React, { useState, useEffect } from 'react';
import { Language, ServiceApplication } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_INFO } from '../data/schoolData';

interface OnlineServicesModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'ghs_davangere_service_apps';

export const OnlineServicesModal: React.FC<OnlineServicesModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const t = UI_STRINGS[lang];

  const [reqType, setReqType] = useState('admission');
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [grade, setGrade] = useState('8');
  const [satsNo, setSatsNo] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [submittedApp, setSubmittedApp] = useState<ServiceApplication | null>(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [savedApplications, setSavedApplications] = useState<ServiceApplication[]>([]);

  // Escape key handler and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Load saved applications from localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSavedApplications(JSON.parse(raw));
        }
      } catch (err) {
        console.error('Failed to read saved applications', err);
      }
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || phone.trim().length < 10) {
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newApp: ServiceApplication = {
      appNo: `GHS-DVG-2025-${randomSuffix}`,
      type: reqType,
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      grade: `${grade}th Standard`,
      satsNo: satsNo.trim() || 'N/A',
      mobile: phone.trim(),
      details: details.trim(),
      appliedDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Received',
    };

    setSubmittedApp(newApp);

    // Persist in localStorage
    try {
      const updated = [newApp, ...savedApplications];
      setSavedApplications(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save application', err);
    }
  };

  const handleResetForm = () => {
    setSubmittedApp(null);
    setStudentName('');
    setFatherName('');
    setSatsNo('');
    setPhone('');
    setDetails('');
    setViewHistory(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border-t-4 border-[#13325e] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div>
            <h3 id="service-modal-title" className="text-sm sm:text-base font-bold text-[#13325e]">
              {t.modal_title}
            </h3>
            <span className="text-[11px] text-amber-800 font-semibold">
              {lang === 'kn' ? 'ಸಕಾಲ ಸೇವಾ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ' : 'Under Karnataka Sakala Citizen Charter'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 text-xl font-bold cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Prototype Warning Banner */}
        <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center justify-between px-4 no-print">
          <span>
            {lang === 'kn'
              ? 'ಸೂಚನೆ: ಇದು ಕರಡು ಪ್ರಾಯೋಗಿಕ ಅರ್ಜಿಯಾಗಿದೆ (Evaluation Form). ಮುದ್ರಿತ ರಸೀದಿಯನ್ನು ಕಚೇರಿಗೆ ಸಲ್ಲಿಸಿ.'
              : 'Notice: This is a prototype application form. Please present the printed receipt at the school office.'}
          </span>
          {savedApplications.length > 0 && !submittedApp && (
            <button
              onClick={() => setViewHistory(!viewHistory)}
              className="text-[#13325e] font-bold underline hover:text-amber-800 shrink-0 ml-2 cursor-pointer"
            >
              {viewHistory
                ? lang === 'kn' ? 'ಅರ್ಜಿ ನಮೂನೆಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Form'
                : lang === 'kn' ? `ಹಿಂದಿನ ಅರ್ಜಿಗಳು (${savedApplications.length})` : `History (${savedApplications.length})`}
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 text-xs sm:text-sm">
          {viewHistory && !submittedApp ? (
            /* Previously Submitted Applications History */
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#13325e]">
                {lang === 'kn' ? 'ನಿಮ್ಮ ಹಿಂದಿನ ಆನ್‌ಲೈನ್ ಅರ್ಜಿಗಳ ಪಟ್ಟಿ:' : 'Your Submitted Applications:'}
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {savedApplications.map((app, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-mono text-[#13325e]">{app.appNo}</strong>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-slate-700 text-xs">
                      <span>{app.studentName} ({app.grade})</span> · <span className="text-slate-500">{app.appliedDate}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSubmittedApp(app);
                        setViewHistory(false);
                      }}
                      className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'kn' ? 'ರಸೀದಿ ವೀಕ್ಷಿಸಿ / ಮುದ್ರಿಸಿ' : 'View / Print Receipt'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewHistory(false)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-800 font-semibold rounded text-xs hover:bg-slate-300"
                >
                  {lang === 'kn' ? 'ಹೊಸ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Submit New Application'}
                </button>
              </div>
            </div>
          ) : submittedApp ? (
            /* Acknowledgment Slip */
            <div className="space-y-4 printable-area">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-center no-print">
                <span className="text-2xl block mb-1">✓</span>
                <strong className="block text-sm font-bold">{t.app_success_title}</strong>
                <p className="text-xs text-emerald-800 mt-0.5">{t.app_success_note}</p>
              </div>

              {/* Printable Official Receipt */}
              <div className="border-2 border-slate-300 rounded p-4 bg-white text-slate-900 space-y-3">
                <div className="text-center border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-sm text-[#13325e]">
                    {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {lang === 'kn' ? SCHOOL_INFO.deptKn : SCHOOL_INFO.deptEn} · UDISE: {SCHOOL_INFO.udise}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-bold rounded mt-1">
                    {lang === 'kn' ? 'ಅರ್ಜಿ ಸ್ವೀಕೃತಿ ರಸೀದಿ (ಕರಡು ಮಾದರಿ / Prototype Slip)' : 'Application Acknowledgment Receipt (Prototype)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">{t.receipt_app_no}</span>
                    <strong className="font-mono text-sm text-[#13325e]">{submittedApp.appNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.receipt_date}</span>
                    <strong className="font-mono text-slate-800">{submittedApp.appliedDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.form_name_label}</span>
                    <strong className="text-slate-900">{submittedApp.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.form_grade_label}</span>
                    <strong className="text-slate-900">{submittedApp.grade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.form_phone_label}</span>
                    <strong className="font-mono text-slate-900">{submittedApp.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SATS ID:</span>
                    <strong className="font-mono text-slate-900">{submittedApp.satsNo}</strong>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-600">
                  <p>
                    <strong>{lang === 'kn' ? 'ಸೂಚನೆ:' : 'Note:'}</strong>{' '}
                    {lang === 'kn'
                      ? 'ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ (ಹಿಂದಿನ ಅಂಕಪಟ್ಟಿ, ಜಾತಿ/ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ) ಶಾಲಾ ಕಚೇರಿಗೆ ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರ ಬೆಳಗ್ಗೆ 10:30 ರಿಂದ ಮಧ್ಯಾಹ್ನ 3:30 ರೊಳಗೆ ಭೇಟಿ ನೀಡಿ.'
                      : 'Kindly visit the school administrative office with original documents on working days between 10:30 AM and 3:30 PM.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 no-print">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>{t.receipt_print}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-2 bg-slate-200 text-slate-800 font-semibold rounded text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  {lang === 'kn' ? 'ಮತ್ತೊಂದು ಅರ್ಜಿ' : 'New Application'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-slate-800 text-white font-semibold rounded text-xs hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            /* Application Input Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {t.form_type_label}
                </label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                  required
                >
                  <option value="admission">{t.form_type_opt_admission}</option>
                  <option value="tc">{t.form_type_opt_tc}</option>
                  <option value="study_cert">{t.form_type_opt_study}</option>
                  <option value="scholarship">{t.form_type_opt_scholarship}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.form_name_label}
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಉದಾ: ಪ್ರದೀಪ್ ಕುಮಾರ್ ಎನ್.' : 'e.g., Pradeep Kumar N.'}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.form_father_label}
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಉದಾ: ನಾಗರಾಜ್ ಕೆ.' : 'e.g., Nagaraj K.'}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.form_grade_label}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                    required
                  >
                    <option value="8">8ನೇ ತರಗತಿ (Class 8)</option>
                    <option value="9">9ನೇ ತರಗತಿ (Class 9)</option>
                    <option value="10">10ನೇ ತರಗತಿ (Class 10 - SSLC)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {t.form_phone_label}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {t.form_sats_label}
                </label>
                <input
                  type="text"
                  value={satsNo}
                  onChange={(e) => setSatsNo(e.target.value)}
                  placeholder="9-digit SATS ID (optional)"
                  maxLength={9}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  {t.form_details_label}
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={2}
                  placeholder={
                    lang === 'kn'
                      ? 'ನಿಮ್ಮ ಕೋರಿಕೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರ (ಉದಾ: ಕನ್ನಡ ಮಾಧ್ಯಮಕ್ಕೆ ಹೊಸ ಪ್ರವೇಶ ಅಥವಾ ಟಿ.ಸಿ ವರ್ಗಾವಣೆ)...'
                      : 'Brief details about your request (e.g., Transfer to high school, scholarship assistance)...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-slate-200 text-slate-800 font-semibold rounded text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  {t.btn_cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer"
                >
                  {t.btn_submit_app}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
