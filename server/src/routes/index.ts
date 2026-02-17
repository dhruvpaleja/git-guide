import { Router } from 'express';
import healthRoutes from './health.js';

const router = Router();

router.use(healthRoutes);

// Add feature routes here as they are built:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/blog', blogRoutes);
// router.use('/courses', courseRoutes);

export default router;
