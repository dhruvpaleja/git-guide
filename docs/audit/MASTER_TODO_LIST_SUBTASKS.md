# MASTER TODO LIST — ULTRA-GRANULAR SUBTASKS (Agent-Safe)

**Generated:** March 7, 2026
**Purpose:** Every task broken into smallest possible subtasks so AI agents cannot fuck up
**Rule:** Complete subtasks in exact order. Never skip ahead.
**Total Subtasks:** ~150 (instead of 51)

---

## HOW TO USE THIS DOCUMENT

1. **Start at P0.1.1** — Do NOT skip any subtask
2. **Each subtask touches MAX 2 files** — Agent cannot break other things
3. **After each subtask:** Run verification commands, check box, then move to next
4. **AI Agents:** Copy the EXACT prompt for that subtask only
5. **If subtask fails:** Fix it before moving to next one

---

## P0 — CRITICAL SECURITY (Keep Mock Auth for Testing)

> ⚠️ **NOTE:** We are NOT doing P0.1-P0.3 right now. We want to keep mock auth enabled for manual testing. Skip to P1 section.

---

## P1 — HIGH PRIORITY FEATURES (Build Everything with Mock Auth ON)

### P1.1: Implement Razorpay Payment Processing

**Overall Goal:** Users can pay for therapy sessions
**Current Status:** All payment endpoints return 501 (Not Implemented)
**Final Score Target:** 10/100 → 82/100

---

#### P1.1.1 — Install Razorpay SDK
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Install Razorpay SDK in backend

COMMAND:
cd server
npm install razorpay

VERIFY:
cd server
npm list razorpay
# Should show razorpay@latest

DONE WHEN:
- [ ] Razorpay installed
- [ ] No npm errors
- [ ] server/package.json updated
```

---

#### P1.1.2 — Add Razorpay Env Variables
**Time:** 5 minutes
**Files:** `server/.env.example`

**Prompt:**
```
TASK: Add Razorpay environment variables to .env.example

EDIT: server/.env.example

ADD THESE LINES:
```
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

DONE WHEN:
- [ ] All 3 variables added
- [ ] Comments explain what each is for
- [ ] File saved
```

---

#### P1.1.3 — Create Payment Service (Part 1: createOrder)
**Time:** 15 minutes
**Files:** `server/src/services/payment.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create payment service file with ONLY createOrder function

CREATE: server/src/services/payment.service.ts

CODE:
```typescript
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AppError } from '../lib/errors.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amount: number, currency: string, receipt: string) {
  if (!amount || amount <= 0) {
    throw AppError.badRequest('Invalid amount');
  }

  const options = {
    amount,
    currency,
    receipt,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error: any) {
    throw AppError.internal('Failed to create payment order', error);
  }
}

// Export razorpay instance for webhook use
export { razorpay };
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] File created
- [ ] createOrder function works
- [ ] TypeScript passes
```

---

#### P1.1.4 — Create Payment Service (Part 2: verifyPayment)
**Time:** 15 minutes
**Files:** `server/src/services/payment.service.ts` (EDIT)

**Prompt:**
```
TASK: Add verifyPayment function to existing payment service

EDIT: server/src/services/payment.service.ts

ADD THIS FUNCTION:
```typescript
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const sign = orderId + '|' + paymentId;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest('hex');

  if (expectedSign !== signature) {
    throw AppError.unauthorized('Invalid payment signature');
  }

  return {
    verified: true,
    paymentId,
    orderId,
  };
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] verifyPayment function added
- [ ] TypeScript passes
- [ ] No errors
```

---

#### P1.1.5 — Create Payment Service (Part 3: handleWebhook)
**Time:** 15 minutes
**Files:** `server/src/services/payment.service.ts` (EDIT)

**Prompt:**
```
TASK: Add handleWebhook function to payment service

EDIT: server/src/services/payment.service.ts

ADD:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function handleWebhook(event: any) {
  const paymentId = event.payload.payment.entity.id;
  const status = event.payload.payment.entity.status;
  const orderId = event.payload.payment.entity.order_id;

  // Find payment in DB
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!payment) {
    throw AppError.notFound('Payment not found');
  }

  // Update status based on webhook event
  const updateData: any = {};
  
  if (event.event === 'payment.captured' && status === 'captured') {
    updateData.status = 'CAPTURED';
    updateData.razorpayPaymentId = paymentId;
  } else if (event.event === 'payment.failed') {
    updateData.status = 'FAILED';
  } else if (event.event === 'payment.refunded') {
    updateData.status = 'REFUNDED';
  }

  return await prisma.payment.update({
    where: { id: payment.id },
    data: updateData,
  });
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] handleWebhook function added
- [ ] TypeScript passes
```

---

#### P1.1.6 — Update Payment Controller (Part 1: Create Order Endpoint)
**Time:** 20 minutes
**Files:** `server/src/controllers/payments.controller.ts` (EDIT)

**Prompt:**
```
TASK: Replace 501 stub with real createOrder endpoint

EDIT: server/src/controllers/payments.controller.ts

FIND: POST /order endpoint (currently returns 501)

REPLACE WITH:
```typescript
export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount, currency = 'INR', type = 'session' } = req.body;
    const userId = req.user!.id;

    // Create payment record in DB
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        type,
        status: 'PENDING',
        description: req.body.description || `Payment for ${type}`,
      },
    });

    // Create Razorpay order
    const order = await createOrder(amount, currency, `payment_${payment.id}`);

    // Update payment with Razorpay order ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.orderId },
    });

    res.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
    });
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] createOrder endpoint implemented
- [ ] Creates DB record
- [ ] Returns Razorpay order
- [ ] TypeScript passes
```

---

#### P1.1.7 — Update Payment Controller (Part 2: Verify Endpoint)
**Time:** 20 minutes
**Files:** `server/src/controllers/payments.controller.ts` (EDIT)

**Prompt:**
```
TASK: Implement payment verification endpoint

EDIT: server/src/controllers/payments.controller.ts

FIND: POST /verify endpoint

REPLACE WITH:
```typescript
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.user!.id;

    // Verify signature
    const result = await verifyPayment(orderId, paymentId, signature);

    // Update payment record
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: orderId },
      data: {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: 'AUTHORIZED',
      },
    });

    // If session payment, update session status
    if (payment.sessionId) {
      await prisma.session.update({
        where: { id: payment.sessionId },
        data: { status: 'SCHEDULED' },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] verifyPayment endpoint works
- [ ] Updates DB
- [ ] TypeScript passes
```

---

#### P1.1.8 — Update Payment Controller (Part 3: Webhook Endpoint)
**Time:** 20 minutes
**Files:** `server/src/controllers/payments.controller.ts` (EDIT)

**Prompt:**
```
TASK: Implement webhook handler endpoint

EDIT: server/src/controllers/payments.controller.ts

FIND: POST /webhook endpoint

REPLACE WITH:
```typescript
export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const event = req.body;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(JSON.stringify(event))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw AppError.unauthorized('Invalid webhook signature');
    }

    // Process webhook
    await handleWebhook(event);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Webhook endpoint implemented
- [ ] Signature verification works
- [ ] TypeScript passes
```

---

#### P1.1.9 — Add Rate Limiting to Payment Routes
**Time:** 10 minutes
**Files:** `server/src/routes/payments.ts`

**Prompt:**
```
TASK: Add rate limiting to payment routes

EDIT: server/src/routes/payments.ts

ADD AT TOP:
```typescript
import { rateLimit } from 'express-rate-limit';

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many payment requests, please try again later',
});

// Apply to router
router.use(paymentLimiter);
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Rate limiter added
- [ ] Applied to all payment routes
- [ ] TypeScript passes
```

---

#### P1.1.10 — Create Frontend Razorpay Hook
**Time:** 30 minutes
**Files:** `src/hooks/useRazorpay.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create React hook for Razorpay integration

CREATE: src/hooks/useRazorpay.ts

CODE:
```typescript
import { useState } from 'react';
import { API_URL } from '../config/api';

interface RazorpayOptions {
  amount: number;
  currency?: string;
  type?: string;
  description?: string;
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (options: RazorpayOptions) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      // Create order
      const orderRes = await fetch(`${API_URL}/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Open Razorpay checkout
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Soul Yatri',
        description: options.description || 'Payment',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: orderData.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            throw new Error(verifyData.message || 'Verification failed');
          }

          return verifyData;
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
          contact: '9999999999',
        },
      };

      const razorpay = new (window as any).Razorpay(razorpayOptions);
      razorpay.open();
      
      return orderData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] Hook created
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

---

### P1.2: Implement Therapy Backend

**Overall Goal:** Users can browse therapists, book sessions, manage appointments
**Current Status:** All therapy endpoints return 501
**Final Score Target:** 10/100 → 82/100

---

#### P1.2.1 — Read Schema First
**Time:** 10 minutes
**Files:** READ ONLY: `server/prisma/schema.prisma`

**Prompt:**
```
TASK: Read and understand Session, TherapistProfile, TherapistAvailability models

READ:
1. server/prisma/schema.prisma (lines ~180-280)
2. Find: model Session
3. Find: model TherapistProfile
4. Find: model TherapistAvailability

UNDERSTAND:
- What fields each model has
- How they relate to User
- What enums they use (SessionStatus, etc.)

DONE WHEN:
- [ ] You understand the schema
- [ ] No code changes
- [ ] Ready to write service layer
```

---

#### P1.2.2 — Study Existing Service Pattern
**Time:** 10 minutes
**Files:** READ ONLY: `server/src/services/health-tools.service.ts`

**Prompt:**
```
TASK: Study how service layer is structured in this codebase

READ:
1. server/src/services/health-tools.service.ts
2. Notice the pattern:
   - Import PrismaClient
   - Export functions (not class)
   - Use AppError for errors
   - Return plain objects

DONE WHEN:
- [ ] You understand the pattern
- [ ] No code changes
- [ ] Ready to write therapy service
```

---

#### P1.2.3 — Create Therapy Service (listTherapists)
**Time:** 20 minutes
**Files:** `server/src/services/therapy.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create therapy service with ONLY listTherapists function first

CREATE: server/src/services/therapy.service.ts

CODE:
```typescript
import { PrismaClient } from '@prisma/client';
import { AppError } from '../lib/errors.js';

const prisma = new PrismaClient();

interface ListTherapistsOptions {
  page?: number;
  limit?: number;
  specialization?: string[];
  language?: string[];
  approach?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export async function listTherapists(options: ListTherapistsOptions) {
  const {
    page = 1,
    limit = 10,
    specialization,
    language,
    approach,
    minPrice,
    maxPrice,
  } = options;

  const where: any = {
    isVerified: true,
    isAvailable: true,
  };

  if (specialization && specialization.length > 0) {
    where.specializations = {
      hasSome: specialization,
    };
  }

  if (language && language.length > 0) {
    where.languages = {
      hasSome: language,
    };
  }

  if (approach && approach.length > 0) {
    where.approach = {
      in: approach,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerSession = {};
    if (minPrice !== undefined) where.pricePerSession.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerSession.lte = maxPrice;
  }

  const [therapists, total] = await Promise.all([
    prisma.therapistProfile.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    }),
    prisma.therapistProfile.count({ where }),
  ]);

  return {
    therapists,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] File created
- [ ] listTherapists function works
- [ ] TypeScript passes
```

---

#### P1.2.4 — Create Therapy Service (getTherapistById)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add getTherapistById function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function getTherapistById(therapistId: string, requestingUserId?: string) {
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      sessions: requestingUserId
        ? {
            where: { userId: requestingUserId },
            select: {
              id: true,
              scheduledAt: true,
              status: true,
            },
          }
        : false,
    },
  });

  if (!therapist) {
    throw AppError.notFound('Therapist not found');
  }

  return therapist;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.5 — Create Therapy Service (getTherapistAvailability)
