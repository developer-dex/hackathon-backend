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

## API Documentation

### User Signup with Team Reference

The signup process now requires a valid Team ID reference instead of a department string.

```bash
curl -X POST \
  http://localhost:3000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "TEAM_MEMBER",
    "teamId": "65f123456789abcdef123456"
  }'
```

The `teamId` must be a valid MongoDB ObjectId of an existing team. You can get team IDs using the GET teams endpoint:

```bash
curl -X GET \
  http://localhost:3000/api/teams \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### Category API with Icon Upload Support

The Category API now supports icon file uploads. You can create categories with uploaded image files or use icon names.

#### Create a Category with File Upload

```bash
curl -X POST \
  http://localhost:3000/api/categories/create \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'name=NEW_CATEGORY' \
  -F 'description=Description of the new category' \
  -F 'color=#ff5733' \
  -F 'icon=@/path/to/your/icon/file.png'
```

- The icon file must be an image (JPEG, PNG, GIF, or SVG)
- Maximum file size: 2MB
- The uploaded file will be stored in the `public/icons` directory
- The icon URL will be returned in the response

#### Create a Category with Icon Name

You can also create a category by providing an icon name instead of uploading a file:

```bash
curl -X POST \
  http://localhost:3000/api/categories/create \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "NEW_CATEGORY",
    "description": "Description of the new category",
    "color": "#ff5733",
    "icon": "trophy"
  }'
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "id": "653eb45d932d0d3456789012",
    "name": "NEW_CATEGORY",
    "description": "Description of the new category",
    "icon": "filename.png",
    "iconUrl": "/icons/filename.png",
    "color": "#ff5733",
    "isActive": true,
    "createdAt": "2023-10-29T12:34:56.789Z",
    "updatedAt": "2023-10-29T12:34:56.789Z"
  },
  "message": "Category created successfully"
}
```

The response includes:
- The original `icon` value (filename or icon name)
- An `iconUrl` field with the full path to the icon image 