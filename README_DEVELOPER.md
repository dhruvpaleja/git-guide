# 🚀 Soul Yatri - Developer Onboarding & Project Roadmap

Welcome to Soul Yatri! This document serves as your entry point to understand the project, the codebase structure, and how to get started.

## 📋 Quick Overview

**Soul Yatri** is an enterprise-grade web application for mental health and wellness management. It provides:

- 🔐 **Authentication & Authorization** - Secure user management with role-based access
- 📝 **Blog System** - Share wellness articles and experiences
- 🎓 **Courses** - Structured learning paths for mental health
- 👥 **Community** - Connect with others, share, and support
- 💚 **Health Tools** - Mood tracking, meditation, journaling
- 🧘 **Therapy Sessions** - Book and manage therapy sessions
- 📊 **Dashboards** - Analytics and personal insights

**Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Radix UI

---

## 📚 Documentation Index

Start here based on your role:

### For New Developers
1. **[SETUP.md](./SETUP.md)** - Get your environment ready
   - Installation steps
   - Available commands
   - Project structure
   - Development workflow

2. **[FEATURE_TEMPLATE.md](./FEATURE_TEMPLATE.md)** - How to build features
   - File structure template
   - Code patterns
   - Type definitions
   - Service layer
   - Hooks and components
   - Testing patterns

3. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - When things break
   - Common issues and solutions
   - Installation problems
   - Type errors
   - API issues
   - Performance tips

### For Architects & Team Leads
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design
   - Feature-based folder structure
   - Design patterns
   - Data flow
   - Security approach
   - Scalability for 2000+ pages

5. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development standards
   - Code style guide
   - Naming conventions
   - Best practices
   - Performance guidelines
   - Security requirements

6. **[API.md](./API.md)** - Backend integration
   - All API endpoints
   - Request/response formats
   - Authentication flow
   - Error handling

### For QA & Testing
7. **[ENTERPRISE_CHECKLIST.md](./ENTERPRISE_CHECKLIST.md)** - Verification checklist
   - 70+ enterprise requirements
   - All requirements verified ✅
   - Quality metrics

---

## 🎯 Getting Started (5 Minutes)

### Step 1: Clone & Setup
```bash
git clone https://github.com/dhruvpaleja/soul-yatri-website.git
cd soul-yatri-website/app
npm install
cp .env.example .env.local
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5173/
```

### Step 3: Explore the Code
```
src/
├── features/          ← Features you'll build
├── components/        ← Reusable components
├── config/           ← Routes, permissions, validation
├── services/         ← API integration
├── types/            ← TypeScript definitions
├── hooks/            ← Custom React hooks
└── utils/            ← Helpers & utilities
```

### Step 4: Run Quality Checks
```bash
npm run type-check    # Check TypeScript
npm run lint          # Check code quality
npm run format        # Format code
```

---

## 🏗️ Project Structure

```
soul-yatri-website/
├── app/                       ← You're here
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Radix UI components
│   │   │   ├── common/       # Shared components
│   │   │   ├── layouts/      # Page layouts
│   │   │   └── sections/     # Hero, CTA, etc.
│   │   │
│   │   ├── features/         # Feature modules (7 total)
│   │   │   ├── auth/         # Login, signup, auth
│   │   │   ├── blog/         # Blog posts & comments
│   │   │   ├── courses/      # Course content
│   │   │   ├── community/    # Discussions
│   │   │   ├── dashboard/    # User dashboards
│   │   │   ├── health-tools/ # Mood, meditation, journal
│   │   │   └── therapy/      # Session management
│   │   │
│   │   ├── config/           # Configuration
│   │   │   ├── routes.ts     # 30+ routes with RBAC
│   │   │   ├── permissions.ts # 4 roles, 30+ permissions
│   │   │   └── validation.schemas.ts # 9 Zod schemas
│   │   │
│   │   ├── services/         # Service layer
│   │   │   ├── api.service.ts     # HTTP client
│   │   │   ├── storage.service.ts # LocalStorage
│   │   │   └── analytics.service.ts # Event tracking
│   │   │
│   │   ├── types/            # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── blog.types.ts
│   │   │   ├── course.types.ts
│   │   │   ├── community.types.ts
│   │   │   ├── health.types.ts
│   │   │   ├── therapy.types.ts
│   │   │   └── dashboard.types.ts
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── advanced.hooks.ts # 8 production hooks
│   │   │   └── use-mobile.ts
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   ├── security.ts        # Password, CSRF, roles
│   │   │   ├── errors/           # Error classes
│   │   │   ├── string.helpers.ts
│   │   │   ├── collection.helpers.ts
│   │   │   ├── date.helpers.ts
│   │   │   ├── number.helpers.ts
│   │   │   ├── react.helpers.ts
│   │   │   └── testing.utils.ts
│   │   │
│   │   ├── context/          # React Context
│   │   ├── middleware/       # API middleware
│   │   ├── constants/        # Constants
│   │   ├── assets/          # Images, fonts
│   │   └── App.tsx          # Root component
│   │
│   ├── public/              # Static files
│   ├── dist/                # Build output (after npm run build)
│   │
│   ├── SETUP.md             # Setup guide
│   ├── FEATURE_TEMPLATE.md  # Feature development template
│   ├── TROUBLESHOOTING.md   # Common issues & solutions
│   ├── ARCHITECTURE.md      # System design
│   ├── DEVELOPMENT.md       # Dev standards
│   ├── API.md              # Backend API docs
│   ├── ENTERPRISE_CHECKLIST.md # 70+ requirements ✅
│   │
│   ├── vite.config.ts      # Build configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── eslint.config.js    # Linting rules
│   ├── .prettierrc          # Code formatting
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Dependencies & scripts
│   └── .gitignore          # Git ignore rules
```

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read SETUP.md and get environment running
- [ ] Read ARCHITECTURE.md to understand structure
- [ ] Explore existing features: auth, blog, courses
- [ ] Learn TypeScript types in `src/types/`
- [ ] Understand services in `src/services/`

