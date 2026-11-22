import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle, ChevronsUpDown, Keyboard } from 'lucide-react';
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
  const [srStatus, setSrStatus] = useState<string>('');

  const sectionRef = useRef<HTMLElement | null>(null);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const firstAccordionBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pendingFocusRef = useRef<boolean>(false);

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

  const scrollIntoViewRespectingMotion = (element: HTMLElement | null) => {
    if (!element) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const focusAccordionTarget = () => {
    const target = firstAccordionBtnRef.current ?? toggleBtnRef.current;
    scrollIntoViewRespectingMotion(sectionRef.current);
    target?.focus({ preventScroll: true });
    setSrStatus(t.faq_shortcut_focused_sr);
  };

  useEffect(() => {
    if (isSectionOpen && pendingFocusRef.current) {
      pendingFocusRef.current = false;
      const frame = window.requestAnimationFrame(() => {
        focusAccordionTarget();
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [isSectionOpen]);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat) return;

      const isSlash = event.key === '/' || (event.code === 'Slash' && !event.shiftKey);
      if (!event.altKey || event.ctrlKey || event.metaKey || !isSlash) {
        return;
      }

      event.preventDefault();

      const activeElement = document.activeElement as HTMLElement | null;
      const isFocusedInsideAccordion = Boolean(
        activeElement && accordionRef.current?.contains(activeElement)
      );

      if (isFocusedInsideAccordion) {
        const previousTarget = previousFocusRef.current;
        if (
          previousTarget &&
          previousTarget.isConnected &&
          !accordionRef.current?.contains(previousTarget)
        ) {
          previousTarget.focus({ preventScroll: false });
        } else {
          const fallbackMain = document.getElementById('main-content');
          if (fallbackMain) {
            fallbackMain.focus({ preventScroll: true });
          } else {
            activeElement?.blur();
          }
        }
        setSrStatus(t.faq_shortcut_restored_sr);
        return;
      }

      if (
        activeElement &&
        activeElement !== document.body &&
        !accordionRef.current?.contains(activeElement)
      ) {
        previousFocusRef.current = activeElement;
      }

      if (!isSectionOpen) {
        pendingFocusRef.current = true;
        setIsSectionOpen(true);
        return;
      }

      focusAccordionTarget();
    };

    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, [isSectionOpen, t.faq_shortcut_focused_sr, t.faq_shortcut_restored_sr]);

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

  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      !isSectionOpen
    ) {
      return;
    }

    const anyExpanded = Object.values(openIds).some(Boolean);
    if (!anyExpanded) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;

    // Identify if focus is currently on an accordion trigger or inside an expanded panel
    const activeExpandedItem = filteredFaqs.find((item) => {
      if (!openIds[item.id]) return false;
      const triggerEl = triggerRefs.current[item.id];
      const panelEl = panelRefs.current[item.id];
      return Boolean(
        activeElement && (activeElement === triggerEl || panelEl?.contains(activeElement))
      );
    });

    const firstVisibleExpanded = filteredFaqs.find((item) => Boolean(openIds[item.id]));
    const targetId = activeExpandedItem?.id ?? firstVisibleExpanded?.id ?? filteredFaqs[0]?.id;

    event.preventDefault();
    event.stopPropagation();

    setOpenIds({});
    if (targetId) {
      triggerRefs.current[targetId]?.focus();
    }
    setSrStatus(t.faq_escape_closed_sr);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-section-heading"
      aria-keyshortcuts="Alt+/"
      className="py-12 bg-slate-50 border-b border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div role="status" aria-live="polite" className="sr-only">
          {srStatus}
        </div>

        <SectionHeading
          headingId="faq-section-heading"
          kickerEn="PARENT & STUDENT HELP DESK"
          kickerKn="ಪೋಷಕರ ಮಾರ್ಗದರ್ಶಿ"
          title={t.faq_heading}
          subtitle={t.faq_sub}
          action={
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs"
                title={t.faq_shortcut_hint}
              >
                <Keyboard className="w-3.5 h-3.5 text-[#13325e]" aria-hidden="true" />
                <span>{t.faq_shortcut_label}</span>
                <kbd className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[#13325e]">
                  Alt + /
                </kbd>
              </div>

              <Button
                ref={toggleBtnRef}
                variant={isSectionOpen ? 'outline' : 'primary'}
                size="sm"
                aria-expanded={isSectionOpen}
                aria-controls="faq-homepage-drawer"
                aria-keyshortcuts="Alt+/"
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
            </div>
          }
        />

        {/* Toggleable Homepage FAQ Container (respects prefers-reduced-motion) */}
        <div
          id="faq-homepage-drawer"
          aria-hidden={!isSectionOpen}
          onKeyDown={handleDrawerKeyDown}
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
                ref={accordionRef}
                id={`faq-filter-panel-${selectedCategory}`}
                role="tabpanel"
                aria-labelledby={`faq-filter-tab-${selectedCategory}`}
                aria-keyshortcuts="Alt+/"
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
                          ref={(el) => {
                            triggerRefs.current[item.id] = el;
                            if (idx === 0) {
                              firstAccordionBtnRef.current = el;
                            }
                          }}
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          aria-keyshortcuts={idx === 0 ? 'Alt+/' : undefined}
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
                        ref={(el) => {
                          panelRefs.current[item.id] = el;
                        }}
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
