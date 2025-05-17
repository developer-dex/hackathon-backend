# Standard Operating Procedure (SOP) for Kudos Application

This document outlines the standard procedures for setting up, developing, testing, and maintaining the Kudos application.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Development Workflow](#development-workflow)
3. [Testing](#testing)
4. [Code Standards](#code-standards)
5. [API Documentation](#api-documentation)

## Environment Setup

### Prerequisites

- Node.js (recommended version in package.json)
- npm or yarn
- Git

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment configuration:
   ```bash
   # Copy example environment file
   cp .env.example .env
   # Edit .env file with appropriate values
   ```

4. Verify setup by running tests:
   ```bash
   npm test
   ```

## Development Workflow

### Starting the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Testing

### Running Tests

Run all tests:
```bash
npm test
```

Run tests with coverage report:
```bash
npm test -- --coverage
```

### Test Structure

- Unit tests are located in the `tests` directory
- Tests follow the same structure as the source code
- Jest is used as the testing framework

## Code Standards

### TypeScript Naming Conventions

### The project follows these naming conventions:

```typescript
// i - Instance
const iAuthRouteUseCase = new AuthRouteUseCase();

// T - Type
type TUserPayload = {
  name: string;
  age: number;
};

// I - Interface
interface IUser {
  id: number;
  email: string;
}

// C - Constant
const CMAXLIMIT = 100;

// E - Enum
enum EUserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST',
}
```

### TypeScript Configuration

- The project uses TypeScript with configuration in `tsconfig.json`
- All new code should be written in TypeScript
- Interfaces should be used to define data models

### Linting

- ESLint is configured in `.eslintrc.js`
- Run linting check:
  ```bash
  npm run lint
  ```
- Fix linting issues automatically:
  ```bash
  npm run lint -- --fix
  ```

### Code Structure

The application follows Clean Architecture principles:

1. **Entities**: Core business objects
2. **Use Cases**: Application-specific business rules
3. **Interface Adapters**: Adapters between use cases and external agencies
4. **Frameworks & Drivers**: External frameworks, databases, web, etc.

### Source Directory Structure

- `src/`: Main source code
  - `entities/`: Business entities and models
  - `usecases/`: Business logic and use cases
  - `interfaces/`: Interface adapters (controllers, presenters)
  - `frameworks/`: External frameworks and tools
  - `middlewares/`: Express middlewares
  - `config/`: Application configuration

### Error Handling

All API responses follow the standard format:

```json
{
  "success": true|false,
  "data": {}, // Response data
  "message": "", // Success or error message
  "error": "" // Detailed error message (only when success=false)
}
``` 