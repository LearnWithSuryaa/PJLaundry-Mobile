import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";

export default function ServiceHeader() {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kembali ke halaman sebelumnya"
        onPress={handleGoBack}
        style={({ pressed }) => [
          styles.touchTarget44,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.backButtonSurface}>
          <ArrowLeft size={22} color={ONBOARDING_COLORS.text} />
        </View>
      </Pressable>

      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>PJLaundry</Text>
        <Text style={styles.brandSubtitle}>Katalog Layanan Resmi</Text>
      </View>

      <View style={styles.headerRightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(51, 51, 51, 0.08)",
  },
  touchTarget44: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSurface: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ONBOARDING_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 2,
  },
  brandContainer: {
    alignItems: "center",
  },
  brandTitle: {
    color: ONBOARDING_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  brandSubtitle: {
    color: "#555555",
    fontSize: 12,
    marginTop: 2,
  },
  headerRightPlaceholder: {
    width: 44,
  },
  pressed: {
    opacity: 0.82,
  },
});
