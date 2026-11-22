import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ChevronsUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FAQ_ITEMS } from '../data/schoolData';
import { FaqItem } from '../types';
import { Button, Card, SectionHeading, Tabs, TabItem } from './ui';

type FaqFilter = 'all' | FaqItem['category'];

const CATEGORY_LABELS: Record<FaqItem['category'], { kn: string; en: string }> = {
  admissions: { kn: 'ದಾಖಲಾತಿ', en: 'Admissions' },
  academics: { kn: 'ಶೈಕ್ಷಣಿಕ & ನಿಯಮಗಳು', en: 'Academics & Policies' },
  welfare: { kn: 'ಸವಲತ್ತು & ಬಿಸಿಯೂಟ', en: 'Welfare & Meals' },
  certificates: { kn: 'TC & ಪ್ರಮಾಣಪತ್ರ', en: 'TC & Certificates' },
};

export const FAQSection: React.FC = () => {
  const { t, pick } = useApp();
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<FaqFilter>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-01': true,
  });

  const filterTabs: TabItem<FaqFilter>[] = [
    { id: 'all', label: t.faq_filter_all },
    { id: 'admissions', label: t.faq_filter_admissions },
    { id: 'academics', label: t.faq_filter_academics },
    { id: 'welfare', label: t.faq_filter_welfare },
    { id: 'certificates', label: t.faq_filter_certificates },
  ];

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const allVisibleOpen =
    filteredFaqs.length > 0 && filteredFaqs.every((item) => Boolean(openIds[item.id]));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = () => {
    const nextState = !allVisibleOpen;
    setOpenIds((prev) => {
      const updated = { ...prev };
      for (const item of filteredFaqs) {
        updated[item.id] = nextState;
      }
      return updated;
    });
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-heading"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          headingId="faq-section-heading"
          kickerEn="PARENT & STUDENT HELP DESK"
          kickerKn="ಪೋಷಕರ ಮಾರ್ಗದರ್ಶಿ"
          title={t.faq_heading}
          subtitle={t.faq_sub}
          action={
            <Button
              variant={isSectionOpen ? 'outline' : 'primary'}
              size="sm"
              aria-expanded={isSectionOpen}
              aria-controls="faq-homepage-drawer"
              onClick={() => setIsSectionOpen((prev) => !prev)}
              leftIcon={<HelpCircle className="w-4 h-4" />}
              rightIcon={
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${
                    isSectionOpen ? 'rotate-180' : ''
                  }`}
                />
              }
            >
              {isSectionOpen ? t.faq_toggle_hide : t.faq_toggle_show}
            </Button>
          }
        />

        {/* Toggleable Homepage FAQ Container (respects prefers-reduced-motion) */}
        <div
          id="faq-homepage-drawer"
          aria-hidden={!isSectionOpen}
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
            isSectionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className={isSectionOpen ? 'space-y-5 pt-1' : 'invisible pointer-events-none'}>
              {/* Filter Tabs & Expand/Collapse Control */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <Tabs
                  items={filterTabs}
                  activeId={selectedCategory}
                  onChange={setSelectedCategory}
                  ariaLabel={t.faq_heading}
                  idPrefix="faq-filter"
                />

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {filteredFaqs.length} {t.faq_questions_count}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleToggleAll}
                    leftIcon={<ChevronsUpDown className="w-3.5 h-3.5" />}
                  >
                    {allVisibleOpen ? t.faq_collapse_all : t.faq_expand_all}
                  </Button>
                </div>
              </div>

              {/* Accordion List */}
              <div
                id={`faq-filter-panel-${selectedCategory}`}
                role="tabpanel"
                aria-labelledby={`faq-filter-tab-${selectedCategory}`}
                className="space-y-3"
              >
                {filteredFaqs.map((item, idx) => {
                  const isOpen = Boolean(openIds[item.id]);
                  const panelId = `faq-answer-${item.id}`;
                  const buttonId = `faq-question-${item.id}`;
                  const catLabel = CATEGORY_LABELS[item.category];

                  return (
                    <Card
                      key={item.id}
                      surface="white"
                      padding="none"
                      interactive
                      className="overflow-hidden"
                    >
                      <h3 className="m-0">
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggleItem(item.id)}
                          className="w-full min-h-[52px] px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors duration-150 motion-reduce:transition-none cursor-pointer"
                        >
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-medium text-emerald-900 flex items-center gap-2">
                              <span className="font-mono tabular-nums text-slate-500">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{pick(catLabel.kn, catLabel.en)}</span>
                            </p>
                            <span className="block text-sm sm:text-base font-bold text-[#13325e] leading-snug">
                              {pick(item.questionKn, item.questionEn)}
                            </span>
                          </div>

                          <span
                            className={`w-8 h-8 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-[#13325e] shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                              isOpen ? 'rotate-180 bg-amber-50 border-amber-300' : ''
                            }`}
                            aria-hidden="true"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        aria-hidden={!isOpen}
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? 'grid-rows-[1fr] opacity-100 visible'
                            : 'grid-rows-[0fr] opacity-0 invisible'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-4 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                            {pick(item.answerKn, item.answerEn)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
