import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xykvzzitgmnipsxbhcf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3Z6eml0Z21uaXBzY3hiaGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzIxNDgsImV4cCI6MjA5MDAwODE0OH0.BKCIhAEFr1stb2v5bOthkzhJvWQBrknqqHfLiz4sRpI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
