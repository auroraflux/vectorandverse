# Claude Code Workflows

**Explicit triggers for common tasks**

## When user says "create blog post" or "write article"
1. Use `docs/writing/blog-post-template.md`
2. Create file: `src/content/blog/[slug].mdx`
3. Create image folder: `public/images/blog/[slug]/`
4. Run smoke test: `npm run test:smoke:claude`

## When user says "add feature" or "implement X"
1. **STOP** - Read `docs/development/pre-development-checklist.md`
2. Search for existing functionality
3. Follow `docs/development/adding-features.md`
4. Test with appropriate test suite

## When user says "run tests"
1. Start server: `npm run dev:claude`
2. **ALWAYS** run smoke first: `npm run test:smoke:claude`
3. If passes, run critical: `CLAUDE_MODE=true npx playwright test core-functionality accessibility seo-and-meta`
4. See `docs/reference/testing-guide.md` for change-based testing

## When build/server fails
1. Check port conflicts: `npm run kill-all-dev`
2. Restart: `npm run dev:claude`
3. Run smoke test to verify
4. Check `docs/reference/port-strategy.md` if issues persist

## When user says "deploy" or "push to production"
1. Run full test suite: `npm run test:claude`
2. Build: `npm run build`
3. Check for draft posts that shouldn't deploy
4. User handles actual deployment

## When tests fail
1. If "Connection refused": Dev server not running
2. If console errors: Check smoke test output
3. If specific test fails: Run individually with `--debug`
4. See `docs/reference/testing-guide.md`

## When adding images
1. Place in: `public/images/blog/[post-slug]/`
2. Use markdown: `![alt text](/images/blog/[post-slug]/image.jpg)`
3. Lightbox automatic for MDX posts
4. See `docs/writing/images.md`

## When debugging
1. Use `npm test:debug` for interactive debugging
2. Check browser console in headed mode
3. Add `await page.pause()` in tests
4. See specific error in test output

**Remember**: Always use port 4322 for Claude Code operations