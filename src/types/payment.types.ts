/**
 * Payment & E-commerce Types
 * Payment gateway, Soul Shop merchandise, subscriptions
 */

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: 'razorpay' | 'stripe';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  type: 'therapy-session' | 'course' | 'shop-order' | 'subscription' | 'astrology-session';
  referenceId: string; // sessionId, courseId, orderId, etc.
  metadata?: Record<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentTransactionId: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  sessionsIncluded: number;
  aiAssistantAccess: boolean;
  meditationAccess: boolean;
  communityAccess: boolean;
  courseDiscount: number; // percentage
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: ShopCategory;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
}

export type ShopCategory =
  | 'crystals'
  | 'incense'
  | 'books'
  | 'meditation-tools'
  | 'yoga-accessories'
  | 'journals'
  | 'apparel'
  | 'wellness-kits'
  | 'other';

export interface ShopOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentTransactionId: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ── Payouts (Therapist / Astrologer earnings) ────────────────────────────

export interface PayoutAccount {
  id: string;
  userId: string;
  role: 'therapist' | 'astrologer' | 'course-creator';
  bankName: string;
  accountNumber: string; // encrypted
  ifscCode: string;
  upiId?: string;
  panNumber: string; // encrypted
  verified: boolean;
  createdAt: Date;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  payoutAccountId: string;
  gatewayTransferId?: string;
  period: string; // e.g., 'Feb 2026'
  sessionsCount: number;
  platformCommission: number;
  netAmount: number;
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

export interface EarningsSummary {
  userId: string;
  totalEarnings: number;
  totalPaidOut: number;
  pendingPayout: number;
  currentMonthEarnings: number;
  sessionCount: number;
  averagePerSession: number;
  commissionRate: number;
  currency: string;
}
