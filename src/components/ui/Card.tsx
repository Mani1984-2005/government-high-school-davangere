import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'white' | 'muted' | 'tinted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const SURFACE_CLASSES = {
  white: 'bg-white border-slate-200',
  muted: 'bg-slate-50 border-slate-200',
  tinted: 'bg-blue-50/60 border-blue-200',
};

const PADDING_CLASSES = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  surface = 'white',
  padding = 'md',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`rounded-lg border shadow-2xs ${SURFACE_CLASSES[surface]} ${PADDING_CLASSES[padding]} ${
        interactive ? 'transition-colors duration-150 hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
