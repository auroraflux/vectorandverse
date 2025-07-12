# Commands Reference

## Development

```bash
npm run dev
```
Starts development server at `http://localhost:4321`

## Building

```bash
npm run build
```
Creates production build in `dist/` directory

## Preview

```bash
npm run preview
```
Preview production build locally

## Testing

```bash
# Run all tests (requires dev server running)
npm test

# Interactive UI mode
npm test:ui

# Debug mode
npm test:debug
```

## Linting & Formatting

```bash
# Check TypeScript
npx tsc --noEmit

# Format with Prettier
npx prettier --write .
```

## Git Workflow

```bash
# Check changes
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin main
```

## Common Tasks

### Add New Blog Post
1. Create MDX file in `src/content/blog/`
2. Add images to `public/images/blog/[slug]/`
3. Run dev server to preview

### Update Dependencies
```bash
npm update
npm audit fix
```