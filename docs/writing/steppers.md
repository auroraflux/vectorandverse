# Stepper Component

## What It Does

Creates numbered step-by-step instructions with visual indicators.

## Basic Usage

```markdown
::: stepper
{items: [
  {title: "Install dependencies", content: "Run npm install to get started"},
  {title: "Start dev server", content: "Run npm run dev to start the development server"},
  {title: "Open browser", content: "Navigate to http://localhost:4321"}
]}
:::
```

## Full Example

```markdown
## How to Deploy Your Site

Follow these steps to deploy to production:

::: stepper
{items: [
  {
    title: "Build the project", 
    content: "Run npm run build to create the production bundle"
  },
  {
    title: "Test the build", 
    content: "Run npm run preview to test the production build locally"
  },
  {
    title: "Deploy to hosting", 
    content: "Upload the dist folder to your hosting provider"
  },
  {
    title: "Verify deployment", 
    content: "Visit your site URL and check everything works"
  }
]}
:::
```

## Guidelines

- Keep titles short and action-oriented
- Content should be concise instructions
- Use for sequential processes
- Ideal for tutorials and how-to guides
- Steps are automatically numbered