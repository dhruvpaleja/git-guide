/**
 * SUBTASK G6: Unit tests for pricing stage progression logic
 * 
 * Tests the getUserPricingStage function to ensure:
 * - completedSessionCount = 0 → 'discovery'
 * - completedSessionCount = 1-2 → 'pay_as_you_like'
 * - completedSessionCount >= 3 → 'standard'
 */

import { test, expect, describe } from 'node:test';
import { prisma } from '../src/lib/prisma.js';
import { getUserPricingStage } from '../src/services/therapy.service.js';

describe('getUserPricingStage', async () => {
  let testUserId: string;

  // Setup: Create a test user before running tests
  async function setup() {
    // Create a test user
    const testEmail = `pricing-unit-test-${Date.now()}@test.com`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: 'hashed_password_placeholder',
        name: 'Pricing Unit Test User',
        role: 'user',
      },
    });
    testUserId = testUser.id;
  }

  // Cleanup: Remove test user after all tests
  async function teardown() {
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
  }

  test('should return discovery stage for user with no therapy journey', async () => {
    await setup();
    
    try {
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('discovery');
      expect(result.completedSessions).toBe(0);
    } finally {
      await teardown();
    }
  });

  test('should return discovery stage for user with 0 completed sessions', async () => {
    await setup();
    
    try {
      // Create therapy journey with 0 completed sessions
      await prisma.therapyJourney.create({
        data: {
          userId: testUserId,
          completedSessionCount: 0,
        },
      });
      
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('discovery');
      expect(result.completedSessions).toBe(0);
    } finally {
      await teardown();
    }
  });

  test('should return pay_as_you_like stage for user with 1 completed session', async () => {
    await setup();
    
    try {
      await prisma.therapyJourney.create({
        data: {
          userId: testUserId,
          completedSessionCount: 1,
        },
      });
      
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('pay_as_you_like');
      expect(result.completedSessions).toBe(1);
    } finally {
      await teardown();
    }
  });

  test('should return pay_as_you_like stage for user with 2 completed sessions', async () => {
    await setup();
    
    try {
      await prisma.therapyJourney.create({
        data: {
          userId: testUserId,
          completedSessionCount: 2,
        },
      });
      
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('pay_as_you_like');
      expect(result.completedSessions).toBe(2);
    } finally {
      await teardown();
    }
  });

  test('should return standard stage for user with 3 completed sessions', async () => {
    await setup();
    
    try {
      await prisma.therapyJourney.create({
        data: {
          userId: testUserId,
          completedSessionCount: 3,
        },
      });
      
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('standard');
      expect(result.completedSessions).toBe(3);
    } finally {
      await teardown();
    }
  });

  test('should return standard stage for user with 5 completed sessions', async () => {
    await setup();
    
    try {
      await prisma.therapyJourney.create({
        data: {
          userId: testUserId,
          completedSessionCount: 5,
        },
      });
      
      const result = await getUserPricingStage(testUserId);
      
      expect(result.stage).toBe('standard');
      expect(result.completedSessions).toBe(5);
    } finally {
      await teardown();
    }
  });

  test('should handle non-existent user gracefully', async () => {
    const nonExistentUserId = 'non-existent-user-id';
    
    const result = await getUserPricingStage(nonExistentUserId);
    
    expect(result.stage).toBe('discovery');
    expect(result.completedSessions).toBe(0);
  });
});
