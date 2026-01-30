# CMMS API Documentation

> **Version:** 1.0  
> **Base URL:** `http://localhost:3000/api/v1/cmms/`  
> **Swagger Documentation:** `http://localhost:3000/docs`

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Asset Management](#asset-management)
5. [Task Management](#task-management)
6. [Role & Permission Management](#role--permission-management)
7. [Notifications](#notifications)
8. [Data Storage Guide](#data-storage-guide)
9. [Error Handling](#error-handling)
10. [Postman Collection](#postman-collection)

---

## Overview

The CMMS (Computerized Maintenance Management System) API is a NestJS-based RESTful API that manages assets, tasks, users, and maintenance operations. The API uses:

- **Database:** PostgreSQL with TypeORM
- **Caching:** Redis
- **Authentication:** JWT-based token authentication
- **Validation:** Class-validator with DTOs
- **Authorization:** Role-based permission system

### Key Features
- ✅ JWT Token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CRUD operations for Users, Assets, Tasks
- ✅ Asset QR code generation
- ✅ Task assignment and approval workflows
- ✅ Real-time notifications
- ✅ Soft delete mechanism
- ✅ Audit logging

---

## Authentication

### 1. Register a New User

**Endpoint:** `POST /api/v1/cmms/auth/register`

**Description:** Register a new user in the system. This endpoint does not require authentication.

**Request Body:**
```json
{
  "username": "john.doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "mobileNumber": "+1234567890",
  "role": 1,
  "supervisorIds": ["uuid-of-supervisor-1", "uuid-of-supervisor-2"]
}
```

**Field Validations:**
- `username`: Required, 6-15 characters, lowercase letters/numbers with optional single underscores or periods
- `password`: Required, 6-15 characters, must include uppercase, lowercase, number, and special character
- `email`: Optional, must be valid email format
- `firstName`, `lastName`: Optional strings
- `mobileNumber`: Optional string
- `role`: Optional number (role ID)
- `supervisorIds`: Optional array of UUIDs

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-generated",
    "username": "john.doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "mobileNumber": "+1234567890",
    "role": {
      "id": 1,
      "roleName": "Admin",
      "permissions": [...]
    },
    "createdAt": "2026-01-21T06:47:53.000Z",
    "updatedAt": "2026-01-21T06:47:53.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "mobileNumber": "+1234567890",
    "role": 1
  }'
```

### 2. Login

**Endpoint:** `POST /api/v1/cmms/auth/login`

**Description:** Authenticate user and receive JWT access token.

**Request Body:**
```json
{
  "username": "john.doe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "john.doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": {
        "id": 1,
        "roleName": "Admin",
        "permissions": [...]
      }
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "SecurePass123!"
  }'
```

> [!IMPORTANT]
> Save the `access_token` from the login response. You must include this token in the `Authorization` header for all subsequent API requests:
> ```
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> ```

---

## User Management

### 1. Create User (Requires CREATE_USERS Permission)

**Endpoint:** `POST /api/v1/cmms/user/`

**Description:** Create a new user. Requires authentication and `CREATE_USERS` permission.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "jane.smith",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass456!",
  "mobileNumber": "+9876543210",
  "role": 2,
  "supervisorIds": ["uuid-of-supervisor"]
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "new-uuid",
    "username": "jane.smith",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "role": {
      "id": 2,
      "roleName": "Technician"
    },
    "supervisors": [...],
    "createdBy": "uuid-of-creator",
    "createdAt": "2026-01-21T07:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/cmms/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane.smith",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "SecurePass456!",
    "role": 2
  }'
```

### 2. Get All Users

**Endpoint:** `GET /api/v1/cmms/user/`

**Description:** Retrieve all users with optional filters and pagination.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `username` (optional): Filter by username
- `email` (optional): Filter by email
- `role` (optional): Filter by role ID

**Example Request:**
```
GET /api/v1/cmms/user/?page=1&limit=10&role=2
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid-1",
      "username": "john.doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": {
        "id": 1,
        "roleName": "Admin"
      },
      "createdAt": "2026-01-20T10:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "username": "jane.smith",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": {
        "id": 2,
        "roleName": "Technician"
      },
      "createdAt": "2026-01-21T07:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### 3. Get User by ID

**Endpoint:** `GET /api/v1/cmms/user/:id`

**Example:** `GET /api/v1/cmms/user/uuid-1`

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-1",
    "username": "john.doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "mobileNumber": "+1234567890",
    "role": {
      "id": 1,
      "roleName": "Admin",
      "permissions": [...]
    },
    "supervisors": [],
    "supervisees": [],
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  }
}
```

### 4. Update User

**Endpoint:** `PUT /api/v1/cmms/user/:id`

**Request Body:**
```json
{
  "firstName": "Johnny",
  "email": "johnny.doe@example.com",
  "mobileNumber": "+9999999999"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-1",
    "username": "john.doe",
    "firstName": "Johnny",
    "email": "johnny.doe@example.com",
    "mobileNumber": "+9999999999",
    "updatedBy": "uuid-of-updater",
    "updatedAt": "2026-01-21T08:00:00.000Z"
  }
}
```

### 5. Delete User (Soft Delete)

**Endpoint:** `DELETE /api/v1/cmms/user/:id`

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": {
    "id": "uuid-1",
    "isDeleted": true,
    "deletedBy": "uuid-of-deleter",
    "deletedAt": "2026-01-21T09:00:00.000Z"
  }
}
```

### 6. Reset User Password

**Endpoint:** `PUT /api/v1/cmms/user/:id/reset-password`

**Request Body:**
```json
{
  "password": "NewSecurePass789!"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

### 7. Get Users by Supervisor ID

**Endpoint:** `GET /api/v1/cmms/user/supervisor/:supervisorId`

**Response:** Returns all users supervised by the specified supervisor.

---

## Asset Management

### 1. Create Asset

**Endpoint:** `POST /api/v1/cmms/asset/`

**Description:** Create a new asset with optional checklists and QR code generation.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Hydraulic Press Machine",
  "category": "Manufacturing Equipment",
  "metadata": {
    "manufacturer": "ACME Corp",
    "model": "HP-5000",
    "serialNumber": "SN123456789",
    "purchaseDate": "2025-01-15",
    "warrantyExpiry": "2028-01-15"
  },
  "photos": [
    "https://example.com/images/machine1.jpg",
    "https://example.com/images/machine2.jpg"
  ],
  "specifications": "Pressure: 500 tons, Power: 75 kW, Dimensions: 3m x 2m x 4m",
  "location": {
    "building": "Building A",
    "floor": "Ground Floor",
    "zone": "Production Zone 1",
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  },
  "localLabel": "HPM-001",
  "parentId": null,
  "checklists": [
    {
      "question": "Is the hydraulic oil level adequate?",
      "questionType": "yes_no",
      "option": {},
      "description": "Check oil level indicator",
      "status": 1,
      "expectedAnswer": "yes",
      "category": "Daily Inspection"
    },
    {
      "question": "Check for oil leaks",
      "questionType": "yes_no",
      "description": "Visual inspection of hoses and connections",
      "expectedAnswer": "no",
      "category": "Daily Inspection"
    }
  ]
}
```

**Field Descriptions:**
- `title`: Required, asset name/title
- `category`: Optional, asset category
- `metadata`: Optional JSON object for custom fields
- `photos`: Array of photo URLs
- `specifications`: Text description of technical specs
- `location`: JSON object for location information
- `localLabel`: Custom identifier/label
- `parentId`: UUID of parent asset (for hierarchical assets)
- `checklists`: Array of checklist items for this asset

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Asset created successfully",
  "data": {
    "id": "asset-uuid",
    "title": "Hydraulic Press Machine",
    "code": "AST-20260121-001",
    "category": "Manufacturing Equipment",
    "metadata": {...},
    "photos": [...],
    "specifications": "...",
    "location": {...},
    "localLabel": "HPM-001",
    "qrCode": {
      "id": "qr-uuid",
      "qrCodeUrl": "https://storage.example.com/qr-codes/asset-uuid.png",
      "qrCodeData": "AST-20260121-001"
    },
    "checklists": [
      {
        "id": "checklist-uuid-1",
        "question": "Is the hydraulic oil level adequate?",
        "questionType": "yes_no",
        "category": "Daily Inspection",
        "status": 1
      }
    ],
    "createdBy": "creator-uuid",
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/cmms/asset/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hydraulic Press Machine",
    "category": "Manufacturing Equipment",
    "metadata": {
      "manufacturer": "ACME Corp",
      "model": "HP-5000"
    },
    "photos": [],
    "specifications": "Pressure: 500 tons",
    "location": {
      "building": "Building A",
      "floor": "Ground Floor"
    }
  }'
```

### 2. Get All Assets

**Endpoint:** `GET /api/v1/cmms/asset/`

**Query Parameters:**
- `code`: Filter by asset code
- `title`: Filter by title

**Example:** `GET /api/v1/cmms/asset/?title=Hydraulic`

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Assets fetched successfully",
  "data": [
    {
      "id": "asset-uuid",
      "title": "Hydraulic Press Machine",
      "code": "AST-20260121-001",
      "category": "Manufacturing Equipment",
      "location": {...},
      "qrCode": {...},
      "checklists": [...],
      "createdAt": "2026-01-21T10:00:00.000Z"
    }
  ]
}
```

### 3. Update Asset

**Endpoint:** `PUT /api/v1/cmms/asset/:assetId`

**Request Body:** (All fields optional)
```json
{
  "title": "Hydraulic Press Machine - Updated",
  "specifications": "Pressure: 600 tons, Power: 80 kW",
  "location": {
    "building": "Building B",
    "floor": "First Floor"
  }
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Asset updated successfully",
  "data": {
    "id": "asset-uuid",
    "title": "Hydraulic Press Machine - Updated",
    "specifications": "Pressure: 600 tons, Power: 80 kW",
    "updatedBy": "updater-uuid",
    "updatedAt": "2026-01-21T11:00:00.000Z"
  }
}
```

### 4. Delete Asset (Soft Delete)

**Endpoint:** `DELETE /api/v1/cmms/asset/:assetId`

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Asset deleted successfully"
}
```

---

## Task Management

### 1. Create Task

**Endpoint:** `POST /api/v1/cmms/task/` (Requires CREATE_TASK permission)

**Description:** Create a maintenance task for an asset.

**Request Body:**
```json
{
  "title": "Monthly Maintenance - Hydraulic Press",
  "description": "Perform monthly maintenance including oil change, filter replacement, and safety checks",
  "status": 1,
  "startDate": "2026-01-25T09:00:00.000Z",
  "dueDate": "2026-01-25T15:00:00.000Z",
  "priority": 2,
  "asset": "asset-uuid",
  "estimatedLaborTime": "6 hours",
  "type": "preventive",
  "parentId": null,
  "createdByRemarks": "Scheduled maintenance as per annual plan",
  "checklists": [
    {
      "question": "Oil changed?",
      "questionType": "yes_no",
      "expectedAnswer": "yes",
      "category": "Maintenance"
    }
  ]
}
```

**Field Descriptions:**
- `title`: Required, task title
- `description`: Optional, detailed description
- `status`: Optional number (1=pending, 2=in-progress, 3=completed)
- `startDate`: Optional start date/time
- `dueDate`: Optional due date/time
- `priority`: Optional number (1=low, 2=medium, 3=high, 4=critical)
- `asset`: Optional UUID of related asset
- `estimatedLaborTime`: Optional estimated time
- `type`: Optional task type (preventive, corrective, inspection, etc.)
- `parentId`: Optional parent task UUID
- `createdByRemarks`: Optional creator notes
- `checklists`: Optional array of task checklists

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Task created successfully",
  "data": {
    "id": "task-uuid",
    "title": "Monthly Maintenance - Hydraulic Press",
    "description": "...",
    "status": 1,
    "priority": 2,
    "asset": {
      "id": "asset-uuid",
      "title": "Hydraulic Press Machine",
      "code": "AST-20260121-001"
    },
    "createdBy": "creator-uuid",
    "createdAt": "2026-01-21T12:00:00.000Z"
  }
}
```

### 2. Get All Tasks

**Endpoint:** `GET /api/v1/cmms/task/`

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `priority`: Filter by priority
- `type`: Filter by type

**Example:** `GET /api/v1/cmms/task/?status=1&priority=2`

**Response:** Returns paginated list of tasks.

### 3. Get Task by ID

**Endpoint:** `GET /api/v1/cmms/task/:id`

**Response:** Returns detailed task information including asset, checklists, and assignment details.

### 4. Update Task

**Endpoint:** `PUT /api/v1/cmms/task/:id`

**Request Body:** (All fields optional)
```json
{
  "status": 2,
  "description": "Updated description"
}
```

**Response (204 No Content):** Task updated successfully.

### 5. Approve Task

**Endpoint:** `PUT /api/v1/cmms/task/:id/approve` (Requires APPROVE_TASKS permission)

**Request Body:**
```json
{
  "approveStatus": 1,
  "remarks": "Task approved for execution"
}
```

**Response:** Task approval status updated.

### 6. Assign Task

**Endpoint:** `PUT /api/v1/cmms/task/:id/assigned-to/:assignedToId`

**Description:** Assign task to a specific user.

**Response:** Task assigned successfully.

### 7. Get Tasks by Assigned User

**Endpoint:** `GET /api/v1/cmms/task/assigned-to/:assignedToId`

**Query Parameters:** Same as Get All Tasks

**Response:** Returns tasks assigned to specified user.

### 8. Get Task Status Summary

**Endpoint:** `GET /api/v1/cmms/task/status/summary`

**Query Parameters:**
- `year`: Filter by year
- `month`: Filter by month

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "pending": 15,
    "inProgress": 8,
    "completed": 42,
    "overdue": 3
  }
}
```

### 9. Get Pending Approval Tasks

**Endpoint:** `GET /api/v1/cmms/task/pending/approval`

**Response:** Returns all tasks pending approval.

---

## Role & Permission Management

### 1. Create Role with Permissions

**Endpoint:** `POST /api/v1/cmms/role-permission/`

**Request Body:**
```json
{
  "roleName": "Maintenance Supervisor",
  "permissions": [
    "CREATE_TASK",
    "APPROVE_TASKS",
    "VIEW_REPORTS",
    "MANAGE_ASSETS"
  ]
}
```

**Response:** Role created with associated permissions.

### 2. Get All Roles

**Endpoint:** `GET /api/v1/cmms/role-permission/`

**Response:** Returns all roles with their permissions.

### 3. Get Role by ID

**Endpoint:** `GET /api/v1/cmms/role-permission/:id`

### 4. Update Role

**Endpoint:** `PUT /api/v1/cmms/role-permission/:id`

### Permission Management

- `POST /api/v1/cmms/permission/` - Create permission
- `GET /api/v1/cmms/permission/` - Get all permissions
- `GET /api/v1/cmms/permission/:id` - Get permission by ID
- `PUT /api/v1/cmms/permission/:id` - Update permission

---

## Notifications

### 1. Get Notifications by User ID

**Endpoint:** `GET /api/v1/cmms/notifications/user/:userId/`

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "notification-uuid",
      "title": "Task Assigned",
      "message": "You have been assigned a new task: Monthly Maintenance",
      "type": "task_assignment",
      "isRead": false,
      "createdAt": "2026-01-21T12:30:00.000Z"
    }
  ]
}
```

### 2. Mark Notification as Read

**Endpoint:** `PUT /api/v1/cmms/notifications/:id/read`

**Response:** Notification marked as read.

---

## Data Storage Guide

### How Data is Stored in PostgreSQL

The CMMS API uses **TypeORM** with **PostgreSQL** to store data. Each entity is mapped to a database table with the following structure:

#### User Storage
**Table:** `users`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| username | VARCHAR | Unique username |
| first_name | VARCHAR | User's first name |
| last_name | VARCHAR | User's last name |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password (bcrypt) |
| mobile_number | VARCHAR | Contact number |
| profile_picture | VARCHAR | Profile image URL |
| role_id | INTEGER | Foreign key to roles table |
| is_deleted | BOOLEAN | Soft delete flag |
| created_by | UUID | User who created record |
| updated_by | UUID | User who updated record |
| deleted_by | UUID | User who deleted record |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Related Tables:**
- `user_supervisor`: Many-to-many relationship for supervisor-supervisee mapping

#### Asset Storage
**Table:** `assets`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR | Asset title |
| code | TEXT | Unique asset code (auto-generated) |
| category | VARCHAR | Asset category |
| metadata | JSONB | Custom metadata (flexible JSON) |
| photos | JSON | Array of photo URLs |
| specifications | TEXT | Technical specifications |
| location | JSONB | Location details (flexible JSON) |
| local_label | VARCHAR | Custom label |
| parent_id | UUID | Parent asset ID (hierarchical) |
| qr_code_id | UUID | Foreign key to qr_codes table |
| is_deleted | BOOLEAN | Soft delete flag |
| created_by | UUID | Creator user ID |
| updated_by | UUID | Updater user ID |
| deleted_by | UUID | Deleter user ID |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Related Tables:**
- `qr_codes`: One-to-one relationship for QR code
- `checklists`: One-to-many for asset checklists
- `logbooks`: One-to-many for asset maintenance logs
- `tasks`: One-to-many for related tasks

#### Task Storage
**Table:** `tasks`

Tasks are stored with references to assets, assigned users, and include approval workflows.

### Data Relationships

```
users
  ├─ One-to-Many → assets (created_by, updated_by)
  ├─ One-to-Many → tasks (created_by, assigned_to)
  ├─ Many-to-One → roles
  └─ Many-to-Many → users (supervisors)