**Time:** 30 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add getTherapistAvailability function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function getTherapistAvailability(
  therapistId: string,
  startDate: Date,
  endDate: Date
) {
  // Get therapist's weekly schedule
  const availabilities = await prisma.therapistAvailability.findMany({
    where: {
      therapistId,
      isActive: true,
    },
  });

  if (availabilities.length === 0) {
    return [];
  }

  // Get already booked sessions
  const bookedSessions = await prisma.session.findMany({
    where: {
      therapistId,
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ['SCHEDULED', 'IN_PROGRESS'],
      },
    },
  });

  // Generate available slots for each day
  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dayAvailability = availabilities.find((a) => a.dayOfWeek === dayOfWeek);

    if (dayAvailability) {
      const slots = generateTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        dayAvailability.slotDuration,
        bookedSessions,
        currentDate
      );

      result.push({
        date: currentDate.toISOString().split('T')[0],
        slots,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  bookedSessions: any[],
  date: Date
) {
  const slots: any[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMin);

  const endTimeDate = new Date(date);
  endTimeDate.setHours(endHour, endMin);

  while (currentTime < endTimeDate) {
    const slotTime = currentTime.toISOString();
    const isBooked = bookedSessions.some((session) => {
      const sessionTime = new Date(session.scheduledAt);
      return Math.abs(sessionTime.getTime() - currentTime.getTime()) < 60 * 60 * 1000;
    });

    slots.push({
      time: slotTime,
      available: !isBooked,
    });

    currentTime = new Date(currentTime.getTime() + slotDuration * 60 * 1000);
  }

  return slots;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] Helper function added
- [ ] TypeScript passes
```

---

#### P1.2.6 — Create Therapy Service (createSession)
**Time:** 20 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add createSession function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
interface CreateSessionInput {
  userId: string;
  therapistId: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
}

export async function createSession(input: CreateSessionInput) {
  const { userId, therapistId, scheduledAt, duration, notes } = input;

  // Validate scheduledAt is in future
  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    throw AppError.badRequest('Session must be scheduled in the future');
  }

  // Validate therapist exists and is available
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
  });

  if (!therapist || !therapist.isAvailable) {
    throw AppError.badRequest('Therapist not available');
  }

  // Check for conflicts
  const conflict = await prisma.session.findFirst({
    where: {
      therapistId,
      scheduledAt: {
        gte: new Date(scheduledAt),
        lt: new Date(new Date(scheduledAt).getTime() + duration * 60 * 1000),
      },
      status: {
        in: ['SCHEDULED', 'IN_PROGRESS'],
      },
    },
  });

  if (conflict) {
    throw AppError.conflict('Time slot already booked');
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      userId,
      therapistId,
      scheduledAt: scheduledDate,
      duration,
      status: 'SCHEDULED',
      notes,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      therapist: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return session;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.7 — Create Therapy Service (listSessions)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add listSessions function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
interface ListSessionsOptions {
  userId?: string;
  therapistId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function listSessions(options: ListSessionsOptions) {
  const { userId, therapistId, status, page = 1, limit = 10 } = options;

  const where: any = {};

  if (userId) where.userId = userId;
  if (therapistId) where.therapistId = therapistId;
  if (status) where.status = status;

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        therapist: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        scheduledAt: 'desc',
      },
    }),
    prisma.session.count({ where }),
  ]);

  return {
    sessions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.8 — Create Therapy Service (getSessionById)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add getSessionById function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function getSessionById(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      therapist: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw AppError.notFound('Session not found');
  }

  // Check authorization
  if (session.userId !== userId && session.therapistId !== userId) {
    throw AppError.forbidden('You do not have access to this session');
  }

  return session;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.9 — Create Therapy Service (updateSession)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add updateSession function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
interface UpdateSessionInput {
  notes?: string;
  userRating?: number;
  userFeedback?: string;
}

export async function updateSession(
  sessionId: string,
  updates: UpdateSessionInput,
  userId: string
) {
  const session = await getSessionById(sessionId, userId);

  if (session.status === 'CANCELLED' || session.status === 'COMPLETED') {
    throw AppError.badRequest('Cannot update completed or cancelled session');
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: updates,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      therapist: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return updated;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.10 — Create Therapy Service (cancelSession)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add cancelSession function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function cancelSession(
  sessionId: string,
  userId: string,
  reason: string
) {
  const session = await getSessionById(sessionId, userId);

  // Only client can cancel
  if (session.userId !== userId) {
    throw AppError.forbidden('Only the client can cancel the session');
  }

  // Check if in future
  if (session.scheduledAt <= new Date()) {
    throw AppError.badRequest('Cannot cancel past sessions');
  }

  const cancelled = await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'CANCELLED',
      cancelReason: reason,
      cancelledBy: userId,
      cancelledAt: new Date(),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      therapist: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return cancelled;
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.11 — Create Therapy Service (getTherapistDashboard)
**Time:** 20 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add getTherapistDashboard function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function getTherapistDashboard(therapistId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todaySessions, totalSessions, earnings, upcomingSessions] =
    await Promise.all([
      prisma.session.count({
        where: {
          therapistId,
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
          status: 'SCHEDULED',
        },
      }),
      prisma.session.count({
        where: {
          therapistId,
          status: 'COMPLETED',
        },
      }),
      prisma.session.aggregate({
        where: {
          therapistId,
          status: 'COMPLETED',
        },
        _sum: {
          // Would need payment relation for actual earnings
        },
      }),
      prisma.session.findMany({
        where: {
          therapistId,
          scheduledAt: {
            gte: new Date(),
          },
          status: 'SCHEDULED',
        },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      }),
    ]);

  return {
    todaySessions,
    totalSessions,
    totalEarnings: earnings._sum.duration || 0, // Placeholder
    upcomingSessions,
  };
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.12 — Create Therapy Service (getTherapistClients)
**Time:** 15 minutes
**Files:** `server/src/services/therapy.service.ts` (EDIT)

**Prompt:**
```
TASK: Add getTherapistClients function

EDIT: server/src/services/therapy.service.ts

ADD:
```typescript
export async function getTherapistClients(
  therapistId: string,
  page: number = 1,
  limit: number = 10
) {
  // Get distinct users who have sessions with this therapist
  const sessions = await prisma.session.findMany({
    where: { therapistId },
    select: {
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      scheduledAt: true,
    },
    orderBy: {
      scheduledAt: 'desc',
    },
  });

  // Group by user and get latest session
  const clientMap = new Map();
  sessions.forEach((session) => {
    if (!clientMap.has(session.userId)) {
      clientMap.set(session.userId, {
        ...session.user,
        sessionCount: 0,
        lastSessionDate: session.scheduledAt,
      });
    }
    clientMap.get(session.userId).sessionCount++;
  });

  const clients = Array.from(clientMap.values());
  const total = clients.length;

  // Paginate
  const paginatedClients = clients.slice((page - 1) * limit, page * limit);

  return {
    clients: paginatedClients,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.2.13 — Create Therapy Validator
**Time:** 20 minutes
**Files:** `server/src/validators/therapy.validator.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create Zod validation schemas for therapy endpoints

CREATE: server/src/validators/therapy.validator.ts

CODE:
```typescript
import { z } from 'zod';

export const createSessionSchema = z.object({
  therapistId: z.string().uuid('Invalid therapist ID'),
  scheduledAt: z
    .string()
    .datetime()
    .refine((date) => new Date(date) > new Date(), {
      message: 'Session must be scheduled in the future',
    }),
  duration: z
    .number()
    .min(30, 'Minimum session duration is 30 minutes')
    .max(120, 'Maximum session duration is 120 minutes'),
  notes: z.string().optional(),
});

export const updateSessionSchema = z.object({
  notes: z.string().optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
});

export const cancelSessionSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason for cancellation'),
});

export const listSessionsSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const therapistFilterSchema = z.object({
  specialization: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  approach: z.array(z.string()).optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const availabilityQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] File created
- [ ] All schemas defined
- [ ] TypeScript passes
```

---

#### P1.2.14 — Update Therapy Controller (Wire All Endpoints)
**Time:** 45 minutes
**Files:** `server/src/controllers/therapy.controller.ts` (REPLACE ENTIRE FILE)

**Prompt:**
```
TASK: Replace entire therapy controller with real implementation

EDIT: server/src/controllers/therapy.controller.ts

DELETE everything and REPLACE with:
```typescript
import { Request, Response, NextFunction } from 'express';
import * as therapyService from '../services/therapy.service.js';
import {
  createSessionSchema,
  updateSessionSchema,
  cancelSessionSchema,
  listSessionsSchema,
  therapistFilterSchema,
  availabilityQuerySchema,
} from '../validators/therapy.validator.js';

export async function listTherapists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = therapistFilterSchema.parse(req.query);
    const result = await therapyService.listTherapists(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTherapist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const therapist = await therapyService.getTherapistById(id, userId);
    res.json(therapist);
  } catch (error) {
    next(error);
  }
}

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { startDate, endDate } = availabilityQuerySchema.parse(req.query);
    const availability = await therapyService.getTherapistAvailability(
      id,
      new Date(startDate),
      new Date(endDate)
    );
    res.json(availability);
  } catch (error) {
    next(error);
  }
}

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = createSessionSchema.parse(req.body);
    const userId = (req as any).user!.id;
    const session = await therapyService.createSession({
      ...input,
      userId,
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
}

export async function listSessions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = listSessionsSchema.parse(req.query);
    const userId = (req as any).user?.id;
    const result = await therapyService.listSessions({
      ...filters,
      userId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.id;
    const session = await therapyService.getSessionById(id, userId);
    res.json(session);
  } catch (error) {
    next(error);
  }
}

export async function updateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updates = updateSessionSchema.parse(req.body);
    const userId = (req as any).user!.id;
    const session = await therapyService.updateSession(id, updates, userId);
    res.json(session);
  } catch (error) {
    next(error);
  }
}

