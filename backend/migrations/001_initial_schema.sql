-- VeriFact PostgreSQL Schema Migration
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth handles authentication, this is for additional user data)
-- Note: Supabase auth.users table already exists, we extend it with a public.users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Detections table
CREATE TABLE IF NOT EXISTS public.detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
  content TEXT,
  file_path TEXT,
  
  -- AI Detection results
  ai_detection JSONB NOT NULL DEFAULT '{
    "isAIGenerated": false,
    "confidence": 0,
    "verdict": null,
    "confidenceLevel": null,
    "details": {}
  }'::jsonb,
  
  -- Fact-checking results
  fact_check JSONB DEFAULT '{
    "isFake": null,
    "confidence": 0,
    "verdict": null,
    "claimsDetected": [],
    "verifiedFacts": [],
    "sources": []
  }'::jsonb,
  
  -- Extracted data
  extracted_data JSONB DEFAULT '{
    "text": null,
    "imageCaption": null,
    "audioTranscript": null
  }'::jsonb,
  
  -- Final verdict
  final_verdict JSONB DEFAULT '{
    "category": null,
    "riskLevel": null,
    "explanation": null
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for detections table
CREATE POLICY "Users can view their own detections"
  ON public.detections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own detections"
  ON public.detections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detections"
  ON public.detections
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detections"
  ON public.detections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON public.detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_content_type ON public.detections(content_type);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON public.detections(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detections_updated_at
  BEFORE UPDATE ON public.detections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
