import { supabaseAdmin } from '../config/db.js';

// Note: Auth operations (register, login, logout) are handled by frontend directly with Supabase
// Backend only handles token verification and protected operations

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Get user profile from public.users table
    const { data: userProfile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        createdAt: userProfile.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name',
      });
    }

    // Update user profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ name })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: data,
    });
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};