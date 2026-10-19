import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../theme/tokens";

type BrandLogoProps = {
  size?: number;
  showText?: boolean;
  subtitle?: string;
  horizontal?: boolean;
};

export default function BrandLogo({
  size = 36,
  showText = true,
  subtitle = "Solusi Laundry Modern",
  horizontal = true,
}: BrandLogoProps) {
  return (
    <View
      style={[
        styles.container,
        horizontal ? styles.rowLayout : styles.columnLayout,
      ]}
    >
      <Image
        source={require("../../../assets/images/pjlaundry-logo.png")}
        style={{ width: size, height: size * (917 / 1024) }}
        contentFit="contain"
        transition={200}
        accessibilityLabel="Logo PJLaundry"
      />

      {showText && (
        <View style={horizontal ? styles.textGroupHorizontal : styles.textGroupCentered}>
          <Text style={styles.brandTitle}>
            PJ<Text style={styles.brandTitleAccent}>Laundry</Text>
          </Text>
          {subtitle ? <Text style={styles.brandSubtitle}>{subtitle}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  rowLayout: {
    flexDirection: "row",
    gap: 10,
  },
  columnLayout: {
    flexDirection: "column",
    gap: 6,
  },
  textGroupHorizontal: {
    justifyContent: "center",
  },
  textGroupCentered: {
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  brandTitleAccent: {
    color: COLORS.brandBlue,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
