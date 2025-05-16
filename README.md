# Todo App with Clean Architecture

A Todo application built with Node.js, Express, TypeScript, and MongoDB following Clean Architecture principles.

## Project Structure

The project is organized using Clean Architecture principles, which separates the code into layers:

```
todo-app/
├── src/
│   ├── domain/             # Core business logic and entities
│   │   ├── entities/       # Business objects (Todo)
│   │   ├── interfaces/     # Repository interfaces
│   │   └── services/       # Domain-specific services
│   ├── application/        # Use cases and application logic
│   │   ├── useCases/       # Business use cases (CreateTodo, GetTodos, etc.)
│   │   ├── interfaces/     # Application interfaces
│   │   └── constants/      # Application constants
│   ├── infrastructure/     # External concerns (databases, frameworks)
│   │   └── repositories/   # Repository implementations for MongoDB
│   ├── presentation/       # UI and delivery mechanisms
│   │   ├── controllers/    # Express route handlers
│   │   ├── routes/         # Express routes
│   │   ├── validation/     # Input validation
│   │   └── middlewares/    # Express middlewares
│   ├── dtos/               # Data Transfer Objects
│   ├── mappers/            # Object mappers between layers
│   └── config/             # Configuration files
├── tests/                  # Test files organized by layer
│   ├── domain/             # Domain layer tests
│   ├── application/        # Application layer tests
│   ├── infrastructure/     # Infrastructure layer tests
│   └── presentation/       # Presentation layer tests
├── package.json
├── tsconfig.json
├── jest.config.js
└── .eslintrc.js
```

## Clean Architecture Layers

1. **Domain Layer**: Contains the core business logic, entities, and business rules.
2. **Application Layer**: Contains the use cases that orchestrate the flow of data between the domain and infrastructure layers.
3. **Infrastructure Layer**: Contains implementations of the interfaces defined in the domain layer.
4. **Presentation Layer**: Contains the controllers, routes, and validation logic for the API.

## API Endpoints

- **POST /api/todos** - Create a new todo
- **GET /api/todos** - Get all todos
- **GET /api/todos/:id** - Get a todo by ID
- **PUT /api/todos/:id** - Update a todo
- **DELETE /api/todos/:id** - Delete a todo

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies

```bash
cd todo-app
npm install
```

3. Create a `.env` file in the root directory (use `.env.example` as a template)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
```

4. Run the development server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Testing

The application includes comprehensive tests for all layers of the Clean Architecture:

- Domain layer tests: Test the core business entities and rules
- Application layer tests: Test the use cases and business logic
- Infrastructure layer tests: Test the repository implementations
- Presentation layer tests: Test the controllers and API endpoints

To run all tests:

```bash
npm test
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

To run tests for a specific layer:

```bash
# Run only domain layer tests
npm test -- tests/domain

# Run only a specific test file
npm test -- tests/application/useCases/CreateTodo.test.ts
```

## Benefits of Clean Architecture

- **Maintainability**: The code is organized in a way that makes it easy to understand and modify.
- **Testability**: Each layer can be tested independently.
- **Flexibility**: The application is not tied to any specific framework or database, making it easy to replace components. 