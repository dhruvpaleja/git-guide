import { Router } from 'express';
import { devLogin, createDevLoginEndpoint } from '../lib/dev-login.js';
import { config } from '../config/index.js';

const router = Router();

// Only enable in development
if (config.isDevelopment) {
  // Quick login endpoints for development
  router.get('/user@test.com', async (req, res) => {
    try {
      const result = await devLogin('user@test.com');
      res.json({
        success: true,
        data: result,
        message: '👤 User dashboard access - Full therapy experience'
      });
    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to login user' }
      });
    }
  });

  router.get('/therapist@test.com', async (req, res) => {
    try {
      const result = await devLogin('therapist@test.com');
      res.json({
        success: true,
        data: result,
        message: '👨‍⚕️ Therapist dashboard - Manage sessions & earnings'
      });
    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to login therapist' }
      });
    }
  });

  router.get('/astrologer@test.com', async (req, res) => {
    try {
      const result = await devLogin('astrologer@test.com');
      res.json({
        success: true,
        data: result,
        message: '🔮 Astrologer dashboard - Consultations & predictions'
      });
    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to login astrologer' }
      });
    }
  });

  router.get('/admin@test.com', async (req, res) => {
    try {
      const result = await devLogin('admin@test.com');
      res.json({
        success: true,
        data: result,
        message: '👑 Admin dashboard - Platform management'
      });
    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to login admin' }
      });
    }
  });

  // List all dev login options
  router.get('/', (req, res) => {
    const endpoints = createDevLoginEndpoint();
    res.json({
      success: true,
      data: {
        message: '🚀 Development Login Helper',
        endpoints,
        instructions: {
          browser: 'Click the URLs above or visit them directly',
          curl: 'Use curl -X GET [endpoint]',
          postman: 'Import as GET requests',
          note: 'Only available in development mode'
        }
      }
    });
  });
}

export default router;
