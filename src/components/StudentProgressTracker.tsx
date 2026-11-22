import React, { useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';
import { Alert, Badge, Button, Card, Modal, SectionHeading } from './ui';

export const StudentProgressTracker: React.FC = () => {
  const { t, pick } = useApp();
  const { navigate } = usePortal();
  const [isPrereqOpen, setIsPrereqOpen] = useState(false);

  const prerequisites = [
    {
      kn: '1. ಕರ್ನಾಟಕ CeG SATS API ಅಧಿಕೃತ ಅನುಮತಿ ಮತ್ತು ಒಪ್ಪಂದ (MOU).',
      en: '1. Official Centre for e-Governance (CeG) Karnataka SATS API authorization.',
    },
    {
      kn: '2. ಬ್ರೌಸರ್ ಕೋಡ್‌ನಲ್ಲಿ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ದಾಖಲೆ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಸಂಗ್ರಹಿಸದಿರುವುದು.',
      en: '2. Zero student PII or credentials stored in public frontend JavaScript bundles or localStorage.',
    },
    {
      kn: '3. ಪೋಷಕರ ನೋಂದಾಯಿತ ಮೊಬೈಲ್‌ಗೆ NIC SMS ಗೇಟ್‌ವೇ ಮೂಲಕ ಸರ್ವರ್-ಸೈಡ್ OTP ಪರಿಶೀಲನೆ.',
      en: '3. Server-side parent mobile OTP authentication routed through approved NIC SMS gateway.',
    },
    {
      kn: '4. ಸುರಕ್ಷಿತ HttpOnly, Secure ಮತ್ತು SameSite ಸೆಷನ್ ಕುಕೀಗಳ ಬಳಕೆ.',
      en: '4. Server-managed HttpOnly, Secure, and SameSite session cookies with short timeouts.',
    },
    {
      kn: '5. ಕಟ್ಟುನಿಟ್ಟಾದ ಪಾತ್ರ ಆಧಾರಿತ ಪ್ರವೇಶ ನಿಯಂತ್ರಣ (RBAC - Student & Staff ಪ್ರತ್ಯೇಕ ಪ್ರವೇಶ).',
      en: '5. Strict server-enforced Role-Based Access Control (RBAC) isolating Student and Staff APIs.',
    },
    {
      kn: '6. ಬ್ರೂಟ್-ಫೋರ್ಸ್ ದಾಳಿ ತಡೆಯಲು API ದರ ಮಿತಿ (Rate Limiting) ಮತ್ತು ಖಾತೆ ಲಾಕ್‌ಔಟ್.',
      en: '6. Server-side API rate limiting and progressive lockout protection against brute-force attempts.',
    },
    {
      kn: '7. ಪ್ರತಿಯೊಂದು ಪ್ರವೇಶ ಮತ್ತು ಡೇಟಾ ವೀಕ್ಷಣೆಯ ಆಡಿಟ್ ಲಾಗಿಂಗ್ (DPDP ಕಾಯಿದೆ ಅನುಸರಣೆ).',
      en: '7. Immutable audit logging of data access events in compliance with privacy standards.',
    },
  ];

  return (
    <section
      id="progress"
      aria-labelledby="sats-section-heading"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <SectionHeading
          headingId="sats-section-heading"
          kickerEn="DIGITAL PORTALS & UPCOMING SATS"
          kickerKn="ಡಿಜಿಟಲ್ ಪೋರ್ಟಲ್‌ಗಳು & SATS ಸೇವೆ"
          title={t.sats_upcoming_title}
          subtitle={t.sats_card_desc}
          action={
            <Badge tone="navy" icon={<Lock className="w-3.5 h-3.5" />}>
              {t.sats_upcoming_badge}
            </Badge>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Student & Staff Portal Entry Card */}
          <Card surface="white" padding="lg" className="lg:col-span-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#13325e]">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <h3 className="text-base sm:text-lg font-bold">
                  {pick(
                    'ವಿದ್ಯಾರ್ಥಿ & ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್‌ಗಳು (ಅಭಿವೃದ್ಧಿ ಪೂರ್ವವೀಕ್ಷಣೆ)',
                    'Dedicated Student & Staff Portals (Development Preview)'
                  )}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {pick(
                  'ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಶಿಕ್ಷಕರಿಗಾಗಿ ಪ್ರತ್ಯೇಕ ಲಾಗಿನ್ ಹಾಗೂ ಪಾತ್ರ-ಆಧಾರಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ರಚನೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ಈ ಸ್ಟ್ಯಾಟಿಕ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿಯ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು (PII) ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಇರಿಸದೆ, ಸುರಕ್ಷಿತ ಸರ್ವರ್ ಏಕೀಕರಣಕ್ಕೆ ಸಿದ್ಧವಿರುವ ಇಂಟರ್ಫೇಸ್ ಒದಗಿಸಲಾಗಿದೆ.',
                  'Separate Student and Staff sign-in portals with role-based dashboard workflows are ready for inspection. No real or fictional student PII is bundled in this static client; live SATS marks and attendance sync await backend API provisioning.'
                )}
              </p>

              <Alert tone="info">
                {pick(
                  'ಗೌಪ್ಯತಾ ರಕ್ಷಣೆ: ಸಾರ್ವಜನಿಕ ಜಾಲತಾಣದಲ್ಲಿ ವಿದ್ಯಾರ್ಥಿಗಳ ಹೆಸರು, ಜನ್ಮದಿನಾಂಕ, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಅಂಕಗಳನ್ನು ಪ್ರದರ್ಶಿಸುವುದಿಲ್ಲ.',
                  'Privacy Safeguard: Student names, dates of birth, mobile numbers, and grades are intentionally excluded from client bundles until live authenticated backend delivery.'
                )}
              </Alert>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/student-portal')}
                leftIcon={<GraduationCap className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.nav_student_portal}
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => navigate('/staff-portal')}
                leftIcon={<Users className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.nav_staff_portal}
              </Button>
            </div>
          </Card>

          {/* Upcoming CeG SATS Integration Roadmap Card */}
          <Card surface="muted" padding="lg" className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#13325e]">
                {pick(
                  'ಮುಂಬರುವ SATS ಇ-ಆಡಳಿತ ಸಂಯೋಜನೆ',
                  'Planned Karnataka SATS Integration'
                )}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {pick(
                      'ಅಧಿಕೃತ CeG SATS ದತ್ತಾಂಶ ಸಂಪರ್ಕದೊಂದಿಗೆ CCE ಅಂಕಪಟ್ಟಿ & ಹಾಜರಾತಿ ವೀಕ್ಷಣೆ.',
                      'Live CCE grades and attendance sync upon CeG Karnataka SATS API authorization.'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {pick(
                      'ಪೋಷಕರ ನೋಂದಾಯಿತ ಮೊಬೈಲ್‌ಗೆ OTP ದೃಢೀಕರಣ ಹಾಗೂ ಸರ್ವರ್ ಸೆಷನ್ ಭದ್ರತೆ.',
                      'Parent registered mobile OTP verification with server-side HttpOnly sessions.'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {pick(
                      'ಶಿಕ್ಷಕರಿಗಾಗಿ HRMS ದೃಢೀಕರಣ ಆಧಾರಿತ ತರಗತಿ ಹಾಜರಾತಿ ದಾಖಲಾತಿ ಸೇವೆ.',
                      'HRMS-authenticated class attendance register workflows for school faculty.'
                    )}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setIsPrereqOpen(true)}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                {t.sats_btn_checklist}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Security Prerequisites Modal */}
      <Modal
        isOpen={isPrereqOpen}
        onClose={() => setIsPrereqOpen(false)}
        titleId="sats-prereq-modal-title"
        subtitle={pick('ತಾಂತ್ರಿಕ ಮತ್ತು ಗೌಪ್ಯತಾ ಮಾನದಂಡಗಳು', 'Technical & Privacy Architecture')}
        title={t.sats_prereq_title}
        closeLabel={t.a11y_close_dialog}
        maxWidth="2xl"
        footer={
          <div className="flex justify-end w-full">
            <Button variant="primary" size="sm" onClick={() => setIsPrereqOpen(false)}>
              {t.close}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Alert tone="warning">
            {pick(
              'ನೈಜ ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿಯನ್ನು ಪ್ರಕಟಿಸುವ ಮೊದಲು ಈ ಕೆಳಗಿನ ಎಲ್ಲಾ 7 ತಾಂತ್ರಿಕ ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಸರ್ವರ್‌ನಲ್ಲಿ ಕಡ್ಡಾಯವಾಗಿ ಜಾರಿಗೊಳಿಸಲಾಗುವುದು.',
              'All 7 security controls listed below must be enforced at the backend server layer before any real student data goes live.'
            )}
          </Alert>
          <ul className="divide-y divide-slate-200 border border-slate-200 rounded-md bg-white text-xs sm:text-sm text-slate-800">
            {prerequisites.map((item, idx) => (
              <li key={idx} className="p-3.5 leading-relaxed">
                {pick(item.kn, item.en)}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </section>
  );
};
