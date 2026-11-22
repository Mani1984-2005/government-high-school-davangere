import React, { useState } from 'react';
import { Clock, FileCheck2, Printer, Download, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOOL_INFO } from '../data/schoolData';
import {
  Alert,
  Button,
  FormField,
  INPUT_BASE_CLASS,
  Modal,
} from './ui';

interface OnlineServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineServicesModal: React.FC<OnlineServicesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, t, pick } = useApp();

  const [reqType, setReqType] = useState('admission');
  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [grade, setGrade] = useState('8');
  const [satsNo, setSatsNo] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSlip, setShowSlip] = useState(false);

  const serviceChecklist: Record<string, { kn: string[]; en: string[] }> = {
    admission: {
      kn: [
        'ಹಿಂದಿನ ತರಗತಿಯ ಉತ್ತೀರ್ಣ ಅಂಕಪಟ್ಟಿ',
        'ಹಿಂದಿನ ಶಾಲೆಯ ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ (TC) ಮತ್ತು SATS ಸಂಖ್ಯೆ',
        'ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (ಅನ್ವಯವಾದರೆ) & ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಫೋಟೋ',
      ],
      en: [
        'Previous class marks card / progress report',
        'Transfer Certificate (TC) & SATS enrollment ID from previous school',
        'Applicable caste/income certificate & passport-size photographs',
      ],
    },
    tc: {
      kn: [
        'ಪೋಷಕರ ಸಹಿ ಮಾಡಿದ ಲಿಖಿತ ಕೋರಿಕೆ ಪತ್ರ',
        'ವಿದ್ಯಾರ್ಥಿಯ SATS ಸಂಖ್ಯೆ ಮತ್ತು ಗ್ರಂಥಾಲಯ/ಪ್ರಯೋಗಾಲಯ ಬಾಕಿ ರಹಿತ ದೃಢೀಕರಣ',
      ],
      en: [
        'Signed written request letter from parent/guardian',
        'Student SATS ID & library/laboratory clearance',
      ],
    },
    study_cert: {
      kn: [
        'ವಿದ್ಯಾರ್ಥಿಯ SATS ಸಂಖ್ಯೆ ಹಾಗೂ ಪ್ರಸ್ತುತ ಶೈಕ್ಷಣಿಕ ವರ್ಷದ ವಿವರ',
        'ಪೋಷಕರ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿಯ ಗುರುತಿನ ಚೀಟಿ',
      ],
      en: [
        'Student SATS number and current academic year enrollment record',
        'Parent/student identification proof',
      ],
    },
    scholarship: {
      kn: [
        'ಆಧಾರ್ ಕಾರ್ಡ್ (ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ NPCI ಲಿಂಕ್ ಆಗಿರಬೇಕು)',
        'ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಹಾಗೂ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರತಿ',
      ],
      en: [
        'Aadhaar card mapped to student bank account (NPCI seeded)',
        'Valid caste/income certificate & student bank passbook copy',
      ],
    },
  };

  const reqTypeLabels: Record<string, string> = {
    admission: t.form_type_opt_admission,
    tc: t.form_type_opt_tc,
    study_cert: t.form_type_opt_study,
    scholarship: t.form_type_opt_scholarship,
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (studentName.trim().length < 2) {
      nextErrors.studentName = pick(
        'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
        'Please enter student full name.'
      );
    }
    if (guardianName.trim().length < 2) {
      nextErrors.guardianName = pick(
        'ಪೋಷಕರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
        'Please enter parent/guardian name.'
      );
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      nextErrors.phone = pick(
        'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.',
        'Please enter a valid 10-digit mobile number.'
      );
    }
    if (details.trim().length < 5) {
      nextErrors.details = pick(
        'ಕೋರಿಕೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರವನ್ನು ನಮೂದಿಸಿ.',
        'Please provide brief request details.'
      );
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePrepareSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowSlip(true);
  };

  const handleReset = () => {
    setShowSlip(false);
    setErrors({});
  };

  const handleDownloadSlipTxt = () => {
    const lines = [
      pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn),
      `UDISE: ${SCHOOL_INFO.udise} | School Code: ${SCHOOL_INFO.schoolCode}`,
      '------------------------------------------------------------',
      t.service_slip_title,
      `Date Prepared: ${new Date().toLocaleDateString('en-IN')}`,
      `Service Requested: ${reqTypeLabels[reqType] || reqType}`,
      `Student Name: ${studentName.trim()}`,
      `Parent/Guardian: ${guardianName.trim()}`,
      `Grade: Class ${grade}`,
      `SATS ID: ${satsNo.trim() || 'Not provided'}`,
      `Contact Mobile: ${phone.trim()}`,
      `Remarks: ${details.trim()}`,
      '------------------------------------------------------------',
      pick(
        'ಸೂಚನೆ: ಇದು ಆನ್‌ಲೈನ್ ಸಲ್ಲಿಕೆ ಅಲ್ಲ. ದಯವಿಟ್ಟು ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ ಸೋಮವಾರ–ಶುಕ್ರವಾರ (10:30 AM – 3:30 PM) ಶಾಲಾ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ.',
        'NOTE: This slip was not transmitted online. Present this reference sheet with original documents at the school office (Mon–Fri, 10:30 AM – 3:30 PM).'
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghs-davangere-office-enquiry-slip.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentChecklist = serviceChecklist[reqType] || serviceChecklist.admission;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="service-modal-title"
      subtitle={pick(
        'ಸಕಾಲ ಸೇವಾ ಮಾರ್ಗದರ್ಶಿ · ಆನ್‌ಲೈನ್ ಸಲ್ಲಿಕೆ ಸಕ್ರಿಯವಾಗಿಲ್ಲ',
        'Office Visit Guide · No Online Submission'
      )}
      title={t.modal_title}
      closeLabel={t.a11y_close_dialog}
      maxWidth="2xl"
      printable
      footer={
        showSlip ? (
          <div className="flex flex-wrap items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSlipTxt}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              {pick('ಚೀಟಿ ಡೌನ್‌ಲೋಡ್ (.txt)', 'Download Slip (.txt)')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              {t.receipt_print}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              {pick('ತಿದ್ದುಪಡಿ ಮಾಡಿ', 'Edit Details')}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t.close}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 w-full text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Mon–Fri · 10:30 AM – 3:30 PM</span>
            </span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.close}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4 text-xs sm:text-sm">
        <Alert tone="warning">{t.service_office_alert}</Alert>

        {showSlip ? (
          /* Honest Printable Office Reference Slip — Zero fake status/submission claim */
          <div className="border-2 border-slate-300 rounded-lg p-5 bg-white text-slate-900 space-y-4">
            <div className="text-center border-b border-slate-200 pb-3 space-y-1">
              <h4 className="font-bold text-base text-[#13325e]">
                {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
              </h4>
              <p className="text-xs text-slate-600">
                {pick(SCHOOL_INFO.deptKn, SCHOOL_INFO.deptEn)} · UDISE: {SCHOOL_INFO.udise}
              </p>
              <p className="text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300 inline-block px-3 py-1 rounded mt-1">
                {t.service_slip_title}
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">{t.form_type_label}</dt>
                <dd className="font-bold text-[#13325e]">{reqTypeLabels[reqType]}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{pick('ಸಿದ್ಧಪಡಿಸಿದ ದಿನಾಂಕ:', 'Date Prepared:')}</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {new Date().toLocaleDateString('en-IN')}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.form_name_label}</dt>
                <dd className="font-bold text-slate-900">{studentName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.form_father_label}</dt>
                <dd className="font-bold text-slate-900">{guardianName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.form_grade_label}</dt>
                <dd className="font-bold text-slate-900">Class {grade}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.form_phone_label}</dt>
                <dd className="font-mono font-bold text-slate-900">{phone}</dd>
              </div>
              <div>
                <dt className="text-slate-500">SATS ID:</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {satsNo.trim() || pick('ಲಭ್ಯವಿಲ್ಲ', 'Not provided')}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">{t.form_details_label}</dt>
                <dd className="font-medium text-slate-800 mt-0.5">{details}</dd>
              </div>
            </dl>

            <div className="border-t border-slate-200 pt-3 text-xs text-slate-700 space-y-1">
              <strong className="text-[#13325e] block">
                {pick(
                  'ಶಾಲಾ ಕಚೇರಿಗೆ ತರಬೇಕಾದ ಮೂಲ ದಾಖಲೆಗಳು:',
                  'Original Documents Required at School Office:'
                )}
              </strong>
              <ul className="list-disc pl-5 space-y-1">
                {pick(currentChecklist.kn, currentChecklist.en).map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Dynamic Document Checklist Preview */}
            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-[#13325e] flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>
                  {pick(
                    'ಆಯ್ಕೆ ಮಾಡಿದ ಸೇವೆಗೆ ಕಚೇರಿಯಲ್ಲಿ ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:',
                    'Documents Required at Office for Selected Service:'
                  )}
                </span>
              </h4>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {pick(currentChecklist.kn, currentChecklist.en).map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>

            <form onSubmit={handlePrepareSlip} noValidate className="space-y-3">
              <FormField id="srv-type" label={t.form_type_label} required>
                {(props) => (
                  <select
                    {...props}
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value)}
                    className={INPUT_BASE_CLASS}
                  >
                    <option value="admission">{t.form_type_opt_admission}</option>
                    <option value="tc">{t.form_type_opt_tc}</option>
                    <option value="study_cert">{t.form_type_opt_study}</option>
                    <option value="scholarship">{t.form_type_opt_scholarship}</option>
                  </select>
                )}
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  id="srv-student-name"
                  label={t.form_name_label}
                  required
                  error={errors.studentName}
                >
                  {(props) => (
                    <input
                      {...props}
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು' : 'Student full name'}
                      className={INPUT_BASE_CLASS}
                    />
                  )}
                </FormField>

                <FormField
                  id="srv-guardian-name"
                  label={t.form_father_label}
                  required
                  error={errors.guardianName}
                >
                  {(props) => (
                    <input
                      {...props}
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ತಂದೆ / ತಾಯಿ ಹೆಸರು' : 'Parent / Guardian name'}
                      className={INPUT_BASE_CLASS}
                    />
                  )}
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField id="srv-grade" label={t.form_grade_label} required>
                  {(props) => (
                    <select
                      {...props}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className={INPUT_BASE_CLASS}
                    >
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10 (SSLC)</option>
                    </select>
                  )}
                </FormField>

                <FormField
                  id="srv-phone"
                  label={t.form_phone_label}
                  required
                  error={errors.phone}
                >
                  {(props) => (
                    <input
                      {...props}
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className={`${INPUT_BASE_CLASS} font-mono`}
                    />
                  )}
                </FormField>

                <FormField id="srv-sats" label={t.form_sats_label}>
                  {(props) => (
                    <input
                      {...props}
                      type="text"
                      maxLength={12}
                      value={satsNo}
                      onChange={(e) => setSatsNo(e.target.value)}
                      placeholder="Optional SATS ID"
                      className={`${INPUT_BASE_CLASS} font-mono`}
                    />
                  )}
                </FormField>
              </div>

              <FormField
                id="srv-details"
                label={t.form_details_label}
                required
                error={errors.details}
              >
                {(props) => (
                  <textarea
                    {...props}
                    rows={2}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={pick(
                      'ನಿಮ್ಮ ಕಚೇರಿ ವಿಚಾರಣೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರ...',
                      'Brief summary for the school office desk...'
                    )}
                    className={INPUT_BASE_CLASS}
                  />
                )}
              </FormField>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="submit" variant="primary" size="md" leftIcon={<Printer className="w-4 h-4" />}>
                  {t.service_btn_generate_slip}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};