assets
  ├─ One-to-One → qr_codes
  ├─ One-to-Many → checklists
  ├─ One-to-Many → logbooks
  └─ One-to-Many → tasks

tasks
  ├─ Many-to-One → assets
  ├─ Many-to-One → users (assigned_to)
  └─ One-to-Many → checklists
```

### JSONB Fields

The API uses PostgreSQL's JSONB type for flexible storage:

**Asset Metadata Example:**
```json
{
  "manufacturer": "ACME Corp",
  "model": "HP-5000",
  "serialNumber": "SN123456789",
  "purchaseDate": "2025-01-15",
  "warrantyExpiry": "2028-01-15",
  "customField1": "value1"
}
```

**Asset Location Example:**
```json
{
  "building": "Building A",
  "floor": "Ground Floor",
  "zone": "Production Zone 1",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

### Caching with Redis

The API uses Redis for:
- Session management
- Caching frequently accessed data
- Real-time data synchronization

### Data Validation

All incoming data is validated using **class-validator** decorators:
- Type validation
- Required field checks
- String length limits
- Email format validation
- UUID validation
- Custom regex patterns

---

## Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "username",
      "message": "Username must be at least 6 characters long"
    },
    {
      "field": "password",
      "message": "Password must include at least one uppercase letter"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Update successful (no body) |
| 400 | Bad Request | Validation error or malformed request |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., username exists) |
| 500 | Internal Server Error | Server error |

