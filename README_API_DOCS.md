# CMMS API Documentation

Welcome to the **CMMS (Computerized Maintenance Management System) API** documentation. This folder contains complete guides on how to use the API, create users, store data, and integrate with the system.

## 📚 Documentation Files

### 1. **API_DOCUMENTATION.md** - Complete Guide
The comprehensive API documentation covering:
- ✅ **Authentication** - How to register users and login
- ✅ **User Management** - Create, update, delete, and manage users
- ✅ **Asset Management** - Create and manage assets with QR codes
- ✅ **Task Management** - Create tasks, assign them, and track progress
- ✅ **Role & Permission Management** - RBAC system
- ✅ **Notifications** - User notification system
- ✅ **Data Storage Guide** - How data is stored in PostgreSQL
- ✅ **Error Handling** - Common errors and troubleshooting
- ✅ **Postman Collection** - Import and use API collection

**👉 [Read Full Documentation](./API_DOCUMENTATION.md)**

### 2. **API_QUICK_REFERENCE.md** - Quick Lookup
A concise reference guide with:
- All API endpoints in table format
- Sample cURL commands
- Common query parameters
- Validation rules
- Response codes

**👉 [Quick Reference](./API_QUICK_REFERENCE.md)**

## 🚀 Quick Start

### 1. Start the Server
```bash
npm run start
```
Server runs on: `http://localhost:3000`

### 2. Access Swagger Documentation
Open your browser: `http://localhost:3000/docs`

### 3. Register Your First User
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!",
    "email": "admin@cmms.com",
    "firstName": "Admin"
  }'
```

### 4. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/v1/cmms/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

**Save the `access_token` from the response!**

### 5. Use in Postman
1. Import: `api-collections/api-collection.json`
2. Set environment variable: `access_token` = your JWT token
3. Start making requests!

## 📖 What You'll Find

### How to Create a User
Detailed in **API_DOCUMENTATION.md** Section: **User Management**
- Registration endpoint (no auth required)
- Create user endpoint (requires CREATE_USERS permission)
- All validation rules and examples

### How to Store Data
Detailed in **API_DOCUMENTATION.md** Section: **Data Storage Guide**
- PostgreSQL database schema for all entities
- JSONB fields for flexible metadata
- Relationships between users, assets, tasks
- Caching with Redis

### How to Work with Assets
Detailed in **API_DOCUMENTATION.md** Section: **Asset Management**
- Create assets with photos, specifications, and location
- Automatic QR code generation
- Asset checklists
- Hierarchical assets with parent-child relationships

### How to Manage Tasks
Detailed in **API_DOCUMENTATION.md** Section: **Task Management**
- Create maintenance tasks
- Assign tasks to users
- Approval workflows
- Task status tracking

## 🔑 Key Endpoints

| Feature | Endpoint | Method |
|---------|----------|--------|
| Register | `/api/v1/cmms/auth/register` | POST |
| Login | `/api/v1/cmms/auth/login` | POST |
| Create User | `/api/v1/cmms/user/` | POST |
| Get Users | `/api/v1/cmms/user/` | GET |
| Create Asset | `/api/v1/cmms/asset/` | POST |
| Get Assets | `/api/v1/cmms/asset/` | GET |
| Create Task | `/api/v1/cmms/task/` | POST |
| Get Tasks | `/api/v1/cmms/task/` | GET |

## 🛠️ Technology Stack

- **Framework:** NestJS
- **Database:** PostgreSQL with TypeORM
- **Cache:** Redis
- **Authentication:** JWT
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

## 📦 Project Structure

```
CMMS_APIs/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── users/          # User management
│   │       ├── asset/          # Asset management
│   │       ├── task/           # Task management
│   │       ├── role-permissions/ # RBAC system
│   │       ├── notifications/  # Notifications
│   │       └── constants/      # Route constants
│   ├── auth/                   # Authentication
│   └── main.ts                 # Application entry
├── api-collections/            # Postman collections
├── API_DOCUMENTATION.md        # 📖 Full documentation
├── API_QUICK_REFERENCE.md      # ⚡ Quick reference
└── README_API_DOCS.md          # This file
```

## 🎯 Common Use Cases

### 1. User Registration Flow
```
1. POST /auth/register → Get user created
2. POST /auth/login → Get access_token
3. Use token for all subsequent requests
```

### 2. Asset Creation Flow
```
1. Login to get token
2. POST /asset/ with asset details
3. Automatic QR code generated
4. Asset stored with unique code
```

### 3. Task Assignment Flow
```
1. POST /task/ to create task
2. PUT /task/:id/assigned-to/:userId to assign
3. PUT /task/:id/approve to approve
4. Track status with GET /task/status/summary
```

## 🔐 Authentication

All endpoints (except `/auth/register` and `/auth/login`) require authentication:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📞 Support

- **Swagger UI:** `http://localhost:3000/docs`
- **Full Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Quick Ref:** [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)

---

**Version:** 1.0  
**Last Updated:** January 21, 2026  
**Base URL:** `http://localhost:3000/api/v1/cmms/`
