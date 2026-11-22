import React from 'react';
import { ArrowLeft, Home, ChevronRight, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePortal } from '../context/AuthContext';
import { Button } from './ui';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PortalNavBarProps {
  breadcrumbs: BreadcrumbItem[];
}

export const PortalNavBar: React.FC<PortalNavBarProps> = ({ breadcrumbs }) => {
  const { t, pick } = useApp();
  const { goBack, goHome, session, logout, navigate } = usePortal();

  return (
    <div className="bg-white border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left Navigation Controls + Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="min-h-[40px]"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {t.nav_back_btn}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={goHome}
              className="min-h-[40px]"
              leftIcon={<Home className="w-4 h-4" />}
            >
              {t.nav_home_btn}
            </Button>
          </div>

          <nav
            aria-label={t.breadcrumb_label}
            className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600 min-w-0"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${idx}`}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  )}
                  {isLast || !crumb.onClick ? (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={
                        isLast ? 'font-bold text-[#13325e] truncate' : 'font-medium text-slate-600'
                      }
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="font-medium text-slate-700 hover:text-[#13325e] hover:underline cursor-pointer"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right Session Control */}
        {session && (
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="hidden sm:inline text-xs text-slate-600 font-medium">
              <span className="font-mono font-bold text-[#13325e]">{session.userId}</span>
              {' · '}
              {pick('ಪ್ರಾಯೋಗಿಕ ಸೆಷನ್', 'Dev Session')}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[40px]"
              onClick={() => {
                logout();
                navigate('/');
              }}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              {t.auth_logout}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
