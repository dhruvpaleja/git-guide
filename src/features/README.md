# Feature Modules

Each feature is a self-contained module with its own components, pages, hooks,
services, types, and constants. This keeps code co-located and makes it easy to
add, refactor, or remove features independently.

## Structure for a new feature

```
features/<feature-name>/
├── components/   # UI components scoped to this feature
├── pages/        # Route-level page components (lazy-loaded from router)
├── hooks/        # Feature-specific React hooks
├── services/     # API calls for this feature
├── types/        # TypeScript interfaces/types
├── constants/    # Feature-specific constants
└── index.ts      # Public API — re-exports only what other features need
```

## Adding a new feature

1. Create the directory under `src/features/<name>/`.
2. Build the page component in `pages/`.
3. Lazy-import it in `src/router/index.tsx` and add a route entry.
4. Export shared items (types, hooks) through `index.ts`.
