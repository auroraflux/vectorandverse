# Font System Reference

## Current Setup

- **Font**: Satoshi (variable weight 300-900)
- **Body**: weight 500
- **Headings**: weight 850
- **Location**: `/public/fonts/`

## CSS Variables

```css
:root {
  --font-sans: 'Satoshi', system-ui, sans-serif;
}
```

## Font Files

- `Satoshi-Variable.woff2` (primary)
- `Satoshi-Variable.woff` (fallback)

## Implementation

Fonts loaded in `Layout.astro`:

```css
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2-variations'),
       url('/fonts/Satoshi-Variable.woff') format('woff');
  font-weight: 300 900;
  font-display: swap;
}
```

## Font Weights

- Light: 300
- Regular: 400
- Medium: 500 (body text)
- Bold: 700
- Black: 850 (headings)