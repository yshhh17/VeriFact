import express from 'express';
import {
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected - auth is handled by frontend with Supabase
// Backend only verifies JWT tokens and provides user data

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;