# Port Strategy

**For Claude Code: Port isolation and cleanup**

## Port Assignment

| User | Port | Command | Behavior |
|------|------|---------|----------|
| **You** | 4321 | `npm run dev` | Kills existing, starts fresh |
| **Claude** | 4322 | `npm run dev:claude` | Kills existing, starts fresh |

## When to Use

### User wants to start dev server
```bash
npm run dev              # Always port 4321, auto-cleanup
```

### Claude Code needs to test
```bash
npm run dev:claude       # Terminal 1: Start on 4322
npm run test:smoke:claude # Terminal 2: Quick error check
npm run test:claude      # Terminal 2: Full tests
```

## Cleanup Commands

```bash
npm run kill-port 4321   # Kill specific port
npm run kill-port 4322   # Kill specific port
npm run kill-all-dev     # ⚠️ Nuclear option - kills ALL
```

## How It Works

**`scripts/dev-safe.js`:**
1. Kills processes on target port
2. Waits 500ms for port cleanup
3. Starts fresh astro dev server
4. Each port isolated from others

**Configuration:**
- `playwright.config.ts` detects `CLAUDE_MODE` env var
- Tests use port 4322 when `CLAUDE_MODE=true`
- Complete isolation between user and Claude

## Troubleshooting

**Port still in use?**
```bash
lsof -ti :4321          # Check what's using it
npm run kill-all-dev    # Nuclear cleanup
npm run dev             # Start fresh
```

**Result**: Zero port conflicts. You use 4321, Claude uses 4322.