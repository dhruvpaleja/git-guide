import { Router } from 'express';
import { config } from '../config/index.js';

const router = Router();

// Simple test endpoint - no database required
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Dev server is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    port: config.port
  });
});

// Test dev login without database dependency
router.get('/test-login/:email', (req, res) => {
  const { email } = req.params;
  
  // Simple hardcoded users for testing
  const testUsers = {
    'user@test.com': {
      id: 'test-user-1',
      email: 'user@test.com',
      name: 'Test User',
      role: 'user',
    },
    'therapist@test.com': {
      id: 'test-therapist-1',
      email: 'therapist@test.com',
      name: 'Dr. Test Therapist',
      role: 'therapist',
    },
    'astrologer@test.com': {
      id: 'test-astrologer-1',
      email: 'astrologer@test.com',
      name: 'Test Astrologer',
      role: 'astrologer',
    },
    'admin@test.com': {
      id: 'test-admin-1',
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'admin',
    }
  };
  
  const user = testUsers[email as keyof typeof testUsers];
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: `User not found: ${email}` }
    });
  }
  
  // Generate simple token
  const token = Buffer.from(JSON.stringify({
    sub: user.id,
    role: user.role,
    jti: 'test-jti',
    iss: 'soul-yatri-api',
    aud: 'soul-yatri-client',
  })).toString('base64');
  
  res.json({
    success: true,
    data: {
      user,
      accessToken: token,
      refreshToken: 'test-refresh-token'
    },
    message: `Successfully logged in as ${user.role}!`
  });
});

export default router;