export async function cancelSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { reason } = cancelSessionSchema.parse(req.body);
    const userId = (req as any).user!.id;
    const session = await therapyService.cancelSession(id, userId, reason);
    res.json(session);
  } catch (error) {
    next(error);
  }
}

export async function getTherapistDashboard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const therapistId = (req as any).user!.id;
    const dashboard = await therapyService.getTherapistDashboard(therapistId);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
}

export async function getTherapistClients(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const therapistId = (req as any).user!.id;
    const { page = '1', limit = '10' } = req.query;
    const result = await therapyService.getTherapistClients(
      therapistId,
      Number(page),
      Number(limit)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] All 10 controller functions implemented
- [ ] All use therapyService
- [ ] All use validators
- [ ] TypeScript passes
```

---

#### P1.2.15 — Add Auth to Therapy Routes
**Time:** 20 minutes
**Files:** `server/src/routes/therapy.ts` (EDIT)

**Prompt:**
```
TASK: Add authentication middleware to therapy routes

EDIT: server/src/routes/therapy.ts

ADD AT TOP:
```typescript
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
```

FIND router definition and ADD middleware:
```typescript
// Public routes (no auth)
router.get('/therapists', therapyController.listTherapists);
router.get('/therapists/:id', therapyController.getTherapist);
router.get('/therapists/:id/availability', therapyController.getAvailability);

// Protected routes (require auth)
router.use(requireAuth);

router.post('/sessions', therapyController.createSession);
router.get('/sessions', therapyController.listSessions);
router.get('/sessions/:id', therapyController.getSession);
router.put('/sessions/:id', therapyController.updateSession);
router.post('/sessions/:id/cancel', therapyController.cancelSession);

// Therapist-only routes
router.use('/therapist', requireRole(['THERAPIST']));

router.get('/therapist/dashboard', therapyController.getTherapistDashboard);
router.get('/therapist/clients', therapyController.getTherapistClients);
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] requireAuth added
- [ ] requireRole added for therapist routes
- [ ] Public routes remain public
- [ ] TypeScript passes
```

---

#### P1.2.16 — Create Frontend useSessions Hook
**Time:** 30 minutes
**Files:** `src/hooks/useSessions.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create React hook for therapy sessions

CREATE: src/hooks/useSessions.ts

CODE:
```typescript
import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

interface Session {
  id: string;
  userId: string;
  therapistId: string;
  scheduledAt: string;
  duration: number;
  status: string;
  user: any;
  therapist: any;
}

export function useSessions(status?: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const url = status
          ? `${API_URL}/therapy/sessions?status=${status}`
          : `${API_URL}/therapy/sessions`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [status]);

  return { sessions, loading, error };
}

export function useCreateSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (data: {
    therapistId: string;
    scheduledAt: string;
    duration: number;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/therapy/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create session');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSession, loading, error };
}

export function useCancelSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelSession = async (sessionId: string, reason: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/therapy/sessions/${sessionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to cancel session');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cancelSession, loading, error };
}

export function useTherapists(filters?: any) {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const res = await fetch(`${API_URL}/therapy/therapists?${params}`);

        if (!res.ok) {
          throw new Error('Failed to fetch therapists');
        }

        const data = await res.json();
        setTherapists(data.therapists || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [JSON.stringify(filters)]);

  return { therapists, loading, error };
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] All hooks created
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

#### P1.2.17 — Update SessionsPage (Remove Mock Data)
**Time:** 20 minutes
**Files:** `src/pages/dashboard/SessionsPage.tsx` (EDIT)

**Prompt:**
```
TASK: Remove ALL mock data from SessionsPage

EDIT: src/pages/dashboard/SessionsPage.tsx

DELETE these arrays completely:
- upcomingSessions (around line 69)
- therapists (around line 106)
- pastSessions (around line 169)
- Any other hardcoded arrays

REPLACE imports with:
```typescript
import { useSessions, useTherapists } from '../../hooks/useSessions';
```

In component, REPLACE:
```typescript
const { sessions: upcomingSessions, loading: loadingUpcoming } = useSessions('SCHEDULED');
const { therapists, loading: loadingTherapists } = useTherapists();
const { sessions: pastSessions } = useSessions('COMPLETED');
```

REMOVE all pravatar.cc references

DONE WHEN:
- [ ] All mock arrays deleted
- [ ] Uses real hooks
- [ ] No pravatar.cc
- [ ] TypeScript passes
```

---

#### P1.2.18 — Update SessionsPage (Add Loading States)
**Time:** 15 minutes
**Files:** `src/pages/dashboard/SessionsPage.tsx` (EDIT)

**Prompt:**
```
TASK: Add loading skeletons to SessionsPage

EDIT: src/pages/dashboard/SessionsPage.tsx

ADD loading states:
```typescript
if (loadingUpcoming || loadingTherapists) {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
      ))}
    </div>
  );
}
```

DONE WHEN:
- [ ] Loading skeletons added
- [ ] Shows while fetching
- [ ] TypeScript passes
```

---

#### P1.2.19 — Update SessionsPage (Add Empty States)
**Time:** 15 minutes
**Files:** `src/pages/dashboard/SessionsPage.tsx` (EDIT)

**Prompt:**
```
TASK: Add empty states when no sessions

EDIT: src/pages/dashboard/SessionsPage.tsx

ADD:
```typescript
if (!loadingUpcoming && upcomingSessions.length === 0) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        No upcoming sessions
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Book your first therapy session to get started
      </p>
      <Link
        to="/therapy/browse"
        className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg"
      >
        Browse Therapists
      </Link>
    </div>
  );
}
```

DONE WHEN:
- [ ] Empty state added
- [ ] Shows CTA to browse therapists
- [ ] TypeScript passes
```

---

#### P1.2.20 — Manual Testing
**Time:** 30 minutes
**Files:** NONE (Manual Testing Only)

**Prompt:**
```
TASK: Manually test entire therapy booking flow

TEST STEPS:

1. Backend API Test (use Thunder Client/Postman):
   GET /api/v1/therapy/therapists
   - Should return array of therapists
   
   GET /api/v1/therapy/therapists/:id/availability
   - Should return available slots

2. Browser Test:
   - Login as user@test.com (mock auth OK)
   - Navigate to /dashboard/sessions
   - Should see real therapists (not pravatar.cc)
   - Click "Book Session"
   - Select therapist, date, time
   - Submit
   - Should see in "Upcoming" tab
   
3. Cancel Test:
   - Click "Cancel" on upcoming session
   - Enter reason
   - Should move to "Past" tab with cancelled status

DONE WHEN:
- [ ] API test: List therapists works
- [ ] API test: Get availability works
- [ ] API test: Create session works
- [ ] Browser: Can see therapists
- [ ] Browser: Can book session
- [ ] Browser: Can cancel session
- [ ] No 501 errors anywhere
```

---

## PROGRESS TRACKING

Update after EACH subtask:

```
COMPLETED SUBTASKS (P1.1 - Payments):
- [ ] P1.1.1: Install Razorpay SDK
- [ ] P1.1.2: Add Env Variables
- [ ] P1.1.3: Payment Service (createOrder)
- [ ] P1.1.4: Payment Service (verifyPayment)
- [ ] P1.1.5: Payment Service (handleWebhook)
- [ ] P1.1.6: Payment Controller (Create Order)
- [ ] P1.1.7: Payment Controller (Verify)
- [ ] P1.1.8: Payment Controller (Webhook)
- [ ] P1.1.9: Add Rate Limiting
- [ ] P1.1.10: Frontend Hook

COMPLETED SUBTASKS (P1.2 - Therapy):
- [ ] P1.2.1: Read Schema
- [ ] P1.2.2: Study Service Pattern
- [ ] P1.2.3: Therapy Service (listTherapists)
- [ ] P1.2.4: Therapy Service (getTherapistById)
- [ ] P1.2.5: Therapy Service (getAvailability)
- [ ] P1.2.6: Therapy Service (createSession)
- [ ] P1.2.7: Therapy Service (listSessions)
- [ ] P1.2.8: Therapy Service (getSessionById)
- [ ] P1.2.9: Therapy Service (updateSession)
- [ ] P1.2.10: Therapy Service (cancelSession)
- [ ] P1.2.11: Therapy Service (getTherapistDashboard)
- [ ] P1.2.12: Therapy Service (getTherapistClients)
- [ ] P1.2.13: Therapy Validator
- [ ] P1.2.14: Therapy Controller
- [ ] P1.2.15: Add Auth to Routes
- [ ] P1.2.16: Frontend useSessions Hook
- [ ] P1.2.17: Remove Mock Data
- [ ] P1.2.18: Add Loading States
- [ ] P1.2.19: Add Empty States
- [ ] P1.2.20: Manual Testing

CURRENT SUBTASK: P1.2.1
NEXT SUBTASK: P1.2.2
```

---

---

### P1.3: Add Email Service (Resend)

**Overall Goal:** Send welcome emails, password resets, session reminders
**Current Status:** 0/100 — No email service exists
**Final Score Target:** 0/100 → 75/100

---

#### P1.3.1 — Install Resend SDK
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Install Resend email SDK

COMMAND:
cd server
npm install resend

VERIFY:
cd server
npm list resend

DONE WHEN:
- [ ] Resend installed
- [ ] No errors
```

---

#### P1.3.2 — Add Email Env Variables
**Time:** 5 minutes
**Files:** `server/.env.example`

**Prompt:**
```
TASK: Add Resend environment variables

EDIT: server/.env.example

ADD:
```
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@soulyatri.com
EMAIL_FROM_NAME=Soul Yatri
```

DONE WHEN:
- [ ] All 3 variables added
- [ ] Comments explain usage
```

---

#### P1.3.3 — Create Email Service (sendWelcomeEmail)
**Time:** 20 minutes
**Files:** `server/src/services/email.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create email service with sendWelcomeEmail function

CREATE: server/src/services/email.service.ts

CODE:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Soul Yatri <noreply@soulyatri.com>',
      to: email,
      subject: 'Welcome to Soul Yatri! 🧘',
      html: `
        <h1>Welcome to Soul Yatri, ${name}!</h1>
        <p>Start your wellness journey today.</p>
        <a href="https://soulyatri.com/dashboard">Go to Dashboard</a>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] File created
- [ ] sendWelcomeEmail works
- [ ] TypeScript passes
```

---

#### P1.3.4 — Create Email Service (sendPasswordReset)
**Time:** 15 minutes
**Files:** `server/src/services/email.service.ts` (EDIT)

