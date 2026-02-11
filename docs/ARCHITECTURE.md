# Architecture Guide

## Project Structure Overview

Soul Yatri is a modern, scalable web application built with React, Vite, and TypeScript. It follows industry-standard practices for large-scale applications.

### Directory Structure

```
src/
├── assets/              # Static assets
│   ├── images/         # Image files
│   └── icons/          # SVG and icon assets
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── common/        # Shared components
│   ├── layouts/       # Layout components
│   └── sections/      # Page sections
├── config/            # Configuration files
├── constants/         # Application constants
├── context/           # React Context API
├── hooks/             # Custom React hooks
├── middleware/        # Request/response middleware
├── pages/             # Page components
├── services/          # API and external services
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
    ├── helpers/       # Helper functions
    └── validators/    # Validation functions
```

## Code Organization Principles

### 1. Components
- **UI Components**: Reusable, single-purpose components (Button, Card, Modal)
- **Common Components**: Frequently used components (Header, Footer, Navigation)
- **Layout Components**: Page layout containers
- **Section Components**: Large page sections

### 2. Services
- **API Service**: Centralized HTTP client with retry logic
- **Storage Service**: Abstraction for localStorage/sessionStorage
- **Domain Services**: Business logic services (Auth, User, Blog, etc.)

### 3. Utilities
- **Helpers**: Pure utility functions (string, date, number, array operations)
- **Validators**: Input validation functions
- **Hooks**: Custom React hooks (useIsMounted, useDebounce, usePrevious)

### 4. Types
- Centralized TypeScript type definitions
- Organized by feature/domain
- Strict type safety across the application

### 5. Constants
- Configuration values
- Magic strings and numbers
- Enum-like values
- API endpoints

## Patterns and Best Practices

### State Management
- React Context for global state
- Local component state for UI state
- Services for data persistence

### Error Handling
- Centralized error handling in API service
- Error boundaries for React errors
- User-friendly error messages

### Performance
- Code splitting via lazy loading
- Component memoization
- Image optimization
- Bundle size monitoring

### Testing
- Unit tests for utilities and services
- Component tests for UI components
- Integration tests for features
- E2E tests for critical flows

### Code Quality
- ESLint for code standards
- TypeScript for type safety
- Prettier for code formatting
- Pre-commit hooks

## Development Workflow

### Local Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Running Linter
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## API Integration

The `ApiService` class handles all HTTP requests with:
- Automatic retry logic
- Request/response interceptors
- Error handling and logging
- Request cancellation support

Example usage:
```typescript
import { apiService } from '@/services';

const response = await apiService.get('/api/posts', { timeout: 5000 });
```

## Scalability Considerations

This structure supports:
- **2000+ pages**: Organized into logical modules
- **Large teams**: Clear separation of concerns
- **Code reusability**: Shared components and utilities
- **Performance**: Lazy loading and code splitting
- **Maintainability**: Consistent patterns and naming conventions
