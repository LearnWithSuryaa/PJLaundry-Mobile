import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
      // Jika mode praktikum / Supabase auth gagal, berikan opsi masuk mode demo
      setErrorMessage(
        error instanceof Error
          ? `${error.message}. Anda juga bisa menekan tombol "Lanjut Mode Demo" di bawah.`
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke katalog layanan"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </Pressable>

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

          {/* Tombol Masuk Utama */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Masuk ke akun"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButtonTouch,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.submitButtonSurface, isSubmitting && styles.disabled]}>
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Memproses..." : "Masuk ke Akun"}
              </Text>
            </View>
          </Pressable>

          {/* Tombol Lanjut Mode Demo / Tamu */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lanjut tanpa akun (Mode Demo)"
            onPress={handleGuestLogin}
            style={({ pressed }) => [
              styles.guestButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.guestButtonSurface}>
              <Text style={styles.guestButtonText}>Lanjut Mode Demo / Tamu (Lewati) →</Text>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgPrimary },
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
  },
  backButtonText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: "600" },
  heading: { marginBottom: SPACING.xl },
  eyebrow: {
    color: COLORS.brandBlueDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: "700" },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  form: { gap: SPACING.base },
  field: { gap: SPACING.sm },
  label: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "600" },
  input: {
    backgroundColor: COLORS.surfacePrimary,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: SPACING.base,
  },
  submitButtonTouch: {
    width: "100%",
    alignSelf: "stretch",
    marginTop: 24,
  },
  submitButtonSurface: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#2476BC",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    shadowColor: "#2476BC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  messageError: {
    backgroundColor: COLORS.errorSurface,
    borderRadius: RADIUS.input,
    marginTop: SPACING.base,
    padding: SPACING.base,
  },
  messageText: { color: COLORS.error, fontSize: 13, lineHeight: 19 },
  guestButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  guestButtonSurface: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#EAF5FF",
  },
  guestButtonText: {
    color: "#2476BC",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
