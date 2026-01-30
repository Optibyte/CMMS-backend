# CMMS API - Quick Reference Guide

## Base URL
```
http://localhost:3000/api/v1/cmms/
```

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ No |
| POST | `/auth/login` | Login & get token | ❌ No |

## User Management Endpoints

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|---------------|------------|
| POST | `/user/` | Create user | ✅ Yes | CREATE_USERS |
| GET | `/user/` | Get all users | ✅ Yes | - |
| GET | `/user/:id` | Get user by ID | ✅ Yes | - |
| PUT | `/user/:id` | Update user | ✅ Yes | - |
| DELETE | `/user/:id` | Delete user | ✅ Yes | - |
| PUT | `/user/:id/reset-password` | Reset password | ✅ Yes | - |
| GET | `/user/supervisor/:supervisorId` | Get users by supervisor | ✅ Yes | - |

## Asset Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/asset/` | Create asset | ✅ Yes |
| GET | `/asset/` | Get all assets | ✅ Yes |
| PUT | `/asset/:assetId` | Update asset | ✅ Yes |
| DELETE | `/asset/:assetId` | Delete asset | ✅ Yes |

## Task Management Endpoints

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|---------------|------------|
| POST | `/task/` | Create task | ✅ Yes | CREATE_TASK |
| GET | `/task/` | Get all tasks | ✅ Yes | - |
| GET | `/task/:id` | Get task by ID | ✅ Yes | - |
| PUT | `/task/:id` | Update task | ✅ Yes | - |
| PUT | `/task/:id/approve` | Approve task | ✅ Yes | APPROVE_TASKS |
| PUT | `/task/:id/assigned-to/:assignedToId` | Assign task | ✅ Yes | - |
| GET | `/task/assigned-to/:assignedToId` | Get tasks by assignee | ✅ Yes | - |
| GET | `/task/status/summary` | Get task statistics | ✅ Yes | - |
| GET | `/task/pending/approval` | Get pending approvals | ✅ Yes | - |

## Common Query Parameters

### Pagination
```
?page=1&limit=10
```

### User Filters
```
?username=john&email=example.com&role=1
```

### Asset Filters
```
?code=AST-001&title=Hydraulic
```

### Task Filters
```
?status=1&priority=2&type=preventive
```

## Sample Requests

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "SecurePass123!",
    "email": "john@example.com",
    "firstName": "John"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "SecurePass123!"
  }'
```

### 3. Create Asset (with auth)
```bash
curl -X POST http://localhost:3000/api/v1/cmms/asset/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hydraulic Press",
    "category": "Equipment",
    "location": {"building": "A", "floor": "1"}
  }'
```

### 4. Create Task
```bash
curl -X POST http://localhost:3000/api/v1/cmms/task/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Maintenance",
    "priority": 2,
    "status": 1,
    "asset": "asset-uuid"
  }'
```

### 5. Get All Users (Paginated)
```bash
curl -X GET "http://localhost:3000/api/v1/cmms/user/?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Validation Rules

### Username
- Required, 6-15 characters
- Lowercase letters, numbers, optional single underscores/periods
- Pattern: `/^[a-z0-9]+([._]?[a-z0-9]+)*$/`

### Password
- Required, 6-15 characters
- Must include: uppercase, lowercase, number, special character
- Pattern: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/`

### Email
- Must be valid email format
- Optional for users

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (updated) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

## Authorization Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Permissions
- `CREATE_USERS`
- `CREATE_TASK`
- `APPROVE_TASKS`
- `VIEW_REPORTS`
- `MANAGE_ASSETS`

## JSONB Fields

### Asset Metadata
```json
{
  "manufacturer": "ACME",
  "model": "HP-5000",
  "serialNumber": "SN123",
  "customField": "value"
}
```

### Asset Location
```json
{
  "building": "Building A",
  "floor": "Ground Floor",
  "zone": "Zone 1",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

## Need More Details?
See the full documentation: `API_DOCUMENTATION.md`
