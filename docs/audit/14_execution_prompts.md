# AI Agent Execution Prompts — Soul Yatri (Extended)

## PROMPT 009: Implement Soul Constellation Matching Algorithm

**Priority**: P0 — CRITICAL (Core Differentiator)
**Estimated scope**: 15-20 files, ~2000 lines

```
TASK: Implement Soul Constellation matching algorithm for Soul Yatri.

CONTEXT:
- This is the CORE differentiator - soul-based social networking
- Combines astrology, psychology, wellness, and professional compatibility
- Must be ML-ready but start with rule-based scoring
- Database schema updates required (see SOUL_CONSTELLATION_100_100_PLAN.md)

FILES TO CREATE:
1. server/prisma/schema.prisma (add SoulProfile, Connection, SoulPost, SoulStory, SoulMessage models)
2. server/src/services/soul-matching.service.ts (main algorithm)
3. server/src/services/astrology-compatibility.service.ts (astrology calculations)
4. server/src/controllers/connections.controller.ts
5. server/src/routes/connections.routes.ts
6. server/src/validators/connections.validator.ts

FILES TO EDIT:
1. src/pages/dashboard/ConnectionsPage.tsx (replace mock data)
2. src/features/connections/components/SoulMatchCard.tsx (create)
3. src/features/connections/components/ConstellationVisualizer.tsx (create)

IMPLEMENTATION REQUIREMENTS:

1. Database Schema (schema.prisma):
   - Add SoulProfile model with astrology, personality, wellness fields
   - Add Connection model with compatibility scores
   - Add SoulPost, SoulStory, SoulMessage for social features
   - Add UserActivity for tracking
   - Run: npx prisma migrate dev --name add_soul_constellation

2. Soul Matching Service (soul-matching.service.ts):
   - calculateCompatibility(user1Id, user2Id): Promise<SoulMatch>
   - findSoulMatches(userId, limit): Promise<SoulMatch[]>
   - calculateAstrologyCompatibility(profile1, profile2): number (30% weight)
   - calculatePersonalityCompatibility(profile1, profile2): number (25% weight)
   - calculateWellnessCompatibility(profile1, profile2): number (25% weight)
   - calculateProfessionalCompatibility(profile1, profile2): number (20% weight)
   - generateMatchReasons(data): string[]

3. Astrology Compatibility:
   - Implement sun sign compatibility matrix (all 12 zodiac signs)
   - Implement moon sign compatibility (emotional harmony)
   - Implement rising sign compatibility (first impression)
   - Add synastry calculation for full birth charts
   - Reference: Traditional Vedic + Western astrology principles

4. Personality Compatibility:
   - Core values alignment (set overlap calculation)
   - Love language compatibility
   - Attachment style complementarity
   - MBTI type compatibility (if available)

5. Wellness Compatibility:
   - Wellness goals alignment
   - Practices overlap (meditation, yoga, journaling, etc.)
   - Mental health tags (similar struggles = empathy)
   - Energy level compatibility (similar levels work better)

6. API Endpoints:
   - GET /api/v1/connections/matches - Get soul matches
   - GET /api/v1/connections - Get my connections
   - POST /api/v1/connections/:userId/request - Send request
   - POST /api/v1/connections/:userId/accept - Accept request
   - POST /api/v1/connections/:userId/reject - Reject request
   - POST /api/v1/connections/:userId/block - Block user
   - GET /api/v1/connections/:userId/compatibility - Get score

7. Frontend Components:
   - SoulMatchCard: Display match with compatibility breakdown
   - ConstellationVisualizer: Interactive 3D constellation view
   - ConnectionFilters: Filter by astrology, wellness, professional
   - View toggle: Cards vs Constellation view

SECURITY:
- Only show discoverable users (isDiscoverable flag)
- Respect privacy settings (showZodiacSign, showBirthChart)
- Rate limit match requests (100/hour)
- Prevent self-matching
- Block detection

VALIDATION:
1. Run: cd server && npm run build
2. Run: cd server && npm run lint:ci
3. Run: npx prisma generate
4. Test: Create 5 test users with different zodiac signs
5. Test: Verify compatibility scores are calculated correctly
6. Test: Fire signs match with fire signs (high score)
7. Test: Fire signs match with water signs (low score)
8. Frontend: Verify matches display correctly
9. Frontend: Test connect button functionality

DONE WHEN:
- All database models created and migrated
- Soul matching algorithm implemented with all 4 compatibility dimensions
- Astrology compatibility matrix complete (12x12 signs)
- API endpoints functional and tested
- Frontend displays real matches (no mock data)
- Compatibility scores accurate and explainable
- All lint checks pass
- Manual test: User sees 20+ real matches

HANDOFF NOTE:
- Next prompt: Implement social feed (posts, stories, comments)
- Next prompt: Implement messaging system
- Update docs/audit/_progress.json after completion
```

