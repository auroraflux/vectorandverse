# Kilowhat Project Execution Plan

## Overview

This plan outlines the optimal order for executing tasks from both the [Code Quality Plan](./code-quality-plan.md) and [Refactoring Plan](./refactoring-plan.md). The strategy prioritizes quick wins, risk mitigation, and building momentum.

**Created**: 2025-07-12  
**Status**: Ready for execution

## Execution Strategy

### Week 1: Foundation & Quick Wins

#### Day 1: Clean House (3-4 hours)
*From Refactoring Plan - Phase 1*
- [ ] Remove unused dependencies (`gray-matter`, `unist-util-visit`)
- [ ] Delete dead components:
  - [ ] `src/components/Lightbox.astro`
  - [ ] `src/components/ReadingFocus.astro` 
  - [ ] `src/scripts/typewriter-taglines.js`
- [ ] Remove unused imports (e.g., `getImage` in index.astro)
- [ ] Add missing meta descriptions

**Why first**: Zero risk, immediate codebase cleanup, builds confidence

#### Day 2: SEO Essentials (2 hours)
*From Refactoring Plan - Moved to HIGH priority*
- [ ] Install and configure `@astrojs/sitemap`
- [ ] Create `public/robots.txt`
- [ ] Add structured data to BlogPost layout
- [ ] Implement skip navigation on all pages

**Why second**: High impact for minimal effort, improves discoverability

#### Days 3-5: Image Optimization
*From Refactoring Plan - Phase 2*
- [ ] Convert hero images to use Astro's Image component
- [ ] Optimize profile image on home page
- [ ] Implement responsive image loading

**Why third**: Performance gains without touching JavaScript complexity

### Week 2: JavaScript Foundation

#### Days 6-7: TypeScript Infrastructure
*From JavaScript Refactoring Guide - Phase 1.1*
- [ ] Create module structure (`src/lib/`)
- [ ] Set up TypeScript compilation
- [ ] Configure testing with Vitest
- [ ] Create base utilities (dom.ts, events.ts)

**Why now**: Need infrastructure before extracting JavaScript

#### Days 8-10: Extract Typewriter Animation
*From Code Quality Plan - Critical Priority #1*
*From JavaScript Refactoring Guide - Phase 1.2*
- [ ] Create TypeScript Typewriter class
- [ ] Implement lifecycle management
- [ ] Add ARIA live regions for accessibility
- [ ] Write comprehensive tests
- [ ] Replace inline implementation

**Why this first**: Most isolated component, high visibility, proves the pattern

### Week 3: Security & Performance

#### Days 11-12: Fix XSS Vulnerabilities
*From Code Quality Plan - Critical Priority #2*
*From JavaScript Refactoring Guide - Phase 2*
- [ ] Replace all `innerHTML` with safe alternatives
- [ ] Create DOM manipulation utilities
- [ ] Audit for other security issues

**Why urgent**: Security vulnerabilities are critical

#### Days 13-14: Memory Leak Prevention
*From Code Quality Plan - Critical Priority #3*
- [ ] Implement cleanup for all event listeners
- [ ] Add `astro:before-swap` handlers
- [ ] Create lifecycle management patterns

**Why before continuing**: Prevents issues from spreading to new code

### Week 4: Complex Components

#### Days 15-17: Extract TouchLightbox
*From JavaScript Refactoring Guide - Phase 1.3*
- [ ] Create touch gesture utilities
- [ ] Build TouchLightbox class
- [ ] Implement pinch zoom properly
- [ ] Add comprehensive touch tests
- [ ] Conditional loading (only on pages with images)

**Why challenging**: Most complex component, needs solid foundation

#### Days 18-19: Remaining Components
- [ ] Extract scroll animations
- [ ] Extract header behavior
- [ ] Extract navigation logic

### Week 5: Polish & Documentation

#### Day 20: Configuration & Constants
*From Code Quality Plan - High Priority #4*
- [ ] Extract all magic numbers to constants
- [ ] Create configuration modules
- [ ] Document all timing relationships

#### Days 21-22: Final Cleanup
- [ ] Consolidate CSS animations
- [ ] Add JSDoc to all functions
- [ ] Update README with new architecture
- [ ] Create migration guide

## Success Checkpoints

### After Week 1
- ✅ Codebase 400+ lines lighter
- ✅ SEO foundations in place
- ✅ Hero images optimized
- ✅ Team sees immediate value

### After Week 2  
- ✅ TypeScript infrastructure ready
- ✅ First major component extracted
- ✅ Testing patterns established
- ✅ No more XSS vulnerabilities

### After Week 3
- ✅ No memory leaks
- ✅ Security issues resolved
- ✅ TouchLightbox modernized
- ✅ 60% of JavaScript testable

### After Week 5
- ✅ 95% of JavaScript in modules
- ✅ Full test coverage
- ✅ Zero inline script complexity
- ✅ Documentation complete

## Risk Mitigation

1. **Feature Flags**: Implement for each major component extraction
2. **Parallel Testing**: Keep old code during transition
3. **Rollback Plan**: Git tags at each milestone
4. **Performance Monitoring**: Track metrics after each phase
5. **User Testing**: Verify touch interactions still work

## Dependencies

- **Required Tools**: TypeScript, Vitest, @astrojs/sitemap
- **Optional Tools**: nanostores (for state management)
- **Team Skills**: Basic TypeScript knowledge helpful

## Notes

- Adjust timeline based on team availability
- Consider pair programming for complex extractions
- Run full test suite after each component migration
- Keep stakeholders updated on progress weekly

## Next Action

Start with Day 1 tasks - they're risk-free and provide immediate value!