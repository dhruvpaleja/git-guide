# Soul Yatri — Integration & Platform Recommendations

> **Audit Date:** 2026-03-06  
> **Exchange Rate Used:** 1 USD = ₹84  
> **Codebase State:** Verified from `/server/`, `src/`, `vercel.json`, `package.json`

---

## Current Integration Reality (What's Actually Wired Today)

The following table summarises the verified integration state. "Live" means the code runs end-to-end with real credentials in production. "Stub" means the code exists but API keys are commented out or replaced with TODO comments.

| Area | Status | Evidence |
|------|--------|----------|
| **Frontend Hosting** | ✅ LIVE | `vercel.json` exists; SPA rewrite configured; deploy-ready |
| **Auth (JWT)** | ✅ LIVE | HS256 access token (15-min in-memory) + refresh token (7-day httpOnly cookie) — fully implemented |
| **Database (PostgreSQL + Prisma)** | ⚠️ SCHEMA READY | Prisma schema complete; no cloud provider configured; no `DATABASE_URL` in production env |
| **Video Therapy (Daily.co)** | 🔴 STUB | API key commented out in server code; room creation logic exists but inactive |
| **Payments (Razorpay)** | 🔴 STUB | Razorpay key commented out; payment routes exist; webhook handler scaffolded |
| **AI Chat (OpenAI GPT-4o-mini)** | 🔴 STUB | OpenAI API key commented out; chat routes exist; prompt templates written |
| **Email** | 🔴 CONSOLE ONLY | All email sends `console.log()` the email; Resend/SES/SendGrid all commented as TODO |
| **Background Queue** | 🔴 IN-MEMORY | BullMQ + Redis referenced in TODOs; current impl is synchronous in-process |
| **File Storage** | 🔴 LOCAL DISK | `multer` saves to local `/uploads`; in-memory `Map` for metadata; no S3/R2 |
| **SMS / OTP** | 🔴 NOT IMPLEMENTED | No SMS provider; no OTP flow |
| **Analytics** | 🔴 NOT IMPLEMENTED | No analytics SDK installed |
| **Error Monitoring** | 🔴 NOT IMPLEMENTED | No Sentry or equivalent |
| **CDN / DNS** | ⚠️ PARTIAL | Vercel edge CDN for frontend; backend has no CDN |
| **Cache** | 🔴 IN-MEMORY MAP | Redis referenced in TODOs; `Map()` used in production code |
| **WebSocket** | ⚠️ SERVER ONLY | `ws` library running server-side; not wired to any React component |
| **Real-time UI** | 🔴 NOT WIRED | WebSocket events never reach the frontend |

---

## Recommended Student Solo Stack (₹0/month)

**Target:** One developer, zero real users, just building. All free tiers.

| Layer | Platform | Why |
|-------|----------|-----|
| Frontend | **Vercel Hobby** | Already configured; zero cost; instant deploys |
| Backend | **Railway Hobby** | $5/month credit covers hobby usage; best DX |
| Database | **Neon Free** (or Student Pack Pro) | GitHub Student Pack = 1 year Pro free; Prisma-native |
| Storage | **Cloudflare R2 Free** | 10GB free; no egress fees; S3-compatible |
| Email | **Resend Free** | 3K emails/month free; referenced in TODOs |
| Video | **Daily.co Free** | 10K participant-minutes/month free; already in codebase |
| AI | **OpenAI GPT-4o-mini** | $5 signup credit; cheap enough for dev |
| Auth | **Custom JWT (current)** | Already live; don't touch |
| Analytics | **PostHog Free** | 1M events/month free |
| Error Monitoring | **Sentry Free** (Student Pack) | 500K errors via GitHub Student Pack |
| Queue | **Trigger.dev Free** (Student Pack) | 50K job runs/month; GitHub Student Pack |
| WebSocket | **ws (current)** | Already implemented; wire to frontend |
| SMS | **Fast2SMS** (₹50 signup credit) | ₹50 credit = ~200 OTPs for testing |
| CDN/DNS | **Cloudflare Free** | DNS + SSL + DDoS free forever |

**Monthly Cost: ₹0** *(assuming GitHub Student Developer Pack is activated)*

---

## Recommended Beta Launch Stack (₹2,000–8,000/month)

**Target:** 100–500 real users, therapy bookings live, video sessions active, AI chat active, payments taking real money.

