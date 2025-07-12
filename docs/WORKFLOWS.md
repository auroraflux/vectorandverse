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

## When debugging complex issues
1. Use `mcp__zen__debug` for systematic root cause analysis
2. Provide error messages and symptoms
3. Let it trace through code systematically
4. Follow its investigation steps

## When planning major features
1. Use `mcp__zen__planner` to break down complexity
2. Get step-by-step implementation plan
3. Identify dependencies and risks early
4. Branch strategies for different approaches

## When reviewing code before commit
1. Use `mcp__zen__codereview` for comprehensive analysis
2. Catches security issues, performance problems
3. Suggests improvements and best practices
4. Run BEFORE `git commit`

## When generating tests
1. Use `mcp__zen__testgen` for edge case coverage
2. Specify which components/functions to test
3. Generates Playwright tests following project patterns
4. Includes happy path and failure scenarios

## Advanced MCP Workflows
**For complex tasks** → See `docs/reference/mcp-workflows.md`

**Quick MCP usage**:
- **Project overview** → `smart-tree`
- Complex debugging → `zen__debug`
- Code review → `zen__codereview` 
- Feature planning → `zen__planner`
- Visual testing → `playwright`

**Remember**: Always use port 4322 for Claude Code operations