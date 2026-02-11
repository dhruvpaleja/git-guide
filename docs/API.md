# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.soul-yatri.com
```

## Authentication

All API requests should include the authorization token in the headers:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2024-02-11T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { /* additional info */ }
  },
  "timestamp": "2024-02-11T10:30:00Z"
}
```

## Endpoints

### Authentication

#### Login
- **Path**: `POST /auth/login`
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with auth token

#### Signup
- **Path**: `POST /auth/signup`
- **Request**: User registration data
- **Response**: User object with auth token

#### Logout
- **Path**: `POST /auth/logout`
- **Response**: Success message

### Users

#### Get Profile
- **Path**: `GET /users/profile`
- **Response**: Current user object

#### Update Profile
- **Path**: `PUT /users/profile`
- **Request**: Updated user fields
- **Response**: Updated user object

### Blog

#### Get Posts
- **Path**: `GET /blog/posts`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `search`: Search query
- **Response**: Array of blog posts

#### Get Post
- **Path**: `GET /blog/posts/:id`
- **Response**: Single blog post

#### Create Post
- **Path**: `POST /blog/posts`
- **Request**: Post data
- **Response**: Created post

#### Update Post
- **Path**: `PUT /blog/posts/:id`
- **Request**: Updated post data
- **Response**: Updated post

#### Delete Post
- **Path**: `DELETE /blog/posts/:id`
- **Response**: Success message

### Services

#### Get Services
- **Path**: `GET /services`
- **Response**: Array of services

#### Get Service
- **Path**: `GET /services/:id`
- **Response**: Single service

### Contact

#### Submit Contact Form
- **Path**: `POST /contact`
- **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Your message here",
    "phone": "+1234567890"
  }
  ```
- **Response**: Confirmation message

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Limit**: 100 requests per minute
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Pagination

Paginated endpoints return:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

## Example Requests

### JavaScript/TypeScript with ApiService

```typescript
import { apiService } from '@/services';

// Get posts
const response = await apiService.get('/blog/posts?page=1&limit=20');

// Create post
const newPost = await apiService.post('/blog/posts', {
  title: 'New Post',
  content: 'Post content',
});

// Update post
const updated = await apiService.put('/blog/posts/123', {
  title: 'Updated Title',
});

// Delete post
await apiService.delete('/blog/posts/123');
```

## Webhooks

Subscribe to events:

```
POST /webhooks/subscribe
Body: {
  "event": "post.created",
  "url": "https://yoursite.com/webhook"
}
```

Supported events:
- `post.created`
- `post.updated`
- `post.deleted`
- `user.created`
- `user.updated`
