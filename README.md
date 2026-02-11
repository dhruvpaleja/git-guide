# Soul Yatri - Meditation & Wellness Platform

A modern, production-ready web application built with React, TypeScript, Vite, and Tailwind CSS. Designed with industry-standard practices for scalability and maintainability.

[![Build Status](https://github.com/dhruvpaleja/soul-yatri-website/actions/workflows/build.yml/badge.svg)](https://github.com/dhruvpaleja/soul-yatri-website/actions)
[![Code Quality](https://github.com/dhruvpaleja/soul-yatri-website/actions/workflows/quality.yml/badge.svg)](https://github.com/dhruvpaleja/soul-yatri-website/actions)

## 🚀 Features

- ✨ Modern React 19+ with TypeScript
- ⚡ Vite for ultra-fast development
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔐 Type-safe API integration
- 🏗️ Enterprise-grade architecture
- 📚 Comprehensive documentation
- 🧪 Testing infrastructure
- 🔄 CI/CD pipelines
- 📦 Code splitting & optimization

## 📋 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Language | TypeScript 5+ |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 3 |
| UI Components | Radix UI, Shadcn/ui |
| Forms | React Hook Form |
| Icons | Lucide React |
| State Management | React Context + Services |
| HTTP Client | Fetch API (with service layer) |

## 📦 Project Structure

```
src/
├── assets/           # Static assets
├── components/       # React components
│   ├── ui/          # UI components
│   ├── common/      # Shared components
│   ├── layouts/     # Layout components
│   └── sections/    # Page sections
├── config/          # Configuration
├── constants/       # Application constants
├── context/         # React Context
├── hooks/           # Custom hooks
├── middleware/      # Request/response middleware
├── pages/           # Page components
├── services/        # API & data services
├── styles/          # Global styles
├── types/           # TypeScript types
└── utils/           # Utility functions
    ├── helpers/     # Helper functions
    └── validators/  # Validation functions
```

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvpaleja/soul-yatri-website.git
   cd soul-yatri-website/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173/` in your browser.

## 📚 Available Scripts

```bash
# Development
npm run dev           # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🏗️ Architecture

The project follows a modular, scalable architecture designed for enterprise applications:

- **Components**: Reusable, single-responsibility components
- **Services**: Centralized API calls and data operations
- **Types**: Strict TypeScript types throughout
- **Constants**: Centralized configuration values
- **Utils**: Pure utility and helper functions
- **Context**: Global state management

See [Architecture Guide](docs/ARCHITECTURE.md) for detailed information.

## 📖 Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow
- [Architecture Guide](docs/ARCHITECTURE.md) - Project structure and patterns
- [API Documentation](docs/API.md) - Backend API endpoints
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

## 🔑 Key Features

### Type Safety
- Strict TypeScript configuration
- Global type definitions
- Type-safe API responses

### Performance
- Code splitting by route
- Lazy loading components
- Optimized bundle size
- Image optimization

### Developer Experience
- Hot module replacement (HMR)
- ESLint & Prettier configuration
- Pre-commit hooks
- Detailed error messages

### Code Quality
- Strict type checking
- Consistent code style
- Automated testing
- CI/CD pipelines

## 🔄 Workflow

### Development
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m 'feat(scope): description'`
3. Push to fork: `git push origin feature/your-feature`
4. Create Pull Request

### Standards
- Follow [conventional commits](https://www.conventionalcommits.org/)
- Write clean, self-documenting code
- Add tests for new features
- Update documentation

See [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 🚀 Deployment

### Build
```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### CI/CD
Automatic workflows on push:
- Build verification
- Type checking
- Linting
- Security audits

## 🐛 Troubleshooting

### Clear Cache
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Dev Server Issues
```bash
npm run dev -- --force
```

## 📊 Project Capabilities

- ✅ Supports 2000+ pages
- ✅ Enterprise-scale architecture
- ✅ Type-safe throughout
- ✅ Optimized performance
- ✅ Comprehensive documentation
- ✅ CI/CD ready
- ✅ Production-grade code quality

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🙋 Support

- Check [Documentation](docs/)
- Search [GitHub Issues](https://github.com/dhruvpaleja/soul-yatri-website/issues)
- Create new issue if needed

## 📞 Contact

- Email: dev@soul-yatri.com
- Website: https://soul-yatri.com

---

**Made with React + TypeScript + Vite + Tailwind CSS**