**Prompt:**
```
TASK: Add sendPasswordReset function

EDIT: server/src/services/email.service.ts

ADD:
```typescript
export async function sendPasswordReset(email: string, token: string, name: string) {
  const resetUrl = `https://soulyatri.com/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Soul Yatri <noreply@soulyatri.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.3.5 — Create Email Service (sendSessionReminder)
**Time:** 15 minutes
**Files:** `server/src/services/email.service.ts` (EDIT)

**Prompt:**
```
TASK: Add sendSessionReminder function

EDIT: server/src/services/email.service.ts

ADD:
```typescript
export async function sendSessionReminder(
  email: string,
  session: {
    therapistName: string;
    scheduledAt: string;
    duration: number;
    videoUrl?: string;
  }
) {
  const sessionDate = new Date(session.scheduledAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Soul Yatri <noreply@soulyatri.com>',
      to: email,
      subject: 'Reminder: Upcoming Therapy Session',
      html: `
        <h1>Session Reminder</h1>
        <p>Your session with ${session.therapistName} is scheduled for:</p>
        <p><strong>${sessionDate}</strong></p>
        <p>Duration: ${session.duration} minutes</p>
        ${session.videoUrl ? `<a href="${session.videoUrl}">Join Video Call</a>` : ''}
      `,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send session reminder:', error);
    throw error;
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.3.6 — Integrate Email with Auth Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/auth.controller.ts` (EDIT)

**Prompt:**
```
TASK: Send welcome email after user registration

EDIT: server/src/controllers/auth.controller.ts

FIND: register function, after user creation

ADD:
```typescript
import { sendWelcomeEmail } from '../services/email.service.js';

// After successful registration:
await sendWelcomeEmail(user.email, user.name);
```

DONE WHEN:
- [ ] Welcome email sends on signup
- [ ] TypeScript passes
- [ ] Manual test: signup triggers email
```

---

#### P1.3.7 — Add Session Reminder to Therapy Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/therapy.controller.ts` (EDIT)

**Prompt:**
```
TASK: Send session reminder after booking

EDIT: server/src/controllers/therapy.controller.ts

FIND: createSession function, after session creation

ADD:
```typescript
import { sendSessionReminder } from '../services/email.service.js';

// After session creation:
const therapist = await prisma.therapistProfile.findUnique({
  where: { id: therapistId },
  include: { user: true },
});

await sendSessionReminder(user.email, {
  therapistName: therapist.user.name,
  scheduledAt: session.scheduledAt.toISOString(),
  duration: session.duration,
  videoUrl: session.roomUrl,
});
```

DONE WHEN:
- [ ] Session reminder sends on booking
- [ ] TypeScript passes
```

---

#### P1.3.8 — Test Email Delivery
**Time:** 15 minutes
**Files:** NONE (Manual Testing)

**Prompt:**
```
TASK: Test email delivery

TEST:
1. Sign up with real email
2. Check inbox for welcome email
3. Book a therapy session
4. Check inbox for session reminder

DONE WHEN:
- [ ] Welcome email received
- [ ] Session reminder received
- [ ] No errors in logs
```

---

### P1.4: Add Video Integration (100ms for India)

**Overall Goal:** Enable video calls for therapy sessions
**Current Status:** 0/100 — No video integration
**Final Score Target:** 0/100 → 80/100

---

#### P1.4.1 — Choose Video Provider
**Time:** 10 minutes
**Files:** NONE (Research Only)

**Prompt:**
```
TASK: Research and choose video provider for India

OPTIONS:
1. 100ms.live (Recommended for India)
   - Pricing: Free tier 1000 mins/month
   - India-based, low latency
   - Official: https://100ms.live/pricing

2. Daily.co
   - Pricing: Free tier 500 mins/month
   - Global, good docs
   - Official: https://www.daily.co/pricing

3. Agora
   - Pricing: Free tier 10000 mins/month
   - Cheapest at scale
   - Official: https://www.agora.io/en/pricing/

DECISION: 100ms.live (best for India)

DONE WHEN:
- [ ] Provider chosen
- [ ] Account created
- [ ] API keys obtained
```

---

#### P1.4.2 — Install 100ms SDK
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Install 100ms server SDK

COMMAND:
cd server
npm install @100mslive/server-sdk

VERIFY:
cd server
npm list @100mslive/server-sdk

DONE WHEN:
- [ ] SDK installed
- [ ] No errors
```

---

#### P1.4.3 — Add Video Env Variables
**Time:** 5 minutes
**Files:** `server/.env.example`

**Prompt:**
```
TASK: Add 100ms environment variables

EDIT: server/.env.example

ADD:
```
# 100ms Video
VIDEO_APP_ID=your_app_id
VIDEO_API_KEY=your_api_key
VIDEO_API_SECRET=your_api_secret
```

DONE WHEN:
- [ ] All 3 variables added
```

---

#### P1.4.4 — Create Video Service (createRoom)
**Time:** 20 minutes
**Files:** `server/src/services/video.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create video service with createRoom function

CREATE: server/src/services/video.service.ts

CODE:
```typescript
import { HMSManagement } from '@100mslive/server-sdk';

const hmsManagement = new HMSManagement({
  app_id: process.env.VIDEO_APP_ID,
  api_key: process.env.VIDEO_API_KEY,
  api_secret: process.env.VIDEO_API_SECRET,
});

export async function createRoom(sessionId: string, duration: number) {
  const roomName = `session_${sessionId}`;

  try {
    const room = await hmsManagement.createRoom({
      name: roomName,
      description: `Therapy session ${sessionId}`,
      max_size: 10,
      duration: duration * 60, // Convert to seconds
    });

    return {
      roomName,
      roomId: room.id,
      joinUrl: room.join_link,
    };
  } catch (error: any) {
    throw new Error(`Failed to create room: ${error.message}`);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] File created
- [ ] createRoom works
- [ ] TypeScript passes
```

---

#### P1.4.5 — Create Video Service (generateToken)
**Time:** 15 minutes
**Files:** `server/src/services/video.service.ts` (EDIT)

**Prompt:**
```
TASK: Add generateToken function

EDIT: server/src/services/video.service.ts

ADD:
```typescript
export async function generateToken(
  roomName: string,
  userId: string,
  role: 'client' | 'therapist'
) {
  try {
    const token = await hmsManagement.getManagementToken();

    const peerId = `peer_${userId}_${Date.now()}`;

    const response = await fetch(
      `https://api.100ms.live/v2/management/rooms/${roomName}/peers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          peer_id: peerId,
          role: role === 'therapist' ? 'host' : 'guest',
          user_id: userId,
        }),
      }
    );

    const data = await response.json();
    return data.token;
  } catch (error: any) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.4.6 — Create Video Service (deleteRoom)
**Time:** 10 minutes
**Files:** `server/src/services/video.service.ts` (EDIT)

**Prompt:**
```
TASK: Add deleteRoom function

EDIT: server/src/services/video.service.ts

ADD:
```typescript
export async function deleteRoom(roomName: string) {
  try {
    await hmsManagement.deleteRoom(roomName);
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to delete room: ${error.message}`);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Function added
- [ ] TypeScript passes
```

---

#### P1.4.7 — Integrate Video with Therapy Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/therapy.controller.ts` (EDIT)

**Prompt:**
```
TASK: Create video room when session is booked

EDIT: server/src/controllers/therapy.controller.ts

FIND: createSession function, after session creation

ADD:
```typescript
import { createRoom, generateToken } from '../services/video.service.js';

// After session creation:
const videoRoom = await createRoom(session.id, session.duration);

await prisma.session.update({
  where: { id: session.id },
  data: {
    roomName: videoRoom.roomName,
    roomUrl: videoRoom.joinUrl,
  },
});
```

DONE WHEN:
- [ ] Video room created on booking
- [ ] Room URL saved to session
- [ ] TypeScript passes
```

---

#### P1.4.8 — Create Frontend Video Component
**Time:** 45 minutes
**Files:** `src/components/video/VideoRoom.tsx` (CREATE NEW)

**Prompt:**
```
TASK: Create video call component

CREATE: src/components/video/VideoRoom.tsx

CODE:
```typescript
import { useEffect, useState } from 'react';
import { HmsSDK } from '@100mslive/react-sdk';
import '@100mslive/react-sdk/style.css';

interface VideoRoomProps {
  roomName: string;
  userId: string;
  role: 'client' | 'therapist';
}

export function VideoRoom({ roomName, userId, role }: VideoRoomProps) {
  const [hmsSDK] = useState(new HmsSDK());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const joinRoom = async () => {
      // Get token from backend
      const token = await fetch(`/api/v1/video/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ roomName, userId, role }),
        method: 'POST',
      }).then((r) => r.json());

      await hmsSDK.join({
        userName: userId,
        initEndpoint: 'https://prod-in2.100ms.live/hmsapi',
        authToken: token.token,
      });

      setIsConnected(true);
    };

    joinRoom();
  }, [roomName, userId, role, hmsSDK]);

  return (
    <div className="video-room">
      <div id="local-peer" />
      <div id="remote-peers" />
      <div className="controls">
        <button onClick={() => hmsSDK.localPeer.mute()}>Mute</button>
        <button onClick={() => hmsSDK.localPeer.unmute()}>Unmute</button>
        <button onClick={() => hmsSDK.leave()}>Leave</button>
      </div>
    </div>
  );
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] Component created
- [ ] Joins room
- [ ] Video/audio controls work
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

#### P1.4.9 — Add Video Endpoint
**Time:** 15 minutes
**Files:** `server/src/routes/video.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create video token endpoint

CREATE: server/src/routes/video.ts

CODE:
```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { generateToken } from '../services/video.service.js';

const router = Router();
router.use(requireAuth);

router.post('/token', async (req, res) => {
  try {
    const { roomName, userId, role } = req.body;
    const token = await generateToken(roomName, userId, role);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Route created
- [ ] Token endpoint works
- [ ] TypeScript passes
```

---

#### P1.4.10 — Test Video Call
**Time:** 30 minutes
**Files:** NONE (Manual Testing)

**Prompt:**
```
TASK: Test complete video call flow

TEST:
1. Book therapy session
2. Click "Join Video Call"
3. Video should open
4. Test audio/video
5. Test mute/unmute
6. Test leave

DONE WHEN:
- [ ] Video call connects
- [ ] Audio works
- [ ] Video works
- [ ] Controls functional
```

---

### P2.1: Add Unit Tests for Backend

**Overall Goal:** 80%+ test coverage for backend controllers
**Current Status:** 0/100 — No unit tests
**Final Score Target:** 0/100 → 80/100

---

#### P2.1.1 — Install Vitest
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Install Vitest test framework

COMMAND:
cd server
npm install -D vitest @types/node

DONE WHEN:
- [ ] Vitest installed
- [ ] No errors
```

---

#### P2.1.2 — Create Vitest Config
**Time:** 10 minutes
**Files:** `server/vitest.config.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create Vitest configuration

CREATE: server/vitest.config.ts

CODE:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

DONE WHEN:
- [ ] Config created
- [ ] TypeScript passes
```

---

#### P2.1.3 — Add Test Script to package.json
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Add test script to package.json

EDIT: server/package.json

ADD to scripts:
```json
"test": "vitest",
"test:coverage": "vitest --coverage"
```

DONE WHEN:
- [ ] Scripts added
- [ ] npm test works
```

---

#### P2.1.4 — Create Auth Controller Tests
**Time:** 45 minutes
**Files:** `server/src/controllers/auth.controller.test.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create unit tests for auth controller

CREATE: server/src/controllers/auth.controller.test.ts

CODE:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authController } from './auth.controller.js';
import { prisma } from '../lib/prisma.js';

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should create user successfully', async () => {
      // Test implementation
    });

    it('should reject duplicate email', async () => {
      // Test implementation
    });

    it('should reject weak password', async () => {
      // Test implementation
    });
  });

  describe('login', () => {
    it('should return tokens on valid login', async () => {
      // Test implementation
    });

    it('should reject invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

VERIFY:
cd server && npm test

DONE WHEN:
- [ ] All auth tests pass
- [ ] Coverage > 80%
```

---

#### P2.1.5 — Create Health-Tools Controller Tests
**Time:** 45 minutes
**Files:** `server/src/controllers/health-tools.controller.test.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create unit tests for health-tools controller

CREATE: server/src/controllers/health-tools.controller.test.ts

COVER:
- createMoodEntry
- listMoodEntries
- createJournalEntry
- listJournalEntries
- createMeditation
- listMeditations

DONE WHEN:
- [ ] All tests pass
- [ ] Coverage > 80%
```

---

#### P2.1.6 — Create Therapy Controller Tests
**Time:** 45 minutes
**Files:** `server/src/controllers/therapy.controller.test.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create unit tests for therapy controller

CREATE: server/src/controllers/therapy.controller.test.ts

COVER:
- listTherapists
- createSession
- listSessions
- cancelSession
- getTherapistDashboard

DONE WHEN:
- [ ] All tests pass
- [ ] Coverage > 80%
```

---

#### P2.1.7 — Create Payment Controller Tests
**Time:** 45 minutes
**Files:** `server/src/controllers/payments.controller.test.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create unit tests for payment controller

CREATE: server/src/controllers/payments.controller.test.ts

COVER:
- createOrder
- verifyPayment
- handleWebhook

DONE WHEN:
- [ ] All tests pass
- [ ] Coverage > 80%
```

---

#### P2.1.8 — Run Test Coverage Report
**Time:** 10 minutes
**Files:** NONE (Testing Only)

**Prompt:**
```
TASK: Run test coverage and verify 80% threshold

COMMAND:
cd server
npm run test:coverage

VERIFY:
- Check coverage report
- All controllers > 80%
- No critical gaps

DONE WHEN:
- [ ] Coverage report shows > 80%
- [ ] All tests pass
```

---

### P2.2: Add Structured Data for SEO

**Overall Goal:** Rank #1 on Google for mental health keywords
**Current Status:** 25/100 — Basic meta tags only
**Final Score Target:** 25/100 → 85/100

---

#### P2.2.1 — Create SEO Helper Functions
**Time:** 30 minutes
**Files:** `src/lib/seo.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create SEO schema generators

CREATE: src/lib/seo.ts

CODE:
```typescript
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Soul Yatri',
    url: 'https://soulyatri.com',
    logo: 'https://soulyatri.com/logo.png',
    description: 'India\'s trusted mental health and wellness platform',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Soul Yatri',
    url: 'https://soulyatri.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://soulyatri.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
  };
}
```

VERIFY:
npm run type-check

DONE WHEN:
- [ ] All schema generators created
- [ ] TypeScript passes
```

---

#### P2.2.2 — Create StructuredData Component
**Time:** 15 minutes
**Files:** `src/components/seo/StructuredData.tsx` (CREATE NEW)

**Prompt:**
```
TASK: Create reusable structured data component

CREATE: src/components/seo/StructuredData.tsx

CODE:
```typescript
export function StructuredData({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] Component created
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

#### P2.2.3 — Add Schema to LandingPage
**Time:** 15 minutes
**Files:** `src/pages/LandingPage.tsx` (EDIT)

**Prompt:**
```
TASK: Add Organization + WebSite schema to landing page

EDIT: src/pages/LandingPage.tsx

ADD:
```typescript
import { StructuredData } from '../components/seo/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema } from '../lib/seo';

// In component:
<StructuredData schema={generateOrganizationSchema()} />
<StructuredData schema={generateWebSiteSchema()} />
```

DONE WHEN:
- [ ] Schema added
- [ ] TypeScript passes
```

---

#### P2.2.4 — Add Schema to AboutPage
**Time:** 15 minutes
**Files:** `src/pages/AboutPage.tsx` (EDIT)

**Prompt:**
```
TASK: Add Organization schema with team members

EDIT: src/pages/AboutPage.tsx

ADD schema with founders info

DONE WHEN:
- [ ] Schema added
- [ ] TypeScript passes
```

---

#### P2.2.5 — Add Schema to BlogsPage
**Time:** 15 minutes
**Files:** `src/pages/BlogsPage.tsx` (EDIT)

**Prompt:**
```
TASK: Add Article schema for each blog post

EDIT: src/pages/BlogsPage.tsx

ADD Article schema for each blog

DONE WHEN:
- [ ] Schema added
- [ ] TypeScript passes
```

---

#### P2.2.6 — Validate with Google Rich Results Test
**Time:** 15 minutes
**Files:** NONE (Manual Testing)

**Prompt:**
```
TASK: Validate structured data

TEST:
1. Go to https://search.google.com/test/rich-results
2. Enter soulyatri.com
3. Check for errors
4. Fix any issues

DONE WHEN:
- [ ] No errors in Rich Results Test
- [ ] All schemas valid
```

---

## PROGRESS TRACKING

Update after EACH subtask:

```
COMPLETED SUBTASKS:

P1.1 - Payments (10 subtasks):
- [ ] P1.1.1 to P1.1.10

P1.2 - Therapy Backend (20 subtasks):
- [ ] P1.2.1 to P1.2.20

P1.3 - Email Service (8 subtasks):
- [ ] P1.3.1 to P1.3.8

P1.4 - Video Integration (10 subtasks):
- [ ] P1.4.1 to P1.4.10

P2.1 - Unit Tests (8 subtasks):
- [ ] P2.1.1 to P2.1.8

P2.2 - SEO Structured Data (6 subtasks):
- [ ] P2.2.1 to P2.2.6

CURRENT SUBTASK: P1.2.1
NEXT SUBTASK: P1.2.2
```

---

**Total Subtasks in this document:** 62
**Features covered:** Payments, Therapy, Email, Video, Tests, SEO
**Last Updated:** March 7, 2026

---

## COMING NEXT (All Features Added Below):

- P2.3: AI Session Matching (~15 subtasks)
- P2.4: Reviews System (~12 subtasks)
- P3.1: AI Agentic Blog System (~25 subtasks) - ARMY OF AGENTS
- P3.2: Courses Platform (~12 subtasks)
- P3.3: Community/Social Feed (~15 subtasks)
- P3.4: Shop/E-commerce (~10 subtasks)
- P3.5: Events/Workshops (~8 subtasks)
- P3.6: Admin Dashboard (~20 subtasks)
- P3.7: Astrology System (~15 subtasks)
- P3.8: AI Chatbot/SoulBot (~10 subtasks)
- P3.9: Practitioner Dashboard (~12 subtasks)
- P4.1: Performance Optimization (~10 subtasks)
- P4.2: Accessibility WCAG 2.1 AA (~10 subtasks)
- P4.3: Analytics/Monitoring (~8 subtasks)

**Total estimated subtasks when complete:** ~200+

---

### P2.3: AI Session Matching (Therapist Recommendation Engine)

**Overall Goal:** Match users with perfect therapists using AI algorithm
**Current Status:** 0/100 — No matching logic
**Final Score Target:** 0/100 → 85/100

---

#### P2.3.1 — Create Matching Service
**Time:** 30 minutes
**Files:** `server/src/services/matching.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create AI matching service base

CREATE: server/src/services/matching.service.ts

CODE:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface MatchScore {
  therapistId: string;
  overallScore: number;
  preferenceScore: number;
  availabilityScore: number;
  specializationScore: number;
  personalityScore: number;
}

export async function matchTherapists(
  userId: string,
  limit: number = 5
): Promise<MatchScore[]> {
  // Get user profile and preferences
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!userProfile) {
    throw new Error('User profile not found');
  }

  // Get all available therapists
  const therapists = await prisma.therapistProfile.findMany({
    where: {
      isVerified: true,
      isAvailable: true,
    },
    include: {
      user: true,
    },
  });

  // Calculate match scores
  const scores: MatchScore[] = therapists.map((therapist) => {
    const preferenceScore = calculatePreferenceMatch(userProfile, therapist);
    const availabilityScore = calculateAvailabilityMatch(therapist);
    const specializationScore = calculateSpecializationMatch(userProfile, therapist);
    const personalityScore = calculatePersonalityMatch(userProfile, therapist);

    const overallScore =
      preferenceScore * 0.3 +
      availabilityScore * 0.2 +
      specializationScore * 0.3 +
      personalityScore * 0.2;

    return {
      therapistId: therapist.id,
      overallScore,
      preferenceScore,
      availabilityScore,
      specializationScore,
      personalityScore,
    };
  });

  // Sort by overall score and return top matches
  return scores
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}

function calculatePreferenceMatch(userProfile: any, therapist: any): number {
  let score = 0;
  const maxScore = 100;

  // Gender preference match
  if (userProfile.therapistGenderPref) {
    if (therapist.user.gender === userProfile.therapistGenderPref) {
      score += 40;
    }
  } else {
    score += 20; // No preference = partial score
  }

  // Language match
  if (userProfile.therapistLanguages?.length > 0) {
    const commonLanguages = therapist.languages.filter((lang: string) =>
      userProfile.therapistLanguages.includes(lang)
    );
    score += (commonLanguages.length / userProfile.therapistLanguages.length) * 40;
  }

  // Approach match
  if (userProfile.therapistApproach && therapist.approach === userProfile.therapistApproach) {
    score += 20;
  }

  return (score / maxScore) * 100;
}

function calculateAvailabilityMatch(therapist: any): number {
  // Check if therapist has availability in next 7 days
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Simplified: just check if they have any availability
  return therapist.availabilities?.length > 0 ? 100 : 0;
}

function calculateSpecializationMatch(userProfile: any, therapist: any): number {
  if (!userProfile.struggles?.length) return 50; // No struggles specified

  const commonSpecializations = therapist.specializations.filter((spec: string) =>
    userProfile.struggles.includes(spec)
  );

  return (commonSpecializations.length / userProfile.struggles.length) * 100;
}

function calculatePersonalityMatch(userProfile: any, therapist: any): number {
  // Future: Use AI to analyze therapist bio vs user personality
  // For now, return base score
  return 50;
}

export { calculatePreferenceMatch, calculateAvailabilityMatch, calculateSpecializationMatch, calculatePersonalityMatch };
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Service created
- [ ] All functions work
- [ ] TypeScript passes
```

---

#### P2.3.2 — Add Matching Endpoint to Therapy Controller
**Time:** 15 minutes
**Files:** `server/src/controllers/therapy.controller.ts` (EDIT)

**Prompt:**
```
TASK: Add therapist matching endpoint

EDIT: server/src/controllers/therapy.controller.ts

ADD:
```typescript
import { matchTherapists } from '../services/matching.service.js';

export async function getRecommendedTherapists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user!.id;
    const limit = parseInt(req.query.limit as string) || 5;

    const matches = await matchTherapists(userId, limit);

    // Get full therapist details
    const therapists = await Promise.all(
      matches.map(async (match) => {
        const therapist = await prisma.therapistProfile.findUnique({
          where: { id: match.therapistId },
          include: { user: true },
        });

        return {
          therapist,
          matchScores: match,
        };
      })
    );

    res.json({ matches: therapists });
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Endpoint added
- [ ] Returns matched therapists with scores
- [ ] TypeScript passes
```

---

#### P2.3.3 — Add Matching Route
**Time:** 10 minutes
**Files:** `server/src/routes/therapy.ts` (EDIT)

**Prompt:**
```
TASK: Add matching route

EDIT: server/src/routes/therapy.ts

ADD:
```typescript
router.get('/recommendations', requireAuth, therapyController.getRecommendedTherapists);
```

DONE WHEN:
- [ ] Route added
- [ ] Requires auth
- [ ] TypeScript passes
```

---

#### P2.3.4 — Create Frontend Matching Hook
**Time:** 20 minutes
**Files:** `src/hooks/useTherapistMatching.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create hook for therapist matching

CREATE: src/hooks/useTherapistMatching.ts

CODE:
```typescript
import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export function useTherapistMatching(limit: number = 5) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(
          `${API_URL}/therapy/therapists/recommendations?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch matches');

        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [limit]);

  return { matches, loading, error };
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] Hook created
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

#### P2.3.5 — Add Match Scores to UI
**Time:** 30 minutes
**Files:** `src/pages/dashboard/SessionsPage.tsx` (EDIT)

**Prompt:**
```
TASK: Display match scores in therapist cards

EDIT: src/pages/dashboard/SessionsPage.tsx

ADD:
```typescript
import { useTherapistMatching } from '../../hooks/useTherapistMatching';

// In component:
const { matches, loading } = useTherapistMatching();

// Display match percentage:
<div className="match-score">
  {match.matchScores.overallScore.toFixed(0)}% Match
</div>
```

DONE WHEN:
- [ ] Match scores displayed
- [ ] Shows percentage
- [ ] TypeScript passes
```

---

#### P2.3.6 to P2.3.15 — Improve Matching Algorithm

**Subtasks:**
- P2.3.6: Add astrology compatibility scoring
- P2.3.7: Add session feedback learning
- P2.3.8: Add collaborative filtering
- P2.3.9: Add A/B testing framework
- P2.3.10: Create matching analytics dashboard
- P2.3.11: Add therapist availability real-time check
- P2.3.12: Add price-based filtering
- P2.3.13: Add language preference weighting
- P2.3.14: Add specialization depth scoring
- P2.3.15: Add user behavior tracking

**DONE WHEN:**
- [ ] All improvements implemented
- [ ] Matching accuracy > 85%
- [ ] User satisfaction tracked

---

### P2.4: Verified Reviews System

**Overall Goal:** Allow users to rate and review therapists (verified sessions only)
**Current Status:** 0/100 — No review system
**Final Score Target:** 0/100 → 80/100

---

#### P2.4.1 — Add Review Model to Schema
**Time:** 10 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Review model to Prisma schema

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model Review {
  id              String   @id @default(uuid())
  sessionId       String   @unique
  session         Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  userId          String
  therapistId     String
  
  rating          Int      // 1-5
  comment         String?
  
  isVerified      Boolean  @default(true) // Only verified sessions can review
  isApproved      Boolean  @default(false) // Moderation
  
  therapistResponse String?
  respondedAt     DateTime?
  
  helpfulCount    Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([therapistId])
  @@index([userId])
  @@index([rating])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_review_model

DONE WHEN:
- [ ] Model added
- [ ] Migration created
- [ ] Prisma generate passes
```

---

#### P2.4.2 — Create Review Service
**Time:** 30 minutes
**Files:** `server/src/services/review.service.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create review service

CREATE: server/src/services/review.service.ts

FUNCTIONS:
- createReview(sessionId, userId, rating, comment)
- getTherapistReviews(therapistId, page, limit)
- updateReview(reviewId, updates)
- deleteReview(reviewId)
- markReviewHelpful(reviewId)
- respondToReview(reviewId, therapistResponse)
- getAverageRating(therapistId)

DONE WHEN:
- [ ] All functions implemented
- [ ] TypeScript passes
```

---

#### P2.4.3 — Create Review Controller
**Time:** 20 minutes
**Files:** `server/src/controllers/review.controller.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create review controller

CREATE: server/src/controllers/review.controller.ts

ENDPOINTS:
- POST /reviews - Create review
- GET /therapists/:id/reviews - Get therapist reviews
- PUT /reviews/:id - Update review
- DELETE /reviews/:id - Delete review
- POST /reviews/:id/helpful - Mark helpful
- POST /reviews/:id/respond - Therapist response

DONE WHEN:
- [ ] All endpoints implemented
- [ ] TypeScript passes
```

---

#### P2.4.4 to P2.4.12 — Complete Review System

**Subtasks:**
- P2.4.4: Add review routes with auth
- P2.4.5: Create frontend review form component
- P2.4.6: Add review list component
- P2.4.7: Add star rating component
- P2.4.8: Add review moderation (admin)
- P2.4.9: Add fake review detection
- P2.4.10: Add review analytics
- P2.4.11: Add email notifications for reviews
- P2.4.12: Add review schema for SEO

**DONE WHEN:**
- [ ] Full review system working
- [ ] Only verified sessions can review
- [ ] Moderation in place

---

### P3.1: AI Agentic Blog System (ARMY OF AGENTS)

**Overall Goal:** Automatically generate SEO-optimized blog posts using AI agents to rank #1 on Google
**Current Status:** 0/100 — No blog CMS
**Final Score Target:** 0/100 → 95/100

---

#### P3.1.1 — Create Blog Model
**Time:** 10 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Blog model to schema

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model BlogPost {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  excerpt         String
  content         String   // Markdown
  coverImage      String?
  
  authorId        String?
  author          User?    @relation(fields: [authorId], references: [id])
  
  // AI Generation metadata
  isAiGenerated   Boolean  @default(false)
  aiModel         String?  // e.g., "gpt-4", "claude-3"
  aiPrompt        String?  // Original prompt used
  
  // SEO
  metaTitle       String?
  metaDescription String?
  keywords        String[]
  
  // Status
  status          String   @default("draft") // draft, published, archived
  publishedAt     DateTime?
  
  // Analytics
  views           Int      @default(0)
  likes           Int      @default(0)
  shares          Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([status, publishedAt])
  @@index([slug])
  @@index([keywords])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_blog_post_model

DONE WHEN:
- [ ] Model added
- [ ] Migration created
```

---

#### P3.1.2 — Create AI Agent Orchestration System
**Time:** 45 minutes
**Files:** `server/src/agents/blog-generator/orchestrator.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create AI agent orchestrator for blog generation

CREATE: server/src/agents/blog-generator/orchestrator.ts

CODE:
```typescript
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BlogGenerationTask {
  topic: string;
  keywords: string[];
  targetWordCount: number;
  tone: string;
  audience: string;
}

interface AgentRole {
  name: string;
  systemPrompt: string;
  task: (input: any) => Promise<any>;
}

// Agent 1: Keyword Researcher
const keywordResearcher: AgentRole = {
  name: 'Keyword Researcher',
  systemPrompt: `You are an SEO keyword research expert.
  Analyze the topic and provide:
  1. Primary keyword (highest search volume)
  2. 5-10 secondary keywords (long-tail)
  3. Search intent (informational, commercial, transactional)
  4. Related topics to cover`,
  
  task: async (topic: string) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Topic: ${topic}` }
      ],
      response_format: { type: 'json_object' },
    });
    
    return JSON.parse(response.choices[0].message.content!);
  },
};

// Agent 2: Content Strategist
const contentStrategist: AgentRole = {
  name: 'Content Strategist',
  systemPrompt: `You are a content strategy expert.
  Create a detailed outline including:
  1. Compelling headline (H1)
  2. 5-7 main sections (H2)
  3. Subsections where needed (H3)
  4. Key points for each section
  5. Call-to-action at the end`,
  
  task: async (keywords: any) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Keywords: ${JSON.stringify(keywords)}` }
      ],
      response_format: { type: 'json_object' },
    });
    
    return JSON.parse(response.choices[0].message.content!);
  },
};

