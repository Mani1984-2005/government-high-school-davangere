import React from 'react';
import { ShieldAlert, GraduationCap, Users, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePortal } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { PortalNavBar } from '../PortalNavBar';
import { Alert, Button, Card } from '../ui';

interface UnauthorizedViewProps {
  requiredRole: UserRole;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({ requiredRole }) => {
  const { t, pick } = useApp();
  const { navigate, goHome, session } = usePortal();

  const targetTitle =
    requiredRole === 'student' ? t.nav_student_portal : t.nav_staff_portal;

  return (
    <div className="min-h-[70vh] bg-slate-50 flex flex-col">
      <PortalNavBar
        breadcrumbs={[
          { label: t.nav_home, onClick: goHome },
          { label: targetTitle },
          { label: pick('ಪ್ರವೇಶ ನಿರ್ಬಂಧಿತ', 'Access Required') },
        ]}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card surface="white" padding="lg" className="max-w-lg w-full space-y-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#13325e]">
              {t.auth_unauthorized_title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.auth_unauthorized_desc}
            </p>
          </div>

          {session && session.role !== requiredRole && (
            <Alert tone="warning" className="text-left">
              {pick(
                `ನೀವು ಪ್ರಸ್ತುತ '${session.role === 'student' ? 'ವಿದ್ಯಾರ್ಥಿ' : 'ಸಿಬ್ಬಂದಿ'}' ಪಾತ್ರದೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿರುವಿರಿ. ಈ ಪುಟವನ್ನು ವೀಕ್ಷಿಸಲು '${requiredRole === 'student' ? 'ವಿದ್ಯಾರ್ಥಿ' : 'ಸಿಬ್ಬಂದಿ'}' ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ.`,
                `You are currently signed in with the '${session.role}' role. Viewing this route requires an authorized '${requiredRole}' session.`
              )}
            </Alert>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {requiredRole === 'student' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/student-portal')}
                leftIcon={<GraduationCap className="w-4 h-4" />}
              >
                {t.auth_go_student_login}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/staff-portal')}
                leftIcon={<Users className="w-4 h-4" />}
              >
                {t.auth_go_staff_login}
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={goHome}
              leftIcon={<Home className="w-4 h-4" />}
            >
              {t.nav_home_btn}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