### Common Errors

**1. Authentication Error:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid credentials"
}
```

**2. Permission Error:**
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "You don't have permission to perform this action"
}
```

**3. Validation Error:**
```json
{
  "statusCode": 400,
  "message": [
    "username should not be empty",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

**4. Resource Not Found:**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## Postman Collection

A Postman collection is available in the project:
- **Path:** `f:\CMMS\CMMS_APIs\api-collections\api-collection.json`

### How to Import:
1. Open Postman
2. Click **Import** button
3. Select the `api-collection.json` file
4. The collection will be imported with all endpoints

### Environment Variables to Set:
```
base_url: http://localhost:3000
access_token: <your_jwt_token_from_login>
```

---

## Quick Start Guide

### Step 1: Start the Server
```bash
cd f:\CMMS\CMMS_APIs
npm run start
```

Server will start on: `http://localhost:3000`

### Step 2: Register Your First User
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!",
    "firstName": "Admin",
    "email": "admin@cmms.com",
    "role": 1
  }'
```

### Step 3: Login
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

Save the `access_token` from response.

### Step 4: Create an Asset
```bash
curl -X POST http://localhost:3000/api/v1/cmms/asset/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Asset",
    "category": "Equipment",
    "location": {"building": "Main"}
  }'
```

### Step 5: Create a Task
```bash
curl -X POST http://localhost:3000/api/v1/cmms/task/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "Test task",
    "priority": 2,
    "status": 1
  }'
