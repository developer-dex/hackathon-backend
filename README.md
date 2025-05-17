# Todo App API

A RESTful Todo application API built with TypeScript, Express, and MongoDB following Clean Architecture principles.

## Architecture

This project follows Clean Architecture with these layers:

- **Domain**: Core business entities and interfaces
- **Application**: Use cases implementing business logic
- **Infrastructure**: External frameworks and tools implementation
- **Presentation**: Controllers, routes, and the Express application

## Features

- User authentication (login)
- Authorization with JWT
- Role-based access control (Team Lead)
- Proper error handling and validation
- TypeScript types and interfaces
- Clean Architecture design principles

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```
Then edit the `.env` file with your configuration.

### Development

Run the development server:
```bash
npm run dev
```

### Production Build

Build and start for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login

Example request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## Project Structure

```
todo-app/
├── src/
│   ├── domain/                # Enterprise business rules
│   │   ├── entities/          # Business entities
│   │   └── repositories/      # Repository interfaces
│   │
│   ├── application/           # Application business rules
│   │   └── useCases/          # Use cases implementing business logic
│   │
│   ├── infrastructure/        # Frameworks and drivers
│   │   ├── database/          # Database models and connection
│   │   └── repositories/      # Repository implementations
│   │
│   ├── presentation/          # Interface adapters
│   │   ├── controllers/       # Controllers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # Express routes
│   │   └── validation/        # Request validation
│   │
│   ├── dtos/                  # Data Transfer Objects
│   ├── mappers/               # Mappers for transforming between layers
│   ├── app.ts                 # Express application setup
│   └── server.ts              # Server entry point
│
├── .env.example               # Environment variables example
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## License

This project is licensed under the ISC License. 