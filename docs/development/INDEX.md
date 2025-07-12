# Development Quick Index

**For Claude Code: Feature development workflow**

## Before Coding (REQUIRED)

| Step | File | Words |
|------|------|-------|
| **1. Research & plan** | `pre-development-checklist.md` | 195 |
| **2. Component patterns** | `creating-components.md` | 285 |
| **3. Feature workflow** | `adding-features.md` | 245 |
| **4. Documentation** | `documentation-standards.md` | 315 |

## Workflow Commands

```bash
# Research existing functionality
grep -r "feature_name" src/
find src/components -name "*.astro" | head -10

# Check for similar components  
ls src/lib/components/
ls src/components/ | grep -i keyword
```

## Token Efficiency Rules

1. **Always** check pre-development checklist first
2. **Search** before creating to avoid redundancy
3. **Document** according to word count guidelines
4. **Test** with Playwright before committing

Total: 4 files, ~1,040 words