// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical production URL. The custom domain (radiobug.net) is the canonical
// host; raadiobug.github.io auto-redirects to it once set in repo Pages
// settings. Served at the domain root, so no `base` subpath is needed.
const SITE_URL = 'https://radiobug.net';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    routing: {
      // Persian lives at the root (/), English under /en. Matches "default fa".
      prefixDefaultLocale: false
    }
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'fa',
        locales: { fa: 'fa-IR', en: 'en-US' }
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
