# Troubleshooting Guide

Common issues and solutions for Soul Yatri development.

## Installation & Setup Issues

### Issue: npm install fails
**Symptoms**: 
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution**:
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force resolution
npm install --force

# If still failing, clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Node version incompatibility
**Symptoms**:
```
error: Node version too old
```

**Solution**:
```bash
# Check your Node version
node --version

# Should be 18+ or 20+
# Update from https://nodejs.org/
# Or use nvm (Node Version Manager)
nvm use 20
```

### Issue: Port 5173 already in use
**Symptoms**:
```
Port already in use
```

**Solution**:
```bash
# Use different port
npm run dev -- --port 3000

# Or kill process using port 5173
lsof -i :5173
kill -9 <PID>
```

---

## TypeScript & Compilation Issues

### Issue: Type errors after changes
**Symptoms**:
```
Property 'X' does not exist on type 'Y'
```

**Solution**:
```bash
# Run type checker
npm run type-check

# Or check specific file
npx tsc --noEmit src/file.tsx

# Restart TS server in VS Code
Cmd/Ctrl + Shift + P > TypeScript: Restart TS Server
```

### Issue: Module not found errors
**Symptoms**:
```
Cannot find module '@/path/to/module'
tsconfig paths issue
```

**Solution**:
```bash
# Check tsconfig.json paths configuration
# Should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: React/JSX errors
**Symptoms**:
```
'React' is not found
JSX element is not a constructor
```

**Solution**:
```typescript
// React 17+ supports JSX without import
// No need: import React from 'react'

// Just use JSX in .tsx files
export function Component() {
  return <div>Hello</div>;
}
```

---

## Runtime Issues

### Issue: Module not found at runtime
**Symptoms**:
```
Cannot find module 'react' from path...
```

**Solution**:
```bash
# Verify dependencies installed
npm ls react

# Or reinstall
npm install react react-dom

# Check node_modules exists
ls node_modules/
```

### Issue: App won't start
**Symptoms**:
```
Vite server fails to start
Error in setup or rendering
```

**Solution**:
```bash
# Check for syntax errors
npm run lint

# Check types
npm run type-check

# Clear cache and restart
rm -rf .vite dist node_modules/.vite
npm run dev
```

### Issue: Components not rendering
**Symptoms**:
```
Blank page or partial content
Console errors about components
```

**Solution**:
```typescript
// Check component exports
export function Component() {
  return <div>Content</div>;
}

// Or default export
export default function Component() {
  return <div>Content</div>;
}

// Check error boundary
// Wrap pages in <ErrorBoundary>
```

---

## API & Service Issues

### Issue: API calls failing
**Symptoms**:
```
Fetch error
Network error
404 Not Found
```

**Solution**:
```bash
# Check API URL in .env.local
VITE_API_URL=http://localhost:3000/api/v1

# Verify backend is running
curl http://localhost:3000/api/v1/health

# Check network in DevTools (F12)
# Look for failed requests and status codes
```

### Issue: CORS errors
**Symptoms**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
```typescript
// Backend should include CORS headers
// Or setup proxy in vite.config.ts

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Issue: Data not loading
**Symptoms**:
```
useAsyncOperation always shows loading
Error state but no error message
```

**Solution**:
```typescript
// Check if endpoint is wrong
const { data, status, error } = useAsyncOperation(
  () => featureService.getList()
);

// Log to verify
console.log('Status:', status);
console.log('Error:', error);
console.log('Data:', data);

// Verify service method exists
// Check API response in DevTools Network tab
```

---

## Validation & Forms

### Issue: Form validation not working
**Symptoms**:
```
Form submits with invalid data
No error messages
```

**Solution**:
```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { featureSchema } from '@/config/validation.schemas';

const { register, formState: { errors } } = useForm({
  // Must include resolver
  resolver: zodResolver(featureSchema),
});

// Display errors
{errors.name && <span>{errors.name.message}</span>}
```

### Issue: Schema validation errors
**Symptoms**:
```
Parse error from Zod
Type mismatch
```

**Solution**:
```typescript
// Check schema definition
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

// Validate before submission
try {
  const validated = schema.parse(formData);
} catch (error) {
  console.log(error.errors); // See validation errors
}
```

---

## Styling & Layout Issues

### Issue: Tailwind CSS not working
**Symptoms**:
```
Classes not applying
Colors not showing
```

**Solution**:
```bash
# Check tailwind.config.js has correct content paths
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],

# Rebuild CSS
npm run dev
# Or force rebuild
rm -rf .vite && npm run dev
```

### Issue: Dark mode not working
**Symptoms**:
```
Dark class not applied
Styles not changing
```

**Solution**:
```html
<!-- Make sure html has dark class -->
<html class="dark">
  <body>
    <!-- content -->
  </body>
</html>

<!-- Or use JS -->
<script>
  document.documentElement.classList.toggle('dark');
</script>
```

### Issue: Responsive design not working
**Symptoms**:
```
Breakpoints not triggering
Mobile view broken
```

**Solution**:
```bash
# Check viewport meta tag in index.html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

# Check Tailwind breakpoints used
sm: 640px
md: 768px
lg: 1024px

# Use correct classes
md:grid-cols-2  <!-- Applies at 768px+ -->
```