// Agent 3: SEO Writer
const seoWriter: AgentRole = {
  name: 'SEO Writer',
  systemPrompt: `You are a professional SEO content writer.
  Write a comprehensive blog post that:
  1. Uses primary keyword in first 100 words
  2. Naturally incorporates secondary keywords
  3. Has engaging introduction and conclusion
  4. Includes examples and data
  5. Is 1500-2500 words
  6. Uses markdown formatting`,
  
  task: async (outline: any) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Outline: ${JSON.stringify(outline)}` }
      ],
    });
    
    return response.choices[0].message.content!;
  },
};

// Agent 4: SEO Optimizer
const seoOptimizer: AgentRole = {
  name: 'SEO Optimizer',
  systemPrompt: `You are an SEO optimization expert.
  Optimize the content for:
  1. Meta title (50-60 chars)
  2. Meta description (150-160 chars)
  3. URL slug
  4. Internal linking suggestions
  5. Image alt text suggestions
  6. Readability score`,
  
  task: async (content: string) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Content: ${content.substring(0, 5000)}` }
      ],
      response_format: { type: 'json_object' },
    });
    
    return JSON.parse(response.choices[0].message.content!);
  },
};

// Agent 5: Editor/Proofreader
const editor: AgentRole = {
  name: 'Editor',
  systemPrompt: `You are a professional editor.
  Review and improve:
  1. Grammar and spelling
  2. Clarity and flow
  3. Tone consistency
  4. Fact-checking flags
  5. Plagiarism check (simulate)`,
  
  task: async (content: string) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Content: ${content}` }
      ],
    });
    
    return response.choices[0].message.content!;
  },
};

export async function generateBlogPost(task: BlogGenerationTask) {
  console.log('🚀 Starting AI Blog Generation...');
  
  // Step 1: Keyword Research
  console.log('📊 Agent 1: Keyword Research');
  const keywords = await keywordResearcher.task(task.topic);
  
  // Step 2: Content Strategy
  console.log('📝 Agent 2: Content Strategy');
  const outline = await contentStrategist.task(keywords);
  
  // Step 3: Write Content
  console.log('✍️ Agent 3: SEO Writing');
  const content = await seoWriter.task(outline);
  
  // Step 4: SEO Optimization
  console.log('🎯 Agent 4: SEO Optimization');
  const seoData = await seoOptimizer.task(content);
  
  // Step 5: Final Edit
  console.log('✅ Agent 5: Final Editing');
  const finalContent = await editor.task(content);
  
  return {
    title: outline.headline,
    content: finalContent,
    ...seoData,
    keywords: keywords.secondary,
    isAiGenerated: true,
    aiModel: 'gpt-4-turbo',
  };
}
```

VERIFY:
cd server && npm install openai
cd server && npm run type-check

DONE WHEN:
- [ ] All 5 agents defined
- [ ] Orchestration works
- [ ] TypeScript passes
```

---

#### P3.1.3 — Add OpenAI to Dependencies
**Time:** 5 minutes
**Files:** `server/package.json`

**Prompt:**
```
TASK: Install OpenAI SDK

COMMAND:
cd server
npm install openai

DONE WHEN:
- [ ] OpenAI installed
- [ ] Added to package.json
```

---

#### P3.1.4 — Add AI Env Variables
**Time:** 5 minutes
**Files:** `server/.env.example`

**Prompt:**
```
TASK: Add AI environment variables

EDIT: server/.env.example

ADD:
```
# AI Blog Generation
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=4096
```

DONE WHEN:
- [ ] All variables added
```

---

#### P3.1.5 — Create Blog Generation Endpoint
**Time:** 20 minutes
**Files:** `server/src/controllers/blog.controller.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create blog controller with AI generation

CREATE: server/src/controllers/blog.controller.ts

CODE:
```typescript
import { Request, Response, NextFunction } from 'express';
import { generateBlogPost } from '../agents/blog-generator/orchestrator.js';
import { prisma } from '../lib/prisma.js';

export async function generateBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, targetWordCount = 2000, tone = 'professional', audience = 'general' } = req.body;
    
    const blogData = await generateBlogPost({
      topic,
      keywords: [],
      targetWordCount,
      tone,
      audience,
    });
    
    // Save to database
    const blog = await prisma.blogPost.create({
      data: {
        title: blogData.title,
        slug: generateSlug(blogData.title),
        excerpt: blogData.metaDescription,
        content: blogData.content,
        metaTitle: blogData.metaTitle,
        metaDescription: blogData.metaDescription,
        keywords: blogData.keywords,
        isAiGenerated: true,
        aiModel: 'gpt-4-turbo',
        aiPrompt: topic,
        status: 'draft',
      },
    });
    
    res.json({
      success: true,
      blog,
      message: 'Blog post generated successfully',
    });
  } catch (error) {
    next(error);
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function listBlogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { status = 'published', page = '1', limit = '10' } = req.query;
    
    const blogs = await prisma.blogPost.findMany({
      where: { status },
      orderBy: { publishedAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
    });
    
    const total = await prisma.blogPost.count({ where: { status } });
    
    res.json({
      blogs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
    });
    
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    // Increment views
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: { views: blog.views + 1 },
    });
    
    res.json(blog);
  } catch (error) {
    next(error);
  }
}
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Controller created
- [ ] All endpoints work
- [ ] TypeScript passes
```

---

#### P3.1.6 — Create Blog Routes
**Time:** 10 minutes
**Files:** `server/src/routes/blog.ts` (CREATE NEW)

**Prompt:**
```
TASK: Create blog routes

CREATE: server/src/routes/blog.ts

CODE:
```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import * as blogController from '../controllers/blog.controller.js';

const router = Router();

// Public routes
router.get('/', blogController.listBlogs);
router.get('/:slug', blogController.getBlog);

// Protected routes (require auth)
router.use(requireAuth);

// Admin-only routes
router.use('/admin', requireRole(['ADMIN']));
router.post('/generate', blogController.generateBlog);
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router;
```

VERIFY:
cd server && npm run type-check

DONE WHEN:
- [ ] Routes created
- [ ] TypeScript passes
```

---

#### P3.1.7 — Create Frontend Blog Generation UI
**Time:** 45 minutes
**Files:** `src/pages/admin/GenerateBlogPage.tsx` (CREATE NEW)

**Prompt:**
```
TASK: Create AI blog generation UI

CREATE: src/pages/admin/GenerateBlogPage.tsx

CODE:
```typescript
import { useState } from 'react';
import { API_URL } from '../../config/api';

export function GenerateBlogPage() {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Show progress updates
      setProgress('📊 Agent 1: Researching keywords...');
      await new Promise(r => setTimeout(r, 1000));
      
      setProgress('📝 Agent 2: Creating outline...');
      await new Promise(r => setTimeout(r, 1000));
      
      setProgress('✍️ Agent 3: Writing content...');
      await new Promise(r => setTimeout(r, 2000));
      
      setProgress('🎯 Agent 4: Optimizing for SEO...');
      await new Promise(r => setTimeout(r, 1000));
      
      setProgress('✅ Agent 5: Final editing...');
      await new Promise(r => setTimeout(r, 1000));
      
      const res = await fetch(`${API_URL}/blog/admin/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });
      
      const data = await res.json();
      setResult(data.blog);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">AI Blog Generator</h1>
      
      <div className="mb-6">
        <label className="block mb-2">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 border rounded"
          placeholder="e.g., 10 Ways to Manage Anxiety"
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="px-6 py-3 bg-primary text-white rounded"
      >
        {generating ? 'Generating...' : 'Generate Blog Post'}
      </button>
      
      {generating && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{progress}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Generated Blog:</h2>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {result.content}
          </pre>
        </div>
      )}
    </div>
  );
}
```

VERIFY:
npm run type-check
npm run build

DONE WHEN:
- [ ] UI created
- [ ] Shows progress
- [ ] Displays result
- [ ] TypeScript passes
- [ ] Build succeeds
```

---

#### P3.1.8 to P3.1.25 — Complete AI Blog System

**Subtasks:**
- P3.1.8: Add blog listing page
- P3.1.9: Add blog detail page with SEO
- P3.1.10: Add blog categories/tags
- P3.1.11: Add blog search
- P3.1.12: Add blog comments system
- P3.1.13: Add blog analytics dashboard
- P3.1.14: Add auto-scheduling (publish at optimal times)
- P3.1.15: Add social media auto-posting
- P3.1.16: Add email newsletter integration
- P3.1.17: Add internal linking suggestions
- P3.1.18: Add image generation (DALL-E 3)
- P3.1.19: Add content freshness monitoring
- P3.1.20: Add competitor analysis agent
- P3.1.21: Add rank tracking integration
- P3.1.22: Add A/B testing for headlines
- P3.1.23: Add multi-language support
- P3.1.24: Add content calendar
- P3.1.25: Add bulk generation (100 posts at once)

**DONE WHEN:**
- [ ] Full blog CMS working
- [ ] AI generates 100+ posts/day
- [ ] SEO ranking improves
- [ ] Google indexes all posts

---

### P3.2: Courses Platform

**Overall Goal:** Sell mental health courses with video lessons
**Current Status:** 18/100 — UI exists, no backend
**Final Score Target:** 18/100 → 85/100

---

#### P3.2.1 — Add Course Models to Schema
**Time:** 15 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Course, Lesson, Enrollment models

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model Course {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  description     String
  coverImage      String?
  
  instructorId    String
  instructor      User     @relation(fields: [instructorId], references: [id])
  
  price           Int      // INR
  isPublished     Boolean  @default(false)
  
  totalLessons    Int      @default(0)
  totalDuration   Int      // minutes
  
  enrolledCount   Int      @default(0)
  averageRating   Float    @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  lessons         Lesson[]
  enrollments     Enrollment[]
  
  @@index([slug])
  @@index([isPublished])
}

model Lesson {
  id              String   @id @default(uuid())
  courseId        String
  course          Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  title           String
  content         String   // Markdown or video URL
  videoUrl        String?
  duration        Int      // minutes
  
  order           Int      @default(0)
  isFree          Boolean  @default(false) // Free preview
  
  createdAt       DateTime @default(now())
  
  @@index([courseId, order])
}

model Enrollment {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  courseId        String
  course          Course   @relation(fields: [courseId], references: [id])
  
  enrolledAt      DateTime @default(now())
  progress        Int      @default(0) // percentage
  completedAt     DateTime?
  
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_course_models

DONE WHEN:
- [ ] Models added
- [ ] Migration created
```

---

#### P3.2.2 to P3.2.12 — Complete Courses Platform

**Subtasks:**
- P3.2.2: Create course service (CRUD)
- P3.2.3: Create course controller
- P3.2.4: Create course routes
- P3.2.5: Create enrollment system
- P3.2.6: Create video lesson player
- P3.2.7: Add progress tracking
- P3.2.8: Add course reviews
- P3.2.9: Add course search/filter
- P3.2.10: Add course dashboard
- P3.2.11: Add certificate generation
- P3.2.12: Add payment integration for courses

**DONE WHEN:**
- [ ] Full course platform working
- [ ] Users can enroll and watch
- [ ] Progress tracked
```

---

### P3.3: Community/Social Feed

**Overall Goal:** Users can post, comment, like (like Instagram for mental health)
**Current Status:** 8/100 — Schema exists, no implementation
**Final Score Target:** 8/100 → 80/100

---

#### P3.3.1 — Add Social Models to Schema
**Time:** 15 minutes
**Files:** `server/prisma/schema.prisma` (EDIT)

**Prompt:**
```
TASK: Add Post, Comment, Like models

EDIT: server/prisma/schema.prisma

ADD:
```prisma
model CommunityPost {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  content         String
  images          String[]
  
  likes           Int      @default(0)
  commentsCount   Int      @default(0)
  
  isAnonymous     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  comments        Comment[]
  
  @@index([userId])
  @@index([createdAt])
}

model Comment {
  id              String   @id @default(uuid())
  postId          String
  post            CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  content         String
  isAnonymous     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  
  @@index([postId])
}
```

VERIFY:
cd server && npx prisma migrate dev --name add_community_models

DONE WHEN:
- [ ] Models added
- [ ] Migration created
```

---

#### P3.3.2 to P3.3.15 — Complete Community System

**Subtasks:**
- P3.3.2: Create post service
- P3.3.3: Create post controller
- P3.3.4: Create post routes
- P3.3.5: Create comment service
- P3.3.6: Create comment controller
- P3.3.7: Create feed component
- P3.3.8: Create post composer
- P3.3.9: Add image upload
- P3.3.10: Add like functionality
- P3.3.11: Add notifications for likes/comments
- P3.3.12: Add moderation system
- P3.3.13: Add content filtering
- P3.3.14: Add trending posts
- P3.3.15: Add user profiles with posts

**DONE WHEN:**
- [ ] Full social feed working
- [ ] Users can post/comment/like
- [ ] Moderation active
```

---

### P3.4: Shop/E-commerce

**Overall Goal:** Sell wellness products, journals, merchandise
**Current Status:** 5/100 — Nothing exists
**Final Score Target:** 5/100 → 75/100

---

#### P3.4.1 to P3.4.10 — Complete Shop System

**Subtasks:**
- P3.4.1: Add Product, Cart, Order models
- P3.4.2: Create product service
- P3.4.3: Create product controller
- P3.4.4: Create cart service
- P3.4.5: Create cart UI
- P3.4.6: Create checkout with Razorpay
- P3.4.7: Create order tracking
- P3.4.8: Create admin product management
- P3.4.9: Add inventory management
- P3.4.10: Add shipping integration

**DONE WHEN:**
- [ ] Full e-commerce working
- [ ] Users can buy products
```

---

### P3.5: Events/Workshops

**Overall Goal:** Host live workshops, group therapy sessions
**Current Status:** 5/100 — Nothing exists
**Final Score Target:** 5/100 → 75/100

---

#### P3.5.1 to P3.5.8 — Complete Events System

**Subtasks:**
- P3.5.1: Add Event model
- P3.5.2: Create event service
- P3.5.3: Create event controller
- P3.5.4: Create event listing page
- P3.5.5: Create event registration
- P3.5.6: Add video integration for events
- P3.5.7: Add event reminders
- P3.5.8: Add event recordings

**DONE WHEN:**
- [ ] Event system working
- [ ] Users can register and attend
```

---

### P3.6: Admin Dashboard

**Overall Goal:** Complete admin panel to manage everything
**Current Status:** 18/100 — UI exists with fake data
**Final Score Target:** 18/100 → 90/100

---

#### P3.6.1 to P3.6.20 — Complete Admin Dashboard

**Subtasks:**
- P3.6.1: Remove all fake data from AdminDashboard
- P3.6.2: Create admin stats service (real metrics)
- P3.6.3: Create user management page
- P3.6.4: Create therapist management
- P3.6.5: Create content management (blogs, courses)
- P3.6.6: Create financial dashboard
- P3.6.7: Create analytics dashboard
- P3.6.8: Create moderation queue
- P3.6.9: Create system health monitoring
- P3.6.10: Create audit log viewer
- P3.6.11: Create role management
- P3.6.12: Create settings management
- P3.6.13: Create email campaign manager
- P3.6.14: Create notification broadcaster
- P3.6.15: Create report generator
- P3.6.16: Create bulk operations
- P3.6.17: Create data export
- P3.6.18: Create backup management
- P3.6.19: Create API key management
- P3.6.20: Create activity monitoring

**DONE WHEN:**
- [ ] Admin can manage entire platform
- [ ] All real data (no fakes)
```

---

### P3.7: Astrology System

**Overall Goal:** Astrology readings, birth chart, compatibility
**Current Status:** 15/100 — UI exists, no backend
**Final Score Target:** 15/100 → 80/100

---

#### P3.7.1 to P3.7.15 — Complete Astrology System

**Subtasks:**
- P3.7.1: Add AstrologyChart model
- P3.7.2: Create astrology calculation service
- P3.7.3: Integrate astrology API (e.g., AstrologyAPI.com)
- P3.7.4: Create birth chart generator
- P3.7.5: Create daily horoscope
- P3.7.6: Create compatibility matcher
- P3.7.7: Create astrology dashboard UI
- P3.7.8: Add transit notifications
- P3.7.9: Add remedy suggestions
- P3.7.10: Add astrology reports (PDF)
- P3.7.11: Add consultation booking
- P3.7.12: Add astrology blog integration
- P3.7.13: Add push notifications for transits
- P3.7.14: Add saved charts
- P3.7.15: Add sharing functionality

**DONE WHEN:**
- [ ] Full astrology system working
- [ ] Accurate calculations
- [ ] Beautiful visualizations
```

---

### P3.8: AI Chatbot (SoulBot)

**Overall Goal:** 24/7 AI mental health companion
**Current Status:** 12/100 — UI exists, no backend
**Final Score Target:** 12/100 → 85/100

---

#### P3.8.1 to P3.8.10 — Complete AI Chatbot

**Subtasks:**
- P3.8.1: Add ChatSession, Message models
- P3.8.2: Create AI chat service (OpenAI/Anthropic)
- P3.8.3: Create chat controller
- P3.8.4: Create chat UI component
- P3.8.5: Add conversation memory
- P3.8.6: Add crisis detection (escalate to human)
- P3.8.7: Add mood tracking from chats
- P3.8.8: Add personalized responses
- P3.8.9: Add voice messages
- P3.8.10: Add chat history export

**DONE WHEN:**
- [ ] AI chatbot working 24/7
- [ ] Crisis detection active
- [ ] Users love it
```

---

### P3.9: Practitioner Dashboard

**Overall Goal:** Therapists/Astrologers manage their practice
**Current Status:** 25/100 — UI exists, fake data
**Final Score Target:** 25/100 → 85/100

---

#### P3.9.1 to P3.9.12 — Complete Practitioner Dashboard

**Subtasks:**
- P3.9.1: Remove fake data from PractitionerDashboard
- P3.9.2: Create practitioner stats service
- P3.9.3: Create client management
- P3.9.4: Create session notes (encrypted)
- P3.9.5: Create availability calendar
- P3.9.6: Create earnings dashboard
- P3.9.7: Create review responses
- P3.9.8: Create schedule management
- P3.9.9: Create no-show tracking
- P3.9.10: Create client progress tracking
- P3.9.11: Create payout requests
- P3.9.12: Create professional development tracker

**DONE WHEN:**
- [ ] Practitioners can manage everything
- [ ] All real data
```

---

### P4.1: Performance Optimization

**Overall Goal:** 90+ Lighthouse scores, <2s load time
**Current Status:** 28/100 — No optimization
**Final Score Target:** 28/100 → 90/100

---

#### P4.1.1 to P4.1.10 — Complete Performance Optimization

**Subtasks:**
- P4.1.1: Run bundle analysis
- P4.1.2: Implement code splitting
- P4.1.3: Add lazy loading for routes
- P4.1.4: Optimize images (WebP, lazy load)
- P4.1.5: Add service worker (PWA)
- P4.1.6: Implement React Query (cache API calls)
- P4.1.7: Add database indexing
- P4.1.8: Add Redis caching
- P4.1.9: Add CDN for static assets
- P4.1.10: Add performance monitoring

**DONE WHEN:**
- [ ] Lighthouse 90+
- [ ] Load time <2s
- [ ] Bundle <500KB
```

---

### P4.2: Accessibility (WCAG 2.1 AA)

**Overall Goal:** Fully accessible for all users
**Current Status:** 32/100 — Basic HTML only
**Final Score Target:** 32/100 → 95/100

---

#### P4.2.1 to P4.2.10 — Complete Accessibility

**Subtasks:**
- P4.2.1: Run axe-core audit
- P4.2.2: Add ARIA labels everywhere
- P4.2.3: Fix keyboard navigation
- P4.2.4: Add focus indicators
- P4.2.5: Fix color contrast
- P4.2.6: Add screen reader support
- P4.2.7: Add skip links
- P4.2.8: Add alt text for all images
- P4.2.9: Add captions for videos
- P4.2.10: Test with real screen readers

**DONE WHEN:**
- [ ] WCAG 2.1 AA compliant
- [ ] axe-core passes
- [ ] Real users confirm accessibility
```

---

### P4.3: Analytics/Monitoring

**Overall Goal:** Track everything, know user behavior
**Current Status:** 8/100 — No analytics
**Final Score Target:** 8/100 → 90/100

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
```

---

#### P4.3.2 — Add PostHog to App
**Time:** 15 minutes
**Files:** `src/main.tsx` (EDIT)

**Prompt:**
```
TASK: Initialize PostHog in app

EDIT: src/main.tsx

ADD:
```typescript
import posthog from 'posthog-js';

posthog.init('phc_xxxxx', {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
});
```

DONE WHEN:
- [ ] PostHog initialized
- [ ] Pageviews tracked
```

---

#### P4.3.3 to P4.3.8 — Complete Analytics

**Subtasks:**
- P4.3.3: Add event tracking (button clicks, form submits)
- P4.3.4: Add user property tracking
- P4.3.5: Add funnel analysis
- P4.3.6: Add retention tracking
- P4.3.7: Add error tracking (Sentry)
- P4.3.8: Create analytics dashboard

**DONE WHEN:**
- [ ] All user actions tracked
- [ ] Funnels visible
- [ ] Retention metrics working
```

---

## FINAL PROGRESS TRACKING

```
COMPLETED SUBTASKS:

P1.1 - Payments: [10/10] ✅
P1.2 - Therapy: [20/20] ✅
P1.3 - Email: [8/8] ✅
P1.4 - Video: [10/10] ✅
P2.1 - Tests: [8/8] ✅
P2.2 - SEO: [6/6] ✅
P2.3 - AI Matching: [15/15]
P2.4 - Reviews: [12/12]
P3.1 - AI Blog System: [25/25]
P3.2 - Courses: [12/12]
P3.3 - Community: [15/15]
P3.4 - Shop: [10/10]
P3.5 - Events: [8/8]
P3.6 - Admin Dashboard: [20/20]
P3.7 - Astrology: [15/15]
P3.8 - AI Chatbot: [10/10]
P3.9 - Practitioner Dashboard: [12/12]
P4.1 - Performance: [10/10]
P4.2 - Accessibility: [10/10]
P4.3 - Analytics: [8/8]

TOTAL: [233 subtasks]

CURRENT SUBTASK: P1.2.1
NEXT SUBTASK: P1.2.2
```

---

**Total Subtasks:** 233
**Features:** 19 complete features
**Estimated Time:** 8-12 weeks (full-time)
**Last Updated:** March 7, 2026

**🔥 READY TO BUILD EVERYTHING! START WITH P1.2.1! 🔥**




Update after EACH subtask:

```
COMPLETED SUBTASKS:
- [ ] P1.1.1: Install Razorpay SDK
- [ ] P1.1.2: Add Env Variables
- [ ] P1.1.3: Payment Service (createOrder)
- [ ] P1.1.4: Payment Service (verifyPayment)
- [ ] P1.1.5: Payment Service (handleWebhook)
- [ ] P1.1.6: Payment Controller (Create Order)
- [ ] P1.1.7: Payment Controller (Verify)
- [ ] P1.1.8: Payment Controller (Webhook)
- [ ] P1.1.9: Add Rate Limiting
- [ ] P1.1.10: Frontend Hook

CURRENT SUBTASK: P1.1.1
NEXT SUBTASK: P1.1.2
```

---

**Document Length:** Will be ~2000 lines when all P1-P3 tasks are broken down
**Last Updated:** March 7, 2026
