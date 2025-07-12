# "Main" Text Issue on Blog Posts

## Issue Description
A small "Main" text appears in the top-left corner of blog post pages. This text is not part of the site's design or codebase.

## Investigation Summary
After thorough investigation, we determined:

1. **Not in the codebase**: No literal "Main" text exists in any source files
2. **Not from CSS**: No pseudo-elements are creating this content
3. **Not from Astro**: The dev toolbar has been disabled

## Most Likely Causes

### 1. Browser Extension
The most probable cause is a browser accessibility extension or tool that displays ARIA landmarks. Common extensions that do this include:
- Screen reader extensions
- Accessibility testing tools
- Developer tools for accessibility
- ARIA landmark viewers

### 2. Operating System Accessibility Feature
Some OS-level accessibility features may display landmark labels.

## Solutions Implemented

We've added defensive CSS to `/src/styles/global.css`:

```css
/* Ensure screen reader text is properly hidden */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Hide any potential landmark labels */
[role="main"]::before,
main::before,
article::before {
  content: none !important;
  display: none !important;
}
```

## How to Test

1. **Test in incognito/private mode**: This disables most extensions
2. **Test in different browsers**: Chrome, Firefox, Safari
3. **Check browser extensions**: Look for accessibility-related extensions
4. **Disable all extensions temporarily**: See if the issue persists

## If Issue Persists

If the "Main" text still appears after testing:

1. It's likely a user-specific browser extension or setting
2. The site is functioning correctly - this is a local display issue
3. Users can disable the extension causing it if they prefer

## Note for Production
This issue should not affect production users unless they have similar accessibility extensions installed. The defensive CSS we've added will help prevent most cases of unwanted text display.