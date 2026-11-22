import React from 'react';

interface SectionHeadingProps {
  kickerEn: string;
  kickerKn: string;
  title: string;
  subtitle?: string;
  headingId?: string;
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kickerEn,
  kickerKn,
  title,
  subtitle,
  headingId,
  action,
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 text-xs font-semibold text-emerald-900 tracking-wide">
          <span>{kickerEn}</span>
          <span aria-hidden="true">·</span>
          <span>{kickerKn}</span>
        </p>
        <h2
          id={headingId}
          className="text-2xl sm:text-3xl font-bold text-[#13325e] leading-snug"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