### Week 2: Feature Development
- [ ] Read FEATURE_TEMPLATE.md
- [ ] Pick one small feature to build
- [ ] Create feature folder structure
- [ ] Define types
- [ ] Create services
- [ ] Create components
- [ ] Write tests

### Week 3: Advanced Topics
- [ ] Study RBAC in `src/config/permissions.ts`
- [ ] Learn advanced hooks in `src/hooks/advanced.hooks.ts`
- [ ] Understand error handling in `src/utils/errors/`
- [ ] Learn security patterns in `src/utils/security.ts`
- [ ] Study tests in `src/utils/testing.utils.ts`

### Week 4: Production
- [ ] Learn deployment (see DEVELOPMENT.md)
- [ ] Understand performance optimization
- [ ] Master DEVELOPMENT.md code standards
- [ ] Review ENTERPRISE_CHECKLIST.md

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run dev --port 3000 # Use different port

# Code Quality
npm run lint            # Lint and fix
npm run lint:check      # Check without fixing
npm run format          # Format code
npm run format:check    # Check formatting
npm run type-check      # Check TypeScript

# Building
npm run build           # Build for production
npm run preview         # Preview production build
npm run analyze         # Analyze bundle size

# Git & Commits
git commit -m "feat: type(scope): description"
# Types: feat, fix, docs, style, refactor, test, chore
```

---

## 📦 Feature Roadmap

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Landing page with hero section
- [x] Navigation with pixel-perfect design
- [x] Type system for all features
- [x] RBAC & permissions system
- [x] Validation schemas
- [x] Error handling
- [x] Advanced hooks
- [x] Service layer architecture

### 🔄 Phase 2: Core Features (IN PROGRESS)
- [ ] **Auth**: Login, signup, password reset, 2FA
- [ ] **Blog**: Create, read, update, delete posts with comments
- [ ] **Blog**: Categories, tags, search, pagination
- [ ] **Courses**: Create courses, modules, lessons
- [ ] **Courses**: Enrollment, progress tracking, certificates

### 📅 Phase 3: Health & Wellness (PLANNED)
- [ ] **Health Tools**: Mood tracker with charts
- [ ] **Health Tools**: Guided meditation player
- [ ] **Health Tools**: Journal with templates
- [ ] **Health Tools**: Breathing exercises
- [ ] **Health Goals**: Set and track wellness goals

### 👥 Phase 4: Community & Therapy (PLANNED)
- [ ] **Community**: Discussion threads
- [ ] **Community**: User profiles, badges, karma
- [ ] **Community**: Moderation tools
- [ ] **Therapy**: Session booking & calendar
- [ ] **Therapy**: Session notes and feedback
- [ ] **Therapy**: Therapist onboarding

### 🎯 Phase 5: Advanced (PLANNED)
- [ ] **Dashboards**: Personalized analytics
- [ ] **Dashboards**: Health metrics visualization
- [ ] **Admin Panel**: User management
- [ ] **Admin Panel**: Content moderation
- [ ] **Admin Panel**: Analytics dashboard
- [ ] **Mobile**: Responsive design optimization
- [ ] **Mobile**: PWA support

---

## 🔐 Authentication & Roles

Your app supports 4 user roles:

### 1. **User** (Default)
- View blog posts
- Browse courses
- Community access
- Health tools access
- Book therapy sessions

### 2. **Therapist**
- All user permissions +
- Manage patients
- Manage sessions
- View patient progress
- Create courses

### 3. **Moderator**
- Moderate community posts
- Flag inappropriate content
- Manage comments
- Community moderation dashboard

### 4. **Admin**
- Manage users & therapists
- Manage content
- Analytics & reporting
- System settings

---

## 🛡️ Security & Best Practices

### Always Follow These Rules:
1. ✅ **Validate Input** - Use Zod schemas
2. ✅ **Sanitize HTML** - Use `sanitizeHTML()` from utils
3. ✅ **Check Permissions** - Use RBAC before rendering
4. ✅ **Error Handling** - Use custom error classes
5. ✅ **Environment Variables** - Use `.env` files
6. ✅ **Never Commit Secrets** - Check `.gitignore`

### Security Utilities Available:
```typescript
import { 
  hashPassword, 
  verifyPassword,    // Password hashing
  generateCSRFToken, // CSRF protection
  isAuthenticated,   // Check auth status
  hasRole,          // Check user role
  verifyPermission, // Check permission
  sanitizeHTML      // Prevent XSS
} from '@/utils/security';
```

---

## 📊 Codebase Stats

| Metric | Value |
|--------|-------|
| **React Components** | 50+ |
| **UI Components** | 30+ |
| **Features** | 7 |
| **Routes** | 30+  |
| **Permissions** | 30+ |
| **Validation Schemas** | 9 |
| **Custom Hooks** | 8+ |
| **Utility Functions** | 25+ |
| **Error Classes** | 7 |
| **TypeScript Files** | 94 |
| **Lines of Code** | 10,000+ |

---

## 🎯 Common Tasks

### Create a New Feature
```bash
# Follow FEATURE_TEMPLATE.md
1. Create folder: mkdir -p src/features/feature-name
2. Define types: src/features/feature-name/types/index.ts
3. Create service: src/features/feature-name/services/
4. Create hooks: src/features/feature-name/hooks/
5. Create components: src/features/feature-name/components/
6. Create page: src/features/feature-name/pages/
7. Add route: src/config/routes.ts
8. Add permission: src/config/permissions.ts
9. Add schema: src/config/validation.schemas.ts
```

### Call an API
```typescript
import { apiService } from '@/services';

