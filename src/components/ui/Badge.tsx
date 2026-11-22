import React from 'react';

export type BadgeTone = 'neutral' | 'navy' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-800 border-slate-300',
  navy: 'bg-[#13325e] text-white border-[#13325e]',
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  warning: 'bg-amber-50 text-amber-950 border-amber-300',
  danger: 'bg-red-50 text-red-900 border-red-200',
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  icon,
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-semibold whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
