import express from 'express';
import * as onboardingController from '../controllers/onboardingController';

const router = express.Router();

router.get('/', onboardingController.setupUserOnboarding);
router.post('/updateOrganization', onboardingController.completeOrganizationOnboarding);
router.post('/finish', onboardingController.completeOnboarding);

export default router;