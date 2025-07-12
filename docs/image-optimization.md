# Image Optimization Strategy

## Current Implementation

Since images are stored in the `public` directory, Astro cannot optimize them during the build process. However, we've implemented several improvements:

### 1. Proper Width/Height Attributes
All images now have explicit width and height attributes to prevent Cumulative Layout Shift (CLS).

### 2. Picture Elements with WebP Support
Images are wrapped in `<picture>` elements that attempt to load WebP versions if they exist:

```html
<picture>
  <source type="image/webp" srcset="image.webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

### 3. Loading and Decoding Attributes
- Hero images use `loading="eager"` and `fetchpriority="high"`
- Blog card images use `loading="lazy"` for better performance
- All images use `decoding="async"` to prevent blocking

## Future Optimization Options

### Option 1: Move Images to src/ Directory
For true build-time optimization, move images to `src/assets/` and import them:

```astro
---
import heroImage from '../assets/hero.jpg';
import { Image } from 'astro:assets';
---
<Image src={heroImage} alt="..." />
```

### Option 2: Pre-optimize Images
Use the provided script to generate WebP versions:

```bash
# Install sharp dependency
npm install --save-dev sharp

# Run optimization
node scripts/optimize-images.js
```

This will create:
- WebP versions of all images
- Multiple sizes for responsive images

### Option 3: Use a CDN
Consider using an image CDN like:
- Cloudinary
- Imgix
- Cloudflare Images

These services can optimize and resize images on-the-fly.

## Performance Benefits

Even with the current implementation:
1. **Reduced CLS**: Explicit dimensions prevent layout shifts
2. **WebP Support**: ~30% smaller file sizes for supported browsers
3. **Lazy Loading**: Faster initial page load for blog listings
4. **Async Decoding**: Non-blocking image rendering

## Testing

Run the Playwright tests to ensure images display correctly:

```bash
npm test
```