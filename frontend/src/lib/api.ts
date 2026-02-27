import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get access token from Supabase session
 */
const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  return session.access_token;
};

/**
 * Get Authorization header with Supabase JWT token
 */
const getAuthHeader = async () => {
  const token = await getAccessToken();
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * API call wrapper that includes authentication
 */
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// ============================================
// Auth API (works with backend)
// ============================================

/**
 * Get current user profile from backend
 */
export const getUserProfile = async () => {
  return apiCall('/api/auth/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (name: string) => {
  return apiCall('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
};

// ============================================
// Detection API
// ============================================

/**
 * Detect AI-generated text
 */
export const detectText = async (text: string) => {
  return apiCall('/api/detect/text', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

/**
 * Detect AI-generated image
 */
export const detectImage = async (file: File) => {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/detect/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Content-Type is automatically set by browser for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Image detection failed');
  }

  return response.json();
};

/**
 * Detect AI-generated video
 */
export const detectVideo = async (file: File) => {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch(`${API_BASE_URL}/api/detect/video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Content-Type is automatically set by browser for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Video detection failed');
  }

  return response.json();
};

/**
 * Get detection history
 */
export const getDetectionHistory = async (page = 1, limit = 10) => {
  return apiCall(`/api/detect/history?page=${page}&limit=${limit}`);
};

/**
 * Get single detection by ID
 */
export const getDetection = async (id: string) => {
  return apiCall(`/api/detect/${id}`);
};

/**
 * Delete a detection
 */
export const deleteDetection = async (id: string) => {
  return apiCall(`/api/detect/${id}`, {
    method: 'DELETE',
  });
};