```

---

## Best Practices

### 1. Always Use Validation
All DTOs have built-in validations. Review the entity and DTO files for exact requirements.

### 2. Use Filters and Pagination
For large datasets, always use pagination parameters:
```
GET /api/v1/cmms/user/?page=1&limit=20
```

### 3. Store Tokens Securely
- Never expose tokens in client-side code
- Use environment variables
- Refresh tokens periodically

### 4. Leverage JSONB Fields
Use `metadata` and `location` JSONB fields for flexible, custom data without schema changes.

### 5. Soft Delete
Resources are soft-deleted by default (`isDeleted` flag). Hard deletes are not exposed via API.

### 6. Asset Hierarchy
Use `parentId` to create parent-child asset relationships.

### 7. Audit Trail
All records automatically track `createdBy`, `updatedBy`, and timestamps.

---

## Support & Documentation

- **Swagger UI:** `http://localhost:3000/docs`
- **Project Path:** `f:\CMMS\CMMS_APIs`
- **Database:** PostgreSQL
- **Cache:** Redis

For more information, review the source code entity files:
- Users: `src/app/api/users/entities/user.entity.ts`
- Assets: `src/app/api/asset/entities/asset.entity.ts`
- Tasks: `src/app/api/task/entities/task.entity.ts`

---

**Last Updated:** January 21, 2026  
**API Version:** 1.0
