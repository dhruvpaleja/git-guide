# Soul Yatri — Cost Model

> **Audit Date:** 2026-03-06  
> **Currency:** All costs in INR (₹). USD costs converted at **1 USD = ₹84**.  
> **Note:** Costs are estimates based on published pricing as of audit date. Always verify current pricing at provider websites before financial planning.

---

## Assumptions

| Parameter | Value | Notes |
|-----------|-------|-------|
| Exchange rate | 1 USD = ₹84 | Used for all USD→INR conversions |
| User geography | India (95%+) | INR payments; India PoPs preferred |
| Video session duration | avg 30 minutes | 1 therapist + 1 client = 2 participant-minutes per minute = 60 participant-mins per session |
| AI chat session | avg 20 messages/session | ~200 tokens/message = ~4,000 tokens per chat session |
| AI model split | 70% GPT-4o-mini / 30% GPT-4o | Mini for classification/summaries; GPT-4o for therapy AI |
| Storage per user | avg 5 MB | Avatar (1MB) + exported journal PDFs (4MB) |
| Email per user/month | avg 5 emails | Booking confirmation + weekly summary + OTP + misc |
| OTP rate | ~25% of sessions trigger OTP | Phone verification on signup + forgot password |
| Therapy booking conversion | 15% of registered users book therapy | Conservative estimate |
| Average therapy session revenue | ₹1,500–3,000 | Standard Indian online therapy pricing |
| Subscription revenue | ₹299–999/month | Wellness tools subscription tiers |

---

## Scenario 1: Student Solo Dev (0 Real Users, Just Building)

**Target: ₹0/month** — All free tiers. One developer building and testing locally.

| Service | Platform | Free Tier Used | Monthly Cost |
|---------|----------|---------------|--------------|
| Frontend Hosting | Vercel Hobby | Unlimited static deploys; 100GB bandwidth | ₹0 |
| Backend Hosting | Railway Hobby | $5/month credit covers hobby usage | ₹0 |
| Database | Neon Free | 0.5GB storage; 1 project; auto-suspend | ₹0 |
| File Storage | Local disk / Cloudflare R2 Free | 10GB free; no egress fees | ₹0 |
| Email | Resend Free | 3,000 emails/month | ₹0 |
| Video | Daily.co Free | 10,000 participant-minutes/month | ₹0 |
| AI/LLM | OpenAI (signup credit) | $5 new account credit (~₹420) | ₹0 (credit) |
| Auth | Custom JWT (current) | Self-hosted; no cost | ₹0 |
| Analytics | PostHog Free | 1M events/month | ₹0 |
| Error Monitoring | Sentry Free (Student Pack) | 500K errors/month | ₹0 |
| Queue | In-memory (current) / Trigger.dev Free | 50K job runs/month (Student Pack) | ₹0 |
| WebSocket | ws (current) | Self-hosted Node.js | ₹0 |
| SMS/OTP | Fast2SMS (signup credit) | ₹50 credit = ~200 test OTPs | ₹0 (credit) |
| CDN/DNS | Cloudflare Free | DNS + SSL + CDN | ₹0 |
| Domain | Namecheap (Student Pack) | 1 year .me free; or use vercel.app subdomain | ₹0 |

**Total Monthly Cost: ₹0/month**  
**Total Annual Cost: ₹0/year** *(GitHub Student Pack activated)*

> ⚡ **Action:** Activate GitHub Student Developer Pack immediately. NMIMS student email qualifies. Unlocks ~₹1,50,000/year in free credits.

---

## Scenario 2: Student Team Dev (2–5 Devs, Shared Environment, 0 Real Users)

**Target: ₹0–500/month** — Shared services. Multiple developers pushing to shared staging.

