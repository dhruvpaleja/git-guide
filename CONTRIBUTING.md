# Contributing to Soul Yatri

First off, thank you for considering contributing to Soul Yatri! It's people like you that make Soul Yatri such a great mental health platform.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if possible**
* **Include environment details (OS, browser, Node version)**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List some examples of how this enhancement would be used**

### Pull Requests

* Fill in the required PR template
* Don't forget to link issues to your PR
* Follow the coding style
* Include tests when applicable
* Update documentation as needed

## Development Setup

### Prerequisites

* Node.js >= 22.12.0
* npm >= 10.x
* PostgreSQL >= 15
* Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/dhruvpaleja/soul-yatri-website.git

# Navigate to project directory
cd soul-yatri-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Setup environment variables
cp .env.example .env
cd server
cp .env.example .env

# Start development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

### Database Setup

```bash
# In server directory
npx prisma migrate dev
npx prisma generate
npm run seed
```

## Coding Style

* **TypeScript**: Strict mode enabled
* **ESLint**: Enforces code quality
* **Prettier**: Code formatting
* **React Hooks**: Functional components preferred
* **Naming**: camelCase for variables/functions, PascalCase for components/types

### Frontend Guidelines

* Use TypeScript for all files
* Prefer functional components with hooks
* Use the established component library (shadcn/ui)
* Follow the existing folder structure
* Write meaningful component and variable names

### Backend Guidelines

* Use TypeScript for all files
* Follow the controller-service-repository pattern
* Validate all inputs with Zod
* Use async/await for asynchronous operations
* Handle errors with the AppError class
* Log appropriately with Winston

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new therapy booking feature
fix: resolve video call connection issue
docs: update API documentation
style: format code according to prettier
refactor: refactor authentication logic
test: add unit tests for pricing service
chore: update dependencies
```

## Testing

### Frontend Tests

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### Backend Tests

```bash
# Run specific test
npm run test:pricing
npm run test:cancellation
npm run test:therapist-limit
npm run test:nudge
npm run test:flow
```

## Quality Checks

Before submitting a PR, ensure all checks pass:

```bash
# Frontend
npm run type-check
npm run lint
npm run build

# Backend
cd server
npm run build
npm run lint
```

## Deployment

### Staging

Push to `develop` branch for staging deployment.

### Production

Push to `master` branch for production deployment.

## Architecture Overview

### Frontend

* **React 19** with TypeScript
* **Vite** for bundling
* **React Router** for routing
* **shadcn/ui** for components
* **Tailwind CSS** for styling
* **Prisma Client** for type safety

### Backend

* **Express.js** with TypeScript
* **Prisma ORM** for database
* **PostgreSQL** database
* **JWT** for authentication
* **Zod** for validation
* **Winston** for logging

### Database

* **PostgreSQL** 15+
* **Prisma** for schema management
* Migrations for version control

## Documentation

* Keep README.md up to date
* Document all public APIs
* Add JSDoc comments for complex functions
* Update CHANGELOG.md with significant changes

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.
