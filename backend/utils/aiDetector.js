import axios from 'axios';
import fs from 'fs';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const detectAIText = async (text) => {
  try {
    console.log('🔍 Detecting AI in text...');
    
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/roberta-base-openai-detector',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data[0];
    
    const aiResult = result.find(r => r.label === 'LABEL_1' || r.label === 'Fake' || r.label === 'LABEL_0');
    const isAIGenerated = aiResult?.label === 'LABEL_1' || aiResult?.label === 'Fake';
    const confidence = (aiResult?.score || 0.5) * 100;

    return {
      isAIGenerated,
      confidence:  parseFloat(confidence.toFixed(2)),
      humanProbability: parseFloat((100 - confidence).toFixed(2)),
      aiProbability: parseFloat(confidence.toFixed(2)),
      modelUsed: 'roberta-base-openai-detector',
      analysis: result,
    };
  } catch (error) {
    console.error('❌ AI Text Detection Error:', error.response?.data || error.message);
    
    // Fallback:  simple heuristic check
    return fallbackTextDetection(text);
  }
};

// Image AI Detection
export const detectAIImage = async (imagePath) => {
  try {
    console.log('🔍 Detecting AI in image...');
    
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Using AI Image Detector model (free)
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector',
      imageBuffer,
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const result = response.data;
    
    const aiResult = result.find(r => r.label.toLowerCase().includes('artificial') || r.label.toLowerCase().includes('ai'));
    const humanResult = result.find(r => r.label.toLowerCase().includes('human') || r.label.toLowerCase().includes('real'));
    
    const isAIGenerated = aiResult && aiResult.score > (humanResult?.score || 0);
    const confidence = ((isAIGenerated ? aiResult.score : humanResult?.score) || 0.5) * 100;

    return {
      isAIGenerated,
      confidence: parseFloat(confidence.toFixed(2)),
      humanProbability: parseFloat(((humanResult?.score || 0) * 100).toFixed(2)),
      aiProbability: parseFloat(((aiResult?.score || 0) * 100).toFixed(2)),
      modelUsed: 'umm-maybe/AI-image-detector',
      analysis: result,
      detectedArtifacts: [], // Can be enhanced later
    };
  } catch (error) {
    console.error('❌ AI Image Detection Error:', error.response?.data || error.message);
    
    return {
      isAIGenerated:  false,
      confidence: 50,
      humanProbability:  50,
      aiProbability: 50,
      modelUsed: 'fallback-heuristic',
      analysis: { error: 'Detection failed, using fallback' },
      detectedArtifacts: [],
    };
  }
};

// Video AI Detection (analyze frames)
export const detectAIVideo = async (frames) => {
  try {
    console.log('🔍 Detecting AI in video frames...');
    
    const frameResults = [];
    let aiFrameCount = 0;
    let totalConfidence = 0;

    // Analyze each frame (limit to 10 frames to save API calls)
    const framesToAnalyze = frames.slice(0, 10);
    
    for (const framePath of framesToAnalyze) {
      const result = await detectAIImage(framePath);
      frameResults.push(result);
      
      if (result.isAIGenerated) {
        aiFrameCount++;
      }
      totalConfidence += result.confidence;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const avgConfidence = totalConfidence / framesToAnalyze.length;
    const aiPercentage = (aiFrameCount / framesToAnalyze.length) * 100;
    const isAIGenerated = aiPercentage > 50;

    return {
      isAIGenerated,
      confidence: parseFloat(avgConfidence.toFixed(2)),
      humanProbability: parseFloat((100 - aiPercentage).toFixed(2)),
      aiProbability:  parseFloat(aiPercentage.toFixed(2)),
      modelUsed: 'frame-analysis-ai-detector',
      analysis: {
        framesAnalyzed: framesToAnalyze.length,
        aiFrames: aiFrameCount,
        humanFrames: framesToAnalyze.length - aiFrameCount,
        avgScore: parseFloat((avgConfidence / 100).toFixed(3)),
        frameResults:  frameResults,
      },
      suspiciousPatterns: aiPercentage > 60 ?  [
        'Multiple frames show AI generation patterns',
        'Inconsistent visual artifacts detected',
      ] : [],
    };
  } catch (error) {
    console.error('❌ AI Video Detection Error:', error.message);
    
    return {
      isAIGenerated: false,
      confidence: 50,
      humanProbability: 50,
      aiProbability: 50,
      modelUsed: 'fallback',
      analysis: { error: 'Video analysis failed' },
      suspiciousPatterns: [],
    };
  }
};

// Fallback text detection (simple heuristics)
const fallbackTextDetection = (text) => {
  const aiIndicators = [
    /as an ai language model/i,
    /i don't have personal/i,
    /i cannot (provide|access|browse)/i,
    /my knowledge (cutoff|was last updated)/i,
    /i'm (just )?an ai/i,
  ];

  let indicatorCount = 0;
  aiIndicators.forEach(pattern => {
    if (pattern.test(text)) indicatorCount++;
  });

  // Simple scoring
  const avgSentenceLength = text.split('.').reduce((acc, s) => acc + s.trim().split(' ').length, 0) / text.split('.').length;
  const hasVeryUniformSentences = avgSentenceLength > 20 && avgSentenceLength < 25;
  
  const aiScore = (indicatorCount * 30) + (hasVeryUniformSentences ?  20 : 0);
  const confidence = Math.min(aiScore, 70); // Cap at 70% for heuristic

  return {
    isAIGenerated: confidence > 50,
    confidence,
    humanProbability: 100 - confidence,
    aiProbability: confidence,
    modelUsed: 'fallback-heuristic',
    analysis:  { 
      method: 'heuristic', 
      indicatorsFound: indicatorCount,
      note: 'Primary model unavailable, using basic detection',
    },
  };
};

export const getConfidenceLevel = (confidence) => {
  if (confidence >= 90) return 'Very High';
  if (confidence >= 75) return 'High';
  if (confidence >= 60) return 'Medium';
  if (confidence >= 45) return 'Low';
  return 'Very Low';
};

// Helper function to get verdict
export const getVerdict = (isAIGenerated, confidence) => {
  if (confidence >= 75) {
    return isAIGenerated ? 'AI Generated' : 'Human Created';
  } else if (confidence >= 60) {
    return isAIGenerated ? 'Likely AI Generated' : 'Likely Human Created';
  } else {
    return 'Uncertain - Needs Manual Review';
  }
};