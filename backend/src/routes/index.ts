import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import onboardingRoutes from './onboarding.routes';
import jobRoutes from './job.routes';
import projectRoutes from './project.routes';
import peopleRoutes from './people.routes';
import caroRoutes from './caro.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/jobs', jobRoutes);
router.use('/people', peopleRoutes);
router.use('/projects', projectRoutes);
router.use('/caro', caroRoutes);

export default router;
