import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required in .env file');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in .env file');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is required in .env file');
}

// Supabase client for admin operations (backend)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Supabase client for auth operations  
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (ok during setup)
      throw error;
    }
    
    console.log('✅ Supabase Connected');
    return true;
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
    return false;
  }
};

export default testConnection;