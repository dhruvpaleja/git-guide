import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const _DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/soul_yatri?schema=public';

const prisma = new PrismaClient();

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
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding development users...');

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

      // eslint-disable-next-line no-console
      console.log(`✅ Created ${user.role}: ${user.email}`);

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
        // eslint-disable-next-line no-console
        console.log(`  📋 Created therapist profile for ${user.email}`);
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
        // eslint-disable-next-line no-console
        console.log(`  👤 Created user profile for ${user.email}`);
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

    // eslint-disable-next-line no-console
    console.log('\n🎉 Development users created successfully!');
    // eslint-disable-next-line no-console
    console.log('\n📋 Login Credentials:');
    // eslint-disable-next-line no-console
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    DEV_USERS.forEach(user => {
      // eslint-disable-next-line no-console
      console.log(`\n🔐 ${user.role.toUpperCase()} Dashboard:`);
      // eslint-disable-next-line no-console
      console.log(`   Email: ${user.email}`);
      // eslint-disable-next-line no-console
      console.log(`   Password: ${user.password}`);
    });

    // eslint-disable-next-line no-console
    console.log('\n💡 Quick Access Tips:');
    // eslint-disable-next-line no-console
    console.log('   • User Dashboard: Full user experience with therapy booking');
    // eslint-disable-next-line no-console
    console.log('   • Therapist Dashboard: Manage sessions, availability, earnings');
    // eslint-disable-next-line no-console
    console.log('   • Astrologer Dashboard: Astrology consultations and predictions');
    // eslint-disable-next-line no-console
    console.log('   • Admin Dashboard: User management and platform oversight');

  } catch (error) {

    console.error('❌ Error seeding dev users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDevUsers().catch(console.error);
}

export { seedDevUsers };
