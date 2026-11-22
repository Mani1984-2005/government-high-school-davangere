import React, { useState } from 'react';
import {
  Search,
  X,
  Clock,
  Phone,
  Printer,
  Download,
  User,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NOTICES_DATA, SCHOOL_INFO } from '../data/schoolData';
import { NoticeItem } from '../types';
import {
  Badge,
  Button,
  Card,
  INPUT_BASE_CLASS,
  Modal,
  SectionHeading,
  Tabs,
  TabItem,
} from './ui';

type NoticeCategory = NoticeItem['category'];

export const NoticesSection: React.FC = () => {
  const { lang, t, pick } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  const categories: TabItem<NoticeCategory>[] = [
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
    const haystack = [
      n.titleKn,
      n.titleEn,
      n.summaryKn,
      n.summaryEn,
      n.refNo,
    ]
      .join(' ')
      .toLowerCase();
    return matchesCategory && haystack.includes(q);
  });

  const handleDownloadSpecimen = (notice: NoticeItem) => {
    const content = [
      pick(SCHOOL_INFO.deptKn, SCHOOL_INFO.deptEn),
      pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn),
      `${pick(SCHOOL_INFO.divisionKn, SCHOOL_INFO.divisionEn)} | UDISE: ${SCHOOL_INFO.udise}`,
      '------------------------------------------------------------',
      `Ref No: ${notice.refNo}`,
      `Date: ${pick(notice.dateStrKn, notice.dateStrEn)}`,
      '',
      pick(notice.titleKn, notice.titleEn),
      '',
      pick(notice.fullContentKn, notice.fullContentEn),
      '',
      '------------------------------------------------------------',
      `${pick(SCHOOL_INFO.headmasterKn, SCHOOL_INFO.headmasterEn)}`,
      t.hm_designation,
      '[Specimen Circular / Draft Copy]',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${notice.id}-circular.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="notices"
      aria-labelledby="notices-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          headingId="notices-section-heading"
          kickerEn="OFFICIAL CIRCULARS"
          kickerKn="ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು"
          title={t.notices_heading}
          subtitle={t.notices_sub}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Notices Board & Filters */}
          <div className="lg:col-span-8 space-y-4">
            <Card surface="muted" padding="sm" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Tabs
                  items={categories}
                  activeId={selectedCategory}
                  onChange={setSelectedCategory}
                  ariaLabel={t.notices_heading}
                  idPrefix="notices-filter"
                />
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {filteredNotices.length} {t.notices_count_label}
                </span>
              </div>

              <div className="relative">
                <label htmlFor="notices-search-input" className="sr-only">
                  {t.search_placeholder}
                </label>
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="notices-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search_placeholder}
                  className={`${INPUT_BASE_CLASS} pl-9 pr-9`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={t.a11y_close_dialog}
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </Card>

            {/* Notice Cards List */}
            <div
              id={`notices-filter-panel-${selectedCategory}`}
              role="tabpanel"
              aria-labelledby={`notices-filter-tab-${selectedCategory}`}
              className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs"
            >
              {filteredNotices.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-sm">
                  {lang === 'kn'
                    ? 'ಯಾವುದೇ ಸುತ್ತೋಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಬಳಸಿ.'
                    : 'No circulars found matching your search. Please adjust the filter.'}
                </div>
              ) : (
                filteredNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {/* Date Block */}
                    <div className="shrink-0 w-16 text-center bg-blue-50/80 border border-blue-200 text-[#13325e] rounded-md p-2">
                      <span className="block text-2xl font-bold font-mono leading-none tabular-nums">
                        {notice.day}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                        {pick(notice.monthKn, notice.monthEn)}
                      </span>
                    </div>

                    {/* Notice Body */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                        {notice.isImportant && (
                          <Badge tone="danger" icon={<AlertCircle className="w-3 h-3" />}>
                            {lang === 'kn' ? 'ತುರ್ತು / ಮುಖ್ಯ' : 'IMPORTANT'}
                          </Badge>
                        )}
                        <span className="font-mono">{notice.refNo}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-900 font-medium font-mono">
                          {notice.pdfSize}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#13325e] leading-snug">
                        {pick(notice.titleKn, notice.titleEn)}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {pick(notice.summaryKn, notice.summaryEn)}
                      </p>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveNotice(notice)}
                          className="text-xs font-bold text-[#13325e] hover:text-amber-700 inline-flex items-center gap-1.5 cursor-pointer py-1"
                        >
                          <span>{t.btn_read_full}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Headmaster Desk */}
          <aside aria-label={t.hm_desk_title} className="lg:col-span-4">
            <Card surface="muted" padding="md" className="space-y-4">
              <div className="text-center space-y-2">
                <div
                  className="w-20 h-20 mx-auto rounded-full bg-slate-200 border-2 border-amber-500 flex items-center justify-center text-slate-600"
                  aria-hidden="true"
                >
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#13325e]">
                    {pick(SCHOOL_INFO.headmasterKn, SCHOOL_INFO.headmasterEn)}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {t.hm_designation}
                  </p>
                </div>
                <p className="text-xs font-semibold text-emerald-900">
                  {lang === 'kn' ? '28 ವರ್ಷಗಳ ಬೋಧನಾ ಸೇವೆ' : '28 Years of Dedicated Service'}
                </p>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-md border border-slate-200 leading-relaxed">
                “{t.hm_quote}”
              </blockquote>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-medium">{t.hm_timing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${SCHOOL_INFO.phone}`}
                    className="font-mono text-[#13325e] font-bold hover:underline"
                  >
                    {SCHOOL_INFO.phone}
                  </a>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Accessible Circular Preview Modal */}
      <Modal
        isOpen={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        titleId="circular-modal-title"
        subtitle={activeNotice ? `${t.ref_no_label} ${activeNotice.refNo}` : undefined}
        title={activeNotice ? pick(activeNotice.titleKn, activeNotice.titleEn) : ''}
        closeLabel={t.a11y_close_dialog}
        maxWidth="2xl"
        printable
        footer={
          activeNotice && (
            <>
              <span className="text-xs text-slate-500 font-mono">
                {activeNotice.pdfSize} · Specimen Document
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadSpecimen(activeNotice)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  {t.btn_download_specimen}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.print()}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  {t.btn_download_sim}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setActiveNotice(null)}>
                  {t.close}
                </Button>
              </div>
            </>
          )
        }
      >
        {activeNotice && (
          <div className="space-y-4 text-slate-900">
            <div className="text-center border-b-2 border-slate-300 pb-4 space-y-1">
              <div className="mb-2 p-1.5 bg-amber-50 border border-dashed border-amber-300 text-center text-xs text-amber-950 font-semibold rounded">
                {lang === 'kn'
                  ? 'ಅಧಿಕೃತ ಕರಡು ಪ್ರತಿ (Official Circular Specimen Preview)'
                  : 'Official Circular Specimen Preview'}
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {t.gov_dept}
              </p>
              <h4 className="text-lg font-bold text-[#13325e]">
                {pick(SCHOOL_INFO.nameKn, SCHOOL_INFO.nameEn)}
              </h4>
              <p className="text-xs text-slate-600">
                {pick(SCHOOL_INFO.divisionKn, SCHOOL_INFO.divisionEn)} · UDISE: {SCHOOL_INFO.udise}
              </p>
              <div className="pt-2 text-xs font-mono font-semibold text-slate-600 flex justify-between">
                <span>{activeNotice.refNo}</span>
                <span>{pick(activeNotice.dateStrKn, activeNotice.dateStrEn)}</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {pick(activeNotice.fullContentKn, activeNotice.fullContentEn)}
            </div>

            <div className="pt-6 flex justify-between items-end border-t border-slate-200 mt-6">
              <div className="w-20 h-20 border-2 border-dashed border-amber-500 rounded-full flex flex-col items-center justify-center text-[9px] text-amber-900 bg-amber-50/50 font-semibold text-center p-1">
                <span>[ಮಾದರಿ ಮುದ್ರೆ]</span>
                <span>SPECIMEN</span>
                <span>SEAL</span>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-slate-900">
                  {pick(SCHOOL_INFO.headmasterKn, SCHOOL_INFO.headmasterEn)}
                </p>
                <p className="text-slate-600">{t.hm_designation}</p>
                <p className="text-[11px] text-slate-500 italic">
                  {lang === 'kn' ? '[ಕರಡು ಪ್ರತಿ]' : '[Draft Specimen]'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
