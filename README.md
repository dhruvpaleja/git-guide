# Soul Yatri

A comprehensive mental wellness platform that connects users with qualified therapists, astrologers, and counselors for personalized mental health support.

## 🌟 Features

### **For Users**
- **Therapy Booking**: Connect with licensed therapists for online counseling sessions
- **Astrology Consultations**: Get guidance from experienced astrologers
- **Mood Tracking**: Monitor your emotional well-being with daily mood tracking
- **Meditation & Mindfulness**: Access guided meditation sessions
- **Journaling**: Personal journal for self-reflection and growth
- **Constellation & Connections**: Planned high-depth emotional graph and social resonance features; frontend concepts exist, backend is still being built

### **For Practitioners**
- **Professional Dashboard**: Manage sessions, availability, and client relationships
- **Video Sessions**: Planned, not yet integrated with a live video provider
- **Schedule Management**: Flexible scheduling and calendar integration
- **Earnings Tracking**: Planned, not yet implemented end-to-end
- **Client Management**: Secure client records and progress tracking

### **For Administrators**
- **User Management**: Oversee user accounts and permissions
- **Platform Analytics**: Comprehensive insights and reporting
- **Content Management**: Manage resources and educational content
- **Quality Assurance**: Monitor service quality and user satisfaction

## Current Implementation Reality

- Fully implemented end-to-end today: auth core, onboarding/profile/settings, mood tracking, journaling, meditation logs, notifications.
- Partially implemented: constellation frontend, sessions UI, practitioner views, astrology onboarding capture.
- Mostly planned / mocked / stubbed today: community, connections, messaging, full therapy operations, astrologer operations, admin analytics, AI runtime orchestration.
- Mock auth is enabled by default in development for role testing.

## 🚀 Tech Stack

### **Frontend**
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **Lucide React** for beautiful icons
- **React Router** for navigation
- **Context + hooks + service layer** for most current state and data flows

### **Backend**
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **PostgreSQL** for data storage
- **JWT** for authentication
- **bcrypt** for password hashing
- **ws** for current real-time notification transport

### **Infrastructure**
- **Vercel** for frontend deployment
- **Railway/Heroku** for backend hosting
- **PostgreSQL** for production database
- **Redis** planned for cache/queue scale-out; not the current default local runtime

## 🛠️ Development

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### **Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvpaleja/soul-yatri-website.git
   cd soul-yatri-website
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   cd ..
   ```

3. **Environment setup**
   ```bash
   # Copy environment files
   cp .env.example .env.local
   cp server/.env.example server/.env
   
   # Configure your database and API keys
   ```

4. **Database setup**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Frontend (http://localhost:5173)
   npm run dev
   
   # Backend (http://localhost:3000) - in another terminal
   cd server
   npm run dev
   ```

### **Development Accounts**

For testing, use these pre-configured accounts:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| User | user@test.com | user123 | User Dashboard |
| Therapist | therapist@test.com | therapist123 | Practitioner Dashboard |
| Astrologer | astrologer@test.com | astrologer123 | Astrology Dashboard |
| Admin | admin@test.com | admin123 | Admin Dashboard |

> These work with mock auth enabled (`VITE_ENABLE_MOCK_AUTH=true`, the default in dev).

## 📱 Pages & Features

### **Public Pages**
- **Landing Page**: Beautiful introduction to the platform
- **About Us**: Our mission and team
- **Services**: Detailed service offerings
- **Blog**: Mental health resources and articles
- **Contact**: Get in touch with our team

### **User Dashboard**
- **Overview**: Personal wellness dashboard
- **Sessions**: Booked and upcoming sessions
- **Journal**: Personal journal entries
- **Mood Tracking**: Daily mood and emotion tracking
- **Meditation**: Guided meditation library
- **Settings**: Profile and preferences

### **Practitioner Dashboard**
- **Schedule**: Manage availability and appointments
- **Clients**: View and manage client relationships
- **Earnings**: Track income and statistics
- **Profile**: Professional information and settings

Note: practitioner, astrologer, and admin dashboards currently include partial UI and planned flows, but several backend domains still return placeholder or `501 Not Implemented` responses.

### **Admin Dashboard**
- **Users**: Manage all user accounts
- **Analytics**: Platform usage and insights
- **Content**: Manage educational resources
- **Settings**: Platform configuration

## 🔐 Authentication & Security

- **JWT-based authentication** with secure token handling
- **Role-based access control** (User, Therapist, Astrologer, Admin)
- **Password strength validation** with zxcvbn
- **Rate limiting** on API endpoints
- **Secure cookie handling** for session management
- **Input validation** and sanitization
- **CORS configuration** for secure API access

## 📊 Data Models

### **Users**
- Basic user information and authentication
- Role-based permissions and access
- Profile settings and preferences

### **Profiles**
- **User Profile**: Personal information and wellness goals
- **Therapist Profile**: Professional credentials and specialties
- **Settings**: User preferences and privacy settings

### **Sessions**
- Booking and scheduling information
- Session types and pricing
- Status tracking and history

### **Content**
- Blog posts and articles
- Educational resources
- Meditation and mindfulness content

## 🧪 Testing & Quality

### **Full Quality Gate**
```bash
npm run quality:ci
```
Runs type-check → lint:ci → build → bundle:budget → server build → server lint:ci.

### **E2E Smoke Tests**
```bash
npm run test:e2e
```
One Playwright smoke suite currently covers 14 tests across public routes, auth, dashboard rendering, and resilience. These tests are not currently enforced in CI.

### **Individual Checks**
```bash
npm run type-check     # TypeScript
npm run lint:ci        # ESLint (zero warnings)
npm run build          # Production build
npm run bundle:budget  # JS chunk size checks
cd server && npm run build && npm run lint:ci  # Backend
```

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected for Vite + React)
3. Set environment variables
4. Deploy!

### **Backend (Railway/Heroku)**
1. Connect your GitHub repository
2. Configure Node.js environment
3. Set database connection and environment variables
4. Deploy and run database migrations

### **Database (PostgreSQL)**
- Production PostgreSQL database
- Connection pooling and optimization
- Regular backups and monitoring

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vercel** for the excellent hosting platform
- **Prisma** for the modern ORM
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Mental Health Professionals** who inspire this platform

## 📞 Support

For support, questions, or feedback:

- **Email**: support@soulyatri.com
- **GitHub Issues**: [Create an issue](https://github.com/dhruvpaleja/soul-yatri-website/issues)
- **Discord**: Join our community (coming soon)

---

**Built with ❤️ for mental wellness and personal growth**
#   G i t   C o n f i g u r a t i o n   U p d a t e d   f o r   V e r c e l 
 
 #   G i t   C o n f i g u r a t i o n   U p d a t e d   f o r   G i t H u b   +   V e r c e l   I n t e g r a t i o n 
 
 