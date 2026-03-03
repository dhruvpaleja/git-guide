import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Direct database seeding - bypasses all API limitations
const prisma = new PrismaClient();

const DEV_USERS = [
  {
    email: 'user@test.com',
    password: 'User123!@#',
    name: 'Test User',
    role: 'USER',
  },
  {
    email: 'therapist@test.com', 
    password: 'Therapist123!@#',
    name: 'Dr. Test Therapist',
    role: 'THERAPIST',
  },
  {
    email: 'astrologer@test.com',
    password: 'Astrologer123!@#', 
    name: 'Test Astrologer',
    role: 'ASTROLOGER',
  },
  {
    email: 'admin@test.com',
    password: 'Admin123!@#',
    name: 'Test Admin',
    role: 'ADMIN',
  },
];

async function seedAllDevUsers() {
  console.log('🚀 Creating ALL development users via direct database...');
  
  try {
    // Clean existing dev users
    console.log('🧹 Cleaning existing dev users...');
    await prisma.user.deleteMany({
      where: {
        email: {
          in: DEV_USERS.map(u => u.email)
        }
      }
    });

    // Create dev users with proper roles
    for (const user of DEV_USERS) {
      console.log(`👤 Creating ${user.role}: ${user.email}`);
      
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          passwordHash,
          name: user.name,
          role: user.role,
          isVerified: true, // Auto-verify for development
        },
      });

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
        console.log(`  ✅ Therapist profile created`);
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
        console.log(`  ✅ User profile created`);
      }

      // Create user settings for all users
      await prisma.userSettings.create({
        data: {
          userId: createdUser.id,
          darkMode: true,
          animations: true,
          pushNotifs: true,
          profileVisible: true,
        }
      });

      console.log(`  ✅ User settings created`);
    }

    console.log('\n🎉 ALL DEVELOPMENT USERS CREATED SUCCESSFULLY!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    DEV_USERS.forEach(user => {
      console.log(`\n🔐 ${user.role}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
    });

    console.log('\n🌐 Dashboard Access:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 User:     Full therapy experience');
    console.log('👨‍⚕️ Therapist: Session management & earnings');
    console.log('🔮 Astrologer: Consultations & predictions');
    console.log('👑 Admin:    Platform management');
    
    console.log('\n💡 Ready to Test!');
    console.log('1. Open: http://localhost:5173');
    console.log('2. Login with any of the accounts above');
    console.log('3. Test all dashboard features!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedAllDevUsers();
