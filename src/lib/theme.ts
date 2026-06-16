/** Shared theme constants + helpers used by the client-side toggle. */

export type Theme = 'light' | 'dark' | 'system';

export const THEME_KEY = 'radiobug-theme';

export function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(THEME_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Apply a theme to <html> and persist the choice. */
export function applyTheme(theme: Theme): void {
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, theme);
}
