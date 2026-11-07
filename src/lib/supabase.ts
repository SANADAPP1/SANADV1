import { createClient } from "@supabase/supabase-js";

// Safe public credentials
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://msqwsimmlupusdbfwtxq.supabase.co";
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_bw83VbG--H_sSDINK6l4DA_YPrXXWG3";

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role?: "master" | "admin" | "resident" | string;
  building_id?: string | null;
  apartment_number?: string | null;
  phone?: string;
  created_at: string;
}

export interface Building {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  code?: string;
  total_units?: number;
  balance?: number;
  manager_email?: string;
  manager_name?: string;
  created_at: string;
}

export interface Invite {
  id: string;
  code: string;
  building_id: string;
  role: "admin" | "resident" | string;
  created_at: string;
  used_at?: string | null;
  created_by?: string | null;
}

export interface Transaction {
  id: string;
  building_id: string;
  user_id?: string | null;
  title?: string;
  description?: string;
  amount: number;
  type: "income" | "expense";
  status?: "pending" | "approved" | "rejected";
  category?: string;
  date: string;
  created_at: string;
}

/**
 * Public Supabase client using Anon/Publishable key.
 * Adheres strictly to security best practices: Secret keys are never exposed in browser runtime.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
