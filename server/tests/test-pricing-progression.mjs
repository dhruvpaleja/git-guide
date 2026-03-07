#!/usr/bin/env node

/**
 * SUBTASK G6: Manual Integration Test Script for Pricing Stage Progression
 * 
 * This script tests the pricing stage progression by:
 * 1. Creating a test user
 * 2. Simulating completion of discovery session
 * 3. Verifying next booking is pay_as_you_like
 * 4. Simulating completion of pay_as_you_like session
 * 5. Verifying next booking is standard
 * 
 * Usage: npx tsx tests/test-pricing-progression.mjs
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma.ts';
import { getUserPricingStage } from '../src/services/therapy.service.ts';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPricingProgressionTest() {
  let testUserId;
  let testEmail;

  try {
    log('\n🧪 SUBTASK G6: Pricing Stage Progression Test\n', 'cyan');
    log('=' .repeat(60), 'cyan');

    // =========================================================================
    // STEP 0: Setup - Create test user
    // =========================================================================
    log('\n📝 Step 0: Creating test user...', 'blue');
    
    testEmail = `pricing-test-${Date.now()}@test.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: '$2b$10$test_hash_placeholder', // bcrypt hash placeholder
        name: 'Pricing Test User',
        role: 'USER',
      },
    });
    testUserId = testUser.id;
    
    log(`✅ Test user created: ${testEmail}`, 'green');

    // =========================================================================
    // STEP 1: Verify initial pricing stage (discovery)
    // =========================================================================
    log('\n📊 Step 1: Checking initial pricing stage...', 'blue');
    
    let result = await getUserPricingStage(testUserId);
    
    log(`   Stage: ${result.stage}`, result.stage === 'discovery' ? 'green' : 'red');
    log(`   Completed Sessions: ${result.completedSessions}`, 'cyan');
    
    if (result.stage !== 'discovery') {
      throw new Error(`Expected 'discovery' but got '${result.stage}'`);
    }
    
    log('✅ Initial stage is correct: DISCOVERY', 'green');

    // =========================================================================
    // STEP 2: Simulate completing discovery session
    // =========================================================================
    log('\n📅 Step 2: Simulating discovery session completion...', 'blue');
    
    await prisma.therapyJourney.upsert({
      where: { userId: testUserId },
      update: { 
        completedSessionCount: 1,
        firstSessionAt: new Date(),
        lastSessionAt: new Date(),
      },
      create: {
        userId: testUserId,
        completedSessionCount: 1,
        firstSessionAt: new Date(),
        lastSessionAt: new Date(),
      },
    });
    
    log('✅ Discovery session marked as completed', 'green');
    
    await sleep(100); // Small delay to ensure DB update

    // =========================================================================
    // STEP 3: Verify pricing stage changed to pay_as_you_like
    // =========================================================================
    log('\n💰 Step 3: Verifying pricing stage is now pay_as_you_like...', 'blue');
    
    result = await getUserPricingStage(testUserId);
    
    log(`   Stage: ${result.stage}`, result.stage === 'pay_as_you_like' ? 'green' : 'red');
    log(`   Completed Sessions: ${result.completedSessions}`, 'cyan');
    
    if (result.stage !== 'pay_as_you_like') {
      throw new Error(`Expected 'pay_as_you_like' but got '${result.stage}'`);
    }
    
    log('✅ Pricing stage correctly changed to: PAY_AS_YOU_LIKE', 'green');

    // =========================================================================
    // STEP 4: Simulate completing pay_as_you_like session
    // =========================================================================
    log('\n📅 Step 4: Simulating pay_as_you_like session completion...', 'blue');
    
    await prisma.therapyJourney.update({
      where: { userId: testUserId },
      data: { 
        completedSessionCount: 2,
        lastSessionAt: new Date(),
      },
    });
    
    log('✅ Pay-as-you-like session marked as completed', 'green');
    
    await sleep(100);

    // =========================================================================
    // STEP 5: Verify pricing stage is still pay_as_you_like (2 sessions)
    // =========================================================================
    log('\n💰 Step 5: Verifying pricing stage with 2 completed sessions...', 'blue');
    
    result = await getUserPricingStage(testUserId);
    
    log(`   Stage: ${result.stage}`, result.stage === 'pay_as_you_like' ? 'green' : 'red');
    log(`   Completed Sessions: ${result.completedSessions}`, 'cyan');
    
    if (result.stage !== 'pay_as_you_like') {
      throw new Error(`Expected 'pay_as_you_like' but got '${result.stage}'`);
    }
    
    log('✅ Pricing stage correctly remains: PAY_AS_YOU_LIKE', 'green');

    // =========================================================================
    // STEP 6: Simulate completing one more session (total 3)
    // =========================================================================
    log('\n📅 Step 6: Simulating third session completion...', 'blue');
    
    await prisma.therapyJourney.update({
      where: { userId: testUserId },
      data: { 
        completedSessionCount: 3,
        lastSessionAt: new Date(),
      },
    });
    
    log('✅ Third session marked as completed', 'green');
    
    await sleep(100);

    // =========================================================================
    // STEP 7: Verify pricing stage changed to standard
    // =========================================================================
    log('\n💵 Step 7: Verifying pricing stage is now standard...', 'blue');
    
    result = await getUserPricingStage(testUserId);
    
    log(`   Stage: ${result.stage}`, result.stage === 'standard' ? 'green' : 'red');
    log(`   Completed Sessions: ${result.completedSessions}`, 'cyan');
    
    if (result.stage !== 'standard') {
      throw new Error(`Expected 'standard' but got '${result.stage}'`);
    }
    
    log('✅ Pricing stage correctly changed to: STANDARD', 'green');

    // =========================================================================
    // SUMMARY
    // =========================================================================
    log('\n' + '=' .repeat(60), 'cyan');
    log('🎉 ALL TESTS PASSED!', 'green');
    log('=' .repeat(60), 'cyan');
    log('\n📊 Pricing Stage Progression Summary:', 'cyan');
    log('   0 sessions → discovery', 'yellow');
    log('   1-2 sessions → pay_as_you_like', 'yellow');
    log('   3+ sessions → standard', 'yellow');
    log('\n✅ SUBTASK G6 verification complete!\n', 'green');

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
        await prisma.therapyJourney.delete({
          where: { userId: testUserId },
        }).catch(() => {}); // Ignore if doesn't exist
        
        await prisma.user.delete({
          where: { id: testUserId },
        });
        
        log('✅ Test data cleaned up', 'green');
      } catch (cleanupError) {
        log(`⚠️  Cleanup warning: ${cleanupError.message}`, 'yellow');
      }
    }
    
    await prisma.$disconnect();
  }
}

// Run the test
runPricingProgressionTest();
