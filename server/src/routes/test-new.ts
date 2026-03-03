import { Router } from 'express';
import { config } from '../config/index.js';

const router = Router();

// Health check - no database required
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Dev server is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    port: config.port
  });
});

// Test dev login - ultra simple version
router.get('/test-login/:email', (req, res) => {
  const { email } = req.params;
  
  console.log(`[TEST LOGIN] Received request for: ${email}`);
  
  // Simple hardcoded users - MUST match frontend routing expectations
  const testUsers: Record<string, { id: string; email: string; name: string; role: string }> = {
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
      role: 'practitioner', // Frontend routes 'practitioner' to /practitioner
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
  
  const user = testUsers[email];
  if (!user) {
    console.log(`[TEST LOGIN] User not found: ${email}`);
    return res.status(404).json({
      success: false,
      error: { message: `User not found: ${email}` }
    });
  }
  
  // Generate simple JWT-like token
  const token = Buffer.from(JSON.stringify({
    sub: user.id,
    role: user.role,
    jti: 'test-jti-' + Date.now(),
    iss: 'soul-yatri-api',
    aud: 'soul-yatri-client',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  })).toString('base64');
  
  console.log(`[TEST LOGIN] Success for ${email}, role: ${user.role}`);
  
  // Return EXACTLY what frontend expects
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: token,
    },
    timestamp: new Date().toISOString(),
  });
});

// Ultra-simple ping endpoint for testing connectivity
router.get('/ping', (req, res) => {
  res.json({ 
    success: true, 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

export default router;
