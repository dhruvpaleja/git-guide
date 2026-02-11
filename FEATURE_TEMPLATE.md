# Feature Development Template

Use this template when creating new features in the Soul Yatri application.

## Quick Start

```bash
# 1. Create feature folder
mkdir -p src/features/feature-name/{components,pages,services,types,hooks,constants}

# 2. Copy this template guide to your feature
# 3. Implement following the pattern below
```

## File Structure Template

```
src/features/feature-name/
├── components/
│   ├── FeatureComponent.tsx
│   └── index.ts
├── pages/
│   └── FeaturePage.tsx
├── services/
│   └── feature.service.ts
├── types/
│   └── index.ts
├── hooks/
│   └── useFeature.ts
├── constants/
│   └── index.ts
└── README.md
```

## Types (types/index.ts)

```typescript
export interface Feature {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FeatureStatus = 'pending' | 'active' | 'archived';
```

## Service (services/feature.service.ts)

```typescript
import { apiService } from '@/services';
import type { Feature } from '../types';

export const featureService = {
  async getList(page = 1, limit = 20) {
    return apiService.get<Feature[]>(`/feature?page=${page}&limit=${limit}`);
  },

  async getById(id: string) {
    return apiService.get<Feature>(`/feature/${id}`);
  },

  async create(data: Partial<Feature>) {
    return apiService.post<Feature>('/feature', data);
  },

  async update(id: string, data: Partial<Feature>) {
    return apiService.put<Feature>(`/feature/${id}`, data);
  },

  async delete(id: string) {
    return apiService.delete(`/feature/${id}`);
  },
};
```

## Hook (hooks/useFeature.ts)

```typescript
import { useAsyncOperation } from '@/hooks/advanced.hooks';
import { featureService } from '../services';

export function useFeatureList() {
  return useAsyncOperation(() => featureService.getList());
}

export function useFeatureById(id: string) {
  return useAsyncOperation(() => featureService.getById(id), !!id);
}
```

## Component (components/FeatureComponent.tsx)

```typescript
import { useFeatureList } from '../hooks';

interface FeatureComponentProps {
  // Props
}

export function FeatureComponent({ }: FeatureComponentProps) {
  const { data, status, error } = useFeatureList();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      {/* Resource content */}
    </div>
  );
}
```

## Page (pages/FeaturePage.tsx)

```typescript
import { FeatureComponent } from '../components';

export function FeaturePage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Feature</h1>
      <FeatureComponent />
    </div>
  );
}
```

## Constants (constants/index.ts)

```typescript
export const FEATURE_CONSTANTS = {
  PAGE_SIZE: 20,
  MAX_ITEMS: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};
```

## Validation Schema

Add to `src/config/validation.schemas.ts`:

```typescript
import { z } from 'zod';

export const featureSchema = z.object({
  name: z.string().min(3, 'Name is required').max(100),
  description: z.string().max(500).optional(),
});

export type FeatureFormData = z.infer<typeof featureSchema>;
```

## Route Configuration

Add to `src/config/routes.ts`:

```typescript
FEATURE: {
  path: '/feature',
  name: 'Feature',
  isPublic: false,
  showInNavigation: true,
  icon: 'icon-name',
  requiredRole: ['user', 'admin'],
},
```

## Permissions

Add to `src/config/permissions.ts`:

```typescript
{ id: 'view_feature', name: 'View Feature', description: 'Can view feature', resource: 'feature', action: 'read' },
{ id: 'manage_feature', name: 'Manage Feature', description: 'Can manage feature', resource: 'feature', action: 'manage' },
```

## Testing Pattern

Create `components/FeatureComponent.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing.utils';
import { FeatureComponent } from './FeatureComponent';

describe('FeatureComponent', () => {
  it('renders loading state', () => {
    renderWithProviders(<FeatureComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

## Error Handling

```typescript
import { AppError, ValidationError } from '@/utils/errors';

try {
  const data = await featureService.create(formData);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else if (error instanceof AppError) {
    // Handle app error
  }
}
```

## Documentation

Create `README.md` in feature folder:

```markdown
# Feature Name

Brief description of the feature.

## Components
- `FeatureComponent` - Main component
- `FeatureList` - List view

## Services
- `featureService.getList()` - Get list
- `featureService.getById(id)` - Get by ID
- `featureService.create(data)` - Create
- `featureService.update(id, data)` - Update
- `featureService.delete(id)` - Delete

## Hooks
- `useFeatureList()` - Get list with loading/error
- `useFeatureById(id)` - Get single item

## Routes
- `/feature` - Feature list page
- `/feature/:id` - Feature detail page

## Permissions
- `view_feature` - View features
- `manage_feature` - Manage features
```

## Checklist

- [ ] Created feature folder structure
- [ ] Defined types in `types/index.ts`
- [ ] Created service in `services/feature.service.ts`
- [ ] Created custom hooks in `hooks/`
- [ ] Created component in `components/`
- [ ] Created page in `pages/`
- [ ] Added constants in `constants/`
- [ ] Added validation schema to `src/config/validation.schemas.ts`
- [ ] Added route to `src/config/routes.ts`
- [ ] Added permissions to `src/config/permissions.ts`
- [ ] Created tests in `__tests__/` or `.test.ts` files
- [ ] Created feature `README.md`
- [ ] Added error handling
- [ ] Added loading states
- [ ] Tested in browser
- [ ] Code review ready

## Common Patterns

### Async Loading Pattern
```typescript
const { data, status, error, execute } = useAsyncOperation(() => service.fetch());

if (status === 'loading') return <LoadingSpinner />;
if (status === 'error') return <ErrorMessage error={error} />;
return <Content data={data} />;
```

### Form Handling Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { featureSchema } from '@/config/validation.schemas';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(featureSchema),
});
```

### Error Handling Pattern
```typescript
import { AppError, validatorChecks } from '@/utils/errors';
import { ValidationError } from '@/utils/errors';

const handleError = (error: unknown) => {
  if (error instanceof ValidationError) {
    // Show validation error
  } else if (error instanceof AppError) {
    // Show app error
  } else {
    // Show generic error
  }
};
```

Need help? Check the existing features in `src/features/` for examples!