---

## Performance Issues

### Issue: App loads slowly
**Symptoms**:
```
Initial load takes long
JavaScript is large
```

**Solution**:
```bash
# Analyze bundle size
npm run analyze

# Check what's being imported
# Look for large dependencies
npm ls --depth=0

# Remove unused libraries
npm uninstall unused-package

# Split code
import { lazy } from 'react';
const HeavyComponent = lazy(() => import('./Heavy'));
```

### Issue: App is slow at runtime
**Symptoms**:
```
Interactions lag
UI is sluggish
```

**Solution**:
```typescript
// Use React DevTools Profiler
// Check for unnecessary re-renders
export const Component = React.memo(function Component() {
  // Component won't re-render unless props change
});

// Optimize hooks
const handleClick = useCallback(() => {
  // Only recreated when dependencies change
}, [dependency]);

// Use lazy loading
const Component = lazy(() => import('./Component'));
```

---

## Build Issues

### Issue: Production build fails
**Symptoms**:
```
npm run build fails
Build has errors
```

**Solution**:
```bash
# Check for errors before building
npm run type-check
npm run lint

# Try building with more info
npm run build -- --debug

# Check dist folder created
ls dist/

# Serve locally to test
npm run preview
```

### Issue: Build output too large
**Symptoms**:
```
dist/ folder > 1MB
Performance issues
```

**Solution**:
```bash
# Analyze bundle
npm run analyze

# Check output size
du -sh dist/

# Enable compression in hosting
# Use gzip or brotli
```

---

## Git & Version Control

### Issue: Git conflicts
**Symptoms**:
```
Merge conflicts
Can't pull/push
```

**Solution**:
```bash
# See conflicts
git status

# Resolve manually, then
git add .
git commit -m "fix: resolve merge conflicts"

# Or abort
git merge --abort
```

### Issue: Accidentally committed sensitive data
**Symptoms**:
```
.env file pushed
API keys exposed
```

**Solution**:
```bash
# Remove from history
git rm --cached .env.local
echo ".env.local" >> .gitignore
git commit -m "chore: remove .env from tracking"

# Or reset specific file
git reset HEAD -- .env.local
```

### Issue: Pre-commit hook failing
**Symptoms**:
```
Can't commit
Type-check or lint fails
```

**Solution**:
```bash
# Run the checks manually
npm run type-check
npm run lint

# Fix issues first, then commit
# Or bypass hooks (not recommended)
git commit --no-verify
```

---

## Environment & Configuration

### Issue: Environment variables not loading
**Symptoms**:
```
process.env.VITE_API_URL is undefined
```

**Solution**:
```typescript
// Vite requires VITE_ prefix
// Must be in .env or .env.local
// VITE_API_URL=...

// Access with import.meta.env
const apiUrl = import.meta.env.VITE_API_URL;

// Must restart dev server after changing
npm run dev
```

### Issue: Different environment variables per environment
**Symptoms**:
```
Prod using dev endpoint
Env vars not switching
```

**Solution**:
```bash
# Create environment files
.env              # Shared defaults
.env.local        # Local overrides (gitignored)
.env.production   # Production values

# Vite automatically loads based on mode
# Default is 'development' for npm run dev
# Production for npm run build

# Or specify mode
npm run build:prod
```

---

## Browser & DevTools

### Issue: DevTools don't show source maps
**Symptoms**:
```
Can't debug TypeScript
Shows compiled JS instead
```

**Solution**:
```bash
# Vite generates source maps in dev mode
# No additional config needed

# Check in DevTools Settings
Settings > Debugger > Enable JavaScript source maps

# Or check vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

### Issue: Component props not visible in React DevTools
**Symptoms**:
```
DevTools shows empty props
Can't inspect state
```

**Solution**:
```bash
# Install React DevTools extension
# Chrome: React Developer Tools
# Firefox: React Developer Tools

# Restart browser
# Refresh page
# Open DevTools > Components tab
```

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'map' of undefined` | Array is undefined | Check if data is loaded before mapping |
| `Type 'X' is not assignable to type 'Y'` | Type mismatch | Check variable type definition |
| `is not a function` | Trying to call non-function | Verify import or function definition |
| `Cannot find module` | Import path wrong | Check path, check tsconfig paths |
| `CORS error` | Backend missing CORS headers | Configure backend CORS |
| `404 Not Found` | API endpoint wrong | Check API URL and endpoint path |

---

## Debug Tips

### Enable debug logging
```typescript
// In development
if (import.meta.env.DEV) {
  console.log('Debug info:', variable);
}
```

### Use debugger
```typescript
export function Component() {
  debugger; // Execution pauses here
  return <div>Hello</div>;
}
```

### Network debugging
```bash
# Check all network requests
F12 > Network tab
# Filter by XHR for API calls
# Check response for errors
```

### Performance profiling
```bash
F12 > Performance tab
# Record interaction
# Analyze timeline
# Check for bottlenecks
```

---

## Support

If you can't find a solution:

1. Check existing issues in GitHub
2. Search project documentation
3. Check error logs in console
4. Try minimal reproduction
5. Ask in team chat with error details
