import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Bersihkan URL dari spasi atau format markdown jika ada
const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const cleanUrl = rawUrl?.split(" ")[0]?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

const serverStorage = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
};

const authStorage =
  typeof window === "undefined"
    ? serverStorage
    : Platform.OS === "web"
      ? window.localStorage
      : AsyncStorage;

function initSupabase() {
  if (!cleanUrl || !supabaseAnonKey) {
    return null;
  }
  try {
    // Validasi URL
    new URL(cleanUrl);
    return createClient(cleanUrl, supabaseAnonKey, {
      auth: {
        storage: authStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.warn("[Supabase Init Warning]: URL tidak valid, mode offline/mock aktif:", error);
    return null;
  }
}

export const supabase = initSupabase();

export const supabaseConfigError = !supabase
  ? "Konfigurasi Supabase belum lengkap atau URL tidak valid. Fitur auth dijalankan dalam mode terbatas."
  : null;
