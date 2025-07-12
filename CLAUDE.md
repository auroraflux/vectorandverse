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

## MCP Server Integration

**Advanced tools for systematic development workflows**

### 📚 MCP Documentation
- **Server overview** → `docs/reference/mcp-servers.md`
- **Workflow combinations** → `docs/reference/mcp-workflows.md`

### 🎯 Quick Task Selection
| Task | Use MCP | Why |
|------|---------|-----|
| Debug issues | `zen__debug` | Systematic analysis |
| Code review | `zen__codereview` | Quality assurance |
| Plan features | `zen__planner` | Step-by-step breakdown |
| Find code | `serena` | Semantic navigation |
| Test UI | `playwright` | Cross-browser testing |
| Get docs | `context7` | Framework guidance |
| System ops | `desktop-commander` | File operations |
| **Directory analysis** | `smart-tree` | **Project overview, file discovery** |

### 💡 Integration Philosophy
- **Use systematic tools** over manual debugging
- **Combine MCPs** for comprehensive workflows  
- **Start with navigation** (Serena) before changes
- **Validate visually** (Playwright) for UI work