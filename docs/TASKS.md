# Task-to-File Mapping

**For Claude Code: Instant file targeting by user intent**

## 🎯 Common Workflows → [WORKFLOWS.md](./WORKFLOWS.md)
**Start here for:** Step-by-step instructions with explicit triggers

## Content Creation Tasks

| User Says | Go To | Words |
|-----------|-------|-------|
| "write blog post" | `writing/blog-post-template.md` | 227 |
| "add frontmatter" | `writing/frontmatter.md` | 177 |
| "insert image" | `writing/images.md` | 152 |
| "create warning" | `writing/admonitions.md` | 216 |
| "add steps" | `writing/steppers.md` | 173 |
| "draft post" | `writing/drafts.md` | 115 |

## Development Tasks

| User Says | Go To | Words |
|-----------|-------|-------|
| "add feature" | `development/adding-features.md` | 245 |
| "create component" | `development/creating-components.md` | 285 |
| "before coding" | `development/pre-development-checklist.md` | 195 |

## Architecture Tasks

| User Says | Go To | Words |
|-----------|-------|-------|
| "system design" | `architecture/overview.md` | 158 |
| "component patterns" | `architecture/components.md` | 164 |
| "data flow" | `architecture/data-flow.md` | 165 |

## Testing Tasks

| User Says | Go To | Words |
|-----------|-------|-------|
| "run tests" | `reference/testing-guide.md` | 350 |
| "test strategy" | `reference/testing-guide.md` | 350 |
| "playwright tests" | `reference/testing-guide.md` | 350 |
| "port conflict" | `reference/port-strategy.md` | 250 |
| "smoke test" | `reference/smoke-testing.md` | 165 |
| "error detection" | `reference/smoke-testing.md` | 165 |

## Quick Fixes

| User Says | Go To | Words |
|-----------|-------|-------|
| "memory leak" | `patterns/memory-management.md` | 181 |
| "security issue" | `patterns/security.md` | 181 |
| "accessibility" | `patterns/accessibility.md` | 164 |
| "file structure" | `reference/file-structure.md` | 203 |
| "commands" | `reference/commands.md` | 154 |

## MCP Server Tasks

| User Says | Use MCP | Why |
|-----------|---------|-----|
| "debug this issue" | `zen__debug` | Systematic root cause analysis |
| "review my code" | `zen__codereview` | Comprehensive quality check |
| "plan new feature" | `zen__planner` | Step-by-step breakdown |
| "find symbol usage" | `serena` | Semantic code navigation |
| "test across browsers" | `playwright` | Cross-browser validation |
| "get framework docs" | `context7` | Latest documentation |
| "search codebase" | `desktop-commander` | Advanced file operations |
| "check TypeScript" | `ide` | Real-time diagnostics |
| "analyze performance" | `sequential-thinking` | Systematic reasoning |
| "security audit" | `zen__secaudit` | OWASP compliance |
| "generate tests" | `zen__testgen` | Comprehensive test coverage |
| "refactor code" | `zen__refactor` | Improvement identification |

**Total Coverage**: 95% of common requests in <250 words per file