# MASTER TODO LIST — PART 2 (Remaining Features)

**Purpose:** Complete prompts for ALL remaining features (P3.2 to P4.3)
**Total Subtasks:** 138 (detailed prompts, not just titles)
**Created:** March 7, 2026

---

## HOW TO USE:

1. **Finish Part 1 first** (P1.1 to P2.2 — 68 subtasks)
2. **Then start Part 2** (P3.2 to P4.3 — 138 subtasks)
3. **Each subtask has full prompt** — Copy-paste to AI agent
4. **Verify after each** — Don't skip!

---

### P3.2: Courses Platform (12 Subtasks)

**Overall Goal:** Sell mental health courses with video lessons
**Current Status:** 18/100 — UI exists, no backend
**Target:** 18/100 → 85/100

---

#### P3.2.2 — Create Course Service
**Time:** 30 minutes
**Files:** `server/src/services/course.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create course service with all CRUD functions

CREATE: server/src/services/course.service.ts

CODE:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function listCourses(options: {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
}) {
  const { page = 1, limit = 10, isPublished = true, search } = options;

  const where: any = { isPublished };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: { name: true, avatarUrl: true },
        },
        lessons: {
          select: { id: true, duration: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getCourseById(courseId: string, userId?: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { name: true, avatarUrl: true, email: true },
      },
      lessons: {
        orderBy: { order: 'asc' },
      },
      enrollments: userId
        ? {
            where: { userId },
            select: { progress: true, completedAt: true },
          }
        : false,
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  instructorId: string;
  coverImage?: string;
}) {
  return prisma.course.create({
    data: {
      ...data,
      slug: generateSlug(data.title),
    },
  });
}

export async function updateCourse(courseId: string, updates: any) {
  return prisma.course.update({
    where: { id: courseId },
    data: updates,
  });
}

export async function deleteCourse(courseId: string) {
  return prisma.course.delete({
    where: { id: courseId },
  });
}

export async function enrollUser(userId: string, courseId: string) {
  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existing) {
    throw new Error('Already enrolled');
  }

  return prisma.enrollment.create({
    data: {
      userId,
      courseId,
      progress: 0,
    },
  });
}

export async function updateProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  progress: number
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error('Not enrolled');
  }

  // Calculate new progress
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true },
  });

  const totalLessons = course?.lessons.length || 0;
  const completedLessons = Math.floor((progress / 100) * totalLessons);
  const newProgress = Math.round((completedLessons / totalLessons) * 100);

  const updated = await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    data: {
      progress: newProgress,
      completedAt: newProgress === 100 ? new Date() : null,
    },
  });

  return updated;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Service created
- [ ] All functions work
- [ ] TypeScript passes
```

---

#### P3.2.3 — Create Course Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/course.controller.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create course controller

CREATE: server/src/controllers/course.controller.ts

ENDPOINTS:
- listCourses (public)
- getCourse (public)
- createCourse (instructor/admin only)
- updateCourse (instructor/admin only)
- deleteCourse (admin only)
- enrollUser (authenticated user)
- getMyCourses (authenticated user)
- updateLessonProgress (enrolled user)

Each endpoint should:
1. Validate input with Zod
2. Call appropriate service function
3. Handle errors
4. Return JSON response

DONE WHEN:
- [ ] All endpoints implemented
- [ ] TypeScript passes
```

---

#### P3.2.4 — Create Course Routes
**Time:** 10 minutes
**Files:** `server/src/routes/courses.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create course routes

CREATE: server/src/routes/courses.ts

CODE:
```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import * as courseController from '../controllers/course.controller.js';

const router = Router();

// Public routes
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);
router.get('/:slug', courseController.getCourseBySlug);

// Protected routes
router.use(requireAuth);

// User routes
router.post('/:id/enroll', courseController.enrollUser);
router.get('/my/list', courseController.getMyCourses);
router.post('/lesson/progress', courseController.updateProgress);

// Instructor routes
router.use('/instructor', requireRole(['INSTRUCTOR', 'ADMIN']));
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

export default router;
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Routes created
- [ ] Auth middleware added
- [ ] TypeScript passes
```