| Layer | Platform | Plan | INR/month |
|-------|----------|------|-----------|
| Frontend | **Vercel Pro** (Student Pack) | Free while student; else ₹1,680 | ₹0–1,680 |
| Backend | **Railway Hobby** | Usage-based ~$15-20 | ₹1,260–1,680 |
| Database | **Neon Pro** (Student Pack) | Free while student; else ₹1,596 | ₹0–1,596 |
| Storage | **Cloudflare R2** | Free 10GB; ~₹0–200 overage | ₹0–200 |
| Email | **Resend Free** → **SendGrid Essentials** | SendGrid free via Student Pack (15K/month) | ₹0 |
| Video | **Daily.co** | ~100 sessions × 30min = ~6K mins → ₹0 (free tier) | ₹0–2,520 |
| AI | **OpenAI GPT-4o-mini** | ~200 conversations/month | ₹504–1,260 |
| Auth | **Custom JWT (current)** | Free | ₹0 |
| Analytics | **PostHog Free** | 1M events covers beta | ₹0 |
| Error Monitoring | **Sentry** (Student Pack) | 500K errors/month | ₹0 |
| Queue | **Trigger.dev** (Student Pack) | 50K runs/month free | ₹0 |
| WebSocket | **ws (current)** | Free | ₹0 |
| SMS / OTP | **MSG91** | ₹0.20/OTP × 500 OTPs | ₹100–500 |
| CDN/DNS | **Cloudflare Free** | Free | ₹0 |
| Payments | **Razorpay** | 2% per transaction | ₹0 fixed + 2% |

**Monthly Fixed Cost: ₹1,864–9,436/month** *(lower bound assumes Student Pack active for Vercel, Neon, SendGrid, Trigger.dev, Sentry)*

---

## Recommended Production Stack (₹15,000–50,000/month)

**Target:** 1,000–5,000 active users/month, therapy bookings, subscription revenue, full feature set.

| Layer | Platform | Plan | INR/month |
|-------|----------|------|-----------|
| Frontend | **Vercel Pro** | ₹1,680/month ($20) | ₹1,680 |
| Backend | **Railway Pro** or **Render Standard** | ₹5,040/month ($60; 2 instances) | ₹5,040 |
| Database | **Neon Pro** | ₹1,596/month ($19) | ₹1,596 |
| Storage | **Cloudflare R2** | ₹0–1,680 ($0-20; 100GB) | ₹840 |
| Email | **Resend Pro** | ₹1,680/month ($20; 50K emails) | ₹1,680 |
| Video | **Daily.co** | ~500 sessions × 30min × 2 = 30K mins → ₹1,680 ($20) | ₹1,680 |
| AI | **OpenAI GPT-4o-mini** + **GPT-4o** | 2K conversations mixed model | ₹5,040–12,600 |
| Analytics | **PostHog** | Free (1M events) or ₹2,100 if exceeded | ₹0–2,100 |
| Error Monitoring | **Sentry Team** | ₹2,184/month ($26) | ₹2,184 |
| Queue | **BullMQ + Upstash Redis** | ₹840/month ($10 Upstash) | ₹840 |
| SMS / OTP | **MSG91** | 5K OTPs × ₹0.20 | ₹1,000 |
| CDN/DNS | **Cloudflare Pro** | ₹1,680/month ($20) | ₹1,680 |
| Payments | **Razorpay** | 2% per transaction | 2% of GMV |
| Video CDN (recordings) | **Bunny.net** | ₹840/month ($10; recording storage) | ₹840 |

**Monthly Fixed Cost: ~₹22,404–29,724/month** *(excludes transaction fees and AI usage spikes)*

---

## Recommended Scale Stack (₹50,000–2,00,000/month)

**Target:** 10,000–50,000 active users/month. This is the "we have PMF and revenue" stage.

| Layer | Platform | Plan | INR/month |
|-------|----------|------|-----------|
| Frontend | **Cloudflare Pages** | ₹0 (unlimited requests) | ₹0 |
| Backend | **Fly.io** (3 regions: Mumbai + Singapore + US) | ₹25,200 ($300; 6 VMs) | ₹25,200 |
| Database | **Neon Scale** | ₹5,040 ($60) | ₹5,040 |
| Read Replica | **Neon Pro** read replica | ₹1,680 ($20) | ₹1,680 |
| Cache | **Upstash Redis** | ₹4,200 ($50 Pay-as-you-go) | ₹4,200 |
| Storage | **Cloudflare R2** | ₹1,680 ($20; 1TB) | ₹1,680 |
| Email | **Amazon SES** | ₹420 ($5; 50K emails) | ₹420 |
| Video | **100ms** or **Daily.co Scale** | ₹25,200 ($300; 5K sessions × 30min) | ₹25,200 |
| AI | **OpenAI GPT-4o-mini** (primary) + **GPT-4o** (premium) | 20K conversations | ₹42,000–84,000 |
| Analytics | **PostHog Scale** | ₹6,300 ($75) | ₹6,300 |
| Error Monitoring | **Sentry Business** | ₹5,040 ($60) | ₹5,040 |
| Queue | **BullMQ + Upstash** | ₹4,200 ($50 Scale) | ₹4,200 |
| SMS / OTP | **MSG91** | 50K OTPs × ₹0.20 | ₹10,000 |
| CDN/DNS | **Cloudflare Pro** | ₹1,680 ($20) | ₹1,680 |
| Monitoring | **Grafana Cloud + New Relic** | ₹0 (free tiers) | ₹0 |

