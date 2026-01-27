import express from 'express';
import {
  detectText,
  detectImage,
  detectVideo,
  getHistory,
  getDetection,
  deleteDetection,
} from '../controllers/detectionController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { extractTextFromImage } from '../middleware/ocr.js';
import { generateImageCaption } from '../middleware/imageCaptioning.js';
import { extractFrames, extractAudio } from '../middleware/videoProcessor.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Text detection
router.post('/text', detectText);

// Image detection (with OCR and captioning middleware)
router.post(
  '/image',
  upload.single('file'),
  extractTextFromImage,
  generateImageCaption,
  detectImage
);

// Video detection (with frame extraction middleware)
router.post(
  '/video',
  upload.single('file'),
  extractFrames,
  // extractAudio, // Optional: uncomment if you implement speech-to-text
  detectVideo
);

// Detection history and management
router.get('/history', getHistory);
router.get('/:id', getDetection);
router.delete('/:id', deleteDetection);

export default router;