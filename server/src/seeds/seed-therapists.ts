import dotenv from 'dotenv';
import { PrismaClient, Role, TherapistApproach, Gender } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const dbUrl = new URL(databaseUrl);
const pool = new pg.Pool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 5432,
  database: dbUrl.pathname.slice(1),
  user: dbUrl.username,
  password: process.env.DATABASE_PASSWORD || decodeURIComponent(dbUrl.password),
  ssl: dbUrl.hostname !== 'localhost' ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const THERAPISTS = [
  {
    name: 'Dr. Aisha Mehta',
    email: 'aisha.mehta@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'corporate stress', 'burnout'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi'],
    qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed', 'CBT Certified'],
    experience: 12,
    bio: 'I specialize in helping professionals navigate anxiety and burnout. With 12 years of experience and a CBT-focused approach, I create structured pathways to clarity. My practice centers on practical, evidence-based techniques that fit into your busy life.',
    rating: 4.9,
    totalReviews: 204,
    totalSessions: 312,
    pricePerSession: 850,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '15:00' },
    ],
    metrics: { avgRating: 4.9, totalCompletedSessions: 312, clientReturnRate: 0.78, bookingFillRate: 0.85, computedPrice: 850, avgSessionDuration: 48, noShowRate: 0.02 },
  },
  {
    name: 'Dr. Rohan Sharma',
    email: 'rohan.sharma@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['depression', 'self-esteem', 'trauma'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi', 'marathi'],
    qualifications: ['Ph.D. Psychology', 'EMDR Certified'],
    experience: 8,
    bio: 'I blend modern therapy with mindfulness-based approaches. Having worked with hundreds of individuals struggling with self-worth and past trauma, I believe healing comes through understanding your story — not just your symptoms.',
    rating: 4.7,
    totalReviews: 156,
    totalSessions: 234,
    pricePerSession: 700,
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 234, clientReturnRate: 0.65, bookingFillRate: 0.72, computedPrice: 700, avgSessionDuration: 46, noShowRate: 0.04 },
  },
  {
    name: 'Dr. Priya Nair',
    email: 'priya.nair@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['relationships', 'couples', 'family'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'malayalam'],
    qualifications: ['M.A. Marriage & Family Therapy', 'Gottman Certified'],
    experience: 10,
    bio: 'Relationships are the mirror of our inner world. Through a holistic approach that honors cultural values and modern dynamics, I help couples and families rebuild trust, communication, and genuine connection.',
    rating: 4.8,
    totalReviews: 178,
    totalSessions: 267,
    pricePerSession: 800,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '11:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' },
    ],
    metrics: { avgRating: 4.8, totalCompletedSessions: 267, clientReturnRate: 0.72, bookingFillRate: 0.80, computedPrice: 800, avgSessionDuration: 49, noShowRate: 0.03 },
  },
  {
    name: 'Dr. Karan Patel',
    email: 'karan.patel@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['stress', 'anger', 'addiction'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'gujarati'],
    qualifications: ['M.Phil Clinical Psychology', 'De-addiction Specialist'],
    experience: 6,
    bio: 'I work with individuals caught in cycles of stress, anger, and addictive behaviors. My approach is direct, structured, and results-oriented — because understanding the pattern is the first step to breaking it.',
    rating: 4.5,
    totalReviews: 89,
    totalSessions: 145,
    pricePerSession: 600,
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '20:00' },
    ],
    metrics: { avgRating: 4.5, totalCompletedSessions: 145, clientReturnRate: 0.55, bookingFillRate: 0.60, computedPrice: 600, avgSessionDuration: 44, noShowRate: 0.06 },
  },
  {
    name: 'Dr. Ananya Singh',
    email: 'ananya.singh@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['grief', 'trauma', 'depression'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi'],
    qualifications: ['Ph.D. Clinical Psychology', 'EMDR Level II', 'RCI Licensed'],
    experience: 15,
    bio: 'With 15 years of deep trauma work, I create a space where grief and pain are honored, not rushed. My practice integrates EMDR, somatic experiencing, and traditional talk therapy for layered healing.',
    rating: 4.9,
    totalReviews: 289,
    totalSessions: 420,
    pricePerSession: 950,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
    ],
    metrics: { avgRating: 4.9, totalCompletedSessions: 420, clientReturnRate: 0.82, bookingFillRate: 0.90, computedPrice: 950, avgSessionDuration: 50, noShowRate: 0.01 },
  },
  {
    name: 'Dr. Vikram Desai',
    email: 'vikram.desai@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['career', 'confidence', 'self-discovery'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'marathi'],
    qualifications: ['M.A. Counseling Psychology', 'Career Coaching Certified'],
    experience: 7,
    bio: 'Stuck in the wrong career? Unsure who you are beyond your job title? I help ambitious professionals find clarity, rebuild confidence, and design a life that feels genuinely theirs.',
    rating: 4.6,
    totalReviews: 112,
    totalSessions: 178,
    pricePerSession: 650,
    availability: [
      { dayOfWeek: 0, startTime: '11:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '11:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '17:00' },
    ],
    metrics: { avgRating: 4.6, totalCompletedSessions: 178, clientReturnRate: 0.60, bookingFillRate: 0.65, computedPrice: 650, avgSessionDuration: 45, noShowRate: 0.05 },
  },
  {
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'depression', 'spiritual-growth'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'tamil', 'kannada'],
    qualifications: ['M.Phil Psychology', 'Yoga Therapy Certified', 'Mindfulness-Based Stress Reduction'],
    experience: 9,
    bio: 'I bridge ancient Indian wisdom with modern psychology. Whether it is anxiety that keeps you up at night or a search for deeper meaning, my practice uses meditation, breathwork, and therapeutic dialogue to find your center.',
    rating: 4.7,
    totalReviews: 134,
    totalSessions: 210,
    pricePerSession: 750,
    availability: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 210, clientReturnRate: 0.68, bookingFillRate: 0.75, computedPrice: 750, avgSessionDuration: 47, noShowRate: 0.03 },
  },
  {
    name: 'Dr. Arjun Kapoor',
    email: 'arjun.kapoor@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['relationships', 'self-esteem', 'anger'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi'],
    qualifications: ['M.A. Clinical Psychology', 'Anger Management Specialist'],
    experience: 5,
    bio: 'I help people break out of toxic relationship patterns and rebuild self-worth. My approach is warm but honest — we look at what is really going on, not just the surface-level symptoms.',
    rating: 4.4,
    totalReviews: 67,
    totalSessions: 98,
    pricePerSession: 550,
    availability: [
      { dayOfWeek: 2, startTime: '16:00', endTime: '21:00' },
      { dayOfWeek: 4, startTime: '16:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
    ],
    metrics: { avgRating: 4.4, totalCompletedSessions: 98, clientReturnRate: 0.50, bookingFillRate: 0.55, computedPrice: 550, avgSessionDuration: 42, noShowRate: 0.08 },
  },
  {
    name: 'Dr. Simran Kaur',
    email: 'simran.kaur@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'stress', 'better-sleep'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'punjabi'],
    qualifications: ['M.Phil Psychology', 'Sleep Disorder Specialist', 'Breathwork Practitioner'],
    experience: 8,
    bio: 'Cannot sleep? Mind racing at 3 AM? I specialize in the anxiety-sleep connection. My holistic approach combines sleep hygiene science, breathwork, and root-cause therapy to help you rest — truly rest.',
    rating: 4.6,
    totalReviews: 123,
    totalSessions: 189,
    pricePerSession: 700,
    availability: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 1, startTime: '09:00', endTime: '15:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '15:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
    ],
    metrics: { avgRating: 4.6, totalCompletedSessions: 189, clientReturnRate: 0.63, bookingFillRate: 0.70, computedPrice: 700, avgSessionDuration: 47, noShowRate: 0.04 },
  },
  {
    name: 'Dr. Nisha Reddy',
    email: 'nisha.reddy@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['trauma', 'grief', 'depression'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'telugu'],
    qualifications: ['Ph.D. Clinical Psychology', 'Trauma-Focused CBT', 'RCI Licensed'],
    experience: 11,
    bio: 'I have spent a decade helping people process trauma and loss using structured, evidence-based interventions. Healing is not linear, but with the right approach, it is always possible.',
    rating: 4.8,
    totalReviews: 198,
    totalSessions: 305,
    pricePerSession: 850,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '14:00' },
    ],
    metrics: { avgRating: 4.8, totalCompletedSessions: 305, clientReturnRate: 0.75, bookingFillRate: 0.82, computedPrice: 850, avgSessionDuration: 49, noShowRate: 0.02 },
  },
  {
    name: 'Dr. Amit Joshi',
    email: 'amit.joshi@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['addiction', 'anger', 'stress'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi', 'bengali'],
    qualifications: ['M.Phil Clinical Psychology', 'NIMHANS Trained', 'Substance Abuse Specialist'],
    experience: 13,
    bio: 'After 13 years in de-addiction and anger management — including work at NIMHANS — I bring deep clinical experience to a warm, non-judgmental space. Recovery is not about willpower. It is about rewiring.',
    rating: 4.7,
    totalReviews: 167,
    totalSessions: 278,
    pricePerSession: 800,
    availability: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 278, clientReturnRate: 0.70, bookingFillRate: 0.78, computedPrice: 800, avgSessionDuration: 46, noShowRate: 0.03 },
  },
  {
    name: 'Dr. Tara Menon',
    email: 'tara.menon@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['self-discovery', 'spiritual-growth', 'relationships'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'malayalam'],
    qualifications: ['M.A. Transpersonal Psychology', 'Art Therapy Certified', 'Vedic Counselor'],
    experience: 7,
    bio: 'I blend art therapy, transpersonal psychology, and Vedic wisdom. If you are at a crossroads — questioning your path, your relationships, your purpose — I help you listen to the answers you already carry.',
    rating: 4.5,
    totalReviews: 94,
    totalSessions: 142,
    pricePerSession: 650,
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '16:00' },
    ],
    metrics: { avgRating: 4.5, totalCompletedSessions: 142, clientReturnRate: 0.58, bookingFillRate: 0.62, computedPrice: 650, avgSessionDuration: 44, noShowRate: 0.06 },
  },
];