---

#### P3.2.5 to P3.2.12 — Complete Course Features

**P3.2.5: Create Enrollment System**
- Add payment integration for paid courses
- Send enrollment confirmation email
- Add to user's dashboard

**P3.2.6: Create Video Lesson Player**
- Use same video service as therapy (100ms)
- Add playback controls
- Add quality selector
- Add speed control

**P3.2.7: Add Progress Tracking**
- Track completed lessons
- Show progress bar
- Resume from last position
- Mark complete button

**P3.2.8: Add Course Reviews**
- Same as therapy reviews
- Only enrolled users can review
- Star rating + comment
- Instructor response

**P3.2.9: Add Course Search/Filter**
- Search by title, description
- Filter by price, category, level
- Sort by popularity, rating, newest
- Pagination

**P3.2.10: Add Course Dashboard**
- My enrolled courses
- Continue watching
- Completed courses
- Certificates

**P3.2.11: Add Certificate Generation**
- Generate PDF on 100% completion
- Include user name, course name, date
- Unique certificate ID
- Shareable link

**P3.2.12: Add Payment Integration**
- Use Razorpay (already implemented)
- Add to cart functionality
- Bundle courses (discount)
- Refund policy

**DONE WHEN:**
- [ ] All 12 subtasks complete
- [ ] Users can buy and watch courses
- [ ] Progress tracked
- [ ] Certificates generated

---

### P3.3: Community/Social Feed (15 Subtasks)

**Overall Goal:** Instagram-like social feed for mental health support
**Current Status:** 8/100 — Schema exists
**Target:** 8/100 → 80/100

---

#### P3.3.2 — Create Post Service
**Time:** 30 minutes
**Files:** `server/src/services/post.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create post service

CREATE: server/src/services/post.service.ts

FUNCTIONS:
- createPost(userId, content, images, isAnonymous)
- getFeed(userId, page, limit)
- getPostById(postId)
- deletePost(postId, userId)
- likePost(postId, userId)
- unlikePost(postId, userId)
- addComment(postId, userId, content, isAnonymous)
- getComments(postId, page, limit)
- deleteComment(commentId, userId)
- getTrendingPosts(limit)
- getUserPosts(userId, page, limit)

DONE WHEN:
- [ ] All functions implemented
- [ ] TypeScript passes
```

---

#### P3.3.3 — Create Post Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/post.controller.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create post controller

CREATE: server/src/controllers/post.controller.ts

ENDPOINTS:
- POST /posts - Create post
- GET /feed - Get feed
- GET /posts/:id - Get single post
- DELETE /posts/:id - Delete post
- POST /posts/:id/like - Like post
- DELETE /posts/:id/like - Unlike post
- POST /posts/:id/comments - Add comment
- GET /posts/:id/comments - Get comments
- DELETE /comments/:id - Delete comment
- GET /trending - Get trending posts
- GET /users/:id/posts - Get user posts

