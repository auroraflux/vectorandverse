/**
 * @module kilowhat/lib/config/brand
 * @description Brand configuration for Vector & Verse
 * 
 * Central configuration for all branding elements including taglines,
 * descriptions, and domain. Modify this file to update branding across
 * the entire application.
 */

export const BRAND_CONFIG = {
  name: "vector&verse",
  taglines: [
    "Where AI math meets human mess",
    "Technical concepts, emotional damage", 
    "High-dimensional life in sequential stories"
  ],
  descriptions: {
    main: "Where AI's mathematical reality meets human emotional experience",
    navigation: "Technical concepts through human experience",
    about: "Where AI math meets human mess"
  },
  domain: "https://vectorandverse.me"
} as const;

export type BrandConfig = typeof BRAND_CONFIG;