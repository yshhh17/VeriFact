import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (req, res, next) => {
  try {
    // Only process if file is an image
    if (req.file && req.file.mimetype.startsWith('image/')) {
      console.log('📸 Extracting text from image...');
      
      const { data:  { text } } = await Tesseract.recognize(
        req.file.path,
        'eng',
        {
          logger: info => console.log(info)
        }
      );
      
      // Attach extracted text to request
      req.extractedText = text.trim();
      console.log('✅ Text extracted:', req.extractedText);
    }
    
    next();
  } catch (error) {
    console.error('❌ OCR Error:', error);
    // Don't fail the request, just continue without extracted text
    req.extractedText = '';
    next();
  }
};