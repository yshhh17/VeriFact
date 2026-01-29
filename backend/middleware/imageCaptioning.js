import axios from 'axios';
import fs from 'fs';

export const generateImageCaption = async (req, res, next) => {
  try {
    if (req.file && req.file.mimetype.startsWith('image/')) {
      console.log('🖼️ Generating image caption...');
      
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString('base64');
      
      // Using Hugging Face's BLIP image captioning model (free)
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
        { inputs: base64Image },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      req.imageCaption = response.data[0]?.generated_text || '';
      console.log('✅ Image caption:', req.imageCaption);
    }
    
    next();
  } catch (error) {
    console.error('❌ Image captioning error:', error);
    req.imageCaption = '';
    next();
  }
};