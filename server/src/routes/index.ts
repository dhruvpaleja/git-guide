import { Router } from 'express';
import healthRoutes from './health.js';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import therapyRoutes from './therapy.js';
import videoRoutes from './video.js';
import astrologyRoutes from './astrology.js';
import aiRoutes from './ai.js';
import healthToolsRoutes from './health-tools.js';
import courseRoutes from './courses.js';
import blogRoutes from './blog.js';
import communityRoutes from './community.js';
import shopRoutes from './shop.js';
import paymentRoutes from './payments.js';
import eventRoutes from './events.js';
import adminRoutes from './admin.js';
import corporateRoutes from './corporate.js';
import careerRoutes from './careers.js';
import notificationRoutes from './notifications.js';
import ngoRoutes from './ngo.js';
import devLoginRoutes from './dev-login.js';
import devHelperRoutes from './dev-helper.js';
import { config } from '../config/index.js';

const router = Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
if (config.runtime.enableDevRoutes) {
  router.use('/dev-login', devLoginRoutes);
  router.use('/dev-helper', devHelperRoutes);
}
router.use('/users', userRoutes);
router.use('/therapy', therapyRoutes);
router.use('/video', videoRoutes);
router.use('/astrology', astrologyRoutes);
router.use('/ai', aiRoutes);
router.use('/health-tools', healthToolsRoutes);
router.use('/courses', courseRoutes);
router.use('/blog', blogRoutes);
router.use('/community', communityRoutes);
router.use('/shop', shopRoutes);
router.use('/payments', paymentRoutes);
router.use('/events', eventRoutes);
router.use('/admin', adminRoutes);
router.use('/corporate', corporateRoutes);
router.use('/careers', careerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ngo', ngoRoutes);

export default router;
