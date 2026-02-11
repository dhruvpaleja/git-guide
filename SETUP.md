# Quick Setup Guide

This guide will help you get up and running with the Soul Yatri enterprise codebase.

## Prerequisites

- **Node.js**: 18+ or 20+
- **npm** or **yarn**
- **Git**

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/dhruvpaleja/soul-yatri-website.git
cd soul-yatri-website/app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false
VITE_SENTRY_DSN=
```

### 4. Setup Pre-commit Hooks (Optional but Recommended)
```bash
npm install husky @commitlint/config-conventional @commitlint/cli --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run type-check && npm run lint:check"
npx husky add .husky/commit-msg "commitlint -E HUSKY_GIT_PARAMS"
```

### 5. Start Development Server
```bash
npm run dev
```

Server will be available at `http://localhost:5173/`

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint and fix code |
| `npm run lint:check` | Check linting without fixing |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | Check TypeScript types |

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── common/         # Shared components
│   ├── layouts/        # Layout components
│   └── sections/       # Page sections
├── features/           # Feature modules
│   ├── auth/          # Authentication feature
│   ├── blog/          # Blog feature
│   ├── courses/       # Courses feature
│   ├── community/     # Community feature
│   ├── dashboard/     # Dashboard feature
│   ├── health-tools/  # Health tools feature
│   └── therapy/       # Therapy feature
├── config/            # Configuration
├── constants/         # Constants
├── context/           # React Context
├── hooks/             # Custom hooks
├── lib/               # Library utilities
├── middleware/        # Middleware
├── services/          # Services (API, Storage, etc.)
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Development Workflow

### 1. Create a New Feature

```bash
# Create feature folder
mkdir -p src/features/your-feature/{components,pages,services,types,hooks}
```

### 2. Define Types
Create `src/features/your-feature/types/index.ts`:
```typescript
export interface YourFeatureType {
  id: string;
  name: string;
  // ... other properties
}
```

### 3. Create Services
Create `src/features/your-feature/services/index.ts`:
```typescript
import { apiService } from '@/services';

export const yourFeatureService = {
  async getItems() {
    return apiService.get('/your-feature');
  },
};
```

### 4. Create Hooks
Create `src/features/your-feature/hooks/useYourFeature.ts`:
```typescript
import { useAsyncOperation } from '@/hooks/advanced.hooks';
import { yourFeatureService } from '../services';

export function useYourFeature() {
  return useAsyncOperation(() => yourFeatureService.getItems());
}
```

### 5. Create Components
Create `src/features/your-feature/components/YourFeature.tsx`:
```typescript
import { useYourFeature } from '../hooks';

export function YourFeature() {
  const { data, status, error } = useYourFeature();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error?.message}</div>;

  return <div>{/* Your content */}</div>;
}
```

## Code Quality

### Linting
```bash
npm run lint        # Lint and fix automatically
npm run lint:check  # Check without fixing
```

### Formatting
```bash
npm run format      # Format code
npm run format:check # Check formatting
```

### Type Checking
```bash
npm run type-check
```

## Testing

### Running Tests
```bash
npm test            # Run all tests
npm test --watch    # Run tests in watch mode
npm test --coverage # Generate coverage report
```

### Writing Tests
Tests should be placed next to the component/service:
```
src/
├── services/
│   ├── api.service.ts
│   └── api.service.test.ts
└── components/
    ├── Button.tsx
    └── Button.test.tsx
```

## API Integration

### Using API Service
```typescript
import { apiService } from '@/services';
import type { YourType } from '@/types';

// GET request
const response = await apiService.get<YourType>('/endpoint');

// POST request
const response = await apiService.post<YourType>('/endpoint', { data: 'value' });

// PUT request
const response = await apiService.put<YourType>('/endpoint/123', { data: 'value' });

// DELETE request
await apiService.delete('/endpoint/123');
```

### Error Handling
```typescript
try {
  const response = await apiService.get('/endpoint');
  if (!response.success) {
    console.error(response.error);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## Environment Variables

### Available Variables
- `VITE_API_URL` - Backend API URL
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking
- `VITE_SENTRY_DSN` - Sentry error tracking

### Development
Use `.env.local` for local development

### Production
Use `.env.production` for production builds

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
npm run type-check
```

### Build Issues
```bash
# Clear build cache
rm -rf dist node_modules/.vite
npm run build
```

## Performance Tips

1. **Use Code Splitting**: Import components with `lazy()`
2. **Optimize Images**: Use WebP with fallbacks
3. **Monitor Bundle Size**: Check Vite build output
4. **Use React DevTools**: Debug component performance
5. **Enable Production Optimizations**: Built into Vite

## Security

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use HTTPS** in production
3. **Validate all inputs** - Use validation schemas
4. **Sanitize HTML** - Use provided utilities
5. **Check permissions** - Use RBAC

## Git Workflow

### Commit Format
Follow conventional commits:
```
feat(scope): description
fix(scope): description
docs(scope): description
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature
```

### Commit Changes
```bash
git commit -m "feat(feature): your description"
```

### Push and Create PR
```bash
git push origin feature/your-feature
```

## Need Help?

- Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guides
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details
- Check [API.md](API.md) for API documentation
- Check [ENTERPRISE_CHECKLIST.md](ENTERPRISE_CHECKLIST.md) for checklist

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Validation](https://zod.dev)
