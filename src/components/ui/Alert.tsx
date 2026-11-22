import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ALERT_STYLES: Record<AlertTone, { box: string; icon: React.ReactNode }> = {
  info: {
    box: 'bg-blue-50/80 border-blue-200 text-slate-800',
    icon: <Info className="w-5 h-5 text-[#13325e] shrink-0 mt-0.5" aria-hidden="true" />,
  },
  success: {
    box: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />,
  },
  warning: {
    box: 'bg-amber-50 border-amber-300 text-amber-950',
    icon: <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />,
  },
  danger: {
    box: 'bg-red-50 border-red-200 text-red-950',
    icon: <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  tone = 'info',
  title,
  children,
  className = '',
}) => {
  const style = ALERT_STYLES[tone];
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'note'}
      className={`rounded-lg border p-4 text-xs sm:text-sm flex items-start gap-3 ${style.box} ${className}`}
    >
      {style.icon}
      <div className="space-y-1 flex-1 min-w-0">
        {title && <strong className="block font-bold text-[#13325e]">{title}</strong>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
