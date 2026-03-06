# Cost Model — Soul Yatri Platform

_All prices researched March 2026 from official vendor pricing pages. INR conversions at ₹84/USD._

## Scenario 1: Student MVP (₹0–₹500/mo | $0–$6/mo)

**Goal**: Launch MVP with real auth, health tools, basic therapy booking — zero or near-zero cost.

| Service | Provider | Plan | Monthly Cost (USD) | Monthly Cost (INR) |
|---------|----------|------|-------------------:|-------------------:|
| Frontend Hosting | Vercel | Hobby (Free) | $0 | ₹0 |
| Backend Hosting | Render | Free (512MB, spins down) | $0 | ₹0 |
| Database | Neon | Free (0.5GB, 100 CU-hrs) | $0 | ₹0 |
| Email | Resend | Free (3K emails/mo) | $0 | ₹0 |
| Video | 100ms | Free (10K min/mo) | $0 | ₹0 |
| Payments | Razorpay | Per-txn only | $0 base | ₹0 base |
| Analytics | PostHog | Free (1M events) | $0 | ₹0 |
| Error Monitoring | Sentry | Free (5K errors) | $0 | ₹0 |
| Cache/Queue | Upstash | Free (10K cmd/day) | $0 | ₹0 |
| AI Chat | Google Gemini | Free (15 req/min) | $0 | ₹0 |
| Domain | .in domain | Annual | ~$1/mo | ~₹84/mo |
| **TOTAL** | | | **$1/mo** | **~₹84/mo** |

**Notes**:
- Render free tier spins down after 15 min inactivity; ~30s cold start
- Neon scales to zero automatically; 0.5GB is enough for early users
- 100ms free = ~167 hrs of 1:1 therapy sessions/mo
- Razorpay charges 2% per transaction only (no monthly fee)
- Gemini free tier sufficient for ~50-100 AI interactions/day
- Domain is the only hard cost (~₹1000/yr for .in)

## Scenario 2: Early Growth (₹2,000–₹5,000/mo | $25–$60/mo)

**Goal**: 100-500 users, always-on backend, reliable email, basic monitoring.

| Service | Provider | Plan | Monthly Cost (USD) | Monthly Cost (INR) |
|---------|----------|------|-------------------:|-------------------:|
| Frontend Hosting | Vercel | Hobby (Free) | $0 | ₹0 |
| Backend Hosting | Render | Starter ($7/mo, always-on) | $7 | ₹588 |
| Database | Neon | Launch (~$15/mo) | $15 | ₹1,260 |
| Email | Resend | Free (3K/mo still sufficient) | $0 | ₹0 |
| Video | 100ms | Free tier likely sufficient | $0 | ₹0 |
| Payments | Razorpay | Per-txn (2% of GMV) | ~$2-5 | ~₹168-420 |
| Analytics | PostHog | Free | $0 | ₹0 |
| Error Monitoring | Sentry | Free | $0 | ₹0 |
| Cache | Upstash | Free | $0 | ₹0 |
| AI Chat | OpenAI GPT-4o-mini | ~$5/mo at 100 chats/day | $5 | ₹420 |
| Domain + SSL | Vercel manages | Included | $0 | ₹0 |
| **TOTAL** | | | **$29–$32/mo** | **₹2,436–₹2,688/mo** |

**Notes**:
- Render Starter runs 24/7 (no cold starts)
- Neon Launch gives 16 CU, auto-scaling, 7-day restore
- 500 users × 2 sessions/mo × 45 min = 750 video min (well within 10K free)
- Razorpay revenue: if 50 paid sessions/mo × ₹1,000 = ₹50,000 GMV → ₹1,000 fee
- GPT-4o-mini at ~$0.15/1M input tokens handles hundreds of conversations

## Scenario 3: Growth (₹10,000–₹25,000/mo | $120–$300/mo)

**Goal**: 1,000-5,000 users, professional infrastructure, HD video, dedicated support.

