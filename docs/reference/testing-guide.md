# Testing Guide

**For Claude Code: Optimized Playwright test execution**

## Test Priority

### ⚡ Always First: Smoke Test (30-45 sec)
```bash
npm run test:smoke:claude  # MUST pass before other tests
```
Catches: Console errors, rendering failures, basic loading issues

### 🔥 Always Run: Critical Tests (2-3 min)
```bash
CLAUDE_MODE=true npx playwright test core-functionality accessibility seo-and-meta
```
- `core-functionality` - Navigation, 404, basics
- `accessibility` - A11y, keyboard, screen readers  
- `seo-and-meta` - Meta tags, Open Graph

### ⚡ Feature Tests (3-4 min) - Run When:
- **Components changed**: `simple-lightbox`
- **Styles changed**: `visual-and-styling`
- **Performance concerns**: `performance`

### 🔧 Diagnostic Tests (8-10 min) - Only When:
- **Image issues**: `inspect-images` (376 lines!)
- **Debugging needed**: `picture-element-test`, `content-and-functionality`

## Change-Based Testing

| What Changed | Run These Tests |
|--------------|-----------------|
| Blog post | `smoke` + `seo-and-meta` + `accessibility` |
| Component | `smoke` + Critical + relevant feature test |
| Styling | `smoke` + Critical + `visual-and-styling` |
| Images | `smoke` + Critical + `simple-lightbox` |
| Config/build | `smoke` + ALL Critical + `performance` |

## Commands

### Claude Code Workflow (Port 4322)
```bash
# 1. Start server
npm run dev:claude

# 2. Always run smoke first
npm run test:smoke:claude

# 3. Then run appropriate tests
npm run test:claude         # All tests
# OR specific tests based on changes
```

### Manual Testing (Port 4321)
```bash
npm run dev      # Your server
npm test         # All tests
npm test:debug   # Interactive debugging
```

## Browser Coverage
5 configurations: Desktop Chrome/Firefox/Safari + Mobile Chrome/Safari

## Quick Fixes
- **"Connection refused"**: Start dev server first
- **Flaky tests**: Add `--retries=2`
- **Port conflicts**: See `reference/port-strategy.md`

**Token savings**: Run only relevant tests (3-6) vs all 9 tests saves 70% runtime.