import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthSession, PortalRoute, UserRole } from '../types';

const KNOWN_ROUTES: PortalRoute[] = [
  '/',
  '/student-portal',
  '/student-register',
  '/student-dashboard',
  '/parent-register',
  '/staff-portal',
  '/staff-register',
  '/staff-dashboard',
  '/registration-status',
];

function normalizePath(pathname: string): PortalRoute {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  if (KNOWN_ROUTES.includes(cleaned as PortalRoute)) {
    return cleaned as PortalRoute;
  }
  return '/';
}

interface PortalNavigationAndAuthContextValue {
  route: PortalRoute;
  canGoBack: boolean;
  navigate: (to: PortalRoute, options?: { anchorId?: string }) => void;
  navigateToHomeSection: (anchorId: string) => void;
  goHome: () => void;
  goBack: () => void;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  loginDemoStudent: (studentId: string) => void;
  loginDemoStaff: (staffIdOrEmail: string) => void;
  logout: () => void;
}

const PortalContext = createContext<PortalNavigationAndAuthContextValue | null>(null);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PortalRoute>(() => normalizePath(window.location.pathname));
  const [historyDepth, setHistoryDepth] = useState<number>(0);
  // Session lives strictly in React memory — never stores passwords or PII in localStorage
  const [session, setSession] = useState<AuthSession | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
      setHistoryDepth((prev) => Math.max(0, prev - 1));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to target anchor after returning to '/' from a portal view
  useEffect(() => {
    if (route === '/' && pendingAnchor) {
      const targetId = pendingAnchor;
      setPendingAnchor(null);
      window.requestAnimationFrame(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [route, pendingAnchor]);

  const navigate = useCallback(
    (to: PortalRoute, options?: { anchorId?: string }) => {
      const targetPath = options?.anchorId ? `${to}#${options.anchorId}` : to;
      if (normalizePath(window.location.pathname) !== to || options?.anchorId) {
        window.history.pushState({ route: to }, '', targetPath);
        setHistoryDepth((prev) => prev + 1);
      }
      setRoute(to);
      if (options?.anchorId) {
        setPendingAnchor(options.anchorId);
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    []
  );

  const navigateToHomeSection = useCallback(
    (anchorId: string) => {
      const cleanId = anchorId.replace(/^#/, '');
      if (route === '/') {
        const el = document.getElementById(cleanId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.location.hash !== `#${cleanId}`) {
          window.history.replaceState(null, '', `/#${cleanId}`);
        }
        return;
      }
      navigate('/', { anchorId: cleanId });
    },
    [route, navigate]
  );

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goBack = useCallback(() => {
    if (historyDepth > 0 || window.history.length > 1) {
      // If we navigated internally, browser history takes us back; fall back cleanly if still on same URL
      const currentPath = window.location.pathname;
      window.history.back();
      window.setTimeout(() => {
        if (window.location.pathname === currentPath && currentPath !== '/') {
          navigate('/');
        }
      }, 150);
    } else {
      navigate('/');
    }
  }, [historyDepth, navigate]);

  const loginDemoStudent = useCallback((studentId: string) => {
    const cleanId = studentId.trim().toUpperCase();
    setSession({
      role: 'student',
      userId: cleanId,
      displayNameKn: 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರಾಯೋಗಿಕ ಖಾತೆ (Demo Profile)',
      displayNameEn: 'Student Preview Account (Demo Profile)',
      subtitleKn: '10ನೇ ತರಗತಿ · KSEAB ಮಾದರಿ ವಿವರ (ನೈಜ SATS ಸಂಪರ್ಕ ಬಾಕಿ)',
      subtitleEn: 'Grade 10 · Sample Academic Preview (Pending SATS Integration)',
      authMode: 'development-preview',
      loginTimestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  }, []);

  const loginDemoStaff = useCallback((staffIdOrEmail: string) => {
    const cleanId = staffIdOrEmail.trim();
    setSession({
      role: 'staff',
      userId: cleanId,
      displayNameKn: 'ಬೋಧಕ/ಸಿಬ್ಬಂದಿ ಪ್ರಾಯೋಗಿಕ ಖಾತೆ (Demo Staff)',
      displayNameEn: 'Staff Preview Workspace (Demo Staff)',
      subtitleKn: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ದಾವಣಗೆರೆ · DVG-GHS-042',
      subtitleEn: 'Government High School, Davangere · DVG-GHS-042',
      authMode: 'development-preview',
      loginTimestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => Boolean(session && session.role === role),
    [session]
  );

  return (
    <PortalContext.Provider
      value={{
        route,
        canGoBack: historyDepth > 0 || route !== '/',
        navigate,
        navigateToHomeSection,
        goHome,
        goBack,
        session,
        isAuthenticated: Boolean(session),
        hasRole,
        loginDemoStudent,
        loginDemoStaff,
        logout,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal(): PortalNavigationAndAuthContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used inside PortalProvider');
  }
  return ctx;
}
