/**
 * Social / podcast platform links for RadioBug. `icon` keys map to a brand glyph
 * resolved in Socials.astro (simple-icons for brands, lucide for LinkedIn).
 * `primary: true` marks the main "listen on" platforms surfaced in the hero.
 */

export type SocialKey =
  | 'youtube'
  | 'spotify'
  | 'castbox'
  | 'instagram'
  | 'telegram'
  | 'x'
  | 'linkedin';

export interface Social {
  key: SocialKey;
  label: string;
  href: string;
  /** Listening platform (vs. a social profile). */
  listen: boolean;
}

export const socials: Social[] = [
  {
    key: 'spotify',
    label: 'Spotify',
    href: 'https://creators.spotify.com/pod/profile/radiobug/',
    listen: true
  },
  { key: 'castbox', label: 'Castbox', href: 'https://castbox.fm/channel/6341851', listen: true },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@raadiobug', listen: true },
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/raadiobug',
    listen: false
  },
  { key: 'telegram', label: 'Telegram', href: 'https://t.me/raadiobug', listen: false },
  { key: 'x', label: 'X', href: 'https://x.com/itwasx', listen: false },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arian-alijani',
    listen: false
  }
];

export const listenPlatforms = socials.filter(s => s.listen);
