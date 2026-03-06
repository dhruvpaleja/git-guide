# 📱 Soul Yatri - Mobile App Conversion Plan

## Executive Summary

**Goal:** Convert the existing React web application into a native mobile app for **iOS (App Store)** and **Android (Play Store)**

**Recommended Approach:** **React Native with Expo**

**Estimated Timeline:** **14-19 weeks (3.5-4.5 months)**

**Estimated Code Reuse:** **60-70%**

---

## 🎯 Why React Native + Expo?

### Advantages
| Factor | Benefit |
|--------|---------|
| **Same Tech Stack** | React + TypeScript already in use |
| **Code Reuse** | 60-70% business logic reusable |
| **Team Skills** | Existing React expertise transfers directly |
| **Single Codebase** | One codebase for iOS + Android |
| **Fast Development** | Hot reload, instant preview |
| **Native Performance** | Near-native performance with native modules |
| **Expo Ecosystem** | Pre-built native modules (camera, notifications, auth, etc.) |
| **Easy Deployment** | EAS Build for App Store + Play Store submission |

### Alternative Options Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Flutter** | Great performance, beautiful UI | New language (Dart), less code reuse | ❌ Not recommended |
| **Native (Swift/Kotlin)** | Best performance | 2x development effort, 2 codebases | ❌ Too expensive |
| **Ionic/Capacitor** | Web tech reuse | Performance limitations | ❌ Not ideal for complex app |
| **React Native CLI** | Full control | More setup, manual native config | ⚠️ Possible but more work |
| **React Native + Expo** | Fast setup, managed workflow | Some native module limitations | ✅ **RECOMMENDED** |

---

## 📊 Current Application Analysis

### App Complexity
- **15+ Pages** (Public + Protected routes)
- **13 Feature Modules**
- **45+ UI Components** (shadcn/ui)
- **12 Backend Controllers**
- **15 Database Models**
- **JWT Authentication**
- **Real-time WebSocket**
- **Payment Integration** (Razorpay)
- **Video Calling** (Daily.co)

### Core Features to Mobile
1. ✅ User Authentication (Login/Signup)
2. ✅ Dashboard with mood tracking, journaling, meditation
3. ✅ Constellation (emotional mapping visualization)
4. ✅ Therapy/Astrology session booking
5. ✅ Practitioner dashboards
6. ✅ Courses & Blog content
7. ✅ Notifications (push notifications)
8. ✅ Payment processing
9. ✅ Video calls for sessions
10. ✅ Admin panel

---

## 🏗️ Mobile App Architecture

### Proposed Architecture

```
soul-yatri-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Auth stack
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx
│   ├── (dashboard)/              # Dashboard stack
│   │   ├── index.tsx             # Dashboard home
│   │   ├── mood.tsx
│   │   ├── journal.tsx
│   │   ├── meditate.tsx
│   │   ├── constellation.tsx
│   │   ├── sessions.tsx
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── (practitioner)/           # Practitioner stack
│   │   ├── index.tsx
│   │   ├── clients.tsx
│   │   ├── availability.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── home.tsx
│   │   ├── courses.tsx
│   │   ├── blogs.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
│
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # NativeWind components (buttons, cards, inputs)
│   │   ├── layout/               # Headers, footers, sidebars
│   │   └── shared/               # Shared components
│   ├── config/                   # App configuration
│   ├── constants/                # Constants (API URLs, keys)
│   ├── context/                  # React Context (Auth, Theme)
│   ├── hooks/                    # Custom hooks
│   ├── services/                 # API, WebSocket, Storage
│   ├── store/                    # State management (Zustand recommended)
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── assets/                   # Images, fonts, icons
│
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json
├── tailwind.config.js            # NativeWind config
└── tsconfig.json
```

### State Management Recommendation

**Current:** React Context

**Recommended for Mobile:** **Zustand + React Query**

| Library | Purpose | Why |
|---------|---------|-----|
| **Zustand** | Global state (auth, theme, user prefs) | Simpler than Redux, less boilerplate |
| **React Query** | Server state (API data) | Caching, background sync, optimistic updates |
| **React Context** | Theme, Auth providers | Still useful for specific cases |

---

## 🗺️ Phase-by-Phase Migration Plan

### **Phase 1: Foundation & Setup (Weeks 1-3)**

