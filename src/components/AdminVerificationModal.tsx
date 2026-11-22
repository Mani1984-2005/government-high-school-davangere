import React from 'react';
import { Printer, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOOL_VERIFICATION_CHECKLIST, SCHOOL_INFO } from '../data/schoolData';
import { Alert, Badge, Button, Modal } from './ui';

interface AdminVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, t, pick } = useApp();
  const totalCount = SCHOOL_VERIFICATION_CHECKLIST.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="admin-verify-title"
      subtitle={pick(
        'ಶಾಲಾ ನಿಯೋಜನೆ ಪೂರ್ವ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ (Read-Only)',
        'Pre-Deployment Administrative Audit (Read-Only)'
      )}
      title={t.admin_verify_title}
      closeLabel={t.a11y_close_dialog}
      maxWidth="3xl"
      printable
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <span className="text-xs text-slate-600">
            {pick(
              `ಒಟ್ಟು ${totalCount} ಅಂಶಗಳು · ನೈಜ CMS ದೃಢೀಕರಣ ಬಾಕಿ`,
              `${totalCount} items tracked · Authenticated admin CMS required for updates`
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              {pick('ಪಟ್ಟಿ ಮುದ್ರಿಸಿ (Print Checklist)', 'Print Audit Checklist')}
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.close}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs sm:text-sm">
        <Alert
          tone="warning"
          title={pick(
            'ಶಾಲಾ ಆಡಳಿತ ಹಾಗೂ ತಾಂತ್ರಿಕ ಪರಿಶೀಲಕರಿಗೆ ಪ್ರಮುಖ ಸೂಚನೆ:',
            'Important Notice for School Administration & Technical Reviewers:'
          )}
        >
          {pick(
            `ಈ ಜಾಲತಾಣವನ್ನು ಸಾರ್ವಜನಿಕ ಉತ್ಪಾದನಾ ಸರ್ವರ್‌ಗೆ ನಿಯೋಜಿಸುವ ಮುನ್ನ ಕೆಳಗಿನ ${totalCount} ಸಾಂಸ್ಥಿಕ ವಿವರಗಳನ್ನು ಮುಖ್ಯ ಶಿಕ್ಷಕರು ಹಾಗೂ BEO ಕಚೇರಿಯ ಅಧಿಕೃತ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ ದೃಢಪಡಿಸಿಕೊಳ್ಳಬೇಕು. ಇದು ಕೇವಲ ಪೂರ್ವವೀಕ್ಷಣಾ ಪಟ್ಟಿಯಾಗಿದ್ದು, ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಶಾಶ್ವತ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸುವುದಿಲ್ಲ.`,
            `Before deploying to a live public server, the following ${totalCount} institutional items must be formally confirmed by the Headmaster and BEO office against authorized records. This is a read-only audit sheet until an authenticated admin backend is connected.`
          )}
        </Alert>

        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-md border border-slate-200 text-xs">
          <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#13325e]" aria-hidden="true" />
            <span>
              {pick('ಒಟ್ಟು ಪರಿಶೀಲನಾ ಅಂಶಗಳು:', 'Total Audit Items:')}{' '}
              <strong className="font-mono tabular-nums">{totalCount}</strong>
            </span>
          </span>
          <span className="font-mono font-bold text-[#13325e] tabular-nums">
            UDISE: {SCHOOL_INFO.udise}
          </span>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
          {SCHOOL_VERIFICATION_CHECKLIST.map((fact, index) => (
            <div key={fact.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-bold text-xs sm:text-sm text-[#13325e]">
                  {index + 1}. {pick(fact.itemKn, fact.itemEn)}
                </h4>
                <Badge tone={fact.status === 'Pending School Approval' ? 'warning' : 'neutral'}>
                  {fact.status === 'Pending School Approval'
                    ? pick('ಶಾಲಾ ದೃಢೀಕರಣ ಬಾಕಿ', 'Pending School Approval')
                    : pick('ಮಾದರಿ ಸ್ಥಿತಿ (Draft)', 'Draft Prototype Value')}
                </Badge>
              </div>

              <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">
                  {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಕರಡು ಮೌಲ್ಯ: ' : 'Current Draft Value: '}
                </span>
                <strong className="font-mono text-slate-900">{fact.currentValue}</strong>
              </div>

              <p className="text-xs text-slate-600 leading-snug">
                <strong>{lang === 'kn' ? 'ಅಗತ್ಯ ದಾಖಲೆ:' : 'Verification Source:'} </strong>
                {pick(fact.requiredDocumentKn, fact.requiredDocumentEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