| Service | Platform | Plan | Notes | Monthly Cost |
|---------|----------|------|-------|--------------|
| Frontend Hosting | Vercel Hobby | Free | All devs deploy to preview URLs | ₹0 |
| Backend Hosting | Railway Hobby | $5/month credit | Shared staging server | ₹0–420 |
| Database | Neon Pro (Student Pack) | Free 1 year | Branching = separate DB per developer | ₹0 |
| File Storage | Cloudflare R2 Free | 10GB free | Shared S3-compatible bucket | ₹0 |
| Email | Resend Free | 3K/month | Dev email sends only | ₹0 |
| Video | Daily.co Free | 10K min/month | Enough for 83 test sessions | ₹0 |
| AI | OpenAI | $5 credit then pay-as-you-go | Shared API key; budget alerts set | ₹0–420 |
| Auth | Custom JWT | — | ₹0 | ₹0 |
| Analytics | PostHog Free | 1M events | All devs share one project | ₹0 |
| Error Monitoring | Sentry (Student Pack) | 500K errors | Separate environments per dev | ₹0 |
| Queue | Trigger.dev Free (Student Pack) | 50K runs | Shared background job env | ₹0 |
| SMS | Fast2SMS | ₹50 credit shared | Test OTPs only | ₹0–50 |
| CDN/DNS | Cloudflare Free | — | ₹0 | ₹0 |

**Total Monthly Cost: ₹0–500/month**  
**Dominant Cost:** OpenAI API usage during development (set hard budget limit of $5/month)

> 💡 **Tip:** Use Neon's database branching feature. Each developer gets their own database branch. PRs automatically get a test database. No more "someone dropped the dev DB" incidents.

---

## Scenario 3: Internal Testing (20 Internal Testers)

**Target: ₹500–2,000/month** — First real users (team + selected beta testers). First paid services kick in.

| Service | Platform | Plan | Usage Estimate | Monthly Cost |
|---------|----------|------|---------------|--------------|
| Frontend Hosting | Vercel Hobby/Pro | Hobby (Student Pack Pro) | 20 testers; light traffic | ₹0 |
| Backend Hosting | Railway Hobby | ~$15/month actual usage | Higher than dev due to real sessions | ₹1,260 |
| Database | Neon Pro (Student Pack) | Free 1 year | 20 users; <100MB data | ₹0 |
| File Storage | Cloudflare R2 | Free tier (100MB << 10GB limit) | 20 users × 5MB = 100MB | ₹0 |
| Email | Resend Free | 3K/month | 20 users × 5 emails = 100/month | ₹0 |
| Video | Daily.co Free | 10K min/month | 20 test sessions × 30min × 2 = 1,200 mins | ₹0 |
| AI | OpenAI GPT-4o-mini | ~$3/month | 20 testers × 5 AI chats = 100 sessions | ₹252 |
| Error Monitoring | Sentry Free | 5K errors | Internal testing generates bugs | ₹0 |
| SMS/OTP | Fast2SMS | ~20 OTPs | ₹0.25 × 20 = ₹5 | ₹5 |
| Analytics | PostHog Free | 1M events | Internal usage; far under limit | ₹0 |
| CDN/DNS | Cloudflare Free | — | ₹0 | ₹0 |

**Total Monthly Cost: ₹1,517/month** (~₹500–2,000 range)  
**First Paid Line Item:** Railway backend usage exceeds $5 free credit

---

## Scenario 4: Beta Launch (100–500 Real Users/Month, India)

**Target: ₹3,000–8,000/month** — Public beta. Therapy bookings live. Video sessions active. AI chat live. Real payments.

**Assumptions for this scenario:**
- 300 registered users; 100 monthly active users (MAU)
- 50 therapy sessions/month (each 30 min, 2 participants = 3,000 participant-minutes)
- 200 AI conversations/month (mix of journaling AI + astrology + therapy AI)
- 500 OTP sends/month (signup + password resets)
- 1,500 emails/month (booking confirmations + summaries)
- 1GB new files/month (avatars + journal exports)

