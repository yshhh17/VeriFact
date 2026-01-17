import mongoose from 'mongoose';

const detectionSchema = new mongoose.Schema({
  user: {
    type: mongoose. Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true,
  },
  content: {
    type: String, // For text content or extracted text
  },
  filePath: {
    type: String, // For image/video
  },
  
  // AI Generation Detection
  aiDetection: {
    isAIGenerated: {
      type:  Boolean,
      required: true,
    },
    confidence: {
      type: Number,
      required:  true,
    },
    verdict: String,
    confidenceLevel: String,
    details: {
      type: mongoose.Schema.Types.Mixed,
    }
  },
  
  // Fact-Checking Results (NEW)
  factCheck: {
    isFake: {
      type: Boolean,
      default: null,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    verdict: String,
    claimsDetected: [String],
    verifiedFacts: [{
      claim: String,
      isTrue: Boolean,
      sources: [String],
      explanation: String,
    }],
    sources: [String],
  },
  
  // Extracted Information (NEW)
  extractedData: {
    text: String,          // OCR or direct text
    imageCaption: String,  // What's in the image
    audioTranscript: String, // Speech-to-text from video
  },
  
  // Final Verdict (NEW)
  finalVerdict: {
    category: {
      type: String,
      enum: ['trusted', 'real-fake-news', 'ai-accurate', 'ai-misinformation', 'uncertain'],
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    explanation: String,
  },
  
  createdAt: {
    type:  Date,
    default: Date. now,
  },
});

export default mongoose.model('Detection', detectionSchema);