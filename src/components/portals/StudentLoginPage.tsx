import React, { useState } from 'react';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Home,
  HelpCircle,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import { PortalNavBar } from '../PortalNavBar';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  INPUT_BASE_CLASS,
  Modal,
} from '../ui';

export const StudentLoginPage: React.FC = () => {
  const { t, pick } = useApp();
  const { navigate, goHome, loginDemoStudent, session } = usePortal();

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ studentId?: string; password?: string }>({});
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { studentId?: string; password?: string } = {};
    const cleanId = studentId.trim();

    if (cleanId.length < 6 || !/^[A-Za-z0-9_-]+$/.test(cleanId)) {
      nextErrors.studentId = t.student_id_err;
    }
    if (password.length < 6) {
      nextErrors.password = t.student_pw_err;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Development Preview only: real deployment delegates verification to POST /api/auth/student/login
    loginDemoStudent(cleanId);
    setPassword('');
    navigate('/student-dashboard');
  };

  const handleDevPreview = () => {
    loginDemoStudent('PREVIEW-SATS-01');
    setPassword('');
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: t.nav_student_portal },
        ]}
      />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Portal Login Form */}
          <Card surface="white" padding="lg" className="lg:col-span-7 space-y-5">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-emerald-900">
                  {pick('ವಿದ್ಯಾರ್ಥಿ ಪ್ರವೇಶ ದ್ವಾರ', 'STUDENT PORTAL ACCESS')}
                </span>
                <Badge tone="warning" icon={<Lock className="w-3 h-3" />}>
                  {t.auth_dev_badge}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#13325e] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
                <span>{t.student_portal_title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">{t.student_portal_sub}</p>
            </div>

            {session?.role === 'student' && (
              <Alert tone="success">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {pick(
                      `ನೀವು ಈಗಾಗಲೇ '${session.userId}' ಖಾತೆಯಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿರುವಿರಿ.`,
                      `You are already signed in as '${session.userId}'.`
                    )}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/student-dashboard')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {pick('ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ', 'Open Dashboard')}
                  </Button>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                id="student-login-id"
                label={t.student_id_label}
                required
                error={errors.studentId}
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    autoComplete="username"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errors.studentId) setErrors((p) => ({ ...p, studentId: undefined }));
                    }}
                    placeholder={t.student_id_placeholder}
                    className={`${INPUT_BASE_CLASS} font-mono`}
                  />
                )}
              </FormField>

              <FormField
                id="student-login-password"
                label={t.student_pw_label}
                required
                error={errors.password}
              >
                {(props) => (
                  <div className="relative">
                    <input
                      {...props}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder={t.student_pw_placeholder}
                      className={`${INPUT_BASE_CLASS} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t.auth_hide_pw : t.auth_show_pw}
                      aria-pressed={showPassword}
                      className="absolute right-1.5 top-1 min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded text-slate-600 hover:text-[#13325e] hover:bg-slate-100 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}
              </FormField>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="font-semibold text-[#13325e] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.auth_forgot_pw}</span>
                </button>
                <span className="text-slate-500">
                  {pick('ಸುರಕ್ಷಿತ HttpOnly ಸೆಷನ್ (ನಿಯೋಜಿತ)', 'HttpOnly Session Ready')}
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                {t.auth_remember_note}
              </p>

              <div className="space-y-2.5 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.student_login_btn}
                </Button>

                <Button
                  type="button"
                  variant="accent"
                  size="md"
                  fullWidth
                  onClick={handleDevPreview}
                >
                  {t.auth_dev_enter_student}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={goHome}
                  leftIcon={<Home className="w-4 h-4" />}
                >
                  {t.nav_home_btn}
                </Button>
              </div>
            </form>
          </Card>

          {/* Right Column: Security Architecture Note & Staff Switch */}
          <div className="lg:col-span-5 space-y-5">
            <Alert tone="info" title={pick('ದೃಢೀಕರಣ ಸ್ಥಿತಿ & ಭದ್ರತೆ', 'Authentication & Privacy Notice')}>
              {t.auth_backend_notice}
            </Alert>

            <Card surface="white" padding="md" className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
                {pick('ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸೌಲಭ್ಯಗಳು', 'Inside the Student Workspace')}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5 leading-relaxed">
                <li>{pick('KSEAB 8–10ನೇ ತರಗತಿ ವಿಷಯಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾರ್ಗಸೂಚಿ', 'KSEAB Grades 8–10 subjects and CCE exam calendar')}</li>
                <li>{pick('SSLC ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಮತ್ತು ನೀಲನಕ್ಷೆ ಡೌನ್‌ಲೋಡ್', 'SSLC study capsules and downloadable blueprint guides')}</li>
                <li>{pick('ಶಾಲಾ ಅಧಿಕೃತ ಸುತ್ತೋಲೆಗಳು ಹಾಗೂ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP / NMMS) ವಿವರ', 'Official circulars, Akshara Dasoha & SSP/NMMS entitlements')}</li>
                <li>{pick('ಹಾಜರಾತಿ ನಿಯಮಾವಳಿ & SATS ಏಕೀಕರಣ ಸ್ಥಿತಿ', 'Attendance rules (75% mandate) & upcoming SATS sync status')}</li>
              </ul>
            </Card>

            <Card surface="muted" padding="md" className="flex items-center justify-between gap-3">
              <div className="text-xs">
                <strong className="block text-[#13325e]">
                  {pick('ಶಿಕ್ಷಕರು ಅಥವಾ ಕಚೇರಿ ಸಿಬ್ಬಂದಿಯೇ?', 'Are you Teaching / Office Staff?')}
                </strong>
                <span className="text-slate-600">
                  {pick('ಪ್ರತ್ಯೇಕ ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್ ಬಳಸಿ.', 'Use the dedicated Staff Portal.')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/staff-portal')}
                leftIcon={<Users className="w-3.5 h-3.5" />}
              >
                {t.nav_staff_portal}
              </Button>
            </Card>

            <Card surface="white" padding="md" className="space-y-2.5">
              <strong className="block text-xs text-[#13325e]">
                {pick('ಹೊಸ ನೋಂದಣಿ & ಅನುಮೋದನೆ ಸ್ಥಿತಿ', 'New Registration & Status')}
              </strong>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/student-register')}
                >
                  {t.reg_nav_student}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/parent-register')}
                >
                  {t.reg_nav_parent}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/registration-status')}
                >
                  {t.reg_nav_status}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Forgot Password Guidance Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        titleId="student-forgot-pw-title"
        title={t.auth_forgot_title}
        closeLabel={t.a11y_close_dialog}
        maxWidth="md"
        footer={
          <div className="flex justify-end w-full">
            <Button variant="primary" size="sm" onClick={() => setIsForgotOpen(false)}>
              {t.close}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>{t.student_forgot_body}</p>
          <Alert tone="warning">
            {pick(
              'ಯಾವುದೇ OTP ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಅಪರಿಚಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
              'Never share SATS credentials or OTP verification codes with unauthorized individuals.'
            )}
          </Alert>
        </div>
      </Modal>
    </div>
  );
};
