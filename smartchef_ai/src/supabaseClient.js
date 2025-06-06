import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://fmhdnyomhusszdfxurxz.supabase.co
", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaGRueW9taHVzc3pkZnh1cnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTA3ODQsImV4cCI6MjA2NDc2Njc4NH0.nkQ2ECeVrhEwaiQfhgOo38kBPR6NsbHK6e0BHG6zzaU");
export default supabase;
