import express from 'express';
import userRoutes from './userRoutes';
import onboardingRoutes from './onboardingRoutes';
import { authHandler } from '../middleware/authenticationHandler';

const router = express.Router();

router.use('/users', authHandler, userRoutes);
router.use('/onboarding', authHandler, onboardingRoutes);

export default router;