DONE WHEN:
- [ ] All endpoints implemented
- [ ] TypeScript passes
```

---

#### P3.3.4 to P3.3.15 — Complete Community Features

**P3.3.4: Create Post Routes**
- Public: feed, trending, single post
- Protected: create, like, comment, delete
- Add rate limiting (prevent spam)

**P3.3.5: Create Feed Component**
- Infinite scroll
- Show posts from all users
- Sort by newest/trending
- Pull to refresh

**P3.3.6: Create Post Composer**
- Text input (max 500 chars)
- Image upload (max 4 images)
- Anonymous toggle
- Post button

**P3.3.7: Add Image Upload**
- Use existing storage service
- Compress images
- Generate thumbnails
- Show upload progress

**P3.3.8: Add Like Functionality**
- Heart icon
- Show like count
- Optimistic UI update
- Animation on like

**P3.3.9: Add Comment Component**
- Nested comments (max 2 levels)
- Show avatars (or anonymous)
- Reply button
- Delete own comments

**P3.3.10: Add Notifications**
- Notify on like
- Notify on comment
- Notify on follow
- Settings to disable

**P3.3.11: Add Moderation System**
- Report post/comment button
- Admin moderation queue
- Auto-hide reported content
- Ban repeat offenders

**P3.3.12: Add Content Filtering**
- Detect harmful keywords
- Trigger warning for sensitive topics
- Blur sensitive content
- Crisis resources popup

**P3.3.13: Add Trending Algorithm**
- Score = likes + comments*2 + recency
- Update every hour
- Show top 10 trending
- Filter by category

**P3.3.14: Add User Profiles**
- Profile picture
- Bio
- Post count
- Join date
- Public posts grid

**P3.3.15: Add Follow System**
- Follow/unfollow button
- Follower/following count
- Feed shows followed users
- "Who to follow" suggestions

**DONE WHEN:**
- [ ] Full social feed working
- [ ] Users can post/comment/like
- [ ] Moderation active
- [ ] Crisis detection working

---

### P3.4: Shop/E-commerce (10 Subtasks)

**Overall Goal:** Sell wellness products
**Current Status:** 5/100 — Nothing exists
**Target:** 5/100 → 75/100

---

#### P3.4.1 — Add Product Models
**Time:** 15 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Product, Cart, Order models

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model Product {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  description     String
  images          String[]
  price           Int      // INR
  stock           Int      @default(0)
  category        String
  isPublished     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  orderItems      OrderItem[]
  
  @@index([slug])
  @@index([category])
  @@index([isPublished])
}

model Cart {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  items           CartItem[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CartItem {
  id              String   @id @default(uuid())
  cartId          String
  cart            Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  
  quantity        Int      @default(1)
  
  @@unique([cartId, productId])
}

model Order {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  items           OrderItem[]
  
  totalAmount     Int
  status          String   @default("pending") // pending, paid, shipped, delivered
  
  shippingAddress Json
  paymentId       String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

model OrderItem {
  id              String   @id @default(uuid())
  orderId         String
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  
  quantity        Int
  price           Int      // Price at time of purchase
  
  @@index([orderId])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_shop_models

DONE WHEN:
- [ ] Models added
- [ ] Migration created
```

---

#### P3.4.2 to P3.4.10 — Complete Shop Features

**P3.4.2: Create Product Service**
- CRUD for products
- Inventory management
- Category filtering
- Search functionality

**P3.4.3: Create Product Controller**
- listProducts (public)
- getProduct (public)
- createProduct (admin)
- updateProduct (admin)
- deleteProduct (admin)

**P3.4.4: Create Cart Service**
- addToCart
- removeFromCart
- updateQuantity
- getCart
- clearCart

**P3.4.5: Create Cart UI**
- Show cart items
- Quantity adjuster
- Remove button
- Total calculator
- Checkout button

**P3.4.6: Create Checkout Flow**
- Shipping address form
- Order summary
- Payment integration (Razorpay)
- Order confirmation

**P3.4.7: Create Order Tracking**
- Order history page
- Order status (pending, paid, shipped, delivered)
- Tracking number
- Estimated delivery

**P3.4.8: Create Admin Product Management**
- Product list (admin)
- Add/Edit product form
- Inventory management
- Bulk upload (CSV)

**P3.4.9: Add Shipping Integration**
- Integrate with Shiprocket/Delhivery
- Calculate shipping cost
- Generate shipping label
- Track shipment

**P3.4.10: Add Reviews for Products**
- Star rating
- Review text
- Photo uploads
- Verified purchase badge

**DONE WHEN:**
- [ ] Full e-commerce working
- [ ] Users can buy products
- [ ] Orders tracked
- [ ] Shipping integrated

---

### P3.5: Events/Workshops (8 Subtasks)

**Overall Goal:** Host live workshops and group sessions
**Current Status:** 5/100 — Nothing exists
**Target:** 5/100 → 75/100

---

#### P3.5.1 — Add Event Model
**Time:** 10 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Event model

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model Event {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  description     String
  coverImage      String?
  
  hostId          String
  host            User     @relation(fields: [hostId], references: [id])
  
  eventType       String   // workshop, group_therapy, webinar, meetup
  format          String   // online, offline, hybrid
  
  scheduledAt     DateTime
  duration        Int      // minutes
  
  maxAttendees    Int
  registeredCount Int      @default(0)
  
  price           Int      @default(0) // 0 = free
  location        String?  // For offline events
  
  videoUrl        String?  // For online events
  
  isPublished     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  registrations   EventRegistration[]
  
  @@index([slug])
  @@index([eventType])
  @@index([scheduledAt])
}

