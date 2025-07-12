# MCP Workflow Combinations

**Common task workflows using multiple MCP servers**

## Feature Development Workflow
1. **Smart Tree** → Quick project overview and file discovery
2. **Serena** → Understand existing patterns
3. **Zen Planner** → Break down implementation steps
4. **Context7** → Get framework documentation
5. **Zen Testgen** → Generate comprehensive tests
6. **Playwright** → Visual testing validation

## Bug Investigation Workflow
1. **Zen Debug** → Systematic root cause analysis
2. **Serena** → Navigate to related code
3. **IDE MCP** → Check TypeScript errors
4. **Playwright** → Test visual fixes

## Code Quality Workflow
1. **Zen Analyze** → Deep codebase analysis
2. **Zen Codereview** → Quality review
3. **Zen Secaudit** → Security compliance
4. **Zen Precommit** → Final validation

## Performance Analysis Workflow
1. **Sequential Thinking** → Systematic analysis
2. **Zen Tracer** → Execution path tracing
3. **Desktop Commander** → Run profiling
4. **Playwright** → Browser performance testing

## Project Understanding Workflow (NEW!)
1. **Smart Tree Quick Tree** → Lightning-fast 3-level overview
2. **Smart Tree Project Overview** → Comprehensive analysis
3. **Smart Tree Find Files** → Locate specific file types
4. **Serena** → Navigate to specific code symbols
5. **Context7** → Get framework best practices

## Quick Task Mapping

| Task Type | Primary MCP | Secondary |
|-----------|-------------|-----------|
| **Project overview** | `smart-tree` | `serena` |
| **Find files** | `smart-tree` | `desktop-commander` |
| Debug issue | `zen__debug` | `serena` |
| Plan feature | `zen__planner` | `context7` |
| Code review | `zen__codereview` | `zen__secaudit` |
| Find code | `serena` | `smart-tree` |
| Test UI | `playwright` | `zen__testgen` |
| Get docs | `context7` | N/A |
| System ops | `desktop-commander` | N/A |