| Service | Platform | Plan | Calculation | Monthly Cost |
|---------|----------|------|-------------|--------------|
| Frontend Hosting | Vercel Pro (Student Pack) | Free while student; else Pro | 100 MAU; low bandwidth | ₹0–1,680 |
| Backend Hosting | Railway Hobby/Pro | ~$20/month | 300 users; Node.js API | ₹1,680 |
| Database | Neon Pro (Student Pack) | Free 1 year | ~500MB data; 300 users | ₹0–1,596 |
| File Storage | Cloudflare R2 | Free 10GB; 1M ops free | 1GB/month upload; 100 users | ₹0 |
| Email | Resend Free | 3K/month | 1,500 emails well under 3K limit | ₹0 |
| Video | Daily.co Free → Paid | 10K free min; 3K used = free | 50 sessions × 60 participant-mins | ₹0 |
| AI | OpenAI GPT-4o-mini (70%) | $0.15/1M input + $0.60/1M output | 200 sessions × 4K tokens = 800K tokens → ~$1.50 input; output ~$0.48 | ₹168 |
| AI | OpenAI GPT-4o (30%) | $2.50/1M input + $10/1M output | 60 sessions × 4K tokens = 240K tokens → ~$0.60 input; output ~$0.24 | ₹71 |
| AI Total | — | — | Combined GPT cost | ₹239–504 |
| Error Monitoring | Sentry Free (Student Pack) | 500K errors | Beta bugs expected | ₹0 |
| Queue | Trigger.dev Free (Student Pack) | 50K runs | Email sends + booking tasks | ₹0 |
| SMS/OTP | MSG91 | ₹0.20/OTP | 500 OTPs × ₹0.20 | ₹100 |
| Analytics | PostHog Free | 1M events | 100 MAU × 100 events = 10K/month | ₹0 |
| CDN/DNS | Cloudflare Free | — | ₹0 | ₹0 |
| Payments | Razorpay | 2% per transaction | ~₹0 fixed cost | ₹0 fixed + 2% GMV |
| WebSocket | ws (current) | — | Included in backend | ₹0 |

**Total Monthly Fixed Cost: ₹2,019–3,780/month** *(lower bound with Student Pack active)*  
**Razorpay Fees:** If 30 therapy sessions at ₹1,500 avg = ₹45,000 GMV → ₹900 in Razorpay fees (2%)  
**Total All-In: ~₹2,919–4,680/month** at beta volume

---

## Scenario 5: Initial Production (1,000–5,000 Active Users/Month)

**Target: ₹10,000–25,000/month** — Growing user base, subscription revenue, all features live.

**Assumptions:**
- 3,000 registered users; 2,000 MAU
- 500 therapy sessions/month (30,000 participant-minutes → 20K over free tier)
- 2,000 AI conversations/month
- 5,000 OTP sends/month
- 10,000 emails/month
- 15GB total storage (accumulated)

| Service | Platform | Plan | Calculation | Monthly Cost |
|---------|----------|------|-------------|--------------|
| Frontend Hosting | Vercel Pro | $20/month | 2K MAU | ₹1,680 |
| Backend Hosting | Railway Pro | ~$40/month | 2 Node.js instances for HA | ₹3,360 |
| Database | Neon Pro | $19/month | ~2GB data; 3K users | ₹1,596 |
| File Storage | Cloudflare R2 | ~$1/month | 15GB × $0.015/GB = $0.23; ops ~$0.50 | ₹63 |
| Email | Resend Pro | $20/month | 10K emails → need Pro (>3K free limit) | ₹1,680 |
| Video | Daily.co | $0.00099/min after 10K free | 30K participant-min − 10K free = 20K × $0.00099 = $19.80 | ₹1,663 |
| AI | GPT-4o-mini (70%) + GPT-4o (30%) | Mixed | 2K sessions × 4K tokens mixed model | ₹1,764–3,528 |
| Error Monitoring | Sentry Team | $26/month | 100K+ events/month | ₹2,184 |
| Queue | BullMQ + Upstash Redis | $10/month | Replace in-memory queue | ₹840 |
| SMS/OTP | MSG91 | ₹0.20/OTP | 5K × ₹0.20 | ₹1,000 |
| Analytics | PostHog Free → Growth | Free (1M events) or $0 | 2K MAU × 200 events = 400K/month | ₹0 |
| CDN/DNS | Cloudflare Pro | $20/month | Advanced WAF for health platform | ₹1,680 |
| Monitoring | Sentry + BetterStack Free | ₹0 | Uptime monitoring free tier | ₹0 |