---

## PROMPT 010: Implement Soul Constellation Social Feed

**Priority**: P1 — HIGH
**Estimated scope**: 12-15 files, ~1500 lines

```
TASK: Implement social feed for Soul Constellation (Instagram-style).

CONTEXT:
- Users can share posts about their wellness journey
- Posts show mood, zodiac emoji, wellness tags
- Feed shows posts from connections only
- Support images, videos, text posts
- Like, comment, share functionality

FILES TO CREATE:
1. server/src/controllers/posts.controller.ts
2. server/src/services/feed.service.ts
3. server/src/validators/posts.validator.ts
4. src/features/connections/components/SoulFeed.tsx
5. src/features/connections/components/PostCard.tsx
6. src/features/connections/components/CreatePostBox.tsx
7. src/features/connections/components/StoriesBar.tsx

FILES TO EDIT:
1. server/src/routes/index.ts (add posts routes)
2. src/pages/dashboard/ConnectionsPage.tsx (add feed tab)

IMPLEMENTATION REQUIREMENTS:

1. Database:
   - SoulPost model (already in schema from PROMPT 009)
   - SoulLike model
   - SoulComment model (with nested replies)
   - SoulStory model (expires after 24h)

2. Feed Service (feed.service.ts):
   - createPost(userId, content, media, mood, tags, visibility)
   - getFeed(userId, limit, cursor): Paginated feed
   - likePost(userId, postId)
   - unlikePost(userId, postId)
   - commentOnPost(userId, postId, content, parentId?)
   - getPostEngagement(postId): {likes, comments, shares}

3. API Endpoints:
   - GET /api/v1/posts/feed - Get personalized feed
   - POST /api/v1/posts - Create post
   - GET /api/v1/posts/:id - Get single post
   - DELETE /api/v1/posts/:id - Delete post
   - POST /api/v1/posts/:id/like - Like post
   - DELETE /api/v1/posts/:id/like - Unlike post
   - POST /api/v1/posts/:id/comment - Comment on post
   - GET /api/v1/posts/:id/comments - Get comments
   - GET /api/v1/stories - Get active stories
   - POST /api/v1/stories - Create story

4. Frontend Components:
   - SoulFeed: Main feed component with infinite scroll
   - PostCard: Individual post display
     - User avatar + name + zodiac sign
     - Content (text, images, videos)
     - Mood indicator (1-10 scale with emoji)
     - Like, comment, share buttons
     - Engagement counts
   - CreatePostBox: Post creation
     - Text input
     - Media upload (images/videos)
     - Mood selector (1-10 slider)
     - Tags input
     - Visibility selector (Public/Connections/Private)
   - StoriesBar: Horizontal stories carousel
     - User avatars with ring (like Instagram)
     - Viewed/unviewed state
     - Add story button

5. Features:
   - Infinite scroll pagination
   - Optimistic UI updates (like before server response)
   - Real-time like/comment counts (WebSocket)
   - Image/video compression before upload
   - Auto-delete stories after 24h (cron job)

VALIDATION:
1. Create 10 test posts with different users
2. Verify feed shows only connections' posts
3. Test like/unlike functionality
4. Test nested comments (replies to comments)
5. Test story creation and auto-expiry
6. Verify image upload works
7. Test mood selector displays correctly

DONE WHEN:
- Users can create posts with text, images, mood
- Feed shows posts from connections
- Like, comment, share functionality works
- Stories expire after 24 hours
- All lint checks pass
- Manual test: Create post, see it in feed

HANDOFF NOTE:
- Next prompt: Implement messaging system
- Update docs/audit/_progress.json after completion
```

