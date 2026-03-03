# 🚀 Development Setup & Quick Access Guide

## ⚡ Quick Start (5 minutes)

### 1. Setup Database & Seed Users
```bash
# In server directory
cd server

# Reset database and create dev users
npm run db:reset

# Or step by step:
npx prisma migrate dev
npm run seed:dev
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Quick Login Access 🎯

**🔗 One-Click Login URLs (after server starts):**

| Dashboard | URL | Credentials |
|-----------|-----|-------------|
| 👤 **User** | http://localhost:3000/api/v1/dev-login/user@test.com | Auto-login |
| 👨‍⚕️ **Therapist** | http://localhost:3000/api/v1/dev-login/therapist@test.com | Auto-login |
| 🔮 **Astrologer** | http://localhost:3000/api/v1/dev-login/astrologer@test.com | Auto-login |
| 👑 **Admin** | http://localhost:3000/api/v1/dev-login/admin@test.com | Auto-login |

**📱 Manual Login Credentials:**
```
User Dashboard:
Email: user@test.com
Password: user123

Therapist Dashboard:  
Email: therapist@test.com
Password: therapist123

Astrologer Dashboard:
Email: astrologer@test.com  
Password: astrologer123

Admin Dashboard:
Email: admin@test.com
Password: admin123
```

## 🎯 Dashboard Features

### 👤 User Dashboard
- ✅ **Therapy Booking** - Browse and book therapy sessions
- ✅ **Mood Tracking** - Daily mood entries and analytics
- ✅ **Journal** - Personal journal with mood tagging
- ✅ **Meditation** - Guided meditation sessions
- ✅ **Astrology** - Birth chart analysis and predictions
- ✅ **Community** - Support groups and discussions
- ✅ **Profile Management** - Complete user profile

### 👨‍⚕️ Therapist Dashboard  
- ✅ **Session Management** - View upcoming and past sessions
- ✅ **Availability** - Set working hours and availability
- ✅ **Earnings** - Track income and payment history
- ✅ **Client Notes** - Secure session notes (encrypted)
- ✅ **Profile** - Professional profile and qualifications
- ✅ **Calendar** - Integrated session calendar

### 🔮 Astrologer Dashboard
- ✅ **Consultations** - Manage astrology sessions
- ✅ **Birth Charts** - Generate and analyze charts
- ✅ **Predictions** - Daily/weekly predictions
- ✅ **Client History** - Past consultations and notes
- ✅ **Earnings** - Payment tracking and analytics

### 👑 Admin Dashboard
- ✅ **User Management** - View and manage all users
- ✅ **Therapist Verification** - Approve therapist applications
- ✅ **Platform Analytics** - Usage statistics and metrics
- ✅ **Content Moderation** - Review and moderate content
- ✅ **Settings** - Platform configuration

## 🛠️ Development Commands

```bash
# Database Operations
npm run db:reset      # Reset DB + seed dev users
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Run linting

# Seeding
npm run seed:dev      # Seed only dev users
```

## 🧪 Testing Features

### Switching Between Dashboards
1. **Method 1**: Use the one-click URLs above
2. **Method 2**: Manual login with credentials
3. **Method 3**: Use different browser tabs/incognito windows

### Feature Testing Checklist
- [ ] **User Flow**: Registration → Profile → Book Session → Payment
- [ ] **Therapist Flow**: Login → Set Availability → Conduct Session → View Earnings
- [ ] **Admin Flow**: Login → Verify Therapist → View Analytics → Moderate Content
- [ ] **Cross-Role**: Test permissions and access controls

## 🔧 Development Tips

### 1. Fast Context Switching
```bash
# Keep these URLs bookmarked for quick access:
http://localhost:3000/api/v1/dev-login/user@test.com
http://localhost:3000/api/v1/dev-login/therapist@test.com
http://localhost:3000/api/v1/dev-login/astrologer@test.com
http://localhost:3000/api/v1/dev-login/admin@test.com
```

### 2. Browser DevTools
- Use different browser profiles for each role
- Or use incognito windows to stay logged in as different users
- Save login responses in Postman for API testing

### 3. Database Inspection
```bash
# View all dev users
npx prisma studio

# Check user data
npx prisma db seed
```

## 🐛 Troubleshooting

### "Wrong Password" Issues
```bash
# Reset and re-seed users
npm run db:reset

# Or manually update password in database
```

### Server Won't Start
```bash
# Check environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Reset database
npm run db:reset
```

### Login Not Working
1. Ensure server is running on port 3000
2. Check database connection
3. Verify dev users are created
4. Clear browser cookies/localStorage

## 📱 Mobile Testing

The dev login endpoints work great for mobile testing too:
- Open the URLs on mobile browser
- Copy tokens to mobile app
- Test responsive design

## 🎉 Ready to Code!

You now have:
- ✅ 4 pre-configured dev accounts
- ✅ One-click login access  
- ✅ Complete feature access
- ✅ Easy dashboard switching
- ✅ Full development environment

Start building and testing features instantly! 🚀
