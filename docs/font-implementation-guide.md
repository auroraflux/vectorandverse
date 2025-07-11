# The Satoshi Font Implementation Journey - A Post-Mortem

## The Initial Goal
Replace "Schibsted Grotesk" with "Satoshi" font throughout the blog, maintaining existing weights and spacing.

## What Should Have Been Simple...
In theory, changing a font should be straightforward:
1. Add @font-face declarations
2. Update font-family in Tailwind config
3. Done!

## What Actually Happened

### Phase 1: Initial Implementation Attempts
- ✅ Copied font files to `/public/fonts/`
- ✅ Added @font-face declarations in `global.css`
- ✅ Updated Tailwind config
- ❌ **Result**: No visible changes

### Phase 2: The Discovery
The issue was that `global.css` wasn't being loaded on all pages. We had to:
- Import it in `Layout.astro`
- Remove hardcoded Google Fonts references
- Remove inline font-family overrides

### Phase 3: The Body Text Victory
- ✅ Body text started using Satoshi
- ❌ Headings stubbornly remained in system font

### Phase 4: The Heading Wars
**The Problem**: Tailwind CSS v4 uses CSS variables for fonts
- Headings were using `var(--font-sans)` 
- Our direct font-family declarations were being overridden

**The Solution**: Set the CSS variable
```css
:root {
  --font-sans: 'Satoshi', -apple-system, ...
}
```

### Phase 5: Font Weight Battles
**The Problem**: Multiple layers of font-weight declarations
- Tailwind Typography plugin settings
- Tailwind utility classes (`font-bold`)
- Component-specific styles

**The Solution**: 
1. Remove conflicting `font-bold` classes
2. Use inline styles for specific overrides
3. Update Typography config weights

## Key Lessons Learned

1. **CSS Variables in Modern Frameworks**: Tailwind CSS v4 uses CSS variables extensively. Always check if a framework is using variables instead of direct properties.

2. **Specificity Wars**: When dealing with utility-first CSS frameworks, specificity can become complex:
   - Utility classes can override config
   - Inline styles beat everything
   - !important should be avoided when possible

3. **Variable Fonts**: Modern variable fonts (like Satoshi) support weight ranges, but you still need fallback static fonts for broader compatibility.

4. **Font Loading**: Always ensure font files are:
   - In the correct location (`/public/` for Astro)
   - Referenced with correct paths
   - Loaded before being used

## Final Clean Implementation

```css
/* Layout.astro - Clean font setup */
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2-variations'),
       url('/fonts/Satoshi-Variable.woff') format('woff-variations');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  font-weight: 500; /* Medium weight for body */
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 850; /* Custom weight for headings */
}
```

## Current Font Configuration

### Weights in Use
- **Body Text**: 500 (Medium)
- **Headings**: 850 (Custom weight between Bold and Black)
- **Bold Text**: 700 (Bold)

### Font Files Required
- `Satoshi-Variable.woff2` and `.woff` (Primary - supports weights 300-900)
- Located in `/public/fonts/`

## Troubleshooting Future Font Changes

1. **Check CSS Variable Definitions**: Modern CSS frameworks often use CSS variables
   ```css
   /* Check computed styles for var(--font-*) usage */
   ```

2. **Inspect Specificity**: Use browser DevTools to see which rules are winning

3. **Look for Utility Classes**: Classes like `font-bold` can override your config

4. **Verify Font Loading**: Check Network tab to ensure font files are loading

5. **Test Variable Font Support**: Some browsers may need fallback static fonts

## What We Cleaned Up
- Removed duplicate @font-face declarations
- Removed excessive !important flags
- Consolidated font-family declarations
- Simplified heading weight rules

The implementation is now clean, maintainable, and working perfectly!