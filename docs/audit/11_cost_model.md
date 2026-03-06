# Cost Model — Soul Yatri Platform

## 3 Scenarios: Student (Free), Beta Launch (₹5K/mo), Production Scale (₹50K/mo)

---

## Scenario 1: STUDENT / FREE TIER (₹0/month)

> For development, testing, and portfolio demonstration. Supports ~100 users.

| Category | Service | Plan | Monthly Cost |
|----------|---------|------|-------------|
| Database | Neon Postgres | Free (0.5GB, 100hrs compute) | ₹0 |
| Hosting (Frontend) | Vercel | Free (hobby) | ₹0 |
| Hosting (Backend) | Railway | Free ($5 trial credit) | ₹0 |
| Cache | Upstash Redis | Free (10K commands/day) | ₹0 |
| Email | Resend | Free (3,000 emails/month) | ₹0 |
| Error Tracking | Sentry | Free (5K events/month) | ₹0 |
| Analytics | PostHog | Free (1M events/month) | ₹0 |
| Storage | Cloudflare R2 | Free (10GB + 1M reads) | ₹0 |
| Video | Daily.co | Free (2,000 participant-min/month) | ₹0 |
| AI | OpenAI GPT-4o-mini | Pay-per-use (~₹0 at student scale) | ₹0 |
| Payment | Razorpay | Transaction-based only | ₹0 |
| Monitoring | BetterUptime | Free (10 monitors) | ₹0 |
| Domain | — | Already owned (assumed) | ₹0 |
| **TOTAL** | | | **₹0/month** |

### Constraints at Free Tier
- Neon: 100 compute-hours/month → ~3.3 hrs/day of active queries
- Railway: $5 trial credit exhausts; then need paid
- Vercel: No commercial use; 100GB bandwidth
- Daily.co: 2,000 minutes → ~33 hours of video calls
- Resend: 3,000 emails → ~100 users × 30 emails/month

---

## Scenario 2: BETA LAUNCH (₹5,000/month ≈ $60/month)

> For beta testing with 500-1,000 real users. Basic production features.

| Category | Service | Plan | Monthly Cost (₹) |
|----------|---------|------|------------------|
| Database | Neon Postgres | Launch ($19/mo = ₹1,600) | ₹1,600 |
| Hosting (Frontend) | Vercel | Pro ($20/mo = ₹1,680) | ₹1,680 |
| Hosting (Backend) | Railway | Starter ($5/mo + usage ~$3) | ₹670 |
| Cache | Upstash Redis | Pay-as-you-go (~$2/mo) | ₹170 |
| Email | Resend | Free tier (3K/mo enough for beta) | ₹0 |
| Error Tracking | Sentry | Free tier (5K events enough) | ₹0 |
| Analytics | PostHog | Free tier (1M events enough) | ₹0 |
| Storage | Cloudflare R2 | Free tier (10GB enough for beta) | ₹0 |
| Video | Daily.co | Free + pay overage (~$5/mo) | ₹420 |
| AI | OpenAI GPT-4o-mini | ~100K tokens/day (~$3/mo) | ₹250 |
| Payment Gateway | Razorpay | 2% per transaction (no monthly) | ₹0 base |
| Monitoring | BetterUptime | Free tier | ₹0 |
| Domain + SSL | Cloudflare | Free SSL; domain ~₹100/mo amortized | ₹100 |
| **TOTAL** | | | **₹4,890/month** |

### Revenue Needed to Break Even
- At ₹499/month membership: 10 paying users cover costs
- At 2% Razorpay fee on ₹499: ₹10 per transaction → negligible
- First 50 therapy sessions at ₹500 each: ₹25,000 GMV → ₹500 Razorpay fee

### What You Get at Beta Tier
- ✅ Custom domain with SSL
- ✅ Auto-deploy from GitHub
- ✅ Real payment processing
- ✅ AI chatbot (SoulBot) with rate limits
- ✅ 1:1 video therapy (up to 100 sessions/month)
- ✅ Transactional emails (password reset, booking confirmation)
- ✅ Error tracking and uptime monitoring
- ❌ No marketing email automation
- ❌ No advanced analytics/funnels
- ❌ No CDN image optimization
- ❌ Limited to single backend instance

---

## Scenario 3: PRODUCTION SCALE (₹50,000/month ≈ $600/month)

> For 5,000-10,000 active users. Full feature set. Revenue-generating.

