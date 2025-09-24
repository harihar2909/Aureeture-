import { Router } from 'express';
import { getProfile, updateProfile, createProfile } from '../controllers/profile.controller';
import { customAuthMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createProfileSchema, updateProfileSchema } from '../utils/validationSchemas';

const router = Router();

// All profile routes require authentication
router.use(customAuthMiddleware);

// GET /api/profile
router.get('/', getProfile);

// POST /api/profile
router.post('/', validateRequest(createProfileSchema), createProfile);

// PUT /api/profile
router.put('/', validateRequest(updateProfileSchema), updateProfile);

export default router;
