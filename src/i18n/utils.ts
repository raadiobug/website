import { defaultLang, localeTag, ui, type Lang, type UIKey } from './ui';

/** Format an integer with locale digits (Persian digits in fa), no grouping. */
export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(localeTag[lang], { useGrouping: false }).format(value);
}

/** Returns a translator bound to a locale, falling back to the default lang. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Build an href for a path in a given locale. Pass paths WITHOUT a locale
 * prefix (e.g. '/episodes'); the default locale (fa) maps to the root and
 * English is prefixed with /en.
 */
export function localizedPath(path: string, lang: Lang): string {
  const clean = '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');
  const base = clean === '/' ? '' : clean;
  return lang === defaultLang ? base || '/' : `/en${base || ''}`;
}

/** Strip the locale prefix off a real pathname, yielding a locale-free path. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Map the current pathname to its equivalent in the target locale. */
export function switchLocalePath(pathname: string, target: Lang): string {
  return localizedPath(stripLocale(pathname), target);
}
