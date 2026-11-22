import React, { useState } from 'react';
import { Search, ShieldCheck, ArrowRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import { portalApi, PortalApiError } from '../../api/portalApi';
import type { RegistrationStatusLookupResponse } from '../../../shared/types/auth';
import { PortalNavBar } from '../PortalNavBar';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  INPUT_BASE_CLASS,
} from '../ui';

export const RegistrationStatusPage: React.FC = () => {
  const { lang, t, pick } = useApp();
  const { goHome, navigate } = usePortal();

  const [referenceCode, setReferenceCode] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationStatusLookupResponse | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await portalApi.checkRegistrationStatus(
        { referenceCode: referenceCode.trim().toUpperCase(), identifier: identifier.trim() },
        lang
      );
      setResult(response);
    } catch (err) {
      if (err instanceof PortalApiError) {
        setError(err.message);
      } else {
        setError(
          pick(
            'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',
            'Unable to verify status right now. Please try again later.'
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: t.reg_nav_status },
        ]}
      />

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <Card surface="white" padding="lg" className="space-y-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-emerald-900">
                {pick('ನೋಂದಣಿ ಸ್ಥಿತಿ', 'REGISTRATION STATUS CHECK')}
              </span>
              <Badge tone="navy" icon={<ShieldCheck className="w-3 h-3" />}>
                {pick('ಗೌಪ್ಯತಾ ರಕ್ಷಿತ', 'Enumeration Protected')}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#13325e] flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
              <span>{t.reg_status_title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">{t.reg_status_sub}</p>
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <form onSubmit={handleLookup} noValidate className="space-y-4">
            <FormField
              id="status-ref-code"
              label={pick('ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ (Reference Code)', 'Registration Reference Code')}
              required
            >
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="GHS-REG-2026-XXXXXXXX"
                  className={`${INPUT_BASE_CLASS} font-mono uppercase`}
                />
              )}
            </FormField>

            <FormField
              id="status-identifier"
              label={pick(
                'ನೋಂದಾಯಿತ ID ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
                'Registered Student/Staff ID or Mobile Number'
              )}
              required
            >
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={pick('ಉದಾ: +91 9876543210 ಅಥವಾ ID', 'e.g., +91 9876543210 or ID')}
                  className={`${INPUT_BASE_CLASS} font-mono`}
                />
              )}
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? t.reg_submitting_btn : t.reg_status_btn}
            </Button>
          </form>

          {result && (
            <Alert
              tone={
                result.status === 'approved'
                  ? 'success'
                  : result.status === 'rejected' || result.status === 'revoked'
                  ? 'danger'
                  : 'warning'
              }
              title={`${pick('ಸ್ಥಿತಿ', 'Status')}: ${result.status}`}
            >
              <p className="mb-1.5">{pick(result.messageKn, result.messageEn)}</p>
              <p className="text-xs opacity-90">{pick(result.nextStepKn, result.nextStepEn)}</p>
            </Alert>
          )}

          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student-register')}
            >
              {t.reg_nav_student}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/staff-register')}
            >
              {t.reg_nav_staff}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={goHome}
              leftIcon={<Home className="w-3.5 h-3.5" />}
            >
              {t.nav_home_btn}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