const response = await apiService.get('/endpoint');
const data = await apiService.post('/endpoint', { ...payload });
const updated = await apiService.put('/endpoint/1', { ...changes });
await apiService.delete('/endpoint/1');
```

### Validate a Form
```typescript
import { featureSchema } from '@/config/validation.schemas';

const validated = featureSchema.parse(formData);
```

### Check Permissions
```typescript
import { hasPermission } from '@/utils/security';

if (hasPermission('view_therapy_sessions')) {
  // Show therapy section
}
```

### Handle Errors
```typescript
import { ValidationError, AuthenticationError } from '@/utils/errors';

try {
  // operation
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else if (error instanceof AuthenticationError) {
    // Handle auth error
  }
}
```

---

## 🤝 Contributing

1. **Create a branch** for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow code standards** (see DEVELOPMENT.md)
   - Type all variables
   - Write tests
   - Document functions
   - Handle errors

3. **Check code quality**
   ```bash
   npm run type-check
   npm run lint
   npm run format
   ```

4. **Commit with conventional format**
   ```bash
   git commit -m "feat(feature): description of change"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📞 Support & Resources

### Documentation
- [SETUP.md](./SETUP.md) - Get started
- [FEATURE_TEMPLATE.md](./FEATURE_TEMPLATE.md) - Build features
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix issues
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand design
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Code standards
- [API.md](./API.md) - Backend API
- [ENTERPRISE_CHECKLIST.md](./ENTERPRISE_CHECKLIST.md) - QA checklist

### External Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Validation](https://zod.dev)
- [Radix UI](https://www.radix-ui.com)

### Getting Help
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Search GitHub issues
3. Check existing code for examples
4. Ask in team chat with error details

---

## ✨ What Makes This Enterprise-Grade

✅ **Type Safety** - 100% TypeScript coverage with strict mode  
✅ **RBAC** - 4 roles with granular permissions  
✅ **Validation** - 9 Zod schemas for all inputs  
✅ **Error Handling** - Custom error classes with context  
✅ **Security** - Password hashing, CSRF tokens, sanitization  
✅ **Testing** - Ready for unit, integration, e2e tests  
✅ **Documentation** - 8 comprehensive guides  
✅ **Code Quality** - ESLint, Prettier, type checking  
✅ **Performance** - Code splitting, lazy loading, optimization  
✅ **Scalability** - Feature-based structure for 2000+ pages  

---

## 📝 License

This project is proprietary software for Soul Yatri.

---

**Last Updated**: December 2024  
**Repository**: https://github.com/dhruvpaleja/soul-yatri-website  
**Version**: 1.0.0

---

**Ready to build something amazing? 🚀 Start with [SETUP.md](./SETUP.md)!**
