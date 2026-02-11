# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dhruvpaleja/soul-yatri-website.git
cd soul-yatri-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Code Style Guide

### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Functions**: camelCase (e.g., `handleClick()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Types**: PascalCase (e.g., `UserProps`)
- **Files**: kebab-case for utilities (e.g., `string.helpers.ts`)

### Component Structure
```typescript
import { ReactNode } from 'react';
import { ButtonProps } from '@/types';
import Button from '@/components/ui/Button';

interface MyComponentProps {
  title: string;
  children?: ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Import Order
1. React and external libraries
2. Internal components
3. Types and interfaces
4. Services and utilities
5. Constants
6. Styles

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui';
import { User } from '@/types';
import { apiService } from '@/services';
import { APP_CONSTANTS } from '@/constants';
import styles from './MyComponent.module.css';
```

## TypeScript Guidelines

### Always Use Types
```typescript
// ✓ Good
interface UserData {
  id: string;
  name: string;
}

const user: UserData = { id: '1', name: 'John' };

// ✗ Avoid
const user: any = { id: '1', name: 'John' };
```

### Use Type-Safe APIs
```typescript
// ✓ Good
const response = await apiService.get<UserData>('/api/user');

// ✗ Avoid
const response = await fetch('/api/user');
```

## Git Workflow

### Branch Naming
- Features: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages
Follow conventional commits:
```
feat(component): add new button variant
fix(api): handle network errors properly
docs(architecture): update structure guide
```

### Pull Requests
1. Create feature branch from `master` or `develop`
2. Make changes with clear commits
3. Create PR with description
4. Pass CI/CD checks
5. Get code review
6. Merge to main branch

## Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
Tests should be placed next to the component/service:
```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── Button.stories.tsx
```

## Performance Best Practices

### Code Splitting
```typescript
import { lazy } from 'react';

const HeroSection = lazy(() => import('./HeroSection'));
```

### Memoization
```typescript
import { memo } from 'react';

const Card = memo(({ title, content }) => (
  <div>{title}: {content}</div>
));
```

### Image Optimization
- Use WebP format
- Provide fallbacks
- Add lazy loading
- Optimize file sizes

## Common Tasks

### Adding a New Page
1. Create page component in `src/pages`
2. Add route in routing configuration
3. Update navigation if needed

### Adding a New API Endpoint
1. Add type in `src/types`
2. Create service method in `src/services/api.service.ts`
3. Use in component via `apiService`

### Adding a New UI Component
1. Create component in `src/components/ui`
2. Export from `index.ts`
3. Document props
4. Add examples/stories

## Debugging

### Browser DevTools
- React DevTools extension
- Redux DevTools (if using Redux)
- Network tab for API calls

### Console Logging
```typescript
// Development only
if (import.meta.env.MODE === 'development') {
  console.log('Debug info:', data);
}
```

## Troubleshooting

### Module not found errors
- Check import paths
- Ensure TypeScript paths are configured correctly
- Clear node_modules and reinstall

### Hot reload not working
- Restart dev server
- Clear browser cache
- Check file paths

### Build errors
Run type check first:
```bash
npx tsc --noEmit
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
