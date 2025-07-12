# Documentation Keywords

**For Claude Code: Semantic search optimization**

## File Targeting by Keywords

### Workflow Keywords
- **workflow, triggers, when user says** → `WORKFLOWS.md`
- **common tasks, step by step** → `WORKFLOWS.md`

### Blog Content Keywords
- **post, article, blog, write, create** → `writing/blog-post-template.md`
- **frontmatter, metadata, title, date** → `writing/frontmatter.md`
- **image, photo, picture, upload** → `writing/images.md`
- **warning, note, tip, callout, box** → `writing/admonitions.md`
- **steps, tutorial, guide, sequence** → `writing/steppers.md`
- **draft, hide, preview, wip** → `writing/drafts.md`

### Development Keywords
- **feature, add, new, implement** → `development/adding-features.md`
- **component, create, build, make** → `development/creating-components.md`
- **checklist, before, plan, research** → `development/pre-development-checklist.md`
- **documentation, docs, write, standard** → `development/documentation-standards.md`

### Technical Keywords
- **memory, leak, cleanup, lifecycle** → `patterns/memory-management.md`
- **security, xss, safe, sanitize** → `patterns/security.md`
- **accessibility, a11y, screen reader** → `patterns/accessibility.md`
- **architecture, system, design** → `architecture/overview.md`

### Testing Keywords
- **test, playwright, run, spec, testing** → `reference/testing-guide.md`
- **critical tests, smoke, feature, diagnostic** → `reference/testing-guide.md`
- **testing strategy, change-based** → `reference/testing-guide.md`
- **port conflict, dev server, 4321, 4322, kill** → `reference/port-strategy.md`
- **smoke test, error detection, console** → `reference/smoke-testing.md`

### Quick Reference Keywords
- **command, cli, npm, run** → `reference/commands.md`
- **config, setting, setup** → `reference/config.md`
- **file, directory, structure** → `reference/file-structure.md`
- **font, typography, weight** → `reference/fonts.md`

### MCP Tool Keywords
- **mcp servers, available tools, server list** → `reference/mcp-servers.md`
- **mcp workflow, combine tools, task sequence** → `reference/mcp-workflows.md`
- **debug complex, trace issue, root cause** → Use `mcp__zen__debug`
- **review code, code quality, pre-commit** → Use `mcp__zen__codereview`
- **plan feature, break down, complex task** → Use `mcp__zen__planner`
- **generate tests, test suite, edge cases** → Use `mcp__zen__testgen`
- **refactor, code smell, improve code** → Use `mcp__zen__refactor`
- **security audit, OWASP, vulnerabilities** → Use `mcp__zen__secaudit`
- **document code, generate docs** → Use `mcp__zen__docgen`
- **visual test, screenshot, browser test** → Use Playwright MCP
- **find pattern, search code, similar** → Use Context7 MCP

**Usage**: When user mentions keywords, go directly to the mapped file instead of searching multiple files.