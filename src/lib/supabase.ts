import { createClient } from "@supabase/supabase-js";

// REPLACE THESE with your actual Supabase URL and Anon Key from the Supabase Dashboard
const supabaseUrl = "https://your-project-id.supabase.co";
const supabaseAnonKey = "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