**Total Monthly Fixed Cost: ₹17,510–19,274/month**  
**Razorpay Fees:** 500 sessions × ₹2,000 avg = ₹10,00,000 GMV → ₹20,000 in fees (2%)  
**Total All-In (incl. payment fees): ~₹37,510–39,274/month**

---

## Scenario 6: Growth Production (10,000–50,000 Active Users/Month)

**Target: ₹50,000–2,00,000/month** — Significant user base. Multiple therapists. Subscription + therapy revenue stream.

**Assumptions:**
- 30,000 registered users; 15,000 MAU
- 5,000 therapy sessions/month (600,000 participant-minutes → 590K over free tier)
- 20,000 AI conversations/month
- 50,000 OTP sends/month
- 75,000 emails/month
- 150GB total storage

| Service | Platform | Plan | Monthly Cost |
|---------|----------|------|--------------|
| Frontend Hosting | Cloudflare Pages | Free (unlimited) | ₹0 |
| Backend Hosting | Fly.io (Mumbai + Singapore) | ~$100/month (4 VMs) | ₹8,400 |
| Database | Neon Scale | $69/month | ₹5,796 |
| DB Read Replica | Neon Pro replica | $19/month | ₹1,596 |
| Redis Cache | Upstash Redis Scale | $40/month | ₹3,360 |
| File Storage | Cloudflare R2 | ~$5/month (150GB + ops) | ₹420 |
| Email | Amazon SES | $0.10/1K × 75K = $7.50 | ₹630 |
| Video | Daily.co or 100ms | ~590K min × $0.00099 = $584 | ₹49,056 |
| AI | GPT-4o-mini (80%) + GPT-4o (20%) | 20K sessions × 4K tokens mixed | ₹14,112–28,224 |
| Error Monitoring | Sentry Business | $80/month | ₹6,720 |
| Queue | BullMQ + Upstash Redis | Included above | ₹0 |
| SMS/OTP | MSG91 | 50K × ₹0.20 | ₹10,000 |
| Analytics | PostHog Scale | ~$75/month | ₹6,300 |
| CDN/DNS | Cloudflare Pro | $20/month | ₹1,680 |
| Observability | Grafana Cloud Free + New Relic Free | Free tiers | ₹0 |
| WhatsApp API | MSG91 WhatsApp | ~50K messages × ₹0.45 avg | ₹22,500 |

**Total Monthly Fixed Cost: ₹1,30,570–1,44,682/month**  
**Razorpay Fees:** 5K sessions × ₹2,000 avg = ₹1,00,00,000 GMV → ₹2,00,000 in fees (2%)  
**Total All-In: ~₹3,30,570–3,44,682/month**

> 💡 **Video is the biggest cost driver at scale.** At 5,000 sessions/month, video alone costs ~₹49,000/month. Consider: (1) shorter session caps, (2) LiveKit self-hosted on Hetzner (~₹3,000/month flat), (3) negotiating volume pricing with Daily.co/100ms.

---

## Scenario 7: Scale (1,00,000+ Users/Month)

**Target: ₹2,00,000–5,00,000/month** — Established platform. Multiple therapist verticals. App + Web.

**Assumptions:**
- 1,00,000 registered users; 50,000 MAU
- 15,000 therapy sessions/month
- 1,00,000 AI conversations/month
- 2,00,000 OTP sends/month
- 5,00,000 emails/month
- 1TB total storage

| Service | Platform | Estimated Monthly Cost |
|---------|----------|----------------------|
| Frontend | Cloudflare Pages | ₹0 |
| Backend | Fly.io multi-region OR Kubernetes on GKE Mumbai | ₹42,000–84,000 |
| Database | Neon Scale + PgBouncer | ₹16,800 |
| Cache | Upstash Redis Enterprise | ₹16,800 |
| File Storage | Cloudflare R2 (1TB) | ₹1,260 |
| Email | Amazon SES ($0.10/1K × 500K = $50) | ₹4,200 |
| Video | LiveKit self-hosted (Hetzner AX102) OR 100ms Scale | ₹25,200–84,000 |
| AI | GPT-4o-mini (90%) + GPT-4o (10%) at 100K sessions | ₹42,000–1,26,000 |
| Error Monitoring | Sentry Enterprise | ₹25,200 |
| Queue | BullMQ + Redis Cluster | ₹16,800 |
| SMS | MSG91 (2L OTPs × ₹0.20) | ₹40,000 |
| WhatsApp | MSG91 (1L messages) | ₹45,000 |
| Analytics | Mixpanel Growth or Amplitude | ₹8,400 |
| Observability | Grafana Cloud Pro | ₹8,400 |
| CDN/DNS | Cloudflare Business | ₹16,800 |
| Compliance (DPDPA audit, DPO) | Consultant | ₹25,000 |

