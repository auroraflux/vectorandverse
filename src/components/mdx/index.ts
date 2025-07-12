/**
 * MDX component overrides
 * These components replace the default HTML elements in MDX files
 */

import MDXImage from '../MDXImage.astro';

export const mdxComponents = {
  img: MDXImage,
};