| Service | Provider | Plan | Monthly Cost (USD) | Monthly Cost (INR) |
|---------|----------|------|-------------------:|-------------------:|
| Frontend Hosting | Vercel | Pro ($20/mo) | $20 | ₹1,680 |
| Backend Hosting | Render | Standard ($25/mo, 2GB) | $25 | ₹2,100 |
| Database | Neon | Launch (~$40/mo at 5GB) | $40 | ₹3,360 |
| Email | Resend | Pro ($20/mo, 50K emails) | $20 | ₹1,680 |
| Video | 100ms | ~$50/mo (5K min over free) | $50 | ₹4,200 |
| Payments | Razorpay | 2% of ~₹5L GMV | ~$12 | ~₹1,000 |
| Analytics | PostHog | Free (still under 1M) | $0 | ₹0 |
| Error Monitoring | Sentry | Team ($26/mo) | $26 | ₹2,184 |
| Cache | Upstash | Pro ($10/mo) | $10 | ₹840 |
| AI Chat | OpenAI GPT-4o-mini | ~$15/mo | $15 | ₹1,260 |
| File Storage | Cloudinary | Free (25 credits) | $0 | ₹0 |
| Domain | .com domain | Annual | ~$1/mo | ~₹84/mo |
| **TOTAL** | | | **$219/mo** | **~₹18,388/mo** |

**Notes**:
- At 5K users, Vercel Pro gives faster builds + team collaboration
- Render Standard handles concurrent users without issues
- 5K users × 1 session/mo × 45 min = 3,750 min → ~$15 video cost (within free + small overage)
- Email volume: welcome + booking + receipt + reminder = ~4 emails/user/mo = 20K emails
- Sentry Team for proper error tracking with source maps

## Scenario 4: Scale (₹50,000+/mo | $600+/mo)

**Goal**: 10,000+ users, HA database, horizontal scaling, compliance.

| Service | Provider | Plan | Monthly Cost (USD) | Monthly Cost (INR) |
|---------|----------|------|-------------------:|-------------------:|
| Frontend | Vercel | Pro ($20/mo) | $20 | ₹1,680 |
| Backend | Render | Pro ($85/mo, 4GB/2CPU) × 2 | $170 | ₹14,280 |
| Database | Neon | Scale (~$200/mo at 50GB) | $200 | ₹16,800 |
| Email | Resend | Scale ($90/mo, 100K) | $90 | ₹7,560 |
| Video | 100ms | ~$200/mo (50K min) | $200 | ₹16,800 |
| Payments | Razorpay | 2% of ~₹25L GMV | ~$60 | ~₹5,000 |
| Analytics | PostHog | Usage-based | $50 | ₹4,200 |
| Error Monitoring | Sentry | Team ($26/mo) | $26 | ₹2,184 |
| Cache | Upstash | Pro ($10/mo) | $10 | ₹840 |
| AI | OpenAI GPT-4o | ~$50/mo | $50 | ₹4,200 |
| File Storage | Cloudinary | Plus ($89/mo) | $89 | ₹7,476 |
| **TOTAL** | | | **~$965/mo** | **~₹81,020/mo** |

## Revenue vs Cost Analysis

| Metric | Student MVP | Early Growth | Growth | Scale |
|--------|------------|-------------|--------|-------|
| Monthly Users | 1-50 | 100-500 | 1K-5K | 10K+ |
| Monthly Cost | ₹84 | ₹2,500 | ₹18,000 | ₹81,000 |
| Avg Revenue/User | ₹0 (free) | ₹100 | ₹200 | ₹300 |
| Monthly Revenue | ₹0 | ₹25,000 | ₹4,00,000 | ₹30,00,000 |
| Unit Economics | N/A | ₹50/user profit | ₹196/user profit | ₹292/user profit |
| Break-even Users | N/A | 25 paid users | 90 paid users | 270 paid users |

## Key Takeaways

1. **MVP can launch at ₹84/mo** — only hard cost is a domain name
2. **Free tiers cover development + initial 50 users** — zero infrastructure cost
3. **Video is the biggest variable cost** — 100ms free tier (10K min) covers ~220 thirty-min 1:1 sessions/mo
4. **Razorpay has zero monthly cost** — pure per-transaction pricing ideal for bootstrapping
5. **AI cost is manageable** — GPT-4o-mini at $0.15/1M tokens handles thousands of interactions for pennies
6. **Break-even is achievable** with 25-90 paying users depending on growth stage
7. **Total annual cost for Year 1** (student MVP → early growth): **~₹15,000–₹30,000** (~$180–$360)
