import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../data/translations';

const PREFS_STORAGE_KEY = 'ghs_dvg_preferences';

interface StoredPrefs {
  lang?: Language;
  contrast?: boolean;
  fontScale?: number;
}

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  contrast: boolean;
  setContrast: (contrast: boolean) => void;
  toggleContrast: () => void;
  fontScale: number;
  adjustFontScale: (delta: number) => void;
  resetFontScale: () => void;
  t: (typeof UI_STRINGS)['kn'];
  pick: <T>(knValue: T, enValue: T) => T;
}

const AppContext = createContext<AppContextValue | null>(null);

function readStoredPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredPrefs;
    return {
      lang: parsed.lang === 'en' || parsed.lang === 'kn' ? parsed.lang : undefined,
      contrast: typeof parsed.contrast === 'boolean' ? parsed.contrast : undefined,
      fontScale:
        typeof parsed.fontScale === 'number' && parsed.fontScale >= 0.85 && parsed.fontScale <= 1.25
          ? parsed.fontScale
          : undefined,
    };
  } catch {
    return {};
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialPrefs = readStoredPrefs();
  const [lang, setLangState] = useState<Language>(initialPrefs.lang ?? 'kn');
  const [contrast, setContrastState] = useState<boolean>(initialPrefs.contrast ?? false);
  const [fontScale, setFontScaleState] = useState<number>(initialPrefs.fontScale ?? 1);

  // Sync <html lang>, data-theme, and CSS --font-scale on mount and updates
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (contrast) {
      document.documentElement.setAttribute('data-theme', 'contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [contrast]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', `${fontScale}rem`);
  }, [fontScale]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({ lang, contrast, fontScale })
      );
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }, [lang, contrast, fontScale]);

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'kn' ? 'en' : 'kn'));
  }, []);

  const setContrast = useCallback((next: boolean) => {
    setContrastState(next);
  }, []);

  const toggleContrast = useCallback(() => {
    setContrastState((prev) => !prev);
  }, []);

  const adjustFontScale = useCallback((delta: number) => {
    setFontScaleState((prev) =>
      Math.min(1.25, Math.max(0.85, Number((prev + delta).toFixed(2))))
    );
  }, []);

  const resetFontScale = useCallback(() => {
    setFontScaleState(1);
  }, []);

  const pick = useCallback(
    <T,>(knValue: T, enValue: T): T => (lang === 'kn' ? knValue : enValue),
    [lang]
  );

  const t = UI_STRINGS[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        contrast,
        setContrast,
        toggleContrast,
        fontScale,
        adjustFontScale,
        resetFontScale,
        t,
        pick,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
