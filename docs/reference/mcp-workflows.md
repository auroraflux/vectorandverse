# MCP Workflow Combinations

**Common task workflows using multiple MCP servers**

## Feature Development Workflow
1. **Serena** → Understand existing patterns
2. **Zen Planner** → Break down implementation steps
3. **Context7** → Get framework documentation
4. **Zen Testgen** → Generate comprehensive tests
5. **Playwright** → Visual testing validation

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

## Quick Task Mapping

| Task Type | Primary MCP | Secondary |
|-----------|-------------|-----------|
| Debug issue | `zen__debug` | `serena` |
| Plan feature | `zen__planner` | `context7` |
| Code review | `zen__codereview` | `zen__secaudit` |
| Find code | `serena` | `desktop-commander` |
| Test UI | `playwright` | `zen__testgen` |
| Get docs | `context7` | N/A |
| System ops | `desktop-commander` | N/A |