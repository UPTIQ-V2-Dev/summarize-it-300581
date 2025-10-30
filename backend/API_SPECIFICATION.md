# API Specification

## Database Models

### User Model
```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
  summaries       Summary[]
}
```

### Token Model
```prisma
model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}
```

### Summary Model
```prisma
model Summary {
  id                    Int      @id @default(autoincrement())
  title                 String
  originalText          String
  summaryText           String
  options               String
  wordCount            Int
  originalWordCount    Int
  compressionRatio     Float
  confidence           Float
  keywords             String?
  processingTime       Int
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  user                 User     @relation(fields: [userId], references: [id])
  userId               Int
}
```

## API Endpoints

---

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input or email already exists", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user with email and password.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input", "401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh authentication tokens using refresh token.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"400":"Invalid input", "401":"Invalid refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-30T10:15:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-06T10:00:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/reset-password?token=resetToken123" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/verify-email?token=verifyToken123"
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification email to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: GET /users
DESC: Get paginated list of all users (admin only).
IN: headers:{Authorization:str!}, query:{name?:str, role?:str, sortBy?:str, limit?:int, page?:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"400":"Invalid query parameters", "401":"Unauthorized", "403":"Forbidden - Admin access required", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?page=1&limit=10&role=USER" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: POST /users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden - Admin access required", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Smith","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Smith","role":"USER","isEmailVerified":false,"createdAt":"2025-10-30T10:05:00Z","updatedAt":"2025-10-30T10:05:00Z"}

---

EP: GET /users/{userId}
DESC: Get user by ID (own profile or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid user ID", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T10:00:00Z"}

---

EP: PATCH /users/{userId}
DESC: Update user information (own profile or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name?:str, email?:str, password?:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Updated"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Updated","role":"USER","isEmailVerified":true,"createdAt":"2025-10-30T10:00:00Z","updatedAt":"2025-10-30T11:00:00Z"}

---

EP: DELETE /users/{userId}
DESC: Delete user (own account or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"400":"Invalid user ID", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

---

EP: POST /api/summarize
DESC: Generate text summary with specified options.
IN: headers:{Authorization:str!}, body:{text:str!, options?:{length?:str, style?:str, extractKeywords?:bool}}
OUT: 200:{summary:str, wordCount:int, keywords?:arr[str], processingTime:int, metadata:{originalWordCount:int, compressionRatio:float, confidence:float}}
ERR: {"400":"Invalid input or text too short", "401":"Unauthorized", "422":"Text processing failed", "500":"Internal server error"}
EX_REQ: curl -X POST /api/summarize -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"text":"Long text to summarize...","options":{"length":"medium","style":"paragraph","extractKeywords":true}}'
EX_RES_200: {"summary":"This is a concise summary of the provided text.","wordCount":25,"keywords":["keyword1","keyword2","keyword3"],"processingTime":1500,"metadata":{"originalWordCount":150,"compressionRatio":6.0,"confidence":0.85}}

---

EP: GET /api/history
DESC: Get user's summary history with pagination.
IN: headers:{Authorization:str!}, query:{page?:int, limit?:int}
OUT: 200:arr[{id:str, originalText:str, summary:str, options:{length:str, style:str, extractKeywords:bool}, createdAt:str, wordCount:int, title:str}]
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET "/api/history?page=1&limit=10" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: [{"id":"123","originalText":"Original text content...","summary":"Summary content...","options":{"length":"medium","style":"paragraph","extractKeywords":true},"createdAt":"2025-10-30T10:00:00Z","wordCount":25,"title":"Document Summary"}]

---

EP: POST /api/history
DESC: Save summary to user's history.
IN: headers:{Authorization:str!}, body:{originalText:str!, summary:str!, options:obj!, title:str!, wordCount:int!}
OUT: 201:{id:str, originalText:str, summary:str, options:{length:str, style:str, extractKeywords:bool}, createdAt:str, wordCount:int, title:str}
ERR: {"400":"Invalid input", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /api/history -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"originalText":"Original text...","summary":"Summary text...","options":{"length":"medium","style":"paragraph","extractKeywords":true},"title":"My Summary","wordCount":25}'
EX_RES_201: {"id":"124","originalText":"Original text...","summary":"Summary text...","options":{"length":"medium","style":"paragraph","extractKeywords":true},"createdAt":"2025-10-30T11:00:00Z","wordCount":25,"title":"My Summary"}

---

EP: DELETE /api/history/{id}
DESC: Delete summary from user's history.
IN: headers:{Authorization:str!}, params:{id:str!}
OUT: 204:{}
ERR: {"400":"Invalid summary ID", "401":"Unauthorized", "404":"Summary not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /api/history/123 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: GET /api/stats
DESC: Get user's summary statistics.
IN: headers:{Authorization:str!}
OUT: 200:{totalSummaries:int, totalWordsSummarized:int, averageCompressionRatio:float}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /api/stats -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"totalSummaries":24,"totalWordsSummarized":12450,"averageCompressionRatio":3.2}

---

EP: POST /mcp
DESC: Handle MCP (Model Context Protocol) POST requests.
IN: headers:{Authorization:str!}, body:obj
OUT: 200:obj
ERR: {"400":"Invalid MCP request", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{}'
EX_RES_200: {}

---

EP: GET /mcp
DESC: Handle MCP (Model Context Protocol) GET requests.
IN: headers:{Authorization:str!}, query:obj
OUT: 200:obj
ERR: {"400":"Invalid MCP request", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

---

EP: DELETE /mcp
DESC: Handle MCP (Model Context Protocol) DELETE requests.
IN: headers:{Authorization:str!}, query:obj
OUT: 200:obj
ERR: {"400":"Invalid MCP request", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X DELETE /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Error Response Format

All error responses follow this format:
```json
{
  "code": 400,
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Unprocessable Entity
- **500**: Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Limits vary by endpoint and user type.

## Pagination

Paginated endpoints return results in this format:
```json
{
  "results": [],
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "totalResults": 10
}
```