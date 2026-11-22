import React from 'react';
import { Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LiveTickerProps {
  onNoticeClick: () => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ onNoticeClick }) => {
  const { t } = useApp();

  return (
    <div
      className="ticker-band bg-amber-50 border-b border-amber-200 text-xs text-amber-950 py-2 px-4 no-print"
      role="region"
      aria-label={t.ticker_label}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-800 text-white font-bold rounded text-[11px] tracking-wide">
          <Megaphone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.ticker_label}</span>
        </span>
        <button
          type="button"
          onClick={onNoticeClick}
          className="text-left font-medium text-amber-950 hover:text-red-800 hover:underline truncate cursor-pointer transition-colors"
        >
          {t.ticker_text}
        </button>
      </div>
    </div>
  );
};