| Category | Service | Plan | Monthly Cost (₹) |
|----------|---------|------|------------------|
| Database | Neon Postgres | Scale ($69/mo = ₹5,800) | ₹5,800 |
| Hosting (Frontend) | Vercel | Pro ($20/mo) | ₹1,680 |
| Hosting (Backend) | Railway | Pro ($20/mo + usage ~$30) | ₹4,200 |
| Cache | Upstash Redis | Pro ($10/mo) | ₹840 |
| Email (Transactional) | Resend | Pro ($20/mo = 50K emails) | ₹1,680 |
| Email (Marketing) | Resend | Same account | Included |
| Error Tracking | Sentry | Team ($26/mo) | ₹2,180 |
| Analytics | PostHog | Free (1M events still enough) | ₹0 |
| Storage | Cloudflare R2 | Pay-per-use (~$5/mo for 50GB) | ₹420 |
| Image CDN | Cloudflare Images | $5/mo base | ₹420 |
| Video (1:1) | Daily.co | Scale ($0.004/min × 3000 min) | ₹1,010 |
| Video (Group) | Daily.co | Same account | Included |
| AI (SoulBot) | OpenAI GPT-4o-mini | ~1M tokens/day (~$15/mo) | ₹1,260 |
| AI (Crisis) | OpenAI Moderation | Free API | ₹0 |
| Payment Gateway | Razorpay | 2% per transaction | Variable |
| Queue | BullMQ + Upstash | Included in Redis cost | ₹0 |
| Search | Meilisearch Cloud | Starter ($30/mo) | ₹2,520 |
| Monitoring | BetterUptime | Starter ($20/mo) | ₹1,680 |
| Push Notifications | Firebase FCM | Free | ₹0 |
| Domain + DNS | Cloudflare | Free DNS; domain amortized | ₹100 |
| CMS (Blog) | Sanity | Free (3 users) | ₹0 |
| **SUBTOTAL (Infrastructure)** | | | **₹23,790/month** |
| | | | |
| **Human Costs** | | | |
| Part-time DevOps/SRE | Freelance (10 hrs/mo) | | ₹10,000 |
| Content Creator | Freelance (blog/social) | | ₹8,000 |
| Customer Support | Part-time | | ₹8,000 |
| **SUBTOTAL (Human)** | | | **₹26,000/month** |
| | | | |
| **GRAND TOTAL** | | | **₹49,790/month** |

### Revenue Model at Scale

| Revenue Stream | Price | Users/Mo | Monthly Revenue |
|----------------|-------|----------|----------------|
| Basic Membership | ₹499/mo | 500 | ₹2,49,500 |
| Premium Membership | ₹999/mo | 200 | ₹1,99,800 |
| Therapy Sessions | ₹800/session (20% commission) | 400 | ₹64,000 |
| Courses | ₹1,499 one-time | 50 | ₹74,950 |
| Corporate Packages | ₹25,000/mo | 3 | ₹75,000 |
| **TOTAL REVENUE** | | | **₹6,63,250/month** |
| **Infrastructure Cost** | | | ₹49,790/month |
| **Gross Margin** | | | **₹6,13,460 (92.5%)** |

### Cost Per User Breakdown
| Metric | Value |
|--------|-------|
| Infrastructure cost per MAU (5,000) | ₹4.76/user/month |
| Infrastructure cost per paying user (700) | ₹34/user/month |
| Payback on ₹499 membership | First month |
| Break-even users (infrastructure only) | 48 Basic members |
| Break-even users (full cost) | 100 Basic members |

---

## Cost Optimization Strategies

### Immediate (save 20-30%)
1. **Serverless database** (Neon scale-to-zero) — avoid paying for idle
2. **Aggressive caching** (Upstash) — reduce DB queries by 60%
3. **Image optimization pipeline** (Sharp + R2) — reduce storage/bandwidth
4. **AI token budgeting** — limit SoulBot to 500 tokens/response; use GPT-4o-mini not GPT-4

### Medium-term (save 30-40%)
1. **Self-host PostHog** on Railway — eliminate analytics cost entirely
2. **Move to Fly.io** for backend — cheaper than Railway at scale; global edge
3. **Bundle Daily.co minutes** — annual plan saves 20%
4. **Use Cloudflare Workers** for edge caching — reduce backend load

### Long-term (save 50%+)
1. **Reserved instances** — annual commits on Neon/Railway
2. **Self-host Meilisearch** — eliminate search SaaS cost
3. **Fine-tune smaller AI model** — distill GPT-4o-mini knowledge into local model
4. **Move video to Agora** at scale — better bulk pricing above 10K minutes

---

## Investment Priorities (Where ₹1 Spent Returns ₹10+)

| Priority | Investment | Cost | Expected Return |
|----------|-----------|------|----------------|
| 1 | Razorpay Integration | ₹0 (dev time) | Unlocks ALL revenue |
| 2 | Daily.co Video | ₹0-420/mo | Therapy sessions = primary revenue |
| 3 | Resend Email | ₹0 (free tier) | Password reset → user retention |
| 4 | Sentry | ₹0 (free tier) | Catch errors → reduce churn |
| 5 | OpenAI SoulBot | ₹250/mo | Differentiator → premium conversions |
| 6 | Meilisearch | ₹0 (self-host) | Course/blog discovery → engagement |
| 7 | PostHog | ₹0 (free) | Data-driven decisions → all metrics |
