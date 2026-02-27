import { supabaseAdmin } from '../config/db.js';
import { detectAIText, detectAIImage, detectAIVideo, getConfidenceLevel, getVerdict } from '../utils/aiDetector.js';
import { performFactCheck, generateFactCheckMessage } from '../utils/factChecker.js';
import { extractClaims } from '../utils/clainExtractor.js';
import fs from 'fs';
import path from 'path';

const generateFinalVerdict = (aiDetection, factCheck) => {
  const { isAIGenerated, confidence:  aiConfidence } = aiDetection;
  const { overallVerdict:  factVerdict, confidence: factConfidence } = factCheck;

  let category, riskLevel, explanation;

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

    const aiResult = await detectAIText(text);

    // 2.Extract claims
    const { claims, extractedData } = extractClaims(text);

    // 3.Fact-check
    const factCheckResult = await performFactCheck(claims, text);

    const finalVerdict = generateFinalVerdict(
      { isAIGenerated: aiResult.isAIGenerated, confidence: aiResult.confidence },
      factCheckResult
    );

    // Save to Supabase database
    const { data: detection, error: dbError } = await supabaseAdmin
      .from('detections')
      .insert({
        user_id: req.user.id,
        content_type: 'text',
        content: text,
        ai_detection: {
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          details: aiResult,
        },
        fact_check: {
          isFake: factCheckResult.overallVerdict === 'unverifiable' || factCheckResult.overallVerdict === 'uncertain',
          confidence: factCheckResult.confidence,
          verdict: factCheckResult.overallVerdict,
          claimsDetected: claims,
          verifiedFacts: factCheckResult.verified,
          sources: factCheckResult.sources,
        },
        extracted_data: {
          text: text,
        },
        final_verdict: finalVerdict,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 6.Generate user-friendly messages
    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection.id,
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
        timestamp: detection.created_at,
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

    const factCheckResult = await performFactCheck(claims, combinedText);

    // 6.Generate final verdict
    const finalVerdict = generateFinalVerdict(
      { isAIGenerated: aiResult.isAIGenerated, confidence: aiResult.confidence },
      factCheckResult
    );

    // 7.Save to Supabase database
    const { data: detection, error: dbError } = await supabaseAdmin
      .from('detections')
      .insert({
        user_id: req.user.id,
        content_type: 'image',
        file_path: imagePath,
        ai_detection: {
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          details: aiResult,
        },
        fact_check: {
          isFake: factCheckResult.overallVerdict === 'unverifiable' || factCheckResult.overallVerdict === 'uncertain',
          confidence: factCheckResult.confidence,
          verdict: factCheckResult.overallVerdict,
          claimsDetected: claims,
          verifiedFacts: factCheckResult.verified,
          sources: factCheckResult.sources,
        },
        extracted_data: {
          text: extractedText,
          imageCaption: imageCaption,
        },
        final_verdict: finalVerdict,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection.id,
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
        timestamp: detection.created_at,
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

    // 6.Save to Supabase database
    const { data: detection, error: dbError } = await supabaseAdmin
      .from('detections')
      .insert({
        user_id: req.user.id,
        content_type: 'video',
        file_path: videoPath,
        ai_detection: {
          isAIGenerated: aiResult.isAIGenerated,
          confidence: aiResult.confidence,
          verdict: getVerdict(aiResult.isAIGenerated, aiResult.confidence),
          confidenceLevel: getConfidenceLevel(aiResult.confidence),
          details: aiResult,
        },
        fact_check: {
          isFake: factCheckResult.overallVerdict === 'unverifiable',
          confidence: factCheckResult.confidence,
          verdict: factCheckResult.overallVerdict,
          claimsDetected: claims,
          verifiedFacts: factCheckResult.verified,
          sources: factCheckResult.sources,
        },
        extracted_data: {
          audioTranscript: audioTranscript,
        },
        final_verdict: finalVerdict,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 7.Clean up extracted frames
    if (req.framesDir && fs.existsSync(req.framesDir)) {
      fs.rmSync(req.framesDir, { recursive: true, force: true });
    }

    const aiMessage = `${getVerdict(aiResult.isAIGenerated, aiResult.confidence)} (${aiResult.confidence}% confidence)`;
    const factMessage = generateFactCheckMessage(factCheckResult, claims);

    res.status(200).json({
      success: true,
      data: {
        detectionId: detection.id,
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
        timestamp: detection.created_at,
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
    const offset = (page - 1) * limit;

    // Get detections with pagination
    const { data: detections, error } = await supabaseAdmin
      .from('detections')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('detections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (countError) {
      throw countError;
    }

    res.status(200).json({
      success: true,
      data: {
        detections,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalDetections: count,
          hasMore: page * limit < count,
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
    const { data: detection, error } = await supabaseAdmin
      .from('detections')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !detection) {
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
    // First get the detection to check file path
    const { data: detection, error: fetchError } = await supabaseAdmin
      .from('detections')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !detection) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found',
      });
    }

    // Delete associated file if exists
    if (detection.file_path && fs.existsSync(detection.file_path)) {
      fs.unlinkSync(detection.file_path);
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('detections')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (deleteError) {
      throw deleteError;
    }

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