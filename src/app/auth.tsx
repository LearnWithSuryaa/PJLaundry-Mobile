import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../features/auth/AuthProvider";
import { COLORS, RADIUS, SPACING, TOUCH_TARGET } from "../theme/tokens";

export default function AuthScreen() {
  const router = useRouter();
  const { configError, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim();
    setErrorMessage(null);

    if (!normalizedEmail || password.length < 6) {
      setErrorMessage("Masukkan email dan password minimal 6 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(normalizedEmail, password);
      router.replace("/services");
    } catch (error: unknown) {
      console.warn("[Auth Warning]:", error);
      setErrorMessage(
        error instanceof Error
          ? `${error.message}. Atau tekan tombol "Lanjut Mode Demo" di bawah.`
          : "Autentikasi gagal. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    router.replace("/services");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Kembali ke katalog layanan"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>

          <View style={styles.heading}>
            <Text style={styles.eyebrow}>PJLaundry</Text>
            <Text style={styles.title}>Masuk ke akunmu</Text>
            <Text style={styles.subtitle}>
              Simpan pesanan dan lanjutkan transaksi laundry dengan aman.
            </Text>
          </View>

          {configError ? (
            <View style={styles.messageError}>
              <Text style={styles.messageText}>{configError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={COLORS.textDisabled}
                style={styles.input}
                value={email}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPassword}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={COLORS.textDisabled}
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.messageError}>
              <Text style={styles.messageText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Tombol Masuk Utama - Menggunakan TouchableOpacity Solid dengan background tegas */}
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Masuk ke akun"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[styles.mainButton, isSubmitting && styles.disabled]}
          >
            <Text style={styles.mainButtonText}>
              {isSubmitting ? "Memproses..." : "Masuk ke Akun"}
            </Text>
          </TouchableOpacity>

          {/* Tombol Lanjut Mode Demo / Tamu */}
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Lanjut tanpa akun (Mode Demo)"
            onPress={handleGuestLogin}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>Lanjut Mode Demo / Tamu (Lewati) →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.xl,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  backButtonText: { color: "#0284C7", fontSize: 15, fontWeight: "700" },
  heading: { marginBottom: SPACING.xl },
  eyebrow: {
    color: "#0284C7",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  title: { color: "#0F172A", fontSize: 28, fontWeight: "800" },
  subtitle: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  form: { gap: SPACING.base },
  field: { gap: SPACING.sm },
  label: { color: "#0F172A", fontSize: 14, fontWeight: "600" },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 12,
    borderWidth: 1.5,
    color: "#0F172A",
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: SPACING.base,
  },
  mainButton: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#0284C7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#0369A1",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  messageError: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: SPACING.base,
    padding: SPACING.base,
  },
  messageText: { color: "#DC2626", fontSize: 13, lineHeight: 19 },
  guestButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E0F2FE",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  guestButtonText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "700",
  },
  disabled: { opacity: 0.6 },
});
