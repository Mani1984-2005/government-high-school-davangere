import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Home,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import { portalApi, PortalApiError } from '../../api/portalApi';
import type { RegistrationSubmitResponse } from '../../../shared/types/auth';
import { PortalNavBar } from '../PortalNavBar';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  INPUT_BASE_CLASS,
} from '../ui';

interface SelfRegistrationPageProps {
  mode: 'student' | 'parent' | 'staff';
}

export const SelfRegistrationPage: React.FC<SelfRegistrationPageProps> = ({ mode }) => {
  const { lang, t, pick } = useApp();
  const { goHome, navigate } = usePortal();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<RegistrationSubmitResponse | null>(null);

  // Student fields
  const [studentName, setStudentName] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [satsRef, setSatsRef] = useState('');
  const [classGrade, setClassGrade] = useState<'8' | '9' | '10'>('8');
  const [section, setSection] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState<
    'mother' | 'father' | 'legal_guardian'
  >('mother');
  const [guardianMobileNumber, setGuardianMobileNumber] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [minorGuardianConsent, setMinorGuardianConsent] = useState(false);

  // Staff fields
  const [officialStaffId, setOfficialStaffId] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentOrSubject, setDepartmentOrSubject] = useState('');

  const pageTitle =
    mode === 'student'
      ? t.reg_student_title
      : mode === 'parent'
      ? t.reg_parent_title
      : t.reg_staff_title;

  const pageSub =
    mode === 'student'
      ? t.reg_student_sub
      : mode === 'parent'
      ? t.reg_parent_sub
      : t.reg_staff_sub;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSubmitting(true);

    try {
      let response: RegistrationSubmitResponse;
      if (mode === 'student') {
        response = await portalApi.registerStudent(
          {
            studentName,
            studentIdentifier: studentIdentifier || undefined,
            satsRef: satsRef || undefined,
            classGrade: Number(classGrade) as 8 | 9 | 10,
            section: section || undefined,
            academicYear,
            mobileNumber,
            email: email || undefined,
            guardianName,
            guardianRelationship,
            guardianMobileNumber,
            guardianEmail: guardianEmail || undefined,
            minorGuardianConsent,
          },
          lang
        );
      } else if (mode === 'parent') {
        response = await portalApi.registerParent(
          {
            guardianName,
            relationship: guardianRelationship,
            guardianMobileNumber,
            guardianEmail: guardianEmail || undefined,
            studentIdentifier,
            studentName,
            classGrade: Number(classGrade) as 8 | 9 | 10,
            academicYear,
          },
          lang
        );
      } else {
        response = await portalApi.registerStaff(
          {
            fullName: studentName,
            officialStaffId,
            designation,
            departmentOrSubject,
            mobileNumber,
            email,
          },
          lang
        );
      }

      setSubmittedResult(response);
    } catch (err) {
      if (err instanceof PortalApiError) {
        setServerError(err.message);
      } else {
        setServerError(
          pick(
            'ನೋಂದಣಿ ಸಲ್ಲಿಸುವಲ್ಲಿ ತಾಂತ್ರಿಕ ದೋಷ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',
            'Unable to reach registration service right now. Please try again later.'
          )
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: pageTitle },
        ]}
      />

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card surface="white" padding="lg" className="lg:col-span-8 space-y-5">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-emerald-900">
                  {pick('ಅಧಿಕೃತ ಸ್ವಯಂ ನೋಂದಣಿ', 'OFFICIAL SELF-REGISTRATION')}
                </span>
                <Badge tone="navy" icon={<ShieldCheck className="w-3 h-3" />}>
                  {pick('ಶಾಲಾ ಅನುಮೋದನೆ ಕಡ್ಡಾಯ', 'School Approval Required')}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#13325e] flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
                <span>{pageTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">{pageSub}</p>
            </div>

            <Alert tone="info">{t.reg_privacy_notice}</Alert>

            {serverError && (
              <Alert tone="danger" title={pick('ನೋಂದಣಿ ಪರಿಶೀಲನೆ ದೋಷ', 'Validation / Request Error')}>
                {serverError}
              </Alert>
            )}

            {submittedResult ? (
              <div className="space-y-4">
                <Alert
                  tone="success"
                  title={pick('ನೋಂದಣಿ ಅರ್ಜಿ ದಾಖಲಾಗಿದೆ', 'Registration Request Recorded')}
                >
                  <p className="mb-2">{pick(submittedResult.messageKn, submittedResult.messageEn)}</p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-md flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600">{t.reg_ref_label}:</span>
                    <span className="font-mono font-bold text-sm text-[#13325e]">
                      {submittedResult.referenceCode}
                    </span>
                  </div>
                </Alert>

                <Alert tone="warning">
                  {pick(
                    submittedResult.contactVerification.noteKn,
                    submittedResult.contactVerification.noteEn
                  )}
                </Alert>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/registration-status')}
                    leftIcon={<Search className="w-4 h-4" />}
                  >
                    {t.reg_nav_status}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={goHome}
                    leftIcon={<Home className="w-4 h-4" />}
                  >
                    {t.nav_home_btn}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {mode === 'student' && (
                  <>
                    <FormField
                      id="reg-student-name"
                      label={pick('ವಿದ್ಯಾರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು', 'Student Full Name')}
                      required
                    >
                      {(props) => (
                        <input
                          {...props}
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder={pick('ಶಾಲಾ ದಾಖಲೆಗಳ ಪ್ರಕಾರ ಹೆಸರು', 'Name as per school records')}
                          className={INPUT_BASE_CLASS}
                        />
                      )}
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        id="reg-student-code"
                        label={pick('ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿ ID (ಲಭ್ಯವಿದ್ದರೆ)', 'School Student ID (if issued)')}
                      >
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={studentIdentifier}
                            onChange={(e) => setStudentIdentifier(e.target.value)}
                            placeholder="DVG-STU-..."
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                      <FormField
                        id="reg-student-sats"
                        label={pick('ಅಧಿಕೃತ SATS ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)', 'Authorized SATS ID (optional)')}
                      >
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={satsRef}
                            onChange={(e) => setSatsRef(e.target.value)}
                            placeholder="SATS ID"
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField id="reg-grade" label={pick('ತರಗತಿ', 'Class')} required>
                        {(props) => (
                          <select
                            {...props}
                            value={classGrade}
                            onChange={(e) => setClassGrade(e.target.value as '8' | '9' | '10')}
                            className={INPUT_BASE_CLASS}
                          >
                            <option value="8">{pick('8ನೇ ತರಗತಿ', 'Class 8')}</option>
                            <option value="9">{pick('9ನೇ ತರಗತಿ', 'Class 9')}</option>
                            <option value="10">{pick('10ನೇ ತರಗತಿ (SSLC)', 'Class 10 (SSLC)')}</option>
                          </select>
                        )}
                      </FormField>
                      <FormField id="reg-section" label={pick('ವಿಭಾಗ (ಐಚ್ಛಿಕ)', 'Section (optional)')}>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="A / B"
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                      <FormField id="reg-year" label={pick('ಶೈಕ್ಷಣಿಕ ವರ್ಷ', 'Academic Year')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            placeholder="2025-26"
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        id="reg-student-mobile"
                        label={pick('ವಿದ್ಯಾರ್ಥಿ / ಪೋಷಕರ ಮೊಬೈಲ್', 'Registered Mobile Number')}
                        required
                      >
                        {(props) => (
                          <input
                            {...props}
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="+91 9876543210"
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                      <FormField
                        id="reg-student-email"
                        label={pick('ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)', 'Email Address (optional)')}
                      >
                        {(props) => (
                          <input
                            {...props}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-4">
                      <h3 className="text-sm font-bold text-[#13325e]">
                        {pick('ಪೋಷಕ / ಪಾಲಕರ ವಿವರಗಳು (ಕಡ್ಡಾಯ)', 'Parent / Guardian Details (Mandatory)')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField id="reg-g-name" label={pick('ಪೋಷಕರ ಹೆಸರು', 'Guardian Name')} required>
                          {(props) => (
                            <input
                              {...props}
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              className={INPUT_BASE_CLASS}
                            />
                          )}
                        </FormField>
                        <FormField id="reg-g-rel" label={pick('ಸಂಬಂಧ', 'Relationship')} required>
                          {(props) => (
                            <select
                              {...props}
                              value={guardianRelationship}
                              onChange={(e) =>
                                setGuardianRelationship(
                                  e.target.value as 'mother' | 'father' | 'legal_guardian'
                                )
                              }
                              className={INPUT_BASE_CLASS}
                            >
                              <option value="mother">{pick('ತಾಯಿ', 'Mother')}</option>
                              <option value="father">{pick('ತಂದೆ', 'Father')}</option>
                              <option value="legal_guardian">{pick('ಕಾನೂನುಬದ್ಧ ಪಾಲಕರು', 'Legal Guardian')}</option>
                            </select>
                          )}
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          id="reg-g-mobile"
                          label={pick('ಪೋಷಕರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'Guardian Mobile Number')}
                          required
                        >
                          {(props) => (
                            <input
                              {...props}
                              type="tel"
                              value={guardianMobileNumber}
                              onChange={(e) => setGuardianMobileNumber(e.target.value)}
                              placeholder="+91 9876543210"
                              className={`${INPUT_BASE_CLASS} font-mono`}
                            />
                          )}
                        </FormField>
                        <FormField
                          id="reg-g-email"
                          label={pick('ಪೋಷಕರ ಇಮೇಲ್ (ಐಚ್ಛಿಕ)', 'Guardian Email (optional)')}
                        >
                          {(props) => (
                            <input
                              {...props}
                              type="email"
                              value={guardianEmail}
                              onChange={(e) => setGuardianEmail(e.target.value)}
                              className={INPUT_BASE_CLASS}
                            />
                          )}
                        </FormField>
                      </div>

                      <label className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={minorGuardianConsent}
                          onChange={(e) => setMinorGuardianConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#13325e]"
                        />
                        <span>
                          {pick(
                            'ಅಪ್ರಾಪ್ತ ವಿದ್ಯಾರ್ಥಿಯ ನೋಂದಣಿಗೆ ಪೋಷಕರು/ಪಾಲಕರ ಸಮ್ಮತಿ ಮತ್ತು ಶಾಲಾ ದಾಖಲೆ ಪರಿಶೀಲನೆಗೆ ಒಪ್ಪಿಗೆ ನೀಡಲಾಗಿದೆ.',
                            'Parent/guardian confirms participation and consent for minor student portal registration and school verification.'
                          )}
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {mode === 'parent' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="parent-g-name" label={pick('ಪೋಷಕರ ಪೂರ್ಣ ಹೆಸರು', 'Guardian Full Name')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                      <FormField id="parent-rel" label={pick('ವಿದ್ಯಾರ್ಥಿಯೊಂದಿಗಿನ ಸಂಬಂಧ', 'Relationship')} required>
                        {(props) => (
                          <select
                            {...props}
                            value={guardianRelationship}
                            onChange={(e) =>
                              setGuardianRelationship(
                                e.target.value as 'mother' | 'father' | 'legal_guardian'
                              )
                            }
                            className={INPUT_BASE_CLASS}
                          >
                            <option value="mother">{pick('ತಾಯಿ', 'Mother')}</option>
                            <option value="father">{pick('ತಂದೆ', 'Father')}</option>
                            <option value="legal_guardian">{pick('ಕಾನೂನುಬದ್ಧ ಪಾಲಕರು', 'Legal Guardian')}</option>
                          </select>
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="parent-mobile" label={pick('ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'Guardian Mobile Number')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="tel"
                            value={guardianMobileNumber}
                            onChange={(e) => setGuardianMobileNumber(e.target.value)}
                            placeholder="+91 9876543210"
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                      <FormField id="parent-email" label={pick('ಇಮೇಲ್ (ಐಚ್ಛಿಕ)', 'Email Address (optional)')}>
                        {(props) => (
                          <input
                            {...props}
                            type="email"
                            value={guardianEmail}
                            onChange={(e) => setGuardianEmail(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="parent-stu-id" label={pick('ವಿದ್ಯಾರ್ಥಿ ID / SATS', 'Student ID / SATS')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={studentIdentifier}
                            onChange={(e) => setStudentIdentifier(e.target.value)}
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                      <FormField id="parent-stu-name" label={pick('ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು', 'Student Full Name')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="parent-grade" label={pick('ತರಗತಿ', 'Class')} required>
                        {(props) => (
                          <select
                            {...props}
                            value={classGrade}
                            onChange={(e) => setClassGrade(e.target.value as '8' | '9' | '10')}
                            className={INPUT_BASE_CLASS}
                          >
                            <option value="8">{pick('8ನೇ ತರಗತಿ', 'Class 8')}</option>
                            <option value="9">{pick('9ನೇ ತರಗತಿ', 'Class 9')}</option>
                            <option value="10">{pick('10ನೇ ತರಗತಿ (SSLC)', 'Class 10 (SSLC)')}</option>
                          </select>
                        )}
                      </FormField>
                      <FormField id="parent-year" label={pick('ಶೈಕ್ಷಣಿಕ ವರ್ಷ', 'Academic Year')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                    </div>
                  </>
                )}

                {mode === 'staff' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="staff-reg-name" label={pick('ಪೂರ್ಣ ಹೆಸರು', 'Full Name')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                      <FormField id="staff-reg-id" label={pick('ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿ / KGID ಸಂಖ್ಯೆ', 'Official Staff ID')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={officialStaffId}
                            onChange={(e) => setOfficialStaffId(e.target.value)}
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="staff-reg-desig" label={pick('ಹುದ್ದೆ', 'Designation')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder={pick('ಉದಾ: ಸಹ ಶಿಕ್ಷಕರು', 'e.g., Assistant Master')}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                      <FormField id="staff-reg-dept" label={pick('ವಿಭಾಗ / ಬೋಧನಾ ವಿಷಯ', 'Department / Subject')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="text"
                            value={departmentOrSubject}
                            onChange={(e) => setDepartmentOrSubject(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField id="staff-reg-mobile" label={pick('ಅಧಿಕೃತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'Official Mobile Number')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="+91 9876543210"
                            className={`${INPUT_BASE_CLASS} font-mono`}
                          />
                        )}
                      </FormField>
                      <FormField id="staff-reg-email" label={pick('ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸ', 'Official Email Address')} required>
                        {(props) => (
                          <input
                            {...props}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={INPUT_BASE_CLASS}
                          />
                        )}
                      </FormField>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={submitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {submitting ? t.reg_submitting_btn : t.reg_submit_btn}
                </Button>
              </form>
            )}
          </Card>

          <div className="lg:col-span-4 space-y-4">
            <Card surface="white" padding="md" className="space-y-3">
              <h3 className="text-sm font-bold text-[#13325e] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>{pick('ನೋಂದಣಿ ಹಂತಗಳು', 'Approval Workflow')}</span>
              </h3>
              <ol className="text-xs text-slate-700 space-y-2 list-decimal pl-4 leading-relaxed">
                <li>{pick('ಅಧಿಕೃತ ವಿವರಗಳೊಂದಿಗೆ ಸ್ವಯಂ ನೋಂದಣಿ ಸಲ್ಲಿಕೆ', 'Submit registration request without Aadhaar fields')}</li>
                <li>{pick('ಮೊಬೈಲ್ OTP ಹಾಗೂ ಇಮೇಲ್ ಸಂಪರ್ಕ ದೃಢೀಕರಣ', 'Complete mobile OTP & email verification')}</li>
                <li>{pick('ಶಾಲಾ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಪರಿಶೀಲನೆ', 'School Headmaster / Admin record verification')}</li>
                <li>{pick('ಅನುಮೋದನೆಯ ನಂತರ ಪಾತ್ರ-ಆಧಾರಿತ (RBAC) ಪ್ರವೇಶ', 'Server assigns authorized RBAC role upon approval')}</li>
              </ol>
            </Card>

            <Card surface="muted" padding="md" className="space-y-2.5">
              <p className="text-xs text-slate-700">
                {pick(
                  'ಈಗಾಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದೀರಾ? ನಿಮ್ಮ ಅನುಮೋದನೆ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
                  'Already submitted a registration? Track your approval status.'
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/registration-status')}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              >
                {t.reg_nav_status}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
