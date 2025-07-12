// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { remarkCustomImages } from './src/utils/remark-custom-images.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx({
    remarkPlugins: [remarkCustomImages]
  })],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true
  }
});