**Estimated Total: ₹3,33,860–5,12,660/month**  
**Razorpay Fees at Scale:** 15K sessions × ₹2,000 avg = ₹3,00,00,000 GMV → ₹6,00,000 in fees/month  
**Revenue Target to Cover Costs:** ₹50 ARPU × 50,000 MAU = ₹25,00,000/month (sustainable)

---

## One-Time Costs

| Item | Cost | Notes |
|------|------|-------|
| Domain name — soul-yatri.com | ₹800–1,200/year | GoDaddy/Namecheap; .in domains ~₹600/year |
| Domain name — soul-yatri.in | ₹600–900/year | .in domain for Indian identity |
| SSL Certificate | ₹0 | Cloudflare or Let's Encrypt (free) |
| DLT Registration (TRAI) for SMS | ₹5,000–10,000 one-time | Mandatory for transactional SMS in India; register via Airtel/Jio/Vi |
| WhatsApp Business Verification (Meta) | ₹0 (process cost) | Requires registered business entity; takes 2-4 weeks |
| Google Play Store (Android app, if built) | $25 one-time (~₹2,100) | One-time developer registration |
| Apple App Store (iOS app, if built) | $99/year (~₹8,316/year) | Annual developer program fee |
| Figma Pro (design tool) | ₹5,100/year | Free via GitHub Student Pack while student |
| Company registration (if not done) | ₹5,000–15,000 | Required for payment gateway + DLT + WhatsApp Business |
| Trademark registration (logo + name) | ₹4,500/class | Recommended before public launch; 18-24 month process |
| Legal review (Terms of Service + Privacy Policy for health data) | ₹15,000–50,000 | Essential for therapy/health platform; DPDPA compliance |

**Estimated One-Time Setup Cost: ₹35,000–95,000** *(excluding app stores and legal fees)*

---

## Hidden Costs

These costs are often overlooked in budget planning:

| Hidden Cost | When It Hits | Estimated Impact |
|-------------|-------------|-----------------|
| **Data egress fees (AWS/GCP)** | Any significant file download activity | ₹0.170/GB from Mumbai region; can be ₹5,000+/month at scale |
| **Support tier upgrades** | When a critical service breaks in prod | Daily.co Enterprise support: +$100/month; Vercel Enterprise: +$400/month |
| **Razorpay transaction fees at scale** | Every payment processed | 2% of GMV; at ₹1Cr GMV = ₹2,00,000/month in fees |
| **OpenAI rate limit upgrades** | Users start using AI features heavily | Tier 2 (default) → Tier 3 requires $250 spend; Tier 4 requires $1,000 spend |
| **Video minutes overages** | Therapy sessions go over 30 min | Daily.co $0.00099/min; 100 extra-long sessions = +₹840/month |
| **Database compute overages** | Traffic spikes (media mentions, viral moment) | Neon auto-scales compute; Neon Scale: $0.16/compute-hour |
| **Cloudflare Workers invocations** | If using CF Workers beyond free tier | 100K requests/day free; $5/10M requests after |
| **Sentry event overages** | Bugs during new feature launches | Sentry Team: $0.000290/event over quota |
| **DPDPA compliance audit** | Annual (once law is enforced) | ₹50,000–2,00,000/year depending on data volume |
| **Data breach incident response** | Hopefully never | Legal + technical: ₹5,00,000+ if it occurs |
| **WhatsApp message template rejections** | Anytime Meta rejects templates | Requires re-submission; 3-7 day delay in notifications |
| **App Store rejection + resubmission** | Mobile app development | Loss of time (1-3 weeks); no direct cost but sprint delay |

---