---

## PROMPT 011: Implement Soul Messaging System

**Priority**: P1 — HIGH
**Estimated scope**: 10-12 files, ~1200 lines

```
TASK: Implement real-time messaging for Soul Constellation.

CONTEXT:
- 1:1 messaging between connected users
- Group messaging (up to 10 people)
- Media sharing (images, videos, voice notes)
- Read receipts
- Typing indicators
- Message reactions

FILES TO CREATE:
1. server/src/services/messaging.service.ts
2. server/src/controllers/messages.controller.ts
3. server/src/validators/messages.validator.ts
4. src/features/connections/components/MessagingInterface.tsx
5. src/features/connections/components/ChatWindow.tsx
6. src/features/connections/components/ConversationList.tsx
7. src/features/connections/components/MessageInput.tsx

IMPLEMENTATION REQUIREMENTS:

1. Database:
   - SoulMessage model (already in schema)
   - Conversation model (for group chats)
   - ConversationParticipant model
   - MessageReaction model

2. Messaging Service:
   - createConversation(userId, participantIds, isGroup)
   - sendMessage(conversationId, senderId, content, media)
   - markAsRead(userId, conversationId)
   - getConversations(userId): List of user's conversations
   - getMessages(conversationId, limit, cursor): Paginated messages
   - sendTypingIndicator(userId, conversationId)
   - sendMessageReaction(userId, messageId, emoji)

3. WebSocket Events:
   - message:new - New message received
   - message:read - Message read receipt
   - conversation:typing - User is typing
   - conversation:online - User online status

4. API Endpoints:
   - GET /api/v1/conversations - Get all conversations
   - POST /api/v1/conversations - Create conversation
   - GET /api/v1/conversations/:id/messages - Get messages
   - POST /api/v1/conversations/:id/messages - Send message
   - POST /api/v1/conversations/:id/read - Mark as read
   - DELETE /api/v1/conversations/:id - Leave/delete conversation

5. Frontend Components:
   - MessagingInterface: Main messaging screen
   - ConversationList: List of conversations (like WhatsApp sidebar)
   - ChatWindow: Active chat window
   - MessageInput: Text input with emoji picker, media upload
   - MessageBubble: Individual message display
   - TypingIndicator: "User is typing..." animation

6. Features:
   - Real-time message delivery (WebSocket)
   - Read receipts (single tick → double tick)
   - Typing indicators
   - Online/offline status
   - Media preview (images, videos)
   - Voice note recording
   - Emoji reactions
   - Message search
   - Conversation archive/delete

VALIDATION:
1. Create conversation between 2 users
2. Send 10 messages back and forth
3. Verify real-time delivery (< 100ms)
4. Test read receipts
5. Test typing indicators
6. Test image upload and preview
7. Test voice note recording
8. Test group chat (5 users)

DONE WHEN:
- Users can send/receive messages in real-time
- Read receipts work correctly
- Typing indicators display
- Media sharing functional
- All lint checks pass
- Manual test: Send message, see it appear instantly

HANDOFF NOTE:
- Next prompt: Implement activity tracking & analytics
- Update docs/audit/_progress.json after completion
```

---

**Total Prompts for Soul Constellation:** 3 (P0: 1, P1: 2)
**Estimated Total Time:** 12-16 weeks
**Priority:** This is the CORE differentiator - build this first after security fixes
