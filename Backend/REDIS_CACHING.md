# Redis Caching Implementation

## Overview
Redis caching has been implemented throughout the LMS project to improve performance and reduce database queries.

## Configuration

### Redis Client
- Location: `Backend/Redis/init.redis.ts`
- Configured using `REDIS_URL` environment variable

### Cache Utility
- Location: `Backend/Utils/redis.cache.ts`
- Functions:
  - `getCache(key)` - Retrieve cached data
  - `setCache(key, data, expiration)` - Store data in cache (default: 1 hour)
  - `deleteCache(...keys)` - Delete specific cache keys
  - `deleteCachePattern(pattern)` - Delete keys matching pattern

## Cache Keys Structure

### Users
- `user:{userId}` - Individual user data
- `users:all` - All users list

### Courses
- `course:{courseId}` - Individual course data
- `courses:all` - All courses list

### Orders
- `orders:all` - All orders list

### Notifications
- `notifications:all` - All notifications list

### Layout
- `layout:{type}` - Layout data by type (banner, faq, category)

## Implementation Details

### 1. User Authentication (authuser.controller.ts)
**Cached Operations:**
- User profile data cached on login
- User data cached in authentication middleware

**Cache Invalidation:**
- Logout: Deletes `user:{userId}`
- Update Profile: Updates `user:{userId}`
- Update Password: Updates `user:{userId}`
- Update Avatar: Updates `user:{userId}`
- Update User Role: Updates `user:{userId}` and `users:all`
- Delete User: Deletes `user:{userId}` and `users:all`

### 2. Courses (course.controller.ts)
**Cached Operations:**
- Get Single Course: Caches `course:{courseId}`
- Get All Courses: Caches `courses:all`

**Cache Invalidation:**
- Upload Course: Deletes `courses:all`
- Edit Course: Deletes `course:{courseId}` and `courses:all`
- Delete Course: Deletes `course:{courseId}` and `courses:all`
- Ask Question: Deletes `course:{courseId}`
- Answer Question: Deletes `course:{courseId}`
- Add Review: Deletes `course:{courseId}` and `courses:all`
- Reply Review: Deletes `course:{courseId}`
- Edit Review: Deletes `course:{courseId}` and `courses:all`

### 3. Orders (order.controller.ts)
**Cached Operations:**
- Get All Orders: Caches `orders:all`

**Cache Invalidation:**
- Create Order: Deletes `courses:all`, `course:{courseId}`, `orders:all`, updates `user:{userId}`

### 4. Notifications (notification.controller.ts)
**Cached Operations:**
- Get Notifications: Caches `notifications:all`

**Cache Invalidation:**
- Update Notification: Deletes and refreshes `notifications:all`
- Delete Notification: Deletes and refreshes `notifications:all`
- Cron Job (cleanup): Deletes `notifications:all`

### 5. Layout (layout.controller.ts)
**Cached Operations:**
- Get Layout By Type: Caches `layout:{type}`

**Cache Invalidation:**
- Create Layout: Deletes `layout:{type}`
- Update Layout: Deletes `layout:{type}`

### 6. Authentication Middleware (auth.ts)
**Cached Operations:**
- User verification checks cache first before database
- Caches user data if not found in cache

### 7. JWT Utility (jwt.ts)
**Cached Operations:**
- Caches user data on login/cookie generation

## Benefits

1. **Performance**: Reduced database queries for frequently accessed data
2. **Scalability**: Better handling of concurrent requests
3. **Response Time**: Faster API responses for cached data
4. **Database Load**: Reduced load on MongoDB

## Cache Expiration
- Default expiration: 3600 seconds (1 hour)
- Can be customized per cache operation

## Best Practices Implemented

1. **Cache Invalidation**: All create/update/delete operations invalidate related cache
2. **Consistent Keys**: Structured naming convention for cache keys
3. **Atomic Operations**: Cache updates happen immediately after database operations
4. **Error Handling**: Falls back to database if cache fails
5. **Related Data**: Invalidates all related cache keys (e.g., updating course invalidates both single course and all courses cache)
