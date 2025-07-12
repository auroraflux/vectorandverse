// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kilowhat.harsha.run',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  },
  server: {
    host: true,  // Listen on all network interfaces
    port: 4321
  },
  devToolbar: {
    enabled: false
  }
});