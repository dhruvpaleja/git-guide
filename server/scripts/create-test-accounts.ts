import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Test accounts for development and production
const TEST_ACCOUNTS = [
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

async function createTestAccounts() {
  console.warn('🌱 Creating test accounts in database...');
  
  try {
    // Create each test account
    for (const account of TEST_ACCOUNTS) {
      console.warn(`Creating ${account.role}: ${account.email}`);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email }
      });
      
      if (existingUser) {
        console.warn(`✅ ${account.email} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 12);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: account.email,
          password: hashedPassword,
          name: account.name,
          role: account.role,
        }
      });
      
      console.warn(`✅ Created ${account.role}: ${account.email}`);
      
      // Create user profile for regular users
      if (account.role === 'USER') {
        await prisma.userProfile.create({
          data: {
            userId: user.id,
            dateOfBirth: new Date('1990-01-01'),
            gender: 'PREFER_NOT_TO_SAY',
            city: 'Mumbai',
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
        console.warn(`  📋 Created user profile for ${account.email}`);
      }
      
      // Create therapist profile for therapists
      if (account.role === 'THERAPIST') {
        await prisma.therapistProfile.create({
          data: {
            userId: user.id,
            specializations: ['anxiety', 'depression', 'relationships'],
            approach: 'MIXED',
            languages: ['english', 'hindi'],
            qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed'],
            bio: 'Experienced therapist specializing in anxiety and relationship counseling.',
            pricePerSession: 1500,
            isVerified: true,
            isAvailable: true,
          }
        });
        console.warn(`  🩺 Created therapist profile for ${account.email}`);
      }
      
      // Create user settings for all users
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          darkMode: true,
          animations: true,
          pushNotifs: true,
          profileVisible: true,
        }
      });
      console.warn(`  ⚙️ Created settings for ${account.email}`);
    }
    
    console.warn('\n🎉 Test accounts created successfully!');
    console.warn('\n📋 Login Credentials:');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    TEST_ACCOUNTS.forEach(account => {
      console.warn(`\n🔐 ${account.role.toUpperCase()} Dashboard:`);
      console.warn(`   Email: ${account.email}`);
      console.warn(`   Password: ${account.password}`);
    });
    
    console.warn('\n💡 These accounts are now in the database and can be used for testing!');
    
  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  createTestAccounts();
}

export default createTestAccounts;
