import React, { useRef } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  idPrefix: string;
  variant?: 'pills' | 'underline';
}

export function Tabs<T extends string = string>({
  items,
  activeId,
  onChange,
  ariaLabel,
  idPrefix,
  variant = 'pills',
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = items.length - 1;
    else return;

    e.preventDefault();
    onChange(items[nextIdx].id);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIdx]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={
        variant === 'underline'
          ? 'flex border-b border-slate-200 gap-2 overflow-x-auto'
          : 'flex flex-wrap items-center gap-1.5'
      }
    >
      {items.map((item, idx) => {
        const isActive = item.id === activeId;
        const tabId = `${idPrefix}-tab-${item.id}`;
        const panelId = `${idPrefix}-panel-${item.id}`;

        const cls =
          variant === 'underline'
            ? `min-h-[40px] px-4 py-2 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#13325e] text-[#13325e]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`
            : `min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#13325e] text-white border-[#13325e] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`;

        return (
          <button
            key={item.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cls}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