async function seedTherapists() {
  console.warn('🌱 Seeding 12 therapists...');

  for (const t of THERAPISTS) {
    const passwordHash = await bcrypt.hash('SoulYatri2026!', 12);

    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        passwordHash,
        name: t.name,
        role: Role.THERAPIST,
        isVerified: true,
      },
    });

    // Create UserProfile with gender (needed for gender matching in matching.service)
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        gender: t.gender,
        onboardingStep: 10,
        onboardingComplete: true,
      },
    });

    const profile = await prisma.therapistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specializations: t.specializations,
        approach: t.approach,
        languages: t.languages,
        qualifications: t.qualifications,
        experience: t.experience,
        bio: t.bio,
        pricePerSession: t.pricePerSession,
        rating: t.rating,
        totalReviews: t.totalReviews,
        totalSessions: t.totalSessions,
        isVerified: true,
        isAvailable: true,
        verifiedAt: new Date(),
      },
    });

    // Seed availability
    for (const slot of t.availability) {
      await prisma.therapistAvailability.create({
        data: {
          therapistId: profile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotDuration: 50,
          breakAfterSlot: 10,
          isActive: true,
        },
      });
    }

    // Seed online status
    await prisma.therapistOnlineStatus.upsert({
      where: { therapistId: profile.id },
      update: {},
      create: {
        therapistId: profile.id,
        isOnline: Math.random() > 0.5,
        isAcceptingNow: Math.random() > 0.6,
        lastSeenAt: new Date(),
      },
    });

    // Seed metrics
    await prisma.therapistMetrics.upsert({
      where: { therapistId: profile.id },
      update: {},
      create: {
        therapistId: profile.id,
        avgRating: t.metrics.avgRating,
        totalCompletedSessions: t.metrics.totalCompletedSessions,
        clientReturnRate: t.metrics.clientReturnRate,
        bookingFillRate: t.metrics.bookingFillRate,
        computedPrice: t.metrics.computedPrice,
        avgSessionDuration: t.metrics.avgSessionDuration,
        noShowRate: t.metrics.noShowRate,
        specializationStats: Object.fromEntries(
          t.specializations.map((s) => [
            s,
            {
              avgRating: t.metrics.avgRating - Math.random() * 0.3,
              completedSessions: Math.floor(t.metrics.totalCompletedSessions / t.specializations.length),
              returnRate: t.metrics.clientReturnRate,
            },
          ]),
        ),
      },
    });

    console.warn(`  ✅ ${t.name} (${t.specializations.join(', ')})`);
  }

  console.warn('🎉 Done! 12 therapists seeded.');
}

seedTherapists()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
