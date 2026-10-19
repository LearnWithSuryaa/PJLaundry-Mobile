import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, RADIUS, TOUCH_TARGET } from "../../theme/tokens";

type OnboardingActionsProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  onContinue: () => void;
  onBack: () => void;
};

export default function OnboardingActions({
  isFirstStep,
  isLastStep,
  onContinue,
  onBack,
}: OnboardingActionsProps) {
  const continueLabel = isLastStep ? "Mulai PJLaundry" : "Lanjut";

  if (isFirstStep) {
    return (
      <View style={styles.singleButtonContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lanjut ke langkah pengenalan berikutnya"
          onPress={onContinue}
          style={({ pressed }) => [
            styles.fullWidthTouch,
            pressed && styles.primaryPressed,
          ]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.continueSurface,
                pressed && styles.continueSurfacePressed,
              ]}
            >
              <Text style={styles.continueText}>{continueLabel}</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.dualButtonContainer}>
      {/* Back button container */}
      <View style={styles.backButtonWrapper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke langkah sebelumnya"
          onPress={onBack}
          style={({ pressed }) => [
            styles.fullSizeTouch,
            pressed && styles.secondaryPressed,
          ]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.backButtonSurface,
                pressed && styles.backButtonSurfacePressed,
              ]}
            >
              <ArrowLeft size={22} color={COLORS.textPrimary} />
            </View>
          )}
        </Pressable>
      </View>

      {/* Primary Continue button */}
      <View style={styles.continueButtonWrapper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isLastStep
              ? "Mulai menggunakan PJLaundry dan lihat katalog layanan"
              : "Lanjut ke langkah pengenalan berikutnya"
          }
          onPress={onContinue}
          style={({ pressed }) => [
            styles.fullSizeTouch,
            pressed && styles.primaryPressed,
          ]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.continueSurface,
                pressed && styles.continueSurfacePressed,
              ]}
            >
              <Text style={styles.continueText}>{continueLabel}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleButtonContainer: {
    width: "100%",
    alignSelf: "stretch",
  },
  dualButtonContainer: {
    width: "100%",
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButtonWrapper: {
    width: 52,
    height: 52,
    flexShrink: 0,
  },
  continueButtonWrapper: {
    flex: 1,
    minHeight: 52,
    alignSelf: "stretch",
  },
  fullWidthTouch: {
    width: "100%",
    minHeight: 52,
    alignSelf: "stretch",
  },
  fullSizeTouch: {
    width: "100%",
    height: "100%",
    minHeight: TOUCH_TARGET.min,
    alignSelf: "stretch",
  },
  backButtonSurface: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButtonSurfacePressed: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  continueSurface: {
    width: "100%",
    height: 52,
    paddingHorizontal: 20,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  continueSurfacePressed: {
    backgroundColor: COLORS.brandBlueDark,
  },
  continueText: {
    color: COLORS.textOnAccent,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  primaryPressed: {
    opacity: 0.95,
  },
  secondaryPressed: {
    opacity: 0.8,
  },
});
