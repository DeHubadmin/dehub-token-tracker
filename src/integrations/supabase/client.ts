// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgmvohihwaffavfstmfr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnbXZvaGlod2FmZmF2ZnN0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjI1MTYsImV4cCI6MjA1ODI5ODUxNn0.BUHl1j_lxC4nYCYFMk79Pf-4fzorAlrANHuUtbf1fJ4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);