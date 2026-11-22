import React, { useState } from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';
import { SCHOOL_INFO } from '../data/schoolData';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;

    const ticketNo = `DVG-GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicket(ticketNo);
    setFeedbackSent(true);

    try {
      const stored = JSON.parse(localStorage.getItem('ghs_grievances') || '[]');
      stored.unshift({
        ticketNo,
        name: feedbackName.trim() || 'Anonymous',
        phone: feedbackPhone.trim() || 'N/A',
        message: feedbackMsg.trim(),
        date: new Date().toLocaleDateString('en-IN'),
      });
      localStorage.setItem('ghs_grievances', JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="contact" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>LOCATION & PUBLIC ASSISTANCE</span>
            <span>·</span>
            <span>ವಿಳಾಸ & ಸಂಪರ್ಕ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.contact_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.contact_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Map Direction & Helplines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Postal Address Card */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#13325e] uppercase tracking-wider">
                {t.postal_address_title}
              </h3>
              <address className="not-italic text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block text-base font-bold">
                  {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
                </strong>
                <span>{lang === 'kn' ? SCHOOL_INFO.addressKn : SCHOOL_INFO.addressEn}</span>
                <span className="block mt-1 font-mono text-slate-600">
                  UDISE: <strong>{SCHOOL_INFO.udise}</strong> · School Code: <strong>{SCHOOL_INFO.schoolCode}</strong>
                </span>
              </address>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Phone / Helpline:</span>
                  <strong className="font-mono text-slate-900">{SCHOOL_INFO.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Official Email:</span>
                  <strong className="font-mono text-slate-900">{SCHOOL_INFO.email}</strong>
                </div>
              </div>
            </div>

            {/* How to Reach Us & Transit */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#13325e] uppercase tracking-wider">
                {t.how_to_reach_title}
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">🚌</span>
                  <span>{t.reach_bus}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">🚆</span>
                  <span>{t.reach_train}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">📍</span>
                  <span>{t.reach_landmark}</span>
                </li>
              </ul>
            </div>

            {/* Emergency & Citizen Helplines */}
            <div className="bg-amber-50/80 rounded-lg p-5 border border-amber-200 shadow-2xs space-y-2 text-xs">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                {t.helpline_title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-900 font-medium">
                <div>• {t.childline_label}</div>
                <div>• {t.sakala_label}</div>
                <div>• {t.beo_label}</div>
                <div>• {t.ddpi_label}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Public Grievance & Suggestion Box */}
          <div className="lg:col-span-5 bg-slate-50 rounded-lg p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#13325e]">
                {t.feedback_title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'kn'
                  ? 'ಶಾಲಾ ಸುಧಾರಣೆ, ಬಿಸಿಯೂಟ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿ ಶಿಸ್ತು ಕುರಿತು ಪೋಷಕರು ಮತ್ತು ನಾಗರಿಕರು ಮುಕ್ತವಾಗಿ ಸಲಹೆ ನೀಡಬಹುದು.'
                  : 'Parents and citizens are welcome to submit suggestions or grievances directly to the school administration.'}
              </p>
            </div>

            {feedbackSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-700">✓</span>
                  <strong className="text-sm font-bold text-emerald-900">{t.feedback_success}</strong>
                </div>
                <div className="p-2.5 bg-white border border-emerald-200 rounded text-xs">
                  <span className="text-slate-500 block">
                    {lang === 'kn' ? 'ದೂರು/ಸಲಹಾ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ (Grievance Ticket):' : 'Grievance Reference Ticket:'}
                  </span>
                  <strong className="font-mono text-sm text-[#13325e]">{generatedTicket}</strong>
                </div>
                <p className="text-[11px] text-slate-600">
                  {lang === 'kn'
                    ? 'ಈ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಶಾಲಾ ಕಚೇರಿಯಲ್ಲಿ ಉಲ್ಲೇಖಿಸಿ ಮುಂದಿನ ಕ್ರಮವನ್ನು ವಿಚಾರಿಸಬಹುದು.'
                    : 'Kindly preserve this ticket reference number for follow-up with the school administrative office.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSent(false);
                    setFeedbackName('');
                    setFeedbackPhone('');
                    setFeedbackMsg('');
                    setGeneratedTicket('');
                  }}
                  className="px-3 py-1.5 bg-[#13325e] text-white text-xs font-bold rounded hover:bg-[#0c1f3c] cursor-pointer mt-1"
                >
                  {lang === 'kn' ? 'ಮತ್ತೊಂದು ಸಲಹೆ ಸಲ್ಲಿಸಿ' : 'Submit Another Grievance'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.feedback_name}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)' : 'Your name (optional)'}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.feedback_phone}
                  </label>
                  <input
                    type="tel"
                    value={feedbackPhone}
                    onChange={(e) => setFeedbackPhone(e.target.value)}
                    placeholder="10-digit mobile (optional)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.feedback_msg} *
                  </label>
                  <textarea
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    rows={3}
                    placeholder={
                      lang === 'kn'
                        ? 'ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ದೂರಿನ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...'
                        : 'Write your suggestion or grievance details here...'
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#13325e]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#13325e] text-white font-bold rounded text-xs hover:bg-[#0c1f3c] transition-colors cursor-pointer"
                >
                  {t.feedback_submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
