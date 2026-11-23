import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Bersihkan URL dari spasi atau format markdown jika ada
const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const cleanUrl = rawUrl?.split(" ")[0]?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

// SecureStore Adapter untuk Secure Token Storage (iOS Keychain & Android KeyStore)
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.warn("[SecureStore Error]: Gagal mengambil token:", err);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.warn("[SecureStore Error]: Gagal menyimpan token:", err);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.warn("[SecureStore Error]: Gagal menghapus token:", err);
    }
  },
};

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
      : ExpoSecureStoreAdapter;

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
