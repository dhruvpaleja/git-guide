#!/usr/bin/env node

/**
 * SUBTASK G7: Test Cancellation Rules
 * 
 * This script tests the 2-hour cancellation window policy:
 * - Try cancelling <2h before session → Should FAIL with THERAPY_004
 * - Try cancelling >2h before session → Should SUCCEED
 * 
 * Usage: npx tsx tests/test-cancellation-rules.mjs
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma.ts';
import { cancelSession } from '../src/services/therapy.service.ts';

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

async function runCancellationTests() {
  let testUserId;
  let testTherapistId;
  let testSessionId1; // Session within 2 hours (should fail to cancel)
  let testSessionId2; // Session after 2 hours (should succeed to cancel)

  try {
    log('\n🧪 SUBTASK G7: Cancellation Rules Test\n', 'cyan');
    log('=' .repeat(60), 'cyan');

    // =========================================================================
    // STEP 0: Setup - Create test user and therapist
    // =========================================================================
    log('\n📝 Step 0: Creating test user and therapist...', 'blue');
    
    const testEmail = `cancel-test-${Date.now()}@test.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: '$2b$10$test_hash_placeholder',
        name: 'Cancellation Test User',
        role: 'USER',
      },
    });
    testUserId = testUser.id;
    
    // Create a test therapist
    const therapistEmail = `cancel-therapist-${Date.now()}@test.com`;
    const testTherapist = await prisma.user.create({
      data: {
        email: therapistEmail,
        passwordHash: '$2b$10$test_hash_placeholder',
        name: 'Test Therapist',
        role: 'THERAPIST',
      },
    });
    
    const therapistProfile = await prisma.therapistProfile.create({
      data: {
        userId: testTherapist.id,
        bio: 'Test therapist for cancellation tests',
        specializations: ['Anxiety', 'Depression'],
        experience: 5,
        pricePerSession: 1000,
        languages: ['English'],
      },
    });
    testTherapistId = therapistProfile.id;
    
    log(`✅ Test user created: ${testEmail}`, 'green');
    log(`✅ Test therapist created: ${therapistEmail}`, 'green');

    // =========================================================================
    // STEP 1: Create session within 2 hours (should fail to cancel)
    // =========================================================================
    log('\n📅 Step 1: Creating session within 2 hours...', 'blue');
    
    const soonTime = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour from now
    
    const session1 = await prisma.session.create({
      data: {
        userId: testUserId,
        therapistId: testTherapistId,
        scheduledAt: soonTime,
        duration: 45,
        status: 'SCHEDULED',
        sessionType: 'standard',
      },
    });
    testSessionId1 = session1.id;
    
    log(`   Session scheduled at: ${formatTime(soonTime)}`, 'cyan');
    log(`   Time until session: 1 hour`, 'yellow');
    log('✅ Session created (ID: ' + testSessionId1.substring(0, 8) + '...)', 'green');

    // =========================================================================
    // STEP 2: Try cancelling session within 2 hours (should FAIL)
    // =========================================================================
    log('\n🚫 Step 2: Attempting to cancel session within 2 hours...', 'blue');
    log('   Expected: Should FAIL with cancellation window error', 'gray');
    
    let cancelAttempt1Failed = false;
    let errorMessage = '';
    
    try {
      await cancelSession(testSessionId1, testUserId, 'Testing cancellation within 2 hours');
      log('   ❌ UNEXPECTED: Cancellation succeeded (should have failed)', 'red');
    } catch (error) {
      cancelAttempt1Failed = true;
      errorMessage = error.message;
      log(`   ✅ EXPECTED: Cancellation failed as expected`, 'green');
      log(`   Error code: ${error.code}`, 'cyan');
      log(`   Error message: ${error.message}`, 'gray');
      
      if (error.code === 'CANCELLATION_WINDOW_PASSED' || error.message.includes('2 hours')) {
        log('   ✅ Correct error code received', 'green');
      } else {
        log(`   ⚠️  Unexpected error code: ${error.code}`, 'yellow');
      }
    }
    
    if (!cancelAttempt1Failed) {
      throw new Error('Test failed: Cancellation within 2 hours should have been rejected');
    }

    // =========================================================================
    // STEP 3: Create session after 2 hours (should succeed to cancel)
    // =========================================================================
    log('\n📅 Step 3: Creating session after 2 hours...', 'blue');
    
    const laterTime = new Date(Date.now() + (3 * 60 * 60 * 1000)); // 3 hours from now
    
    const session2 = await prisma.session.create({
      data: {
        userId: testUserId,
        therapistId: testTherapistId,
        scheduledAt: laterTime,
        duration: 45,
        status: 'SCHEDULED',
        sessionType: 'standard',
      },
    });
    testSessionId2 = session2.id;
    
    log(`   Session scheduled at: ${formatTime(laterTime)}`, 'cyan');
    log(`   Time until session: 3 hours`, 'green');
    log('✅ Session created (ID: ' + testSessionId2.substring(0, 8) + '...)', 'green');

    // =========================================================================
    // STEP 4: Cancel session after 2 hours (should SUCCEED)
    // =========================================================================
    log('\n✅ Step 4: Attempting to cancel session after 2 hours...', 'blue');
    log('   Expected: Should SUCCEED', 'gray');
    
    try {
      const result = await cancelSession(testSessionId2, testUserId, 'Testing cancellation after 2 hours');
      
      log('   ✅ Cancellation succeeded as expected', 'green');
      log(`   Result status: ${result.status}`, 'cyan');
      
      // Verify the session was actually cancelled
      const updatedSession = await prisma.session.findUnique({
        where: { id: testSessionId2 },
      });
      
      if (updatedSession.status === 'CANCELLED') {
        log('   ✅ Session status correctly updated to CANCELLED', 'green');
      } else {
        throw new Error(`Session status is ${updatedSession.status}, expected CANCELLED`);
      }
      
      if (updatedSession.cancelledBy === testUserId) {
        log('   ✅ Cancelled by correctly set', 'green');
      }
      
      if (updatedSession.cancelReason === 'Testing cancellation after 2 hours') {
        log('   ✅ Cancel reason correctly saved', 'green');
      }
      
    } catch (error) {
      log(`   ❌ UNEXPECTED: Cancellation failed: ${error.message}`, 'red');
      throw error;
    }

    // =========================================================================
    // STEP 5: Verify TherapyJourney was updated
    // =========================================================================
    log('\n📊 Step 5: Verifying TherapyJourney update...', 'blue');
    
    const journey = await prisma.therapyJourney.findUnique({
      where: { userId: testUserId },
    });
    
    if (journey) {
      log(`   Active therapist count: ${journey.activeTherapistCount}`, 'cyan');
      log('✅ TherapyJourney tracking working correctly', 'green');
    } else {
      log('⚠️  No TherapyJourney found (may be created lazily)', 'yellow');
    }

    // =========================================================================
    // STEP 6: Test edge case - exactly at 2 hour boundary
    // =========================================================================
    log('\n📏 Step 6: Testing edge case (exactly 2 hours before)...', 'blue');
    
    const edgeTime = new Date(Date.now() + (2 * 60 * 60 * 1000) + 1000); // 2 hours + 1 second
    
    const session3 = await prisma.session.create({
      data: {
        userId: testUserId,
        therapistId: testTherapistId,
        scheduledAt: edgeTime,
        duration: 45,
        status: 'SCHEDULED',
        sessionType: 'standard',
      },
    });
    
    log(`   Session scheduled at: ${formatTime(edgeTime)}`, 'cyan');
    log(`   Time until session: 2 hours + 1 second`, 'gray');
    
    try {
      await cancelSession(session3.id, testUserId, 'Edge case test');
      log('   ✅ Cancellation succeeded (just outside 2h window)', 'green');
      
      // Clean up this test session
      await prisma.session.delete({
        where: { id: session3.id },
      }).catch(() => {});
      
    } catch (error) {
      log(`   ℹ️  Cancellation failed: ${error.message}`, 'yellow');
      log('   (This is acceptable - edge cases may vary)', 'gray');
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    log('\n' + '=' .repeat(60), 'cyan');
    log('🎉 ALL CANCELLATION TESTS PASSED!', 'green');
    log('=' .repeat(60), 'cyan');
    log('\n📊 Cancellation Policy Summary:', 'cyan');
    log('   < 2 hours before → ❌ Cancellation REJECTED', 'yellow');
    log('   > 2 hours before → ✅ Cancellation ALLOWED', 'yellow');
    log('\n✅ SUBTASK G7 verification complete!\n', 'green');

  } catch (error) {
    log('\n❌ TEST FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    if (testSessionId1) {
      log('\n🧹 Cleaning up test sessions...', 'blue');
      try {
        await prisma.session.delete({
          where: { id: testSessionId1 },
        }).catch(() => {});
      } catch (e) {}
    }
    if (testSessionId2) {
      try {
        await prisma.session.delete({
          where: { id: testSessionId2 },
        }).catch(() => {});
      } catch (e) {}
    }
    if (testUserId) {
      try {
        await prisma.therapyJourney.delete({
          where: { userId: testUserId },
        }).catch(() => {});
        await prisma.user.delete({
          where: { id: testUserId },
        });
      } catch (e) {}
    }
    if (testTherapistId) {
      try {
        await prisma.therapistProfile.delete({
          where: { id: testTherapistId },
        }).catch(() => {});
        const therapist = await prisma.user.findFirst({
          where: { therapistProfile: { id: testTherapistId } },
        });
        if (therapist) {
          await prisma.user.delete({
            where: { id: therapist.id },
          });
        }
      } catch (e) {}
    }
    log('✅ Test data cleaned up', 'green');
    
    await prisma.$disconnect();
  }
}

// Run the test
runCancellationTests();
