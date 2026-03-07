import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Create Prisma client with PrismaPg adapter (required for Prisma v7 + Supabase)
const dbUrl = new URL(process.env.DATABASE_URL!);
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

// Development credentials - easy to remember
const DEV_USERS = [
  {
    email: 'user@test.com',
    password: 'user123',
    name: 'Test User',
    role: 'USER' as const,
  },
  {
    email: 'therapist@test.com', 
    password: 'therapist123',
    name: 'Dr. Test Therapist',
    role: 'THERAPIST' as const,
  },
  {
    email: 'astrologer@test.com',
    password: 'astrologer123', 
    name: 'Test Astrologer',
    role: 'ASTROLOGER' as const,
  },
  {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Test Admin',
    role: 'ADMIN' as const,
  },
];

async function seedDevUsers() {
  console.warn('🌱 Seeding development users...');
  
  try {
    // Clean existing dev users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: DEV_USERS.map(u => u.email)
        }
      }
    });

    // Create dev users
    for (const user of DEV_USERS) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          passwordHash,
          name: user.name,
          role: user.role,
          isVerified: true, // Auto-verify for development
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      });

      console.warn(`✅ Created ${user.role}: ${user.email}`);
      
      // Create therapist profile if role is THERAPIST
      if (user.role === 'THERAPIST') {
        await prisma.therapistProfile.create({
          data: {
            userId: createdUser.id,
            specializations: ['anxiety', 'depression', 'relationships'],
            approach: 'MIXED',
            languages: ['english', 'hindi'],
            qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed'],
            experience: 5,
            bio: 'Experienced therapist specializing in anxiety and relationship counseling.',
            pricePerSession: 1500,
            isVerified: true,
            isAvailable: true,
          }
        });
        console.warn(`  📋 Created therapist profile for ${user.email}`);
      }

      // Create user profile for regular users
      if (user.role === 'USER') {
        await prisma.userProfile.create({
          data: {
            userId: createdUser.id,
            dateOfBirth: new Date('1990-01-01'),
            gender: 'PREFER_NOT_TO_SAY',
            city: 'Mumbai',
            country: 'India',
            struggles: ['anxiety', 'stress'],
            therapyHistory: 'CONSIDERING',
            goals: ['reduce-anxiety', 'better-sleep'],
            therapistLanguages: ['english'],
            therapistApproach: 'MIXED',
            interests: ['meditation', 'journaling'],
            onboardingStep: 10,
            onboardingComplete: true,
          }
        });
        console.warn(`  👤 Created user profile for ${user.email}`);
      }

      // Create user settings
      await prisma.userSettings.create({
        data: {
          userId: createdUser.id,
          darkMode: true,
          animations: true,
          pushNotifs: true,
          profileVisible: true,
        }
      });
    }

    console.warn('\n🎉 Development users created successfully!');
    console.warn('\n📋 Login Credentials:');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    DEV_USERS.forEach(user => {
      console.warn(`\n🔐 ${user.role.toUpperCase()} Dashboard:`);
      console.warn(`   Email: ${user.email}`);
      console.warn(`   Password: ${user.password}`);
    });

    console.warn('\n💡 Quick Access Tips:');
    console.warn('   • User Dashboard: Full user experience with therapy booking');
    console.warn('   • Therapist Dashboard: Manage sessions, availability, earnings');
    console.warn('   • Astrologer Dashboard: Astrology consultations and predictions');
    console.warn('   • Admin Dashboard: User management and platform oversight');
    
  } catch (error) {
    console.error('❌ Error seeding dev users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedDevUsers().catch(console.error);
}

export { seedDevUsers };
