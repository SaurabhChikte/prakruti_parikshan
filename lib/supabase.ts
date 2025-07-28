import { createClient } from "@supabase/supabase-js"

// Ensure environment variables are available
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY.")
}

// Create a single Supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)
