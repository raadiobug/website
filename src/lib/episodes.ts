import { getCollection, type CollectionEntry } from 'astro:content';
import { localeTag, type Lang } from '@/i18n/ui';
import { localizedPath } from '@/i18n/utils';
import { listenPlatforms, type SocialKey } from '@/data/socials';

export type Episode = CollectionEntry<'episodes'>;

/** All publishable episodes, newest first. Drafts are hidden in production. */
export async function getEpisodes(): Promise<Episode[]> {
  const all = await getCollection('episodes', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  return all.sort((a, b) => b.data.number - a.data.number);
}

export function episodeTitle(ep: Episode, lang: Lang): string {
  return ep.data.title[lang];
}

export function episodeDescription(ep: Episode, lang: Lang): string {
  return ep.data.description[lang];
}

export function guestName(ep: Episode, lang: Lang): string {
  return lang === 'fa' ? ep.data.guest.nameFa : ep.data.guest.name;
}

export function guestRole(ep: Episode, lang: Lang): string | undefined {
  return lang === 'fa' ? ep.data.guest.roleFa : ep.data.guest.role;
}

/** Stable, clean URL for an episode: /episodes/3 (or /en/episodes/3). */
export function episodeHref(ep: Episode, lang: Lang): string {
  return localizedPath(`/episodes/${ep.data.number}`, lang);
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeTag[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export interface ListenLink {
  key: SocialKey;
  label: string;
  href: string;
  /** True when this points at the channel, not the specific episode. */
  fallback: boolean;
}

/**
 * Resolve where to listen to an episode: prefer the episode's own links, fall
 * back to the channel-level platform link so a button is never dead.
 */
export function listenLinks(ep: Episode): ListenLink[] {
  return listenPlatforms.map(p => {
    const own = ep.data.links[p.key as 'spotify' | 'castbox' | 'youtube'];
    return {
      key: p.key,
      label: p.label,
      href: own && own.length > 0 ? own : p.href,
      fallback: !(own && own.length > 0)
    };
  });
}

/** First available episode embed, in display priority order. */
export function primaryEmbed(ep: Episode): { platform: SocialKey; src: string } | null {
  const order: Array<'spotify' | 'youtube' | 'castbox'> = ['spotify', 'youtube', 'castbox'];
  for (const p of order) {
    const src = ep.data.embed[p];
    if (src && src.length > 0) return { platform: p, src };
  }
  return null;
}
