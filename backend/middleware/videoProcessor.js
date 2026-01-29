import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract frames from video
export const extractFrames = async (req, res, next) => {
  try {
    if (req.file && req.file.mimetype.startsWith('video/')) {
      console.log('🎬 Extracting frames from video...');
      
      const framesDir = path.join('uploads', 'frames', Date.now().toString());
      
      if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir, { recursive: true });
      }
      
      // Extract 1 frame per 2 seconds (max 30 frames)
      await new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
          .screenshots({
            count: 30,
            folder: framesDir,
            filename: 'frame-%i.png',
            size: '640x480'
          })
          .on('end', () => {
            console.log('✅ Frames extracted');
            resolve();
          })
          .on('error', (err) => {
            console.error('❌ Frame extraction error:', err);
            reject(err);
          });
      });
      
      // Get all extracted frame paths
      const frames = fs.readdirSync(framesDir).map(file => 
        path.join(framesDir, file)
      );
      
      req.videoFrames = frames;
      req.framesDir = framesDir;
    }
    
    next();
  } catch (error) {
    console.error('❌ Video processing error:', error);
    req.videoFrames = [];
    next();
  }
};

// Extract audio from video (for speech-to-text)
export const extractAudio = async (req, res, next) => {
  try {
    if (req.file && req.file.mimetype.startsWith('video/')) {
      console.log('🎵 Extracting audio from video...');
      
      const audioPath = req.file.path.replace(path.extname(req.file.path), '.mp3');
      
      await new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
          .output(audioPath)
          .audioCodec('libmp3lame')
          .on('end', () => {
            console.log('✅ Audio extracted');
            resolve();
          })
          .on('error', (err) => {
            console.error('❌ Audio extraction error:', err);
            reject(err);
          })
          .run();
      });
      
      req.audioPath = audioPath;
    }
    
    next();
  } catch (error) {
    console.error('❌ Audio extraction error:', error);
    req.audioPath = null;
    next();
  }
};