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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Autentikasi gagal. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Masuk ke akun"
            disabled={isSubmitting || Boolean(configError)}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.pressed,
              (isSubmitting || configError) && styles.disabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Text>
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
  submitButton: {
    alignItems: "center",
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.button,
    justifyContent: "center",
    marginTop: SPACING.xl,
    minHeight: 52,
  },
  submitButtonText: {
    color: COLORS.textOnAccent,
    fontSize: 16,
    fontWeight: "700",
  },
  messageError: {
    backgroundColor: COLORS.errorSurface,
    borderRadius: RADIUS.input,
    marginTop: SPACING.base,
    padding: SPACING.base,
  },
  messageText: { color: COLORS.error, fontSize: 13, lineHeight: 19 },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
