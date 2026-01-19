import Detection from '../models/Detection.js';
import { detectAIText, detectAIImage, detectAIVideo, getConfidenceLevel, getVerdict } from '../utils/aiDetector.js';
import { extractClaims } from '../utils/claimExtractor.js';
import { performFactCheck, generateFactCheckMessage } from '../utils/factChecker.js';
import fs from 'fs';
import path from 'path';

// Helper to generate final verdict
const generateFinalVerdict = (aiDetection, factCheck) => {
  const { isAIGenerated, confidence:  aiConfidence } = aiDetection;
  const { overallVerdict:  factVerdict, confidence: factConfidence } = factCheck;

  let category, riskLevel, explanation;

  // Determine category
  if (! isAIGenerated && factVerdict === 'verified') {
    category = 'trusted';
    riskLevel = 'low';
    explanation = 'This content appears to be human-created and the information has been verified across credible sources.';
  } else if (! isAIGenerated && (factVerdict === 'unverifiable' || factVerdict === 'uncertain')) {
    category = 'real-fake-news';
    riskLevel = 'high';
    explanation = 'This content appears to be human-created but contains unverifiable or false information. Potential misinformation.';
  } else if (isAIGenerated && factVerdict === 'verified') {
    category = 'ai-accurate';
    riskLevel = 'medium';
    explanation = 'This content appears to be AI-generated but the information is accurate and verified.';
  } else if (isAIGenerated && (factVerdict === 'unverifiable' || factVerdict === 'uncertain')) {
    category = 'ai-misinformation';
    riskLevel = 'critical';
    explanation = 'This content appears to be AI-generated and contains unverifiable or false information. High risk of misinformation.';
  } else {
    category = 'uncertain';
    riskLevel = 'medium';
    explanation = 'Detection results are inconclusive. Manual verification strongly recommended.';
  }

  return { category, riskLevel, explanation };
};

// @desc    Detect text content
// @route   POST /api/detect/text
// @access  Private
export const detectText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text with at least 10 characters',
      });
    }

    console.log('🔍 Starting text detection...');

    // 1.AI Detection
    const aiResult = await detectAIText(text);

    // 2.Extract claims
    const { claims, extractedData } = extractClaims(text);

    // 3.Fact-check
    const factCheckResult = await performFactCheck(claims, text);

    // 4.Generate final verdict
    const finalVerdict = generateFinalVerdict(
      { isAIGenerated: aiResult.isAIGenerated, confidence: aiResult.confidence },
      factCheckResult
    );

    // 5.Save to database
    const detection = await Detection.create({
      user: req.user._id,
      contentType: 'text',
      content: text,
      aiDetection: {
        isAIGenerated: aiResult.isAIGenerated,
        confidence: aiResult.confidence,
        verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
        confidenceLevel: getConfidenceLevel(aiResult.confidence),
        details: aiResult,
      },
      factCheck:  {
        isFake: factCheckResult.overallVerdict === 'unverifiable' || factCheckResult.overallVerdict === 'uncertain',
        confidence: factCheckResult.confidence,
        verdict: factCheckResult.overallVerdict,
        claimsDetected: claims,
        verifiedFacts: factCheckResult.verified,
        sources: factCheckResult.sources,
      },
      extractedData:  {
        text: text,
      },
      finalVerdict,
    });

    // 6.Generate user-friendly messages
    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection._id,
        contentType: 'text',
        aiDetection: {
          verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          message: aiMessage,
        },
        factCheck: {
          verdict: factCheckResult.overallVerdict,
          confidence: factCheckResult.confidence,
          claimsDetected: claims,
          verifiedCount: factCheckResult.verified.length,
          unverifiedCount: factCheckResult.unverified.length,
          sources: factCheckResult.sources,
          message: factMessage,
        },
        finalVerdict,
        timestamp: detection.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Text Detection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during text detection',
      error: error.message,
    });
  }
};

