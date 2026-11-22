import React, { useState } from 'react';
import { Search, X, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FACULTY_MEMBERS } from '../data/schoolData';
import { Alert, Card, INPUT_BASE_CLASS, SectionHeading, Tabs, TabItem } from './ui';

type FacultyFilter = 'all' | 'leadership' | 'languages' | 'stem' | 'cocurricular';

export const FacultySection: React.FC = () => {
  const { lang, t, pick } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<FacultyFilter>('all');

  const filterTabs: TabItem<FacultyFilter>[] = [
    { id: 'all', label: t.faculty_all_roles },
    { id: 'leadership', label: lang === 'kn' ? 'ಮುಖ್ಯ ಶಿಕ್ಷಕರು' : 'Leadership' },
    { id: 'languages', label: lang === 'kn' ? 'ಭಾಷಾ ಶಿಕ್ಷಕರು' : 'Languages' },
    { id: 'stem', label: lang === 'kn' ? 'ವಿಜ್ಞಾನ & ಗಣಿತ' : 'Science & Maths' },
    { id: 'cocurricular', label: lang === 'kn' ? 'ಕ್ರೀಡೆ & ICT' : 'Sports & ICT' },
  ];

  const getCategory = (id: string): FacultyFilter => {
    if (id === 'fac-01') return 'leadership';
    if (id === 'fac-02' || id === 'fac-03' || id === 'fac-06') return 'languages';
    if (id === 'fac-04' || id === 'fac-05' || id === 'fac-07') return 'stem';
    return 'cocurricular';
  };

  const filteredFaculty = FACULTY_MEMBERS.filter((fac) => {
    const matchesRole = roleFilter === 'all' || getCategory(fac.id) === roleFilter;
    const q = search.trim().toLowerCase();
    if (!q) return matchesRole;
    return (
      matchesRole &&
      [
        fac.nameKn,
        fac.nameEn,
        fac.designationKn,
        fac.designationEn,
        fac.subjectKn,
        fac.subjectEn,
        fac.qualification,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <section
      id="faculty"
      aria-labelledby="faculty-section-heading"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <SectionHeading
          headingId="faculty-section-heading"
          kickerEn="DEDICATED EDUCATORS"
          kickerKn="ಬೋಧಕ ವೃಂದ"
          title={t.faculty_heading}
          subtitle={t.faculty_sub}
        />

        <Alert tone="info">{t.faculty_photo_note}</Alert>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <Tabs
            items={filterTabs}
            activeId={roleFilter}
            onChange={setRoleFilter}
            ariaLabel={t.faculty_heading}
            idPrefix="faculty-filter"
          />

          <div className="relative w-full lg:w-80">
            <label htmlFor="faculty-search-input" className="sr-only">
              {t.faculty_search_placeholder}
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="faculty-search-input"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.faculty_search_placeholder}
              className={`${INPUT_BASE_CLASS} pl-9 pr-9`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label={t.a11y_close_dialog}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <div
          id={`faculty-filter-panel-${roleFilter}`}
          role="tabpanel"
          aria-labelledby={`faculty-filter-tab-${roleFilter}`}
        >
          {filteredFaculty.length === 0 ? (
            <Card surface="white" padding="lg" className="text-center text-sm text-slate-600">
              {t.faculty_empty}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFaculty.map((fac) => (
                <Card
                  key={fac.id}
                  surface="white"
                  padding="md"
                  interactive
                  className="flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-emerald-900">
                          {pick(fac.designationKn, fac.designationEn)}
                        </p>
                        <h3 className="text-base font-bold text-[#13325e] mt-0.5 leading-snug">
                          {pick(fac.nameKn, fac.nameEn)}
                        </h3>
                      </div>
                      <span
                        className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#13325e] font-bold text-xs shrink-0"
                        aria-hidden="true"
                      >
                        {fac.nameEn
                          .replace(/^(Sri|Smt\.)\s+/i, '')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-slate-800 font-medium">
                        <span className="text-slate-500">
                          {lang === 'kn' ? 'ಬೋಧನಾ ವಿಷಯ: ' : 'Subject: '}
                        </span>
                        <span>{pick(fac.subjectKn, fac.subjectEn)}</span>
                      </div>
                      <div className="text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span className="text-slate-500">{t.qualification_label}</span>
                        <span className="font-mono font-medium">{fac.qualification}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-mono font-bold text-[#13325e] tabular-nums">
                      {fac.expYears}+ {t.years_exp}
                    </span>
                    <span className="text-emerald-900 font-medium">
                      {lang === 'kn' ? 'ಸರ್ಕಾರಿ ಸೇವೆ' : 'Govt Service'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
