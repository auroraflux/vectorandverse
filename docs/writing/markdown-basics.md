# Markdown Basics

## Headings

```markdown
# H1 - Main Title (avoid, use frontmatter title)
## H2 - Section Heading
### H3 - Subsection
#### H4 - Minor Heading
```

## Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`inline code`
```

## Lists

### Unordered
```markdown
- First item
- Second item
  - Nested item
  - Another nested
- Third item
```

### Ordered
```markdown
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step
```

## Links

```markdown
[Link text](https://example.com)
[Internal link](/about)
[Link with title](https://example.com "Hover text")
```

## Code Blocks

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```

```typescript
interface User {
  name: string;
  email: string;
}
```
````

## Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.
```

## Horizontal Rule

```markdown
---
```

## Line Breaks

End a line with two spaces  
to create a line break.

Or use a blank line for a paragraph break.