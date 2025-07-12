# Smoke Testing

**For Claude Code: Fast error detection before considering changes complete**

## Purpose

Catches immediate errors that break the site even when the dev server starts successfully. Runs in 30-45 seconds to verify basic functionality.

## What It Detects

- **Console errors** (JavaScript runtime errors)
- **Network failures** (failed asset loading)
- **Rendering failures** (page doesn't load properly)
- **Navigation breaks** (view transitions fail)

## Commands

### Claude Code (Always Use This)
```bash
# Start Claude's dev server
npm run dev:claude

# Quick smoke test (30-45 seconds)
npm run test:smoke:claude
```

### Manual Testing
```bash
npm run dev
npm run test:smoke
```

## When to Run

**Claude Code must run smoke tests:**
1. **After any code changes** - before considering task complete
2. **Before running full test suite** - catch obvious errors first
3. **After component modifications** - verify rendering works
4. **After dependency changes** - ensure imports work

## What Gets Tested

1. **Homepage loads** - Logo visible, no critical errors
2. **Blog post loads** - Article content renders properly  
3. **Navigation works** - Home ↔ About transitions function

## Error Detection

**Filters out non-critical errors:**
- Favicon 404s
- External analytics failures
- CORS warnings from third-party resources

**Catches critical errors:**
- JavaScript runtime errors
- Component rendering failures
- Local asset loading failures
- Navigation breakage

**Runtime**: ~30-45 seconds vs 8-10 minutes for full test suite.

**Result**: Immediate feedback if changes broke the site.