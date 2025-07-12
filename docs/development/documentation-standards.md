# Documentation Standards

## Documentation Categories

### Writing (`docs/writing/`)
- User-facing content creation guides
- Markdown syntax and components
- Blog post templates and examples
- Word count: 110-250 words per file

### Architecture (`docs/architecture/`)
- System design and patterns
- Component relationships
- Data flow explanations
- Word count: 150-200 words per file

### Patterns (`docs/patterns/`)
- Code patterns and best practices
- Security and accessibility guidelines
- Memory management patterns
- Word count: 160-200 words per file

### Reference (`docs/reference/`)
- Quick lookup information
- Configuration options
- Commands and file structure
- Word count: 100-200 words per file

### Development (`docs/development/`)
- Feature development guides
- Component creation workflows
- Testing and quality standards
- Word count: 200-300 words per file

## File Naming Standards

- Use kebab-case: `adding-features.md`
- Be descriptive: `memory-management.md` not `memory.md`
- Group related topics: `steppers.md`, `admonitions.md`
- Avoid abbreviations: `accessibility.md` not `a11y.md`

## Content Structure

### Required Sections
```markdown
# Clear Title

## Overview (what it does)

## Usage (how to use it)

## Examples (code samples)

## Best Practices (guidelines)
```

### Optional Sections
- Troubleshooting
- Advanced Usage
- Integration Notes
- Performance Considerations

## Writing Guidelines

### Voice and Tone
- Concise and direct
- Action-oriented (use imperatives)
- Assume technical knowledge
- Avoid unnecessary explanations

### Code Examples
```markdown
# Good: Specific and complete
```typescript
import { BaseComponent } from '@/lib/components';

export class MyComponent extends BaseComponent<HTMLElement> {
  protected mount(): void {
    // Implementation
  }
}
```

# Bad: Vague or incomplete
```typescript
class Component {
  // ... some code
}
```
```

### Token Optimization
- Target 100-300 words per file
- Use bullet points for lists
- Minimize redundancy across files
- Include only essential information
- Reference other docs instead of repeating

## Documentation Workflow

### 1. Before Creating
- Check `docs/INDEX.md` for existing coverage
- Search for similar topics across docs
- Determine correct category
- Plan word count and structure

### 2. During Creation
- Follow template structure
- Include practical examples
- Test all code samples
- Keep language concise

### 3. After Creation
- Update `docs/INDEX.md` with new file
- Update category file counts in `docs/README.md`
- Add cross-references from related docs
- Update `CLAUDE.md` if needed

### 4. Quality Check
- Word count within category guidelines
- All code examples work
- No redundancy with existing docs
- Clear and actionable content

## Maintenance

- Review docs monthly for accuracy
- Update when features change
- Remove outdated information
- Consolidate overlapping content