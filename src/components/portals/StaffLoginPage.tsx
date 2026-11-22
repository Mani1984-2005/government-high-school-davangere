import React, { useState } from 'react';
import {
  Users,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Home,
  HelpCircle,
  GraduationCap,
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

export const StaffLoginPage: React.FC = () => {
  const { t, pick } = useApp();
  const { navigate, goHome, loginDemoStaff, session } = usePortal();

  const [staffIdOrEmail, setStaffIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ staffId?: string; password?: string }>({});
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { staffId?: string; password?: string } = {};
    const clean = staffIdOrEmail.trim();
    const looksLikeEmail = clean.includes('@');

    if (
      clean.length < 4 ||
      (looksLikeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) ||
      (!looksLikeEmail && !/^[A-Za-z0-9_-]+$/.test(clean))
    ) {
      nextErrors.staffId = t.staff_id_err;
    }
    if (password.length < 6) {
      nextErrors.password = t.staff_pw_err;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Development Preview only: real deployment validates via POST /api/auth/staff/login (scrypt + HttpOnly cookie)
    loginDemoStaff(clean);
    setPassword('');
    navigate('/staff-dashboard');
  };

  const handleDevPreview = () => {
    loginDemoStaff('STAFF-PREVIEW-01');
    setPassword('');
    navigate('/staff-dashboard');
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: t.nav_staff_portal },
        ]}
      />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Staff Sign-In Form */}
          <Card surface="white" padding="lg" className="lg:col-span-7 space-y-5">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-emerald-900">
                  {pick('ಬೋಧಕ & ಕಚೇರಿ ಸಿಬ್ಬಂದಿ ಪ್ರವೇಶ', 'FACULTY & STAFF ACCESS')}
                </span>
                <Badge tone="warning" icon={<Lock className="w-3 h-3" />}>
                  {t.auth_dev_badge}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#13325e] flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
                <span>{t.staff_portal_title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">{t.staff_portal_sub}</p>
            </div>

            {session?.role === 'staff' && (
              <Alert tone="success">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {pick(
                      `ನೀವು ಈಗಾಗಲೇ '${session.userId}' ಸಿಬ್ಬಂದಿ ಖಾತೆಯಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿರುವಿರಿ.`,
                      `You are already signed in as '${session.userId}'.`
                    )}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/staff-dashboard')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {pick('ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ', 'Open Workspace')}
                  </Button>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                id="staff-login-id"
                label={t.staff_id_label}
                required
                error={errors.staffId}
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    autoComplete="username"
                    value={staffIdOrEmail}
                    onChange={(e) => {
                      setStaffIdOrEmail(e.target.value);
                      if (errors.staffId) setErrors((p) => ({ ...p, staffId: undefined }));
                    }}
                    placeholder={t.staff_id_placeholder}
                    className={`${INPUT_BASE_CLASS} font-mono`}
                  />
                )}
              </FormField>

              <FormField
                id="staff-login-password"
                label={t.staff_pw_label}
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
                      placeholder={t.staff_pw_placeholder}
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
                  {pick('RBAC ಸರ್ವರ್ ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ', 'Backend RBAC Ready')}
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.staff_login_btn}
                </Button>

                <Button
                  type="button"
                  variant="accent"
                  size="md"
                  fullWidth
                  onClick={handleDevPreview}
                >
                  {t.auth_dev_enter_staff}
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

          {/* Right Column: Backend Requirements & Student Switch */}
          <div className="lg:col-span-5 space-y-5">
            <Alert tone="info" title={pick('ಸುರಕ್ಷಿತ ಸಿಬ್ಬಂದಿ ದೃಢೀಕರಣ ನೀತಿ', 'Staff Security Policy')}>
              {t.auth_backend_notice}
            </Alert>

            <Card surface="white" padding="md" className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#13325e]">
                {pick('ಸಿಬ್ಬಂದಿ ಕಾರ್ಯಕ್ಷೇತ್ರದ ವಿಭಾಗಗಳು', 'Inside the Staff Workspace')}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5 leading-relaxed">
                <li>{pick('ದೈನಂದಿನ ಶಾಲಾ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ತರಗತಿ ಅವಧಿಗಳು', 'Daily school bell schedule & periods')}</li>
                <li>{pick('SSLC ಬೋಧನಾ ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು KSEAB ನೀಲನಕ್ಷೆ', 'SSLC academic resources & KSEAB blueprints')}</li>
                <li>{pick('ಶಾಲಾ ಪ್ರಕಟಣೆಗಳು, SDMC ನಡಾವಳಿ & ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ', 'Official circulars, SDMC resolutions & audit status')}</li>
                <li>{pick('ತರಗತಿ ಹಾಜರಾತಿ ಮಾಡ್ಯೂಲ್ (ಸರ್ವರ್ API ನಿಯೋಜಿತ)', 'Attendance management interface (disabled until backend API)')}</li>
              </ul>
            </Card>

            <Card surface="muted" padding="md" className="flex items-center justify-between gap-3">
              <div className="text-xs">
                <strong className="block text-[#13325e]">
                  {pick('ವಿದ್ಯಾರ್ಥಿ ಅಥವಾ ಪೋಷಕರೇ?', 'Student or Parent Sign-In?')}
                </strong>
                <span className="text-slate-600">
                  {pick('ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್‌ಗೆ ತೆರಳಿ.', 'Switch to Student Portal login.')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student-portal')}
                leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
              >
                {t.nav_student_portal}
              </Button>
            </Card>

            <Card surface="white" padding="md" className="space-y-2.5">
              <strong className="block text-xs text-[#13325e]">
                {pick('ಸಿಬ್ಬಂದಿ ನೋಂದಣಿ & ಅನುಮೋದನೆ ಸ್ಥಿತಿ', 'Staff Registration & Status')}
              </strong>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/staff-register')}
                >
                  {t.reg_nav_staff}
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

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        titleId="staff-forgot-pw-title"
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
          <p>{t.staff_forgot_body}</p>
          <Alert tone="warning">
            {pick(
              'ಯಾವುದೇ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವಿಕೆಗಳು ಕೇವಲ ಅಧಿಕೃತ ಕಚೇರಿ ಪರಿಶೀಲನೆಯ ನಂತರ ಮಾತ್ರ ನಡೆಯುತ್ತವೆ.',
              'Administrative credential resets require in-person verification via the Headmaster or BEO office.'
            )}
          </Alert>
        </div>
      </Modal>
    </div>
  );
};