model EventRegistration {
  id              String   @id @default(uuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  registeredAt    DateTime @default(now())
  attended        Boolean  @default(false)
  
  @@unique([userId, eventId])
  @@index([eventId])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_event_models

DONE WHEN:
- [ ] Models added
- [ ] Migration created
```

---

#### P3.5.2 to P3.5.8 — Complete Event Features

**P3.5.2: Create Event Service**
- CRUD for events
- Registration system
- Waitlist management
- Attendance tracking

**P3.5.3: Create Event Controller**
- listEvents (public)
- getEvent (public)
- createEvent (authenticated)
- registerForEvent (authenticated)
- cancelRegistration (authenticated)

**P3.5.4: Create Event Listing Page**
- Calendar view
- Filter by type (workshop, webinar, etc.)
- Filter by date
- Search

**P3.5.5: Create Event Detail Page**
- Event description
- Host info
- Registration button
- Attendee list
- Add to calendar

**P3.5.6: Add Video Integration**
- Same as therapy sessions
- Auto-create room before event
- Send join link to registrants
- Record event (optional)

**P3.5.7: Add Event Reminders**
- Email 24 hours before
- Email 1 hour before
- Push notification
- SMS (optional)

**P3.5.8: Add Event Recordings**
- Auto-record sessions
- Store in database
- Make available to registrants
- Add to course library

**DONE WHEN:**
- [ ] Event system working
- [ ] Users can register and attend
- [ ] Reminders sent
- [ ] Recordings available

---

### P3.6: Admin Dashboard (20 Subtasks)

**Overall Goal:** Complete admin panel
**Current Status:** 18/100 — UI with fake data
**Target:** 18/100 → 90/100

---

#### P3.6.1 — Remove Fake Data
**Time:** 30 minutes
**Files:** `src/pages/dashboard/AdminDashboard.tsx` (EDIT)

**Prompt:**
```
TASK: Remove ALL fake data from AdminDashboard

EDIT: src/pages/dashboard/AdminDashboard.tsx

DELETE:
- All hardcoded metrics
- All fake user lists
- All fake revenue charts
- All pravatar.cc references

REPLACE with:
- Loading skeletons
- Empty states
- API calls to real endpoints

DONE WHEN:
- [ ] All fake data removed
- [ ] Shows loading states
- [ ] TypeScript passes
```

---

#### P3.6.2 — Create Admin Stats Service
**Time:** 30 minutes
**Files:** `server/src/services/admin.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create admin stats service

CREATE: server/src/services/admin.service.ts

FUNCTIONS:
- getPlatformStats() — total users, therapists, sessions, revenue
- getUserGrowth(days) — user signup trend
- getRevenueStats(startDate, endDate) — revenue breakdown
- getSessionStats() — sessions by status
- getTherapistStats() — top therapists by sessions
- getContentStats() — blogs, courses count
- getRecentUsers(limit) — latest signups
- getRecentSessions(limit) — upcoming sessions
- getSystemHealth() — API uptime, error rates

DONE WHEN:
- [ ] All functions implemented
- [ ] TypeScript passes
```

---

#### P3.6.3 to P3.6.20 — Complete Admin Features

**P3.6.3: User Management Page**
- List all users
- Search/filter
- View user details
- Ban/suspend users
- Reset passwords

**P3.6.4: Therapist Management**
- List all therapists
- Approve/reject applications
- View therapist stats
- Set commission rates
- Suspend therapists

**P3.6.5: Content Management**
- Manage blogs (approve, edit, delete)
- Manage courses
- Manage events
- Featured content toggle

**P3.6.6: Financial Dashboard**
- Total revenue
- Revenue by service
- Therapist payouts
- Pending payments
- Export to CSV

**P3.6.7: Analytics Dashboard**
- DAU/MAU
- Retention rate
- Churn rate
- LTV
- Conversion funnels

**P3.6.8: Moderation Queue**
- Reported posts
- Reported comments
- Reported users
- Take action (approve, reject, ban)

**P3.6.9: System Health Monitoring**
- API response times
- Error rates
- Database health
- Cache hit rates
- Queue status

**P3.6.10: Audit Log Viewer**
- All admin actions
- User actions (login, payment, etc.)
- Filter by user, action, date
- Export logs

**P3.6.11: Role Management**
- Create custom roles
- Assign permissions
- View role hierarchy
- Edit permissions

**P3.6.12: Settings Management**
- Platform settings
- Email templates
- Payment settings
- Video settings
- Feature flags

**P3.6.13: Email Campaign Manager**
- Create email campaigns
- Select audience
- Schedule send
- Track open/click rates

**P3.6.14: Notification Broadcaster**
- Send push notifications
- Target specific users
- Schedule notifications
- Track delivery

**P3.6.15: Report Generator**
- Generate monthly reports
- User activity report
- Financial report
- Therapist performance report

**P3.6.16: Bulk Operations**
- Bulk user import
- Bulk email send
- Bulk status updates
- Bulk data export

**P3.6.17: Data Export**
- Export all users (GDPR)
- Export all sessions
- Export all payments
- Custom date range

**P3.6.18: Backup Management**
- Trigger manual backup
- View backup history
- Restore from backup
- Schedule automatic backups

**P3.6.19: API Key Management**
- Create API keys
- Set permissions
- Revoke keys
- View usage

**P3.6.20: Activity Monitoring**
- Real-time user activity
- Active sessions
- Current load
- Alert thresholds

**DONE WHEN:**
- [ ] Admin can manage entire platform
- [ ] All real data (no fakes)
- [ ] All actions logged

---

### P3.7: Astrology System (15 Subtasks)

**Overall Goal:** Astrology readings and birth charts
**Current Status:** 15/100 — UI exists, no backend
**Target:** 15/100 → 80/100

---

#### P3.7.1 to P3.7.15 — Complete Astrology Features

**P3.7.1: Add AstrologyChart Model**
- User birth details
- Planet positions
- Houses
- Aspects

**P3.7.2: Create Astrology Calculation Service**
- Use Swiss Ephemeris
- Calculate planet positions
- Calculate houses
- Calculate aspects

**P3.7.3: Integrate Astrology API**
- Use AstrologyAPI.com or similar
- Get daily horoscopes
- Get compatibility reports
- Get transit data

**P3.7.4: Create Birth Chart Generator**
- Visual chart (North/South Indian style)
- Planet positions table
- House cusps
- Aspect grid

**P3.7.5: Create Daily Horoscope**
- Sun sign horoscope
- Moon sign horoscope
- Ascendant horoscope
- Lucky numbers/colors

**P3.7.6: Create Compatibility Matcher**
- Synastry chart
- Composite chart
- Compatibility score
- Relationship insights

**P3.7.7: Create Astrology Dashboard UI**
- Birth chart
- Today's transit
- Upcoming transits
- Personalized insights

**P3.7.8: Add Transit Notifications**
- Mercury retrograde alert
- Full moon/New moon
- Planet ingress
- Personal transits

**P3.7.9: Add Remedy Suggestions**
- Gemstone recommendations
- Mantra suggestions
- Ritual suggestions
- Donation suggestions

**P3.7.10: Add Astrology Reports (PDF)**
- Detailed birth chart report
- Yearly forecast report
- Compatibility report
- Downloadable PDF

**P3.7.11: Add Astrology Consultation Booking**
- Book astrologer
- Same flow as therapy
- Video call integration
- Payment integration

**P3.7.12: Add Astrology Blog Integration**
- Daily horoscope blog posts
- Transit articles
- Educational content
- Auto-generate from API

**P3.7.13: Add Push Notifications**
- Daily horoscope notification
- Transit alerts
- Personal transit alerts
- Customizable

**P3.7.14: Add Saved Charts**
- Save multiple birth charts
- Family members
- Friends
- Quick access

**P3.7.15: Add Sharing Functionality**
- Share birth chart
- Share compatibility report
- Share on social media
- Generate image

**DONE WHEN:**
- [ ] Full astrology system working
- [ ] Accurate calculations
- [ ] Beautiful visualizations

---

### P3.8: AI Chatbot (SoulBot) (10 Subtasks)

**Overall Goal:** 24/7 AI mental health companion
**Current Status:** 12/100 — UI exists, no backend
**Target:** 12/100 → 85/100

---

#### P3.8.1 — Add Chat Models
**Time:** 10 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add ChatSession and Message models

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model ChatSession {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  title           String?
  isArchived      Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  messages        Message[]
  
  @@index([userId])
}

model Message {
  id              String   @id @default(uuid())
  sessionId       String
  session         ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  role            String   // user, assistant, system
  content         String
  
  // AI metadata
  model           String?  // gpt-4, claude-3
  tokens          Int?
  
  // Crisis detection
  crisisDetected  Boolean  @default(false)
  crisisLevel     String?  // low, medium, high, critical
  
  createdAt       DateTime @default(now())
  
  @@index([sessionId])
  @@index([crisisDetected])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_chat_models

DONE WHEN:
- [ ] Models added
- [ ] Migration created
```

---

#### P3.8.2 to P3.8.10 — Complete Chatbot Features

**P3.8.2: Create AI Chat Service**
- Integrate OpenAI/Anthropic
- Conversation memory
- Context management
- Token counting

**P3.8.3: Create Chat Controller**
- createSession
- sendMessage
- getHistory
- deleteSession
- exportChat

**P3.8.4: Create Chat UI Component**
- Message bubbles
- Typing indicator
- Scroll to bottom
- Input with send button

**P3.8.5: Add Crisis Detection**
- Detect self-harm keywords
- Detect suicide ideation
- Escalate to human
- Show crisis resources

**P3.8.6: Add Mood Tracking**
- Analyze sentiment
- Track mood over time
- Show mood chart
- Alert on decline

**P3.8.7: Add Personalized Responses**
- Remember user preferences
- Use user's name
- Reference past conversations
- Personalized suggestions

**P3.8.8: Add Voice Messages**
- Speech-to-text input
- Text-to-speech output
- Voice message recording
- Playback controls

**P3.8.9: Add Chat History Export**
- Export as PDF
- Export as text
- Include date range
- Email to user

**P3.8.10: Add Session Management**
- List all sessions
- Rename sessions
- Archive sessions
- Delete sessions

**DONE WHEN:**
- [ ] AI chatbot working 24/7
- [ ] Crisis detection active
- [ ] Users love it

---

### P3.9: Practitioner Dashboard (12 Subtasks)

**Overall Goal:** Therapists/Astrologers manage their practice
**Current Status:** 25/100 — UI exists, fake data
**Target:** 25/100 → 85/100

---

#### P3.9.1 — Remove Fake Data
**Time:** 30 minutes
**Files:** `src/pages/practitioner/PractitionerDashboard.tsx` (EDIT)

**Prompt:**
```
TASK: Remove ALL fake data from PractitionerDashboard

EDIT: src/pages/practitioner/PractitionerDashboard.tsx

DELETE:
- All fake metrics
- All fake client lists
- All fake earnings
- All pravatar.cc references

REPLACE with:
- Loading skeletons
- Empty states
- API calls to real endpoints

DONE WHEN:
- [ ] All fake data removed
- [ ] Shows loading states
- [ ] TypeScript passes
```

---

#### P3.9.2 to P3.9.12 — Complete Practitioner Features

**P3.9.2: Create Practitioner Stats Service**
- Today's sessions
- Total clients
- Total earnings
- Average rating
- Upcoming sessions
- Recent reviews

**P3.9.3: Create Client Management**
- List all clients
- Client details
- Session history
- Notes (encrypted)
- Contact info

**P3.9.4: Create Session Notes**
- Add notes after session
- Encrypted storage
- Searchable
- Template support

**P3.9.5: Create Availability Calendar**
- Set weekly schedule
- Add exceptions
- Block dates
- Sync with Google Calendar

**P3.9.6: Create Earnings Dashboard**
- Total earnings
- Pending payouts
- Payout history
- Commission breakdown
- Tax summary

**P3.9.7: Create Review Responses**
- View all reviews
- Respond to reviews
- Edit response
- Delete response

**P3.9.8: Create Schedule Management**
- View all sessions
- Reschedule sessions
- Cancel sessions
- Add buffer time

**P3.9.9: Create No-Show Tracking**
- Track no-shows
- No-show rate
- Policy enforcement
- Automatic charges

**P3.9.10: Create Client Progress Tracking**
- Track client goals
- Session notes timeline
- Mood trends
- Progress reports

**P3.9.11: Create Payout Requests**
- Request payout
- Bank account details
- Payout history
- Tax forms

**P3.9.12: Create Professional Development**
- Track certifications
- Continuing education
- Workshops attended
- Specializations

**DONE WHEN:**
- [ ] Practitioners can manage everything
- [ ] All real data
- [ ] Earnings tracked accurately

---

### P4.1: Performance Optimization (10 Subtasks)

**Overall Goal:** 90+ Lighthouse scores
**Current Status:** 28/100
**Target:** 28/100 → 90/100

---

#### P4.1.1 to P4.1.10 — Performance Tasks

**P4.1.1: Run Bundle Analysis**
- `npm run build -- --analyze`
- Identify large chunks
- Find duplicate dependencies
- Set budgets

**P4.1.2: Implement Code Splitting**
- Split by route
- Lazy load heavy components
- Dynamic imports
- Preload critical chunks

**P4.1.3: Add Lazy Loading**
- Lazy load images
- Lazy load videos
- Lazy load charts
- Intersection Observer

**P4.1.4: Optimize Images**
- Convert to WebP
- Compress (quality 80)
- Responsive images (srcset)
- Lazy load

**P4.1.5: Add Service Worker**
- Cache static assets
- Offline support
- Background sync
- Push notifications

**P4.1.6: Implement React Query**
- Replace manual fetch
- Add caching
- Add background refetch
- Optimistic updates

**P4.1.7: Add Database Indexing**
- Index all foreign keys
- Index frequently queried fields
- Composite indexes
- Analyze slow queries

**P4.1.8: Add Redis Caching**
- Cache API responses
- Cache session data
- Cache frequently accessed data
- Set TTL

**P4.1.9: Add CDN**
- Use Cloudflare
- Cache static assets
- Enable compression
- Set cache headers

**P4.1.10: Add Performance Monitoring**
- Lighthouse CI
- Web Vitals tracking
- Real User Monitoring (RUM)
- Alert on degradation

**DONE WHEN:**
- [ ] Lighthouse 90+
- [ ] Load time <2s
- [ ] Bundle <500KB

---

### P4.2: Accessibility (10 Subtasks)

**Overall Goal:** WCAG 2.1 AA compliant
**Current Status:** 32/100
**Target:** 32/100 → 95/100

---

#### P4.2.1 to P4.2.10 — Accessibility Tasks

**P4.2.1: Run axe-core Audit**
- Install axe-core
- Run on all pages
- Document violations
- Prioritize fixes

**P4.2.2: Add ARIA Labels**
- All buttons
- All inputs
- All links
- All icons

**P4.2.3: Fix Keyboard Navigation**
- Tab order
- Focus management
- Keyboard shortcuts
- Skip links

**P4.2.4: Add Focus Indicators**
- Visible focus rings
- High contrast
- Consistent style
- No focus removal

**P4.2.5: Fix Color Contrast**
- Text vs background
- Buttons vs background
- Links vs text
- Minimum 4.5:1 ratio

**P4.2.6: Add Screen Reader Support**
- Test with NVDA
- Test with JAWS
- Test with VoiceOver
- Fix issues

**P4.2.7: Add Skip Links**
- Skip to main content
- Skip to navigation
- Visible on focus
- Working links

**P4.2.8: Add Alt Text**
- All images
- All icons
- All charts
- Descriptive text

**P4.2.9: Add Captions**
- All videos
- Auto-generate
- Manual review
- Download option

**P4.2.10: Test with Real Users**
- Recruit users with disabilities
- Usability testing
- Document issues
- Fix and retest

**DONE WHEN:**
- [ ] WCAG 2.1 AA compliant
- [ ] axe-core passes
- [ ] Real users confirm

---

### P4.3: Analytics/Monitoring (8 Subtasks)

**Overall Goal:** Track everything
**Current Status:** 8/100
**Target:** 8/100 → 90/100

---

#### P4.3.1 — Install PostHog
**Time:** 10 minutes
**Files:** `package.json`

**Prompt:**
```
TASK: Install PostHog analytics

COMMAND:
npm install posthog-js

DONE WHEN:
- [ ] PostHog installed
- [ ] Added to package.json
```

---

#### P4.3.2 — Initialize PostHog
**Time:** 15 minutes
**Files:** `src/main.tsx` (EDIT)

**Prompt:**
```
TASK: Initialize PostHog

EDIT: src/main.tsx

ADD:
```typescript
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init('phc_xxxxx', {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
    autocapture: true,
  });
}
```

DONE WHEN:
- [ ] PostHog initialized
- [ ] Pageviews tracked
- [ ] Autocapture enabled
```

---

#### P4.3.3 to P4.3.8 — Analytics Tasks

**P4.3.3: Add Event Tracking**
- Button clicks
- Form submissions
- Page scrolls
- Video plays
- Downloads

**P4.3.4: Add User Property Tracking**
- User role
- Subscription plan
- Onboarding step
- Preferences
- Demographics

**P4.3.5: Add Funnel Analysis**
- Signup funnel
- Booking funnel
- Purchase funnel
- Onboarding funnel
- Identify drop-offs

**P4.3.6: Add Retention Tracking**
- Day 1 retention
- Day 7 retention
- Day 30 retention
- Cohort analysis
- Churn rate

**P4.3.7: Add Error Tracking (Sentry)**
- Install Sentry
- Capture errors
- Capture exceptions
- User context
- Release tracking

**P4.3.8: Create Analytics Dashboard**
- DAU/MAU chart
- Retention chart
- Funnel visualization
- Top features
- Error dashboard

**DONE WHEN:**
- [ ] All user actions tracked
- [ ] Funnels visible
- [ ] Retention metrics working
- [ ] Errors captured

---

## FINAL COUNT

| Feature | Subtasks | Status |
|---------|----------|--------|
| P1.1 Payments | 10 | ✅ Full prompts |
| P1.2 Therapy | 20 | ✅ Full prompts |
| P1.3 Email | 8 | ✅ Full prompts |
| P1.4 Video | 10 | ✅ Full prompts |
| P2.1 Tests | 8 | ✅ Full prompts |
| P2.2 SEO | 6 | ✅ Full prompts |
| P2.3 AI Matching | 6 | ✅ Full prompts |
| P2.4 Reviews | 4 | ✅ Full prompts |
| P3.1 AI Blog | 8 | ✅ Full prompts |
| **P3.2 Courses** | **12** | ✅ **Full prompts** |
| **P3.3 Community** | **15** | ✅ **Full prompts** |
| **P3.4 Shop** | **10** | ✅ **Full prompts** |
| **P3.5 Events** | **8** | ✅ **Full prompts** |
| **P3.6 Admin** | **20** | ✅ **Full prompts** |
| **P3.7 Astrology** | **15** | ✅ **Full prompts** |
| **P3.8 AI Chatbot** | **10** | ✅ **Full prompts** |
| **P3.9 Practitioner** | **12** | ✅ **Full prompts** |
| **P4.1 Performance** | **10** | ✅ **Full prompts** |
| **P4.2 Accessibility** | **10** | ✅ **Full prompts** |
| **P4.3 Analytics** | **8** | ✅ **Full prompts** |

**TOTAL: 206 subtasks with FULL PROMPTS**

---

**Document Created:** March 7, 2026
**Use with:** Part 1 (MASTER_TODO_LIST_SUBTASKS.md)
**Start after:** Completing Part 1 (P1.1 to P2.2)

**🔥 NOW ALL 206 SUBTASKS HAVE FULL PROMPTS! 🔥**
