import React, { useState } from 'react';
import {
  MapPin,
  Bus,
  Train,
  Landmark,
  Phone,
  Mail,
  Copy,
  Check,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/schoolData';
import {
  Alert,
  Button,
  Card,
  FormField,
  INPUT_BASE_CLASS,
  SectionHeading,
} from './ui';

export const ContactSection: React.FC = () => {
  const { lang, t, pick } = useApp();

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState(false);

  const buildFormattedDraft = () => {
    const cleanName = senderName.trim() || (lang === 'kn' ? 'ಹೆಸರು ನಮೂದಿಸಿಲ್ಲ' : 'Not provided');
    const cleanPhone = senderPhone.trim() || (lang === 'kn' ? 'ಲಭ್ಯವಿಲ್ಲ' : 'Not provided');
    return [
      `${pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)} (UDISE: ${SCHOOL_INFO.udise})`,
      `Name / ಹೆಸರು: ${cleanName}`,
      `Phone / ದೂರವಾಣಿ: ${cleanPhone}`,
      '',
      `Enquiry / Suggestion:`,
      messageText.trim(),
    ].join('\n');
  };

  const validateDraft = (): boolean => {
    if (honeypot.trim().length > 0) {
      return false;
    }
    if (messageText.trim().length < 10) {
      setFormError(t.contact_err_msg);
      return false;
    }
    setFormError('');
    return true;
  };

  const handleOpenMailto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDraft()) return;

    const subject = encodeURIComponent(
      `School Enquiry - ${pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}`
    );
    const body = encodeURIComponent(buildFormattedDraft());
    window.location.href = `mailto:${SCHOOL_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyDraft = async () => {
    if (!validateDraft()) return;
    try {
      await navigator.clipboard.writeText(buildFormattedDraft());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFormError(
        pick(
          'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ಕೈಯಾರೆ ಆಯ್ಕೆ ಮಾಡಿ ನಕಲಿಸಿ.',
          'Unable to copy automatically. Please copy the text manually.'
        )
      );
    }
  };

  const handlePrintSlip = () => {
    if (!validateDraft()) return;
    window.print();
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <SectionHeading
          headingId="contact-section-heading"
          kickerEn="LOCATION & PUBLIC ASSISTANCE"
          kickerKn="ವಿಳಾಸ & ಸಂಪರ್ಕ"
          title={t.contact_heading}
          subtitle={t.contact_sub}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Transit Guide & Helplines */}
          <div className="lg:col-span-7 space-y-5">
            <Card surface="muted" padding="md" className="space-y-4">
              <h3 className="text-sm font-bold text-[#13325e] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                <span>{t.postal_address_title}</span>
              </h3>
              <address className="not-italic text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
                <strong className="text-slate-900 block text-base font-bold">
                  {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
                </strong>
                <span className="block">{pick(SCHOOL_INFO.addressKn, SCHOOL_INFO.addressEn)}</span>
                <span className="block font-mono text-xs text-slate-600 tabular-nums">
                  UDISE: {SCHOOL_INFO.udise} · School Code: {SCHOOL_INFO.schoolCode}
                </span>
              </address>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-500 block">
                      {pick('ದೂರವಾಣಿ:', 'Phone / Helpline:')}
                    </span>
                    <a
                      href={`tel:${SCHOOL_INFO.phone}`}
                      className="font-mono font-bold text-[#13325e] hover:underline tabular-nums"
                    >
                      {SCHOOL_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-500 block">
                      {pick('ಅಧಿಕೃತ ಇಮೇಲ್:', 'Official Email:')}
                    </span>
                    <a
                      href={`mailto:${SCHOOL_INFO.email}`}
                      className="font-mono font-bold text-[#13325e] hover:underline"
                    >
                      {SCHOOL_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card surface="muted" padding="md" className="space-y-3">
              <h3 className="text-sm font-bold text-[#13325e]">{t.how_to_reach_title}</h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <Bus className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{t.reach_bus}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{t.reach_train}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Landmark
                    className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{t.reach_landmark}</span>
                </li>
              </ul>
            </Card>

            <Alert
              tone="warning"
              title={t.helpline_title}
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-medium mt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{t.childline_label}</span>
                </li>
                <li>{t.sakala_label}</li>
                <li>{t.beo_label}</li>
                <li>{t.ddpi_label}</li>
              </ul>
            </Alert>
          </div>

          {/* Right Column: Honest Email / Printable Enquiry Composer */}
          <Card surface="muted" padding="lg" className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#13325e]">{t.feedback_title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pick(
                  'ಶಾಲಾ ಕಚೇರಿಗೆ ಇಮೇಲ್ ಅಥವಾ ಮುದ್ರಿತ ವಿಚಾರಣಾ ಪತ್ರವನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಕೆಳಗಿನ ನಮೂನೆಯನ್ನು ಬಳಸಿ.',
                  'Use this composer to prepare an email draft or printable reference letter for the school administrative office.'
                )}
              </p>
            </div>

            <Alert tone="info">{t.contact_composer_note}</Alert>

            <form onSubmit={handleOpenMailto} noValidate className="space-y-3.5">
              {/* Honeypot anti-spam field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website-field">Website</label>
                <input
                  id="contact-website-field"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <FormField id="contact-name" label={t.feedback_name}>
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={pick('ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)', 'Your name (optional)')}
                    className={INPUT_BASE_CLASS}
                  />
                )}
              </FormField>

              <FormField id="contact-phone" label={t.feedback_phone}>
                {(props) => (
                  <input
                    {...props}
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder={pick('10 ಅಂಕಿಯ ಮೊಬೈಲ್ (ಐಚ್ಛಿಕ)', '10-digit phone (optional)')}
                    className={`${INPUT_BASE_CLASS} font-mono`}
                  />
                )}
              </FormField>

              <FormField
                id="contact-message"
                label={t.feedback_msg}
                required
                error={formError || undefined}
              >
                {(props) => (
                  <textarea
                    {...props}
                    rows={4}
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder={pick(
                      'ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ವಿಚಾರಣೆಯ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
                      'Write your suggestion or enquiry details here...'
                    )}
                    className={INPUT_BASE_CLASS}
                  />
                )}
              </FormField>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<Mail className="w-4 h-4" />}
                >
                  {t.contact_btn_mailto}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleCopyDraft}
                    leftIcon={
                      copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />
                    }
                  >
                    {copied ? t.contact_btn_copied : t.contact_btn_copy}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={handlePrintSlip}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                  >
                    {t.contact_btn_print}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
