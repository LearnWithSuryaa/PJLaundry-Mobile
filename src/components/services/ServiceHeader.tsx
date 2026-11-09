import { useRouter } from "expo-router";
import { ArrowLeft, Building2 } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import BrandLogo from "../common/BrandLogo";
import { COLORS, RADIUS, TOUCH_TARGET } from "../../theme/tokens";

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
          styles.touchTarget,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.backButtonSurface}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </View>
      </Pressable>

      <View style={styles.brandContainer}>
        <BrandLogo size={28} subtitle="Katalog Layanan Resmi" />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Buka daftar cabang outlet dan ulasan pelanggan"
        onPress={() => router.push("/outlets" as any)}
        style={({ pressed }) => [
          styles.touchTarget,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.outletButtonSurface}>
          <Building2 size={18} color={COLORS.brandBlueDark} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.surfacePrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  touchTarget: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSurface: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  outletButtonSurface: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
  },
  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightPlaceholder: {
    width: TOUCH_TARGET.min,
  },
  pressed: {
    opacity: 0.75,
  },
});
