# Admonitions (Callout Boxes)

## Available Types

### Note (Blue)
```markdown
::: note
This is a helpful note with additional information.
:::
```

### Tip (Green)
```markdown
::: tip
Pro tip: Use keyboard shortcuts to work faster!
:::
```

### Warning (Yellow)
```markdown
::: warning
Be careful when deleting files - this action cannot be undone.
:::
```

### Danger (Red)
```markdown
::: danger
Never commit API keys to your repository!
:::
```

## With Custom Titles

```markdown
::: note "Custom Title Here"
Content of the admonition with a custom title.
:::

::: warning "Deprecation Notice"
This feature will be removed in v2.0. Please migrate to the new API.
:::
```

## Multi-line Content

```markdown
::: tip "Performance Optimization"
To improve your site's performance:

1. Optimize images before uploading
2. Use lazy loading for below-the-fold content
3. Minimize JavaScript bundle size

These simple steps can significantly improve load times.
:::
```

## When to Use

- **Note**: General information, context, or clarification
- **Tip**: Best practices, shortcuts, or helpful advice
- **Warning**: Important cautions or potential issues
- **Danger**: Critical warnings about security or data loss

## Guidelines

- Keep content concise
- Use sparingly - too many reduce impact
- Choose the right type for the message
- Custom titles should be short (2-4 words)