# Contributing Guide

## Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for full setup instructions.

## Workflow

1. Create a feature branch from `master`: `git checkout -b feature/description`
2. Make changes with clear, scoped commits
3. Run quality gates before pushing:
   ```bash
   npm run quality:ci
   ```
4. Push and open a Pull Request
5. Pass CI checks + code review
6. Squash-merge to `master`

## Quality Gates

Every PR must pass the full quality gate chain:

| Gate | Command | What it checks |
|------|---------|---------------|
| Type-check | `npm run type-check` | Frontend TypeScript |
| Lint (frontend) | `npm run lint:ci` | ESLint with zero warnings |
| Build (frontend) | `npm run build` | Vite production build |
| Bundle budget | `npm run bundle:budget` | JS chunk size limits |
| Build (backend) | `cd server && npm run build` | Backend TypeScript |
| Lint (backend) | `cd server && npm run lint:ci` | Backend ESLint (zero warnings) |

Run all at once:
```bash
npm run quality:ci
```

E2E smoke tests (optional but recommended):
```bash
npm run test:e2e
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add password reset flow
fix(dashboard): correct mood chart rendering
docs(api): document therapy endpoints
refactor(services): extract token refresh logic
```

## Code Standards

- **TypeScript**: Use explicit types, avoid `any`. Use `type` imports.
- **ESLint**: Zero warnings policy. Run `npm run lint` to auto-fix.
- **Naming**: PascalCase for components/types, camelCase for functions, UPPER_SNAKE_CASE for constants.
- **Imports**: Use `@/` path alias for frontend, `@contracts/*` for shared types.

## What to Work On

- Check GitHub Issues for open tasks
- Look for `good first issue` label
- Stub routes marked `STUB` in [API.md](API.md) need implementation
- See [ARCHITECTURE.md](ARCHITECTURE.md) for codebase orientation