## Cost Optimisation Strategies

### Strategy 1: Use Free Tiers Strategically
- **Neon auto-suspend:** Neon free tier computes suspend after 5 min inactivity. Dev DB costs ₹0.
- **Railway $5 credit:** Hobby plan includes $5/month credit. Keep dev + staging under $5.
- **Daily.co 10K minutes:** Design therapy sessions to stay within 10K free participant-minutes (= 83 sessions × 30min × 2 participants). Beta can be entirely free.
- **PostHog 1M events:** 1M events/month = 100 MAU × 10,000 events each. Most beta apps never exceed this.

### Strategy 2: Optimize AI Costs (Single Largest Variable Cost)
```
1. Use GPT-4o-mini for ALL classification, moderation, summaries (93% cheaper than GPT-4o)
2. Cache horoscope/astrology responses in Redis (same query → cached answer for 24h)
3. Implement token limits: cap journal AI at 500 tokens output, therapy AI at 1,000 tokens
4. Add user-level AI usage limits (free tier: 5 AI chats/day; pro tier: unlimited)
5. Use Groq (Llama 3.1 70B) free tier for non-critical AI features during dev
```
**Estimated savings:** 60-70% reduction in AI costs vs uncapped GPT-4o usage.

### Strategy 3: Eliminate Egress Fees
```
1. Use Cloudflare R2 instead of AWS S3 → $0 egress fees (saves ₹0.170/GB)
2. Serve all media through Cloudflare CDN → Free egress from Cloudflare edge
3. Use Backblaze B2 + Cloudflare CDN partnership → Zero-cost egress
```
**Estimated savings:** At 1TB/month downloads, saves ~₹14,280/month vs AWS S3.

### Strategy 4: Self-Host at Scale (Video)
```
LiveKit self-hosted on Hetzner AX102 (Germany/Finland, €59/month = ~₹5,300):
- Handles 1,000+ concurrent video sessions
- vs Daily.co at 1,000 sessions × 60 min × 2 participants = 120,000 min → $118.80 = ₹9,979
- Break-even: ~150 sessions/month; saves ₹4,600+/month above that
```

### Strategy 5: WhatsApp Over SMS + Email
- India WhatsApp open rate: 90% vs 20% for email
- Cost comparison: ₹0.35–0.58 per WhatsApp conversation vs ₹0.20/SMS + ₹0.005/email
- WhatsApp conversations have a 24-hour free window after user initiates
- **User-initiated conversations are free** (user sends "book appointment" → all replies free for 24h)
- Design flows so users initiate WhatsApp conversations to reduce notification costs

### Strategy 6: Student Pack Maximisation
```
Activate ALL applicable GitHub Student Pack benefits:
- Vercel Pro: saves ₹1,680/month
- Neon Pro: saves ₹1,596/month
- Supabase Pro: saves ₹2,100/month (use if not using Neon)
- SendGrid Essentials: saves ₹1,680/month
- Sentry: saves ₹2,184/month
- Trigger.dev: saves ~₹840/month
- DigitalOcean $200: one-time ₹16,800 value
- Twilio $50: one-time ₹4,200 (test OTPs)
Total annual saving: ~₹1,20,000–1,50,000/year
```

---

## Minimum Viable Free Stack (₹0/month Path)

This is the complete stack that runs at ₹0/month for a solo developer or small team:

```
Frontend:  Vercel Hobby (free)           → Already configured
Backend:   Railway Hobby ($5 credit)     → $5/month credit covers small apps
Database:  Neon Free Tier               → 0.5GB; Prisma-native; auto-suspend
Storage:   Cloudflare R2 (10GB free)    → S3-compatible; no egress fees
Email:     Resend (3K emails/month)     → Already in TODOs; best DX
Video:     Daily.co (10K min/month)     → Already in codebase; activate API key
AI:        Groq (Llama 3.1 70B free)   → Fast inference; free tier for dev
           + OpenAI $5 signup credit    → For GPT-4o-mini testing
Auth:      Custom JWT (current)         → Already live
Analytics: PostHog (1M events)         → Add <script> tag; done
Errors:    Sentry Free (Student Pack)  → DSN + npm install; done in 10 min
Queue:     Trigger.dev (Student Pack)  → 50K runs/month; no Redis needed
DNS/CDN:   Cloudflare (free)           → DNS + SSL + DDoS protection
SMS:       Fast2SMS (₹50 signup)       → Test OTPs; real OTP needs DLT registration
```

