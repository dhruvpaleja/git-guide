const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DEV_USERS = [
  {
    email: 'user@test.com',
    password: 'user123',
    name: 'Test User',
    role: 'USER',
  },
  {
    email: 'therapist@test.com', 
    password: 'therapist123',
    name: 'Dr. Test Therapist',
    role: 'THERAPIST',
  },
  {
    email: 'astrologer@test.com',
    password: 'astrologer123', 
    name: 'Test Astrologer',
    role: 'ASTROLOGER',
  },
  {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Test Admin',
    role: 'ADMIN',
  },
];

async function setupDevUsers() {
  console.log('🚀 Setting up development users...');
  
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

    // Create dev users
    for (const user of DEV_USERS) {
      console.log(`👤 Creating ${user.role}: ${user.email}`);
      
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          passwordHash,
          name: user.name,
          role: user.role,
          isVerified: true,
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

    console.log('\n🎉 Development setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    DEV_USERS.forEach(user => {
      console.log(`\n🔐 ${user.role}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
    });

    console.log('\n🌐 Quick Access URLs:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 User:     http://localhost:3000/api/v1/dev-login/user@test.com');
    console.log('👨‍⚕️ Therapist: http://localhost:3000/api/v1/dev-login/therapist@test.com');
    console.log('🔮 Astrologer: http://localhost:3000/api/v1/dev-login/astrologer@test.com');
    console.log('👑 Admin:    http://localhost:3000/api/v1/dev-login/admin@test.com');
    
    console.log('\n💡 Next Steps:');
    console.log('1. Start server: npm run dev');
    console.log('2. Open the URLs above in browser');
    console.log('3. Test all dashboard features!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDevUsers();