**Monthly Fixed Cost: ~₹1,32,640–1,74,640/month** *(before AI usage spikes and transaction fees)*

---

## GitHub Student Developer Pack Benefits

The following Student Pack benefits are directly applicable to Soul Yatri. **Activate at:** [education.github.com/pack](https://education.github.com/pack)

| Service | Benefit | Value (INR) | Applicable Layer |
|---------|---------|-------------|-----------------|
| **Vercel** | Pro plan free while student | ₹1,680/month | Frontend Hosting |
| **Neon** | Pro plan free for 1 year | ₹1,596/month (₹19,152/year) | Database |
| **Supabase** | Pro plan free for 1 year | ₹2,100/month (₹25,200/year) | Database + Auth + Storage |
| **Sentry** | 500,000 error events | ₹2,184/month value | Error Monitoring |
| **Trigger.dev** | Access to paid features | ~₹840/month value | Queue / Background Jobs |
| **Ably** | 1 year free | ₹2,436/month (₹29,232/year) | WebSocket / Real-time |
| **Pusher** | 500 connections + extended limits | ~₹840/month value | WebSocket |
| **DigitalOcean** | $200 credit | ₹16,800 one-time | Backend Hosting |
| **Twilio** | $50 credit | ₹4,200 one-time | SMS / OTP testing |
| **Namecheap** | 1 year .me domain free | ~₹1,500 value | Domain |
| **Clerk** | Pro features access | ~₹2,100/month value | Auth (if migrating) |
| **PostHog** | $50 credit | ₹4,200 one-time | Analytics |
| **SendGrid** | Essentials plan 1 year free (15K emails/month) | ₹1,680/month (₹20,160/year) | Email |
| **Bunny.net** | 1TB free bandwidth | ~₹840 value | CDN |

**Total Annual Student Pack Value for Soul Yatri: ~₹1,20,000–1,50,000/year**

> ⚠️ **Action Required:** GitHub Student Pack requires verification of student status. Apply with NMIMS student email. Verification typically takes 1-7 days.

---

## Migration Path

### Phase 0 → Phase 1: Wire Up What Exists (Week 1–2, ₹0 cost)

These are zero-cost migrations that activate already-written code:

```
1. Set DATABASE_URL env var → Neon free tier (Prisma already configured)
2. Set DAILY_API_KEY env var → Daily.co free tier (video routes already written)
3. Set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET → Razorpay test mode (payment routes ready)
4. Set OPENAI_API_KEY → OpenAI (AI routes already written)
5. Set RESEND_API_KEY → Resend free tier (swap console.log in email service)
6. Connect ws WebSocket server to React frontend (server is running; client not wired)
```

**Expected result:** All core features become functional with free-tier credentials.

### Phase 1 → Phase 2: Add Missing Fundamentals (Week 3–4, ₹0–500/month)

```
1. Add Sentry SDK (npm install @sentry/react @sentry/node) → DSN from GitHub Student Pack
2. Add PostHog SDK (npm install posthog-js) → Project API key from PostHog
3. Add MSG91 or Fast2SMS for OTP → Required for phone verification
4. Set up Cloudflare as DNS provider → Free DDoS + SSL + CDN
5. Configure Cloudflare R2 for file uploads → Replace local disk storage
6. DLT registration for SMS (TRAI) → Start immediately; takes 2-3 weeks
```

### Phase 2 → Phase 3: Production Hardening (Month 2–3, ₹2,000–8,000/month)

```
1. Migrate to Neon Pro (Student Pack free) → Enable DB branching for team dev
2. Configure BullMQ + Upstash Redis → Replace in-memory queue for emails + video cleanup
3. Enable Razorpay webhooks in production → Test payment → booking → video room flow end-to-end
4. Add rate limiting (express-rate-limit) → Protect AI endpoints from cost overruns
5. Add HTTPS-only enforcement + HSTS headers
6. Configure Prisma connection pooling (PgBouncer mode) for production loads
7. Add WhatsApp Business API via MSG91 → Indian users prefer WhatsApp over email
```

### Phase 3 → Scale: Infrastructure Evolution (Month 6+)

```
1. Separate backend into services (auth-svc, booking-svc, ai-svc) if needed
2. Migrate to Railway Pro or Fly.io for auto-scaling
3. Add Redis caching layer (Upstash) for astrology data + horoscope responses
4. Migrate email to Amazon SES (90% cheaper than Resend at 500K+ emails/month)
5. Consider 100ms as Daily.co replacement for better India video latency
6. Add Grafana Cloud observability stack
```

---

## Integration Priority Order (MVP Path)

The following is the recommended sequence to go from "code exists" to "first paying user":

### Priority 1 — Must Have Before First User (Week 1)
1. ✅ **Database live** → Set `DATABASE_URL` pointing to Neon free tier
2. ✅ **Email working** → Set `RESEND_API_KEY`; replace all `console.log` email calls
3. ✅ **Error monitoring** → Add Sentry (DSN takes 5 minutes; catches deploy-breaking bugs)
4. ✅ **Cloudflare DNS** → Route domain through Cloudflare for free SSL + DDoS protection

### Priority 2 — Must Have Before First Therapy Booking
5. ✅ **Video calls live** → Set `DAILY_API_KEY`; test therapist + client room creation
6. ✅ **Payments live** → Set `RAZORPAY_KEY_*`; test end-to-end payment → booking flow
7. ✅ **WebSocket wired to UI** → Connect ws server to React client for real-time booking updates

### Priority 3 — Must Have Before Public Beta
8. ✅ **OTP / Phone verification** → MSG91 or Fast2SMS; DLT registration (start NOW — 3-week lead)
9. ✅ **File storage to R2** → Replace local disk with Cloudflare R2 (files lost on Render restart)
10. ✅ **Analytics** → PostHog to understand user drop-off in booking funnel

### Priority 4 — Must Have Before Paid Subscriptions
11. ✅ **Background queue** → Trigger.dev or BullMQ for async email + payment webhooks
12. ✅ **AI chat live** → Set `OPENAI_API_KEY`; add rate limiting to prevent cost overruns
13. ✅ **Cache layer** → Upstash Redis for in-memory Map replacements (session data, rate limits)

### Priority 5 — Growth Stage
14. ✅ **WhatsApp notifications** → MSG91 WhatsApp API; Indian users open WhatsApp more than email
15. ✅ **Monitoring dashboard** → Grafana Cloud or New Relic for API performance visibility
16. ✅ **CDN for assets** → Cloudflare R2 + Cloudflare CDN for fast avatar/recording delivery across India

---

## India-Specific Considerations

### DPDPA 2023 (Digital Personal Data Protection Act)
- **Mental health data is sensitive personal data** under DPDPA 2023
- Explicit consent required before processing; store consent records in DB
- Data localisation: prefer providers with India data residency (Mumbai region on AWS/GCP, India PoPs on Cloudflare)
- **Do not use Google Analytics 4** — therapy session data must not flow to Google
- Appoint a Data Protection Officer (DPO) before processing health data at scale

### TRAI DLT (Distributed Ledger Technology) for SMS
- **Mandatory for transactional SMS** in India since 2018
- Register at [https://www.trai.gov.in/](https://www.trai.gov.in/) via your telecom operator (Airtel/Jio/Vi)
- Registration takes 2–3 weeks + ₹5,000–10,000 one-time fee
- **Start DLT registration as soon as you have a company entity** — do not wait for beta launch

### Payment Settlements (RBI Guidelines)
- Razorpay settlements in INR; no foreign exchange risk
- Therapy platform may need an NBFC partnership if offering EMI/credit features
- GST invoice generation required; Razorpay has built-in GST invoice feature

### WhatsApp Business API (India-Preferred Communication)
- India has 500M+ WhatsApp users; WhatsApp open rate is >90% vs 20% for email
- MSG91 and Twilio both offer WhatsApp Business API
- Requires Meta Business Verification (WhatsApp Business account); takes 1–2 weeks
- Cost: ₹0.35–0.58 per conversation (24-hour window); much higher engagement than SMS

### UPI Deep Links
- Razorpay supports UPI Intent (PhonePe, GPay, Paytm deep links)
- UPI success rate in India is 95%+ vs 80% for card payments
- Zero transaction fee for UPI on Razorpay (as of 2024 for small merchants); verify current policy
