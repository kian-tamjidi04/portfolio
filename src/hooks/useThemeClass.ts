import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Applies the persisted theme to <html> and keeps localStorage in sync.
 *
 * Note: dark mode is fully implemented in CSS but currently unreachable — the
 * toggle button in App.tsx is commented out, so nothing ever calls `setIsDark`.
 * See DESIGN_SYSTEM.md F1. The setter is returned so wiring the toggle back up
 * is a one-line change.
 */
export function useThemeClass() {
  const [isDark, setIsDark] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'dark',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