#### Week 1: Project Setup
- [ ] Initialize Expo project with TypeScript
- [ ] Configure NativeWind (Tailwind for React Native)
- [ ] Set up folder structure
- [ ] Configure ESLint + Prettier
- [ ] Set up Git repository
- [ ] Create app icons and splash screen

**Deliverables:**
```bash
npx create-expo-app@latest soul-yatri-mobile -t tabs
cd soul-yatri-mobile
npm install nativewind tailwindcss
npm install @react-navigation/native @react-navigation/stack
npm install expo-router expo-linking
```

#### Week 2: Core Infrastructure
- [ ] Port TypeScript types from `/src/types/`
- [ ] Port constants from `/src/constants/`
- [ ] Port API service (`api.service.ts`)
- [ ] Set up environment variables
- [ ] Configure Axios/ Fetch with interceptors
- [ ] Set up secure storage (expo-secure-store)

**Code Reuse:**
```typescript
// Direct copy from web project
// src/types/index.ts
// src/types/auth.types.ts
// src/types/user.types.ts
// src/constants/api.constants.ts
// src/constants/routes.constants.ts
```

#### Week 3: Authentication Context
- [ ] Port AuthContext
- [ ] Implement token storage (secure store)
- [ ] Auto-login on app launch
- [ ] Token refresh logic
- [ ] Biometric authentication (expo-local-authentication)
- [ ] Mock auth for development

**Deliverables:**
```typescript
// src/context/AuthContext.tsx
- Login function
- Signup function
- Logout function
- Token refresh
- Auto-hydration
- Biometric auth toggle
```

---

### **Phase 2: Navigation & Core Screens (Weeks 4-5)**

#### Week 4: Navigation Setup
- [ ] Implement React Navigation
- [ ] Create navigation structure:
  - Auth Stack (Login, Signup)
  - Main Tabs (Home, Courses, Blogs, Profile)
  - Dashboard Stack
  - Practitioner Stack
- [ ] Implement deep linking
- [ ] Add navigation guards (protected routes)

**Navigation Structure:**
```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
  <Stack.Screen name="(practitioner)" options={{ headerShown: false }} />
</Stack>
```

#### Week 5: Auth Screens
- [ ] Login Screen
- [ ] Signup Screen
- [ ] Password Reset
- [ ] Form validation (Zod + React Hook Form)
- [ ] Error handling
- [ ] Loading states

**Code Reuse:**
```typescript
// Reuse from web:
- Form validation schemas (Zod)
- Error messages
- API integration logic
- Button components (adapted for RN)
```

---

### **Phase 3: Feature Modules (Weeks 6-13)**

#### Week 6-7: Home & Landing (Priority 1)
- [ ] App home screen (simplified landing)
- [ ] Stats section
- [ ] Services section
- [ ] CTA section
- [ ] Pull-to-refresh
- [ ] Skeleton loading states

**Components to Build:**
- HeroSection (mobile-optimized)
- StatsCard
- ServiceCard
- CTAButton

#### Week 8-9: Dashboard & Health Tools (Priority 1)
- [ ] Dashboard home
- [ ] Mood tracking screen
- [ ] Journal screen
- [ ] Meditation library
- [ ] Constellation visualization
- [ ] Notifications screen

**Key Features:**
```typescript
// Mood Tracking
- Daily mood entry
- Mood calendar
- Mood trends (charts)
- Emoji picker

// Journal
- Rich text editor
- Entry list
- Search & filter
- Mood tags

// Meditation
- Audio player
- Meditation categories
- Progress tracking
- Favorites
```

#### Week 10-11: Constellation Feature (Priority 2)
- [ ] Canvas implementation (react-native-skia)
- [ ] Node creation/editing
- [ ] Node connections
- [ ] Visualization
- [ ] Insights panel
- [ ] Gesture handling

**Technical Approach:**
```typescript
// Use react-native-skia for canvas
// Replace Three.js with Skia for 2D visualization
// Implement custom gesture handlers
// Port node logic from web version
```

#### Week 12: Sessions & Booking (Priority 2)
- [ ] Session listing
- [ ] Booking flow
- [ ] Calendar integration
- [ ] Payment integration (Razorpay)
- [ ] Video call integration (Daily.co)
- [ ] Session reminders