// @desc    Detect image content
// @route   POST /api/detect/image
// @access  Private
export const detectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    console.log('🔍 Starting image detection...');

    const imagePath = req.file.path;

    // 1.AI Image Detection
    const aiResult = await detectAIImage(imagePath);

    // 2.Get extracted text (from OCR middleware)
    const extractedText = req.extractedText || '';

    // 3.Get image caption (from captioning middleware)
    const imageCaption = req.imageCaption || '';

    // 4.Extract claims from text + caption
    const combinedText = `${extractedText} ${imageCaption}`;
    const { claims } = extractClaims(combinedText);

    // 5.Fact-check
    const factCheckResult = await performFactCheck(claims, combinedText);

    // 6.Generate final verdict
    const finalVerdict = generateFinalVerdict(
      { isAIGenerated: aiResult.isAIGenerated, confidence: aiResult.confidence },
      factCheckResult
    );

    // 7.Save to database
    const detection = await Detection.create({
      user: req.user._id,
      contentType: 'image',
      filePath: imagePath,
      aiDetection: {
        isAIGenerated: aiResult.isAIGenerated,
        confidence: aiResult.confidence,
        verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
        confidenceLevel: getConfidenceLevel(aiResult.confidence),
        details: aiResult,
      },
      factCheck: {
        isFake: factCheckResult.overallVerdict === 'unverifiable' || factCheckResult.overallVerdict === 'uncertain',
        confidence: factCheckResult.confidence,
        verdict: factCheckResult.overallVerdict,
        claimsDetected: claims,
        verifiedFacts:  factCheckResult.verified,
        sources: factCheckResult.sources,
      },
      extractedData: {
        text: extractedText,
        imageCaption:  imageCaption,
      },
      finalVerdict,
    });

    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection._id,
        contentType: 'image',
        filePath: imagePath,
        aiDetection: {
          verdict:  getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          message: aiMessage,
        },
        extractedInfo: {
          text: extractedText,
          caption: imageCaption,
        },
        factCheck: {
          verdict: factCheckResult.overallVerdict,
          confidence: factCheckResult.confidence,
          claimsDetected: claims,
          verifiedCount: factCheckResult.verified.length,
          sources: factCheckResult.sources,
          message: factMessage,
        },
        finalVerdict,
        timestamp: detection.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Image Detection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during image detection',
      error: error.message,
    });
  }
};

// @desc    Detect video content
// @route   POST /api/detect/video
// @access  Private
export const detectVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file',
      });
    }

    console.log('🔍 Starting video detection...');

    const videoPath = req.file.path;
    const frames = req.videoFrames || [];

    // 1.AI Video Detection (frame analysis)
    const aiResult = await detectAIVideo(frames);

    // 2.Get extracted audio transcript (if available)
    const audioTranscript = ''; // TODO: Implement speech-to-text

    // 3.Extract claims
    const { claims } = extractClaims(audioTranscript);

    // 4.Fact-check
    const factCheckResult = await performFactCheck(claims, audioTranscript);

    // 5.Generate final verdict
    const finalVerdict = generateFinalVerdict(
      { isAIGenerated: aiResult.isAIGenerated, confidence: aiResult.confidence },
      factCheckResult
    );

    // 6.Save to database
    const detection = await Detection.create({
      user: req.user._id,
      contentType: 'video',
      filePath: videoPath,
      aiDetection: {
        isAIGenerated: aiResult.isAIGenerated,
        confidence: aiResult.confidence,
        verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
        confidenceLevel: getConfidenceLevel(aiResult.confidence),
        details: aiResult,
      },
      factCheck: {
        isFake: factCheckResult.overallVerdict === 'unverifiable',
        confidence: factCheckResult.confidence,
        verdict: factCheckResult.overallVerdict,
        claimsDetected: claims,
        verifiedFacts:  factCheckResult.verified,
        sources: factCheckResult.sources,
      },
      extractedData: {
        audioTranscript: audioTranscript,
      },
      finalVerdict,
    });

    // 7.Clean up extracted frames
    if (req.framesDir && fs.existsSync(req.framesDir)) {
      fs.rmSync(req.framesDir, { recursive: true, force: true });
    }

    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection._id,
        contentType: 'video',
        filePath: videoPath,
        aiDetection:  {
          verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          framesAnalyzed: aiResult.analysis?.framesAnalyzed || 0,
          message: aiMessage,
        },
        factCheck: {
          verdict: factCheckResult.overallVerdict,
          confidence: factCheckResult.confidence,
          claimsDetected: claims,
          sources: factCheckResult.sources,
          message: factMessage,
        },
        finalVerdict,
        timestamp: detection.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Video Detection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during video detection',
      error: error.message,
    });
  }
};

// @desc    Get user's detection history
// @route   GET /api/detect/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const detections = await Detection.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Detection.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        detections,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDetections: total,
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error('❌ Get History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching detection history',
    });
  }
};

// @desc    Get single detection by ID
// @route   GET /api/detect/:id
// @access  Private
export const getDetection = async (req, res) => {
  try {
    const detection = await Detection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!detection) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found',
      });
    }

    res.status(200).json({
      success: true,
      data: detection,
    });
  } catch (error) {
    console.error('❌ Get Detection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching detection',
    });
  }
};

// @desc    Delete detection
// @route   DELETE /api/detect/: id
// @access  Private
export const deleteDetection = async (req, res) => {
  try {
    const detection = await Detection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!detection) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found',
      });
    }

    // Delete associated file if exists
    if (detection.filePath && fs.existsSync(detection.filePath)) {
      fs.unlinkSync(detection.filePath);
    }

    await detection.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Detection deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Detection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting detection',
    });
  }
};