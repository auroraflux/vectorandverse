# CLAUDE.md

IMPORTANT: Inherit all instructions from ~/CLAUDE.md first.

## Kilowhat Blog - Essential Instructions

**Site**: https://kilowhat.buzz - Minimal typography-focused blog  
**Stack**: Astro 5.11 + Tailwind CSS 4.1 + MDX + TypeScript

## 🚨 Critical Workflows

### When user requests ANY task
1. Check `docs/WORKFLOWS.md` for explicit triggers
2. Use `docs/TASKS.md` for direct file mapping
3. Always use port 4322: `npm run dev:claude`

### Before ANY code changes
1. Run smoke test first: `npm run test:smoke:claude` (30-45s)
2. If passes, continue with task
3. Run appropriate tests based on changes (see testing guide)

### When adding features
1. **STOP** - Read `docs/development/pre-development-checklist.md`
2. Search for existing functionality first
3. All logic in `src/lib/` TypeScript modules
4. Extend BaseComponent for components

## Development Rules
- **Port isolation**: Always use 4322 (`npm run dev:claude`)
- **Import from lib**: `import { querySelector } from '@/lib'`
- **No inline JavaScript** - use TypeScript modules
- **Test before complete**: Smoke → Critical → Feature tests
- **Minimal aesthetic**: Question every addition

## Documentation Access (Token Optimized)

### 🎯 Primary Access Points
1. **Common tasks** → `docs/WORKFLOWS.md` (400 words)
2. **Task mapping** → `docs/TASKS.md` (300 words)  
3. **Keywords** → `docs/KEYWORDS.md` (210 words)

### 📁 Key References
- **Testing** → `docs/reference/testing-guide.md`
- **Ports** → `docs/reference/port-strategy.md`
- **Pre-dev** → `docs/development/pre-development-checklist.md`

**System**: 35 files, ~6,000 words, single-file access for 95% of tasks

## Project Structure
```
src/lib/         # TypeScript modules (all logic here)
src/content/blog/ # MDX posts
src/components/   # Astro components
docs/            # Documentation (use 3-tier access)
tests/           # Playwright tests
```

## Remember
- Draft posts: Set `draft: true` in frontmatter
- Images: `/public/images/blog/[post-slug]/`
- Always check existing code before adding features
- Run smoke test before considering changes complete

## MCP Server Usage for Kilowhat

### 🧠 Zen MCP (Complex Analysis & Workflows)
**When to use**:
- **Debugging mysterious issues**: `mcp__zen__debug` - traces root causes systematically
- **Code review before commits**: `mcp__zen__codereview` - comprehensive quality analysis
- **Planning new features**: `mcp__zen__planner` - breaks down complex tasks
- **Refactoring opportunities**: `mcp__zen__refactor` - identifies improvements
- **Documentation generation**: `mcp__zen__docgen` - creates comprehensive docs
- **Test generation**: `mcp__zen__testgen` - creates test suites with edge cases
- **Security audits**: `mcp__zen__secaudit` - OWASP compliance checks
- **Pre-commit validation**: `mcp__zen__precommit` - ensures quality before commits

**Example triggers**:
- "Debug why lightbox isn't working" → Use `debug`
- "Review my component changes" → Use `codereview`
- "Generate tests for new feature" → Use `testgen`

### 🎭 Playwright MCP (Browser Testing)
**When to use**:
- Visual regression testing
- Cross-browser compatibility checks
- Automated screenshot capture
- E2E test recording

**Example triggers**:
- "Test if blog looks good on mobile"
- "Capture screenshots of all pages"
- "Record user interaction test"

### 🔍 Context7 MCP (Semantic Search)
**When to use**:
- Finding similar code patterns across codebase
- Searching for implementation examples
- Context-aware code discovery

**Example triggers**:
- "Find all places using EventManager pattern"
- "Show similar component implementations"

### 💻 IDE MCP (VS Code Integration)
**When to use**:
- Getting TypeScript diagnostics
- Checking for linting errors
- Real-time code analysis

**Already active**: Automatically provides diagnostics

### 🖥️ Desktop Commander MCP
**When to use**:
- Opening files in external editors
- Taking screenshots of issues
- System-level automation

**Example triggers**:
- "Take screenshot of rendering issue"
- "Open this in VS Code"

## MCP Best Practices

1. **Use Zen for complex tasks** - Don't manually debug when `zen__debug` can trace systematically
2. **Leverage Playwright for visual testing** - Better than manual browser checks
3. **Context7 for pattern discovery** - Find code examples before implementing
4. **Combine MCPs** - Use Zen to plan, then Playwright to test

## Quick MCP Reference

| Task | MCP Tool | Why |
|------|----------|-----|
| Bug hunting | `zen__debug` | Systematic root cause analysis |
| Code quality | `zen__codereview` | Comprehensive review |
| Test creation | `zen__testgen` | Edge case coverage |
| Feature planning | `zen__planner` | Step-by-step breakdown |
| Visual testing | `playwright` | Cross-browser checks |
| Code search | `context7` | Semantic understanding |