**Integrations:**
- Razorpay React Native SDK
- Daily.co React Native SDK
- expo-calendar for reminders

#### Week 13: Courses & Blogs (Priority 3)
- [ ] Course listing
- [ ] Course details
- [ ] Blog listing
- [ ] Blog post view
- [ ] Search functionality
- [ ] Bookmarks/favorites

---

### **Phase 4: Practitioner Features (Weeks 14-15)**

#### Week 14: Practitioner Dashboard
- [ ] Practitioner home
- [ ] Today's sessions
- [ ] Client management
- [ ] Availability calendar
- [ ] Earnings overview

#### Week 15: Practitioner Tools
- [ ] Session notes
- [ ] Client history
- [ ] Availability management
- [ ] Profile editing
- [ ] Notification preferences

---

### **Phase 5: Native Features (Weeks 16-17)**

#### Week 16: Native Integrations
- [ ] **Push Notifications** (expo-notifications)
  - Session reminders
  - New messages
  - Mood check-ins
  - Marketing notifications

- [ ] **Camera & Image Upload**
  - Profile pictures
  - Journal attachments
  - Constellation images

- [ ] **Biometric Authentication**
  - Face ID / Touch ID
  - Fingerprint auth

- [ ] **Secure Storage**
  - Token storage
  - Sensitive data encryption

#### Week 17: Advanced Native Features
- [ ] **Offline Support**
  - Local database (WatermelonDB or Realm)
  - Sync on reconnect
  - Offline mood/journal entries

- [ ] **Background Sync**
  - Background fetch
  - Data preloading

- [ ] **Deep Linking**
  - Universal links (iOS)
  - App links (Android)
  - Email/SMS deep links

- [ ] **Share Functionality**
  - Share courses
  - Share blog posts
  - Share constellation

---

### **Phase 6: Polish & Testing (Weeks 18-19)**

#### Week 18: Performance & Polish
- [ ] Performance optimization
  - FlatList optimization
  - Image caching
  - Memoization
  - Bundle size reduction

- [ ] UI Polish
  - Animations (React Native Reanimated)
  - Haptic feedback
  - Loading states
  - Error boundaries

- [ ] Accessibility
  - Screen reader support
  - Dynamic type sizes
  - Color contrast
  - Touch targets (min 44px)

#### Week 19: Testing & Bug Fixes
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Detox)
- [ ] Device testing
  - iOS: iPhone SE, 13, 14 Pro Max
  - Android: Various screen sizes

- [ ] Bug fixes
- [ ] Performance tuning
- [ ] Memory optimization

---

### **Phase 7: Deployment (Week 20)**

#### App Store Submission
- [ ] Create Apple Developer account ($99/year)
- [ ] Create App Store Connect listing
- [ ] Generate app screenshots (all device sizes)
- [ ] Write app description
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Submit for review

#### Play Store Submission
- [ ] Create Google Play Console account ($25 one-time)
- [ ] Create Play Store listing
- [ ] Generate screenshots
- [ ] Write app description
- [ ] Privacy policy
- [ ] Content rating questionnaire
- [ ] Submit for review

#### Backend Preparation
- [ ] Production API endpoints
- [ ] SSL certificates
- [ ] Rate limiting
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics (Firebase, Mixpanel)

---

## 🛠️ Technology Stack

### Core Technologies
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React Native 0.73+ | Cross-platform mobile framework |
| **Platform** | Expo SDK 50+ | Managed React Native workflow |
| **Language** | TypeScript 5.3+ | Type safety |
| **Routing** | Expo Router 3+ | File-based navigation |
| **Styling** | NativeWind 4+ | Tailwind CSS for React Native |

### State & Data
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Global State** | Zustand | Simple state management |
| **Server State** | TanStack Query (React Query) | API caching, background sync |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **Local DB** | WatermelonDB | Offline-first database |
| **Storage** | expo-secure-store | Secure token storage |

### UI & Animation
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Components** | Tamagui / NativeBase | UI component library |
| **Icons** | Lucide React Native | Icon library |
| **Animations** | React Native Reanimated | 60fps animations |
| **Gestures** | React Native Gesture Handler | Touch gestures |
| **Canvas** | react-native-skia | Constellation visualization |
| **Charts** | react-native-gifted-charts | Mood/analytics charts |
| **Calendar** | react-native-calendars | Session booking calendar |

### Native Features
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Notifications** | expo-notifications | Push notifications |
| **Camera** | expo-camera | Profile pictures, journal attachments |
| **Image Picker** | expo-image-picker | Image selection |
| **Biometrics** | expo-local-authentication | Face ID / Fingerprint |
| **Haptics** | expo-haptics | Haptic feedback |
| **Deep Linking** | expo-linking | Universal/app links |
| **Sharing** | expo-sharing | Share functionality |
| **Calendar** | expo-calendar | Session reminders |

### Backend Integration
| Category | Technology | Purpose |
|----------|-----------|---------|
| **API Client** | Axios | HTTP requests |
| **WebSocket** | expo-websocket | Real-time updates |
| **Video Calls** | Daily.co React Native SDK | Therapy sessions |
| **Payments** | Razorpay React Native SDK | In-app payments |

### DevOps & Quality
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Build** | EAS Build | Cloud builds for iOS/Android |
| **Submit** | EAS Submit | App Store/Play Store submission |
| **Updates** | EAS Update | OTA updates |
| **Testing** | Jest + Detox | Unit + E2E tests |
| **Crash Reporting** | Sentry | Error tracking |
| **Analytics** | Firebase Analytics | User analytics |
| **Performance** | Flipper | Debugging & profiling |

---

## 📦 Code Reuse Strategy

### High Reuse (80-100%)
```
✅ TypeScript types (/src/types/)
✅ Constants (/src/constants/)
✅ Config (/src/config/)
✅ API service layer (/src/services/api.service.ts)
✅ WebSocket service (/src/services/websocket.service.ts)
✅ Utility functions (/src/utils/)
✅ Form validation schemas (Zod)
✅ Auth logic (context, hooks)
✅ Business logic modules
```

### Medium Reuse (50-70%)
```
⚠️ React components (adapt to React Native)
⚠️ Custom hooks (some need modification)
⚠️ Feature modules (business logic reusable, UI needs rewrite)
⚠️ Layout components (concept reusable, implementation different)
```

### Low Reuse (0-30%)
```
❌ HTML/CSS (completely different)
❌ Tailwind CSS classes (use NativeWind instead)
❌ React Router (use React Navigation)
❌ Three.js/3D graphics (use react-native-skia)
❌ GSAP animations (use Reanimated)
❌ shadcn/ui components (use React Native UI library)
❌ Web-specific APIs (localStorage, etc.)
```

---

## 📱 UI Component Mapping

### Web → Mobile Component Mapping

| Web Component | Mobile Equivalent | Library |
|--------------|-------------------|---------|
| `<button>` | `<Button>` / `<TouchableOpacity>` | React Native |
| `<div>` | `<View>` | React Native |
| `<p>`, `<span>` | `<Text>` | React Native |
| `<input>` | `<TextInput>` | React Native |
| `<img>` | `<Image>` | React Native |
| `<nav>` | `<BottomTabNavigator>` | React Navigation |
| Tailwind CSS | NativeWind | NativeWind |
| Framer Motion | React Native Reanimated | Reanimated |
| React Router | React Navigation | React Navigation |
| shadcn/ui Button | Tamagui Button | Tamagui |
| shadcn/ui Card | Tamagui Card | Tamagui |
| shadcn/ui Input | Tamagui Input | Tamagui |
| Lucide React | Lucide React Native | Lucide |
| date-fns | date-fns | date-fns (same) |
| Zod | Zod | Zod (same) |
| React Hook Form | React Hook Form | React Hook Form (same) |
| Sonner (toasts) | React Native Toast | react-native-toast-message |
| Recharts | react-native-gifted-charts | react-native-gifted-charts |
| Three.js | react-native-skia | react-native-skia |
| GSAP | React Native Reanimated | Reanimated |

---

## 🎨 Design System Adaptation

### Mobile-First Design Principles

1. **Touch Targets**: Minimum 44x44px (vs web's 24px)
2. **Font Sizes**: Base 16px (vs web's 14px)
3. **Spacing**: 8px grid system (vs web's 4px)
4. **Navigation**: Bottom tabs + hamburger menu
5. **Gestures**: Swipe, pull-to-refresh, long-press
6. **Safe Areas**: Notch/home indicator support
7. **Dark Mode**: System-aware theme switching

### Responsive Breakpoints (Mobile Only)

| Device | Width | Height | Target |
|--------|-------|--------|--------|
| iPhone SE | 375px | 667px | Small phones |
| iPhone 13 | 390px | 844px | Standard phones |
| iPhone 14 Pro Max | 430px | 932px | Large phones |
| iPad Mini | 768px | 1024px | Small tablets |
| iPad Pro | 1024px | 1366px | Large tablets |

---

## 🔐 Security Considerations

### Mobile-Specific Security

1. **Secure Storage**
   ```typescript
   // Use expo-secure-store instead of localStorage
   import * as SecureStore from 'expo-secure-store';
   
   await SecureStore.setItemAsync('authToken', token);
   const token = await SecureStore.getItemAsync('authToken');
   ```

2. **Biometric Authentication**
   ```typescript
   import * as LocalAuthentication from 'expo-local-authentication';
   
   const hasHardware = await LocalAuthentication.hasHardwareAsync();
   const isEnrolled = await LocalAuthentication.isEnrolledAsync();
   const result = await LocalAuthentication.authenticateAsync({
     promptMessage: 'Authenticate to continue',
   });
   ```

3. **Certificate Pinning** (Production)
   ```typescript
   // Pin API certificates to prevent MITM attacks
   ```

4. **Jailbreak/Root Detection**
   ```typescript
   // Detect compromised devices
   import * as Device from 'expo-device';
   ```

5. **App Attest** (iOS)
   ```typescript
   // iOS app attestation for enhanced security
   ```

---

## 📊 Performance Optimization

### Key Strategies

1. **List Optimization**
   ```typescript
   <FlatList
     data={data}
     renderItem={renderItem}
     keyExtractor={item => item.id}
     initialNumToRender={10}
     maxToRenderPerBatch={10}
     windowSize={5}
     removeClippedSubviews={true}
   />
   ```

2. **Image Optimization**
   ```typescript
   // Use optimized images
   <Image
     source={{ uri: imageUrl }}
     style={styles.image}
     resizeMode="cover"
     cache="reuse"
   />
   ```

3. **Memoization**
   ```typescript
   const MemoizedComponent = React.memo(Component);
   const expensiveValue = useMemo(() => computeExpensiveValue(), [deps]);
   const handlePress = useCallback(() => { doSomething(); }, [deps]);
   ```

4. **Code Splitting**
   ```typescript
   // Lazy load heavy components
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
   ```

5. **Bundle Size**
   - Target: < 50MB initial download
   - Use Hermes engine
   - Enable ProGuard (Android)
   - Optimize images/assets

---

## 🧪 Testing Strategy

### Testing Pyramid

```
        /‾‾‾‾‾\
       /  E2E   \      Detox
      /  (10%)   \
     /------------\
    /  Integration  \   React Native Testing Library
   /     (20%)       \
  /------------------\
 /      Unit Tests     \  Jest
/       (70%)           \
--------------------------
```

### Test Types

1. **Unit Tests** (Jest)
   ```typescript
   // Test utility functions, hooks, services
   describe('AuthService', () => {
     it('should login successfully', () => {
       // ...
     });
   });
   ```

2. **Component Tests** (React Native Testing Library)
   ```typescript
   // Test individual components
   test('Button renders correctly', () => {
     const { getByText } = render(<Button title="Click me" />);
     expect(getByText('Click me')).toBeTruthy();
   });
   ```

3. **Integration Tests** (React Native Testing Library)
   ```typescript
   // Test feature flows
   test('Login flow works correctly', () => {
     // ...
   });
   ```

4. **E2E Tests** (Detox)
   ```typescript
   // Test full app flows on real devices
   describe('Login', () => {
     it('should login with valid credentials', async () => {
       await element(by.id('login.email')).typeText('user@test.com');
       await element(by.id('login.password')).typeText('User123!@#');
       await element(by.id('login.submit')).tap();
       await expect(element(by.id('dashboard'))).toBeVisible();
     });
   });
   ```

---

## 📈 Analytics & Monitoring

### Analytics Implementation

```typescript
// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

// Track screen views
await analytics().logScreenView({
  screen_name: 'Login',
  screen_class: 'LoginScreen',
});

// Track events
await analytics().logEvent('login', {
  method: 'email',
  success: true,
});
```

### Crash Reporting

```typescript
// Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableAutoSessionTracking: true,
});

// Capture errors
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### Performance Monitoring

```typescript
// Firebase Performance
import performance from '@react-native-firebase/perf';

const trace = await perf().newTrace('login_flow');
await trace.start();
// ... login logic
await trace.stop();
```

---

## 🚀 Deployment Checklist

### Pre-Launch Checklist

- [ ] **App Icons**: All sizes (iOS + Android)
- [ ] **Splash Screen**: Branded loading screen
- [ ] **App Name**: Finalize app name
- [ ] **Bundle ID**: `com.soulyatri.app`
- [ ] **Version**: 1.0.0 (1)
- [ ] **Privacy Policy**: Hosted URL
- [ ] **Terms of Service**: Hosted URL
- [ ] **Support Email**: support@soulyatri.com
- [ ] **Marketing URL**: Website
- [ ] **Screenshots**: All device sizes
- [ ] **App Preview Video**: 30-second demo
- [ ] **Keywords**: Mental health, therapy, counselling, wellness
- [ ] **Description**: Compelling app description
- [ ] **What's New**: Release notes
- [ ] **Content Rating**: Complete questionnaire
- [ ] **Age Rating**: 17+ (health/medical)
- [ ] **Export Compliance**: Encryption compliance
- [ ] **App Tracking Transparency**: IDFA usage
- [ ] **Push Notifications**: Configure in backend
- [ ] **Deep Links**: Test universal/app links
- [ ] **Backend**: Production-ready API
- [ ] **Monitoring**: Sentry, Firebase configured
- [ ] **Analytics**: Events tracked
- [ ] **Crash Reporting**: Tested
- [ ] **Performance**: Optimized
- [ ] **Accessibility**: Tested with VoiceOver/TalkBack
- [ ] **Localization**: English (add more later)

### App Store Specific

- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect listing created
- [ ] Signing certificates generated
- [ ] Provisioning profiles created
- [ ] TestFlight setup for beta testing
- [ ] App Review guidelines compliance
- [ ] In-App Purchase setup (if applicable)
- [ ] Subscription setup (if applicable)

### Play Store Specific

- [ ] Google Play Console Account ($25 one-time)
- [ ] Play Store listing created
- [ ] Signing key generated (Play App Signing)
- [ ] Content rating completed
- [ ] Target audience defined
- [ ] Data safety section completed
- [ ] Ads declaration (if applicable)
- [ ] Internal testing track
- [ ] Closed testing track
- [ ] Open testing track

---

## 💰 Cost Breakdown

### Development Costs

| Item | Cost | Frequency |
|------|------|-----------|
| **Developer Time** | ₹8-15 lakhs/month × 5 months | One-time |
| **Design** | ₹2-3 lakhs | One-time |
| **Testing Devices** | ₹1-2 lakhs | One-time |

### Ongoing Costs

| Service | Cost | Frequency |
|---------|------|-----------|
| **Apple Developer Program** | $99 (~₹8,200) | Annual |
| **Google Play Console** | $25 (~₹2,100) | One-time |
| **Expo EAS Build** | $29-99/month | Monthly (or free self-hosted) |
| **Sentry** | $0-29/month | Monthly (free tier available) |
| **Firebase** | $0-25/month | Monthly (free tier generous) |
| **Daily.co (Video)** | $0-49/month | Monthly (usage-based) |
| **Razorpay** | 2% per transaction | Per transaction |
| **Push Notifications** | Free (Firebase) | Free |
| **Backend Hosting** | ₹2-5k/month | Monthly |

### Total Estimated Cost

| Phase | Cost (INR) |
|-------|------------|
| **Development** | ₹40-75 lakhs |
| **Design** | ₹2-3 lakhs |
| **Infrastructure (Year 1)** | ₹3-5 lakhs |
| **App Store Fees** | ₹10,300 |
| **Contingency (15%)** | ₹7-12 lakhs |
| **TOTAL** | **₹52-95 lakhs** |

---

## 📅 Timeline Summary

```
Week 1-3:    ████████████████████░░░░░░░░░░░░░░░░░░  Foundation (3 weeks)
Week 4-5:    ████████████████████████████░░░░░░░░░░  Navigation + Auth (2 weeks)
Week 6-13:   ████████████████████████████████████████████████████████  Features (8 weeks)
Week 14-15:  ████████████████████████████████████████████████████████████████  Practitioner (2 weeks)
Week 16-17:  ████████████████████████████████████████████████████████████████████████  Native (2 weeks)
Week 18-19:  ████████████████████████████████████████████████████████████████████████████████  Polish (2 weeks)
Week 20:     ████████████████████████████████████████████████████████████████████████████████████████  Launch (1 week)
```

**Total: 20 weeks (5 months)**

---

## 🎯 Success Metrics

### Launch Goals (First 90 Days)

| Metric | Target |
|--------|--------|
| **Downloads** | 10,000+ |
| **Daily Active Users** | 2,000+ |
| **Session Duration** | 8+ minutes |
| **Retention (Day 7)** | 40%+ |
| **Retention (Day 30)** | 25%+ |
| **App Store Rating** | 4.5+ stars |
| **Crash-Free Sessions** | 99.5%+ |
| **API Response Time** | < 500ms |

### Long-Term Goals (Year 1)

| Metric | Target |
|--------|--------|
| **Total Downloads** | 100,000+ |
| **Monthly Active Users** | 25,000+ |
| **Paid Conversions** | 5,000+ |
| **Revenue** | ₹50 lakhs+ |
| **App Store Rating** | 4.7+ stars |

---

## ⚠️ Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Three.js to Skia migration** | High | High | Start early, prototype first |
| **Video call integration** | Medium | High | Test Daily.co SDK early |
| **Payment integration** | Low | High | Use well-documented Razorpay SDK |
| **Performance issues** | Medium | Medium | Profile early, optimize iteratively |
| **Offline sync complexity** | High | Medium | Use WatermelonDB, start early |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **App Store rejection** | Low | High | Follow guidelines, test with TestFlight first |
| **Budget overrun** | Medium | High | Prioritize features, MVP first |
| **Timeline slippage** | Medium | Medium | Buffer time, agile sprints |
| **Team turnover** | Low | High | Documentation, knowledge sharing |

---

## 📞 Next Steps

### Immediate Actions (This Week)

1. **Decision**: Approve React Native + Expo approach
2. **Budget**: Allocate ₹52-95 lakhs for development
3. **Team**: Hire/assign React Native developers (2-3)
4. **Timeline**: Set launch date (5 months from start)
5. **Backend**: Ensure API is production-ready

### Week 1 Tasks

1. Set up Expo project
2. Configure development environment
3. Create app icons and splash screen
4. Port types and constants
5. Set up API service

### Month 1 Goals

1. ✅ Foundation complete
2. ✅ Navigation working
3. ✅ Auth flows functional
4. ✅ Home screen implemented
5. ✅ Basic dashboard working

---

## 📚 Resources & Documentation

### Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Navigation](https://reactnavigation.org/)
- [EAS Build](https://docs.expo.dev/eas/)

### Recommended Libraries

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "nativewind": "^4.0.0",
    "react-native": "0.73.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "lucide-react-native": "^0.300.0",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/analytics": "^19.0.0",
    "@sentry/react-native": "^5.0.0"
  }
}
```

---

## 🎉 Conclusion

Converting Soul Yatri from a web application to a mobile app is a significant but achievable goal. With **60-70% code reuse**, a **clear migration path**, and **React Native + Expo**, you can launch on both App Store and Play Store in **5 months** with an estimated budget of **₹52-95 lakhs**.

### Key Success Factors

1. ✅ **Start with MVP**: Focus on core features first (Auth, Dashboard, Mood, Journal)
2. ✅ **Prototype Early**: Test Three.js → Skia migration immediately
3. ✅ **Iterate Fast**: Use Expo's hot reload for rapid development
4. ✅ **Test Often**: Test on real devices throughout development
5. ✅ **Monitor Everything**: Set up analytics and crash reporting from day 1

### Ready to Start?

**Next Step:** Create the Expo project and start porting types and constants!

```bash
npx create-expo-app@latest soul-yatri-mobile -t tabs
cd soul-yatri-mobile
npm install
```

Let's build an amazing mobile app! 🚀
