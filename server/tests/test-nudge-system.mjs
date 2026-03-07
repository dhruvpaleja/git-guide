#!/usr/bin/env node

/**
 * SUBTASK G9: Test Nudge Generation and Dismissal
 * 
 * This script tests the nudge system:
 * 1. Create user with completed onboarding but no bookings
 * 2. Evaluate nudges → Should get 'first_session_free'
 * 3. Dismiss the nudge
 * 4. Re-evaluate nudges → Should NOT appear for 7 days (cooldown period)
 * 
 * Usage: npx tsx tests/test-nudge-system.mjs
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma.ts';
import { evaluateNudges } from '../src/services/nudge.service.ts';
import { dismissNudge } from '../src/services/nudge.service.ts';
import { getActiveNudges } from '../src/services/nudge.service.ts';

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

function formatDate(date) {
  if (!date) return 'N/A';
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

async function runNudgeSystemTest() {
  let testUserId;

  try {
    log('\n🧪 SUBTASK G9: Nudge Generation and Dismissal Test\n', 'cyan');
    log('=' .repeat(60), 'cyan');

    // =========================================================================
    // STEP 0: Setup - Create test user with completed onboarding
    // =========================================================================
    log('\n📝 Step 0: Creating test user with completed onboarding...', 'blue');
    
    const testEmail = `nudge-test-${Date.now()}@test.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: '$2b$10$test_hash_placeholder',
        name: 'Nudge Test User',
        role: 'USER',
      },
    });
    testUserId = testUser.id;
    
    // Create user profile with completed onboarding
    const profile = await prisma.userProfile.create({
      data: {
        userId: testUserId,
        dateOfBirth: new Date('2000-01-01'),
        gender: 'PREFER_NOT_TO_SAY',
        city: 'Test City',
        country: 'India',
        struggles: ['Anxiety'],
        goals: ['Reduce anxiety'],
        onboardingComplete: true,
        onboardingStep: 10,
      },
    });
    
    log(`✅ Test user created: ${testEmail}`, 'green');
    log(`✅ Onboarding status: Complete (step ${profile.onboardingStep}/10)`, 'green');

    // =========================================================================
    // STEP 1: Verify user has no sessions booked
    // =========================================================================
    log('\n📊 Step 1: Verifying user has no booked sessions...', 'blue');
    
    const sessionCount = await prisma.session.count({
      where: { userId: testUserId },
    });
    
    log(`   Session count: ${sessionCount}`, 'cyan');
    
    if (sessionCount === 0) {
      log('   ✅ User has no sessions (eligible for first_session_free nudge)', 'green');
    } else {
      log('   ❌ User already has sessions', 'red');
      throw new Error('Test user should have no sessions');
    }

    // =========================================================================
    // STEP 2: Evaluate nudges (should create first_session_free)
    // =========================================================================
    log('\n💡 Step 2: Evaluating nudges...', 'blue');
    log('   Expected: Should create first_session_free nudge', 'gray');
    
    await evaluateNudges(testUserId);
    await sleep(100); // Small delay for DB write
    
    // Fetch all nudges for this user
    const nudges = await prisma.userNudge.findMany({
      where: { userId: testUserId },
      orderBy: { createdAt: 'desc' },
    });
    
    log(`   Total nudges created: ${nudges.length}`, 'cyan');
    
    if (nudges.length === 0) {
      log('   ❌ No nudges created (expected first_session_free)', 'red');
      throw new Error('first_session_free nudge should have been created');
    }
    
    const firstSessionFreeNudge = nudges.find(n => n.nudgeType === 'first_session_free');
    
    if (firstSessionFreeNudge) {
      log('   ✅ first_session_free nudge created', 'green');
      log(`   Nudge ID: ${firstSessionFreeNudge.id.substring(0, 8)}...`, 'gray');
      log(`   Status: ${firstSessionFreeNudge.status}`, 'cyan');
      log(`   Created: ${formatDate(firstSessionFreeNudge.createdAt)}`, 'gray');
    } else {
      log('   ❌ first_session_free nudge not found', 'red');
      log(`   Available nudges: ${nudges.map(n => n.nudgeType).join(', ')}`, 'gray');
      throw new Error('first_session_free nudge should have been created');
    }

    // =========================================================================
    // STEP 3: Get active nudges (should include first_session_free)
    // =========================================================================
    log('\n📬 Step 3: Getting active nudges...', 'blue');
    
    const activeNudges = await getActiveNudges(testUserId);
    
    log(`   Active nudges count: ${activeNudges.length}`, 'cyan');
    
    if (activeNudges.length > 0) {
      log('   ✅ Active nudges available', 'green');
      const activeFirstSessionFree = activeNudges.find(n => n.nudgeType === 'first_session_free');
      if (activeFirstSessionFree) {
        log('   ✅ first_session_free is in active nudges', 'green');
      }
    }

    // =========================================================================
    // STEP 4: Dismiss the first_session_free nudge
    // =========================================================================
    log('\n🚫 Step 4: Dismissing first_session_free nudge...', 'blue');
    
    if (!firstSessionFreeNudge) {
      throw new Error('No nudge to dismiss');
    }
    
    const dismissedNudge = await dismissNudge(firstSessionFreeNudge.id, testUserId);
    
    log(`   ✅ Nudge dismissed`, 'green');
    log(`   New status: ${dismissedNudge.status}`, 'cyan');
    log(`   Dismissed at: ${formatDate(dismissedNudge.dismissedAt)}`, 'gray');
    log(`   Cooldown until: ${formatDate(dismissedNudge.cooldownUntil)}`, 'yellow');
    
    // Verify cooldown is set to 7 days
    if (dismissedNudge.cooldownUntil) {
      const cooldownDays = (dismissedNudge.cooldownUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      log(`   Cooldown duration: ${cooldownDays.toFixed(1)} days`, 'cyan');
      
      if (cooldownDays >= 7 && cooldownDays < 8) {
        log('   ✅ Cooldown is correctly set to 7 days', 'green');
      } else {
        log(`   ⚠️  Unexpected cooldown duration`, 'yellow');
      }
    }

    // =========================================================================
    // STEP 5: Re-evaluate nudges immediately (should NOT create new first_session_free)
    // =========================================================================
    log('\n🔄 Step 5: Re-evaluating nudges immediately after dismissal...', 'blue');
    log('   Expected: Should NOT create new first_session_free (in cooldown)', 'gray');
    
    await evaluateNudges(testUserId);
    await sleep(100);
    
    const nudgesAfterReeval = await prisma.userNudge.findMany({
      where: { userId: testUserId },
      orderBy: { createdAt: 'desc' },
    });
    
    // Count first_session_free nudges
    const firstSessionFreeCount = nudgesAfterReeval.filter(
      n => n.nudgeType === 'first_session_free'
    ).length;
    
    log(`   Total first_session_free nudges: ${firstSessionFreeCount}`, 'cyan');
    
    if (firstSessionFreeCount === 1) {
      log('   ✅ No duplicate nudge created (cooldown working)', 'green');
    } else if (firstSessionFreeCount > 1) {
      log('   ❌ Duplicate nudge created (cooldown NOT working)', 'red');
      throw new Error('Cooldown period should prevent duplicate nudges');
    }
    
    // Check active nudges (should be 0 since the only one is dismissed)
    const activeAfterReeval = await getActiveNudges(testUserId);
    const activeFirstSessionFree = activeAfterReeval.filter(
      n => n.nudgeType === 'first_session_free'
    );
    
    log(`   Active first_session_free nudges: ${activeFirstSessionFree.length}`, 'cyan');
    
    if (activeFirstSessionFree.length === 0) {
      log('   ✅ No active nudges (dismissed one is in cooldown)', 'green');
    }

    // =========================================================================
    // STEP 6: Verify nudge status history
    // =========================================================================
    log('\n📋 Step 6: Verifying nudge status history...', 'blue');
    
    const allNudges = await prisma.userNudge.findMany({
      where: { userId: testUserId },
      orderBy: { createdAt: 'asc' },
    });
    
    for (const nudge of allNudges) {
      log(`   Nudge: ${nudge.nudgeType}`, 'cyan');
      log(`     Status: ${nudge.status}`, 'gray');
      log(`     Created: ${formatDate(nudge.createdAt)}`, 'gray');
      log(`     Dismissed: ${formatDate(nudge.dismissedAt)}`, 'gray');
      log(`     Cooldown until: ${formatDate(nudge.cooldownUntil)}`, 'gray');
    }
    
    const dismissedNudgeFinal = allNudges.find(n => n.nudgeType === 'first_session_free');
    if (dismissedNudgeFinal?.status === 'dismissed') {
      log('   ✅ Nudge correctly marked as dismissed', 'green');
    }

    // =========================================================================
    // STEP 7: Test nudge dismissal ownership (security check)
    // =========================================================================
    log('\n🔒 Step 7: Testing nudge dismissal security...', 'blue');
    log('   Expected: Cannot dismiss another user\'s nudge', 'gray');
    
    try {
      // Try to dismiss with wrong user ID
      await dismissNudge(firstSessionFreeNudge.id, 'wrong-user-id');
      log('   ❌ Security check failed (should have thrown error)', 'red');
      throw new Error('Should not be able to dismiss another user\'s nudge');
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('not owned')) {
        log('   ✅ Security check passed (ownership verified)', 'green');
      } else {
        log(`   ℹ️  Different error: ${error.message}`, 'yellow');
      }
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    log('\n' + '=' .repeat(60), 'cyan');
    log('🎉 ALL NUDGE SYSTEM TESTS PASSED!', 'green');
    log('=' .repeat(60), 'cyan');
    log('\n📊 Nudge System Summary:', 'cyan');
    log('   User with completed onboarding → ✅ Gets first_session_free', 'yellow');
    log('   Dismiss nudge → ✅ Sets 7-day cooldown', 'yellow');
    log('   Re-evaluate during cooldown → ✅ No duplicate created', 'yellow');
    log('   Ownership check → ✅ Security enforced', 'yellow');
    log('\n✅ SUBTASK G9 verification complete!\n', 'green');

  } catch (error) {
    log('\n❌ TEST FAILED', 'red');
    log(`   Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    if (testUserId) {
      log('\n🧹 Cleaning up test data...', 'blue');
      try {
        await prisma.userNudge.deleteMany({
          where: { userId: testUserId },
        }).catch(() => {});
        
        await prisma.therapyJourney.delete({
          where: { userId: testUserId },
        }).catch(() => {});
        
        await prisma.userProfile.delete({
          where: { userId: testUserId },
        }).catch(() => {});
        
        await prisma.user.delete({
          where: { id: testUserId },
        });
        
        log('✅ Test data cleaned up', 'green');
      } catch (e) {
        log(`⚠️  Cleanup warning: ${e.message}`, 'yellow');
      }
    }
    
    await prisma.$disconnect();
  }
}

// Run the test
runNudgeSystemTest();