**Monthly Cost: ₹0** | **Setup Time: ~2 days** | **Capabilities: Full feature set in dev**

---

## Recommended Student Stack Under ₹2,000/month

This stack activates all GitHub Student Pack benefits and supports a real beta launch:

| Service | Platform | Monthly Cost | Student Benefit |
|---------|----------|--------------|----------------|
| Frontend | Vercel Pro | ₹0 | Student Pack: Pro free |
| Backend | Railway Pro | ₹1,260 ($15) | No Student Pack; cheapest real hosting |
| Database | Neon Pro | ₹0 | Student Pack: 1 year free |
| Storage | Cloudflare R2 | ₹0 | Free 10GB |
| Email | SendGrid Essentials | ₹0 | Student Pack: 1 year free (15K/month) |
| Video | Daily.co | ₹0 | Free 10K min/month |
| AI | OpenAI GPT-4o-mini | ₹252 (~$3) | No benefit; keep under $5/month limit |
| Errors | Sentry | ₹0 | Student Pack: 500K events |
| Queue | Trigger.dev | ₹0 | Student Pack: access |
| SMS | Fast2SMS | ₹50–250 | ₹50 signup credit |
| DNS | Cloudflare | ₹0 | Free forever |
| Analytics | PostHog | ₹0 | Free 1M events |

**Total: ₹1,562–1,762/month** *(under ₹2,000 target)*  
**Capabilities:** Auth, video therapy, AI chat, payments, email, OTP, analytics, error monitoring — **full production feature set**

---

## Cost Summary Table by Scenario

| Scenario | Users | Monthly Fixed Cost | Payment Fees | Total All-In |
|----------|-------|-------------------|-------------|-------------|
| Solo Dev | 0 | ₹0 | ₹0 | **₹0/month** |
| Team Dev (2-5) | 0 | ₹0–500 | ₹0 | **₹0–500/month** |
| Internal Testing (20) | 20 | ₹1,517 | ₹0 | **~₹1,517/month** |
| Beta Launch | 100–500 | ₹2,019–3,780 | ~₹900 (2% of ₹45K GMV) | **~₹3,000–5,000/month** |
| Initial Production | 1,000–5,000 | ₹17,510–19,274 | ~₹20,000 (2% of ₹10L GMV) | **~₹37,000–40,000/month** |
| Growth Production | 10,000–50,000 | ₹1,30,570–1,44,682 | ~₹2,00,000 (2% of ₹1Cr GMV) | **~₹3,30,000–3,45,000/month** |
| Scale | 1,00,000+ | ₹3,33,860–5,12,660 | ~₹6,00,000 (2% of ₹3Cr GMV) | **~₹9,33,000–11,12,000/month** |

> **Note:** Payment fees (Razorpay 2%) become the dominant cost at scale. At ₹3Cr GMV/month, Razorpay fees (₹6L) exceed all infrastructure costs combined. Negotiate custom rates with Razorpay above ₹1Cr/month GMV (they offer 1.5–1.75% for high-volume merchants).

---

## Unit Economics Reference

| Metric | Value | Notes |
|--------|-------|-------|
| Cost per registered user (beta) | ~₹15–30 | At 300 users, ₹4,500 monthly infra |
| Cost per therapy session (infra only) | ~₹33–50 | Video + AI + booking overhead |
| Cost per AI conversation | ~₹1.26–2.52 | GPT-4o-mini at 4K tokens |
| Cost per OTP | ₹0.20 | MSG91 DLT route |
| Cost per email | ₹0.005–0.10 | Resend free → SES at scale |
| Cost per video minute (infra) | ₹0.083 | Daily.co $0.00099/min |
| Break-even therapy sessions/month | 25–30 sessions | At ₹1,500/session with 30% platform cut |
| LTV:CAC target | 3:1 minimum | Standard SaaS benchmark |
