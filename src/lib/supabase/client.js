import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debugging logs to verify environment variables
console.log('Initializing Supabase client...');
if (supabaseUrl) {
  console.log('VITE_SUPABASE_URL is defined:', supabaseUrl.substring(0, 15) + '...');
} else {
  console.error('CRITICAL: VITE_SUPABASE_URL is undefined');
}

if (supabaseAnonKey) {
  console.log('VITE_SUPABASE_ANON_KEY is defined');
} else {
  console.error('CRITICAL: VITE_SUPABASE_ANON_KEY is undefined');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase client initialization failed: Missing environment variables.');
}

// Create the client with the provided variables
// We fallback to empty strings to avoid immediate crash, but functionality will be broken if vars are missing
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export default supabase;