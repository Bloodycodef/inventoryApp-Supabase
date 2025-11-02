// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Ambil env dari .env.local (Expo sudah support)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
