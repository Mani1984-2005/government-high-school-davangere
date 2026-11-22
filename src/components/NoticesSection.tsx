import React, { useState, useEffect } from 'react';
import { Language, NoticeItem } from '../types';
import { UI_STRINGS } from '../data/translations';
import { NOTICES_DATA, SCHOOL_INFO } from '../data/schoolData';

interface NoticesSectionProps {
  lang: Language;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeNotice) {
        setActiveNotice(null);
      }
    };
    if (activeNotice) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNotice]);

  const categories = [
    { id: 'all', label: t.filter_all },
    { id: 'exam', label: t.filter_exam },
    { id: 'gov', label: t.filter_gov },
    { id: 'scholarship', label: t.filter_scholarship },
    { id: 'sdmc', label: t.filter_sdmc },
    { id: 'events', label: t.filter_events },
  ];

  const filteredNotices = NOTICES_DATA.filter((n) => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const title = (lang === 'kn' ? n.titleKn : n.titleEn).toLowerCase();
    const summary = (lang === 'kn' ? n.summaryKn : n.summaryEn).toLowerCase();
    return matchesCategory && (title.includes(q) || summary.includes(q));
  });

  const handlePrintNotice = () => {
    window.print();
  };

  return (
    <section id="notices" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>OFFICIAL CIRCULARS</span>
            <span>·</span>
            <span>ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.notices_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.notices_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Notices Board & Filters */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter Tabs & Search */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Notice categories">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === c.id
                        ? 'bg-[#13325e] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search_placeholder}
                  className="w-full px-3 py-2 pl-9 bg-white border border-slate-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#13325e] text-slate-900"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Notice Cards List */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
              {filteredNotices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  {lang === 'kn'
                    ? 'ಯಾವುದೇ ಸುತ್ತೋಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಬಳಸಿ.'
                    : 'No circulars found matching your search. Please adjust the filter.'}
                </div>
              ) : (
                filteredNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {/* Date Badge */}
                    <div className="shrink-0 w-16 text-center bg-blue-50 border border-blue-200 text-[#13325e] rounded p-2">
                      <span className="block text-2xl font-bold font-mono leading-none">
                        {notice.day}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                        {lang === 'kn' ? notice.monthKn : notice.monthEn}
                      </span>
                    </div>

                    {/* Notice Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notice.isImportant && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded border border-red-200">
                            {lang === 'kn' ? 'ತುರ್ತು / ಮುಖ್ಯ' : 'CRITICAL'}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">
                          {notice.refNo}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-emerald-800 font-medium">
                          {notice.pdfSize}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#13325e] leading-snug">
                        {lang === 'kn' ? notice.titleKn : notice.titleEn}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {lang === 'kn' ? notice.summaryKn : notice.summaryEn}
                      </p>

                      <div className="pt-1">
                        <button
                          onClick={() => setActiveNotice(notice)}
                          className="text-xs font-bold text-[#13325e] hover:text-amber-600 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t.btn_read_full}</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Headmaster Desk Card */}
          <aside className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border-3 border-amber-400 p-1 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
                {/* Clean portrait avatar icon */}
                <svg className="w-16 h-16 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#13325e]">
                {lang === 'kn' ? SCHOOL_INFO.headmasterKn : SCHOOL_INFO.headmasterEn}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {t.hm_designation}
              </p>
              <div className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded">
                {lang === 'kn' ? '28 ವರ್ಷಗಳ ಬೋಧನಾ ಸೇವೆ' : '28 Years of Dedicated Service'}
              </div>
            </div>

            <blockquote className="text-xs sm:text-sm text-slate-700 italic bg-white p-3.5 rounded border border-slate-200 leading-relaxed shadow-2xs">
              "{t.hm_quote}"
            </blockquote>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-medium">{t.hm_timing}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-mono text-slate-800 font-bold">{SCHOOL_INFO.phone}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Official Circular View Modal */}
      {activeNotice && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="circular-modal-title"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border-t-4 border-[#13325e] overflow-hidden my-8 printable-area">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700">
                  {t.ref_no_label} {activeNotice.refNo}
                </span>
              </div>
              <button
                onClick={() => setActiveNotice(null)}
                className="text-slate-500 hover:text-slate-800 p-1 text-lg font-bold cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Circular Paper Body (Simulating Official Karnataka Govt Circular) */}
            <div className="p-6 sm:p-8 space-y-4 text-slate-900">
              {/* Official Seal & Heading */}
              <div className="text-center border-b-2 border-slate-300 pb-4">
                <div className="mb-2 p-1 bg-amber-50 border border-dashed border-amber-300 text-center text-[10px] text-amber-900 font-semibold rounded">
                  {lang === 'kn' ? '⚠️ ಅಧಿಕೃತ ಕರಡು ಪ್ರತಿ (Official Circular Specimen Preview)' : '⚠️ Official Circular Specimen Preview'}
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  {t.gov_dept}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-[#13325e] mt-1">
                  {lang === 'kn' ? SCHOOL_INFO.nameKn : SCHOOL_INFO.nameEn}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {lang === 'kn' ? SCHOOL_INFO.divisionKn : SCHOOL_INFO.divisionEn} · UDISE: {SCHOOL_INFO.udise}
                </p>
                <div className="mt-2 text-xs font-mono font-semibold text-slate-500 flex justify-between px-2">
                  <span>{activeNotice.refNo}</span>
                  <span>{lang === 'kn' ? activeNotice.dateStrKn : activeNotice.dateStrEn}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-3 pt-2">
                <h4 id="circular-modal-title" className="text-base sm:text-lg font-bold text-[#13325e] leading-snug">
                  {lang === 'kn' ? activeNotice.titleKn : activeNotice.titleEn}
                </h4>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
                  {lang === 'kn' ? activeNotice.fullContentKn : activeNotice.fullContentEn}
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200 mt-6">
                <div className="text-left text-xs text-slate-500">
                  <div className="w-20 h-20 border-2 border-dashed border-amber-500 rounded-full flex flex-col items-center justify-center text-[9px] text-amber-900 bg-amber-50/50 font-semibold text-center p-1">
                    <span>[ಮಾದರಿ ಮುದ್ರೆ]</span>
                    <span>SPECIMEN</span>
                    <span>SEAL</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-slate-900">
                    {lang === 'kn' ? SCHOOL_INFO.headmasterKn : SCHOOL_INFO.headmasterEn}
                  </p>
                  <p className="text-slate-600">{t.hm_designation}</p>
                  <p className="text-[10px] text-slate-400 italic">[ಕರಡು ಪ್ರತಿ / Draft Copy]</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center no-print">
              <span className="text-xs text-slate-500 font-mono">
                {activeNotice.pdfSize} · Official Document
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintNotice}
                  className="px-4 py-2 bg-[#13325e] text-white text-xs font-bold rounded hover:bg-[#0c1f3c] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>{t.btn_download_sim}</span>
                </button>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="px-3.5 py-2 bg-slate-200 text-slate-800 text-xs font-semibold rounded hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
