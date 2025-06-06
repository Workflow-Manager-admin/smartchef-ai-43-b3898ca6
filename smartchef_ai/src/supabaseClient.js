import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
// Get Supabase keys from environment variables, error if missing
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  // Optionally, log to console for devs
  // eslint-disable-next-line no-console
  console.error("Supabase URL or Anon Key missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;
