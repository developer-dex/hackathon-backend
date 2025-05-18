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

### Admin API

The Admin API provides endpoints for administrative functions such as managing users.

#### Get All Users

Retrieve a list of all users with optional filtering by role and pagination.

```bash
curl -X GET \
  'http://localhost:3000/api/admin/users?role=TEAM_MEMBER&limit=10&offset=1' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Parameters:**
- `role` (optional): Filter users by role (ADMIN, TEAM_LEAD, TEAM_MEMBER)
- `limit` (optional): Number of users to return per page
- `offset` (optional): Page number for pagination (starting from 1)

**Response with Pagination:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "65f123456789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "TEAM_MEMBER",
        "verificationStatus": "VERIFIED",
        "createdAt": "2023-10-29T12:34:56.789Z"
      }
    ]
  },
  "message": "Users retrieved successfully",
  "pagination": {
    "total": 50,
    "limit": 10,
    "page": 1
  }
}
```

**Response without Pagination:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "65f123456789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "TEAM_MEMBER",
        "verificationStatus": "VERIFIED",
        "createdAt": "2023-10-29T12:34:56.789Z"
      }
    ]
  },
  "message": "Users retrieved successfully"
}
```

**Access Control:**
- This endpoint requires admin privileges
- The user must be authenticated with a valid JWT token
- The user's role must be ADMIN

#### Update User Verification Status

Update a user's verification status.

```bash
curl -X PATCH \
  'http://localhost:3000/api/admin/users/65f123456789abcdef123456/verification-status' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "VERIFIED"
  }'
```

**Parameters:**
- `userId`: User ID (in the URL path)
- `status`: New verification status (in the request body)

Available status values:
- `PENDING`: User is pending verification
- `VERIFIED`: User is verified
- `REJECTED`: User verification was rejected

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f123456789abcdef123456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "TEAM_MEMBER",
      "verificationStatus": "VERIFIED",
      "createdAt": "2023-10-29T12:34:56.789Z"
    }
  },
  "message": "User verification status updated successfully",
  "statusCode": 200
}
```

**Error Responses:**
- 400 Bad Request: Invalid verification status
- 404 Not Found: User not found
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: User doesn't have admin privileges 

### Change User Team
```bash
curl -X PATCH http://localhost:3000/api/admin/users/change-team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userId": "user_mongodb_id_here",
    "teamId": "team_mongodb_id_here"
  }'
```

Note: The `teamId` must be a valid MongoDB ObjectId of an existing team. You can get team IDs using the GET teams endpoint described above.

### Kudos API

#### Create Kudos

Creates a new kudos recognition.

```bash
curl -X POST \
  'http://localhost:3000/api/kudos' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "receiverId": "65f123456789abcdef123456",
    "categoryId": "65f123456789abcdef123458",
    "message": "Great job on the project presentation!"
  }'
```

**Note:** The teamId is automatically determined from the receiver's team assignment. The senderId is automatically set to the authenticated user's ID.

**Parameters:**
- `receiverId`: User ID of the kudos recipient (required)
- `categoryId`: Category ID for the kudos (required)
- `message`: Kudos message (required, 5-500 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65f123456789abcdef123460",
    "senderId": "65f123456789abcdef123457",
    "receiverId": "65f123456789abcdef123456",
    "categoryId": "65f123456789abcdef123458",
    "teamId": "65f123456789abcdef123459",
    "message": "Great job on the project presentation!",
    "createdAt": "2023-10-30T15:45:23.456Z",
    "updatedAt": "2023-10-30T15:45:23.456Z"
  },
  "message": "Kudos created successfully",
  "statusCode": 201
}
```

**Access Control:**
- This endpoint requires team lead privileges
- The authenticated user must have the TEAM_LEAD role
- The sender must be the authenticated user

## Admin API Examples

### Change User Role
```bash
curl -X PATCH http://localhost:3000/api/admin/users/change-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userId": "user_mongodb_id_here",
    "role": "Team Lead"
  }'
```

Note: The `role` field must be one of: "Admin", "Team Lead", or "Team Member"

### Basecamp Integration

The Kudos application now integrates with Basecamp to send real-time notifications when kudos are created. When a team lead gives kudos to a team member, a message is automatically posted to the configured Basecamp project.

#### Configuration

To configure the Basecamp integration, set the following environment variable:

```
BASECAMP_WEBHOOK_URL=your_basecamp_webhook_url
```

If not specified, the system will use a default webhook URL.

#### Notification Format

The Basecamp notification includes:
- Sender name (Team Lead who created the kudos)
- Receiver name (Team Member who received the kudos)
- Team name
- Category name
- Kudos message

Example of a Basecamp notification:
```
👏 Appreciation to Team

From: 👨‍💼 John Smith
To: 👨‍💼 Jane Doe
Team: 🏢 Engineering
Category: 🏆 Achievement

Message:
Your exceptional work on authentication testing showcases outstanding attention to detail and a strong commitment to quality.

🚀 Onward and upward!
```
