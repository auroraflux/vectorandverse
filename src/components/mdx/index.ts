/**
 * MDX component overrides
 * These components replace the default HTML elements in MDX files
 */

import Image from './Image.astro';

export const mdxComponents = {
  img: Image,
};