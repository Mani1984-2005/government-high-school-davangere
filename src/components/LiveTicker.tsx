import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';

interface LiveTickerProps {
  lang: Language;
  onNoticeClick: () => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ lang, onNoticeClick }) => {
  const t = UI_STRINGS[lang];

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-xs text-amber-950 py-2 px-4" role="region" aria-label="Official announcements ticker">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-red-700 text-white font-bold rounded text-[11px] tracking-wide">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>{t.ticker_label}</span>
        </span>
        <button
          onClick={onNoticeClick}
          className="text-left font-medium text-amber-900 hover:text-red-800 hover:underline truncate cursor-pointer transition-colors"
          title="Click to view circular"
        >
          {t.ticker_text}
        </button>
      </div>
    </div>
  );
};
