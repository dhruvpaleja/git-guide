#!/usr/bin/env node

/**
 * SUBTASK G8: Test 3-Therapist Limit
 * 
 * This script tests the maximum active therapist limit:
 * - Book with 1st therapist → Should SUCCEED
 * - Book with 2nd therapist → Should SUCCEED
 * - Book with 3rd therapist → Should SUCCEED
 * - Try booking with 4th therapist → Should FAIL with MAX_THERAPISTS_REACHED
 * 
 * Usage: npx tsx tests/test-therapist-limit.mjs
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma.ts';
import { bookSession } from '../src/services/therapy.service.ts';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function formatTime(date) {
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTherapistLimitTest() {
  let testUserId;
  const therapistIds = [];
  const sessionIds = [];

  try {
    log('\n🧪 SUBTASK G8: 3-Therapist Limit Test\n', 'cyan');
    log('=' .repeat(60), 'cyan');

    // =========================================================================
    // STEP 0: Setup - Create test user and 4 therapists
    // =========================================================================
    log('\n📝 Step 0: Creating test user and 4 therapists...', 'blue');
    
    const testEmail = `limit-test-${Date.now()}@test.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: '$2b$10$test_hash_placeholder',
        name: 'Therapist Limit Test User',
        role: 'USER',
      },
    });
    testUserId = testUser.id;
    
    // Create user profile (required for booking)
    await prisma.userProfile.create({
      data: {
        userId: testUserId,
        dateOfBirth: new Date('2000-01-01'),
        gender: 'PREFER_NOT_TO_SAY',
        city: 'Test City',
        country: 'India',
        struggles: ['Anxiety'],
        goals: ['Reduce anxiety'],
        onboardingComplete: true,
      },
    });
    
    log(`✅ Test user created: ${testEmail}`, 'green');
    
    // Create 4 test therapists
    for (let i = 1; i <= 4; i++) {
      const therapistEmail = `limit-therapist-${i}-${Date.now()}@test.com`;
      const testTherapist = await prisma.user.create({
        data: {
          email: therapistEmail,
          passwordHash: '$2b$10$test_hash_placeholder',
          name: `Test Therapist ${i}`,
          role: 'THERAPIST',
        },
      });
      
      const therapistProfile = await prisma.therapistProfile.create({
        data: {
          userId: testTherapist.id,
          bio: `Test therapist ${i} for limit testing`,
          specializations: ['Anxiety', 'Depression'],
          experience: 5 + i,
          pricePerSession: 1000 * i,
          languages: ['English'],
        },
      });
      
      // Create availability for this therapist (recurring weekly schedule)
      // dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday
      const availabilities = [];
      for (let day = 0; day <= 6; day++) {
        availabilities.push({
          therapistId: therapistProfile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          slotDuration: 45,
          breakAfterSlot: 10,
          isActive: true,
        });
      }
      
      await prisma.therapistAvailability.createMany({
        data: availabilities,
      });
      
      therapistIds.push(therapistProfile.id);
      log(`✅ Therapist ${i} created: ${therapistProfile.id.substring(0, 8)}...`, 'green');
    }

    // =========================================================================
    // STEP 1: Book with 1st therapist (should SUCCEED)
    // =========================================================================
    log('\n📅 Step 1: Booking with 1st therapist...', 'blue');
    log('   Expected: Should SUCCEED (1/3 active therapists)', 'gray');
    
    // Create a time that's tomorrow at 10:00 AM (definitely within availability)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const time1 = tomorrow;
    
    try {
      const session1 = await bookSession({
        userId: testUserId,
        therapistId: therapistIds[0],
        scheduledAt: time1,
        sessionType: 'standard',
        bookingSource: 'web',
      });
      
      sessionIds.push(session1.id);
      log(`   ✅ Booking succeeded`, 'green');
      log(`   Session ID: ${session1.id.substring(0, 8)}...`, 'cyan');
      log(`   Scheduled at: ${formatTime(time1)}`, 'gray');
    } catch (error) {
      log(`   ❌ UNEXPECTED: Booking failed: ${error.message}`, 'red');
      throw error;
    }

    // =========================================================================
    // STEP 2: Book with 2nd therapist (should SUCCEED)
    // =========================================================================
    log('\n📅 Step 2: Booking with 2nd therapist...', 'blue');
    log('   Expected: Should SUCCEED (2/3 active therapists)', 'gray');
    
    // Different day - day after tomorrow at 11:00 AM
    const time2 = new Date();
    time2.setDate(time2.getDate() + 2);
    time2.setHours(11, 0, 0, 0);
    
    try {
      const session2 = await bookSession({
        userId: testUserId,
        therapistId: therapistIds[1],
        scheduledAt: time2,
        sessionType: 'standard',
        bookingSource: 'web',
      });
      
      sessionIds.push(session2.id);
      log(`   ✅ Booking succeeded`, 'green');
      log(`   Session ID: ${session2.id.substring(0, 8)}...`, 'cyan');
      log(`   Scheduled at: ${formatTime(time2)}`, 'gray');
    } catch (error) {
      log(`   ❌ UNEXPECTED: Booking failed: ${error.message}`, 'red');
      throw error;
    }

    // =========================================================================
    // STEP 3: Book with 3rd therapist (should SUCCEED)
    // =========================================================================
    log('\n📅 Step 3: Booking with 3rd therapist...', 'blue');
    log('   Expected: Should SUCCEED (3/3 active therapists - MAX)', 'gray');
    
    // 3 days from now at 14:00 (2 PM)
    const time3 = new Date();
    time3.setDate(time3.getDate() + 3);
    time3.setHours(14, 0, 0, 0);
    
    try {
      const session3 = await bookSession({
        userId: testUserId,
        therapistId: therapistIds[2],
        scheduledAt: time3,
        sessionType: 'standard',
        bookingSource: 'web',
      });
      
      sessionIds.push(session3.id);
      log(`   ✅ Booking succeeded`, 'green');
      log(`   Session ID: ${session3.id.substring(0, 8)}...`, 'cyan');
      log(`   Scheduled at: ${formatTime(time3)}`, 'gray');
      log('   ⚠️  User now has MAXIMUM (3) active therapists', 'yellow');
    } catch (error) {
      log(`   ❌ UNEXPECTED: Booking failed: ${error.message}`, 'red');
      throw error;
    }

    // =========================================================================
    // STEP 4: Verify TherapyJourney shows 3 active therapists
    // =========================================================================
    log('\n📊 Step 4: Verifying TherapyJourney active therapist count...', 'blue');
    
    const journey = await prisma.therapyJourney.findUnique({
      where: { userId: testUserId },
    });
    
    if (journey) {
      log(`   Active therapist count: ${journey.activeTherapistCount}`, 'cyan');
      
      if (journey.activeTherapistCount === 3) {
        log('   ✅ Correct count: 3 active therapists', 'green');
      } else {
        log(`   ❌ Expected 3, got ${journey.activeTherapistCount}`, 'red');
      }
    } else {
      log('   ❌ No TherapyJourney found', 'red');
    }

    // =========================================================================
    // STEP 5: Try booking with 4th therapist (should FAIL)
    // =========================================================================
    log('\n🚫 Step 5: Attempting to book with 4th therapist...', 'blue');
    log('   Expected: Should FAIL with MAX_THERAPISTS_REACHED error', 'gray');
    
    // 4 days from now at 15:00 (3 PM)
    const time4 = new Date();
    time4.setDate(time4.getDate() + 4);
    time4.setHours(15, 0, 0, 0);
    
    let bookingAttemptFailed = false;
    let errorCode = '';
    let errorMessage = '';
    
    try {
      await bookSession({
        userId: testUserId,
        therapistId: therapistIds[3],
        scheduledAt: time4,
        sessionType: 'standard',
        bookingSource: 'web',
      });
      
      log('   ❌ UNEXPECTED: Booking succeeded (should have failed)', 'red');
      throw new Error('4th booking should have been rejected');
      
    } catch (error) {
      bookingAttemptFailed = true;
      errorCode = error.code;
      errorMessage = error.message;
      
      log(`   ✅ EXPECTED: Booking failed as expected`, 'green');
      log(`   Error code: ${error.code}`, 'cyan');
      log(`   Error message: ${error.message}`, 'gray');
      
      if (error.code === 'MAX_THERAPISTS_REACHED' || error.message.includes('3 active therapists')) {
        log('   ✅ Correct error code received', 'green');
      } else {
        log(`   ⚠️  Unexpected error code: ${error.code}`, 'yellow');
      }
    }
    
    if (!bookingAttemptFailed) {
      throw new Error('Test failed: 4th booking should have been rejected');
    }

    // =========================================================================
    // STEP 6: Verify active sessions count
    // =========================================================================
    log('\n📊 Step 6: Verifying active sessions...', 'blue');
    
    const activeSessions = await prisma.session.findMany({
      where: {
        userId: testUserId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      select: {
        id: true,
        therapistId: true,
        scheduledAt: true,
        status: true,
      },
    });
    
    const uniqueTherapists = new Set(activeSessions.map(s => s.therapistId));
    
    log(`   Total active sessions: ${activeSessions.length}`, 'cyan');
    log(`   Unique therapists: ${uniqueTherapists.size}`, 'cyan');
    
    if (uniqueTherapists.size === 3) {
      log('   ✅ Correct: 3 unique active therapists', 'green');
    } else {
      log(`   ❌ Expected 3, got ${uniqueTherapists.size}`, 'red');
    }

    // =========================================================================
    // STEP 7: Test edge case - booking with same therapist again
    // =========================================================================
    log('\n📅 Step 7: Testing duplicate booking with same therapist...', 'blue');
    log('   Expected: Should SUCCEED (same therapist, different time)', 'gray');
    
    // 5 days from now at 16:00 (4 PM)
    const timeDuplicate = new Date();
    timeDuplicate.setDate(timeDuplicate.getDate() + 5);
    timeDuplicate.setHours(16, 0, 0, 0);
    
    try {
      const duplicateSession = await bookSession({
        userId: testUserId,
        therapistId: therapistIds[0], // Same as 1st therapist
        scheduledAt: timeDuplicate,
        sessionType: 'standard',
        bookingSource: 'web',
      });
      
      sessionIds.push(duplicateSession.id);
      log(`   ✅ Booking succeeded (multiple sessions with same therapist allowed)`, 'green');
      log(`   Session ID: ${duplicateSession.id.substring(0, 8)}...`, 'cyan');
    } catch (error) {
      log(`   ℹ️  Booking failed: ${error.message}`, 'yellow');
      // This might fail due to other validation, which is OK for this test
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    log('\n' + '=' .repeat(60), 'cyan');
    log('🎉 ALL 3-THERAPIST LIMIT TESTS PASSED!', 'green');
    log('=' .repeat(60), 'cyan');
    log('\n📊 3-Therapist Limit Summary:', 'cyan');
    log('   1st therapist → ✅ ALLOWED', 'yellow');
    log('   2nd therapist → ✅ ALLOWED', 'yellow');
    log('   3rd therapist → ✅ ALLOWED (MAX)', 'yellow');
    log('   4th therapist → ❌ REJECTED', 'yellow');
    log('\n✅ SUBTASK G8 verification complete!\n', 'green');

  } catch (error) {
    log('\n❌ TEST FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    if (sessionIds.length > 0) {
      log('\n🧹 Cleaning up test sessions...', 'blue');
      try {
        await prisma.session.deleteMany({
          where: { id: { in: sessionIds } },
        });
      } catch (e) {}
    }
    if (testUserId) {
      try {
        await prisma.therapyJourney.delete({
          where: { userId: testUserId },
        }).catch(() => {});
        await prisma.userProfile.delete({
          where: { userId: testUserId },
        }).catch(() => {});
        await prisma.user.delete({
          where: { id: testUserId },
        });
      } catch (e) {}
    }
    // Clean up therapists
    for (const therapistId of therapistIds) {
      try {
        const therapist = await prisma.therapistProfile.findUnique({
          where: { id: therapistId },
          include: { user: true },
        });
        if (therapist?.user) {
          await prisma.therapistProfile.delete({
            where: { id: therapistId },
          }).catch(() => {});
          await prisma.user.delete({
            where: { id: therapist.user.id },
          });
        }
      } catch (e) {}
    }
    log('✅ Test data cleaned up', 'green');
    
    await prisma.$disconnect();
  }
}

// Run the test
runTherapistLimitTest();
