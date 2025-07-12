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
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@lib': new URL('./src/lib', import.meta.url).pathname,
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@utils': new URL('./src/lib/utils', import.meta.url).pathname,
        '@animations': new URL('./src/lib/animations', import.meta.url).pathname,
        '@config': new URL('./src/lib/config', import.meta.url).pathname
      }
    }
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