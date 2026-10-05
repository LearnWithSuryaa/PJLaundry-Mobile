import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";

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
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.continueSurface}>
            <Text style={styles.continueText}>{continueLabel}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.dualButtonContainer}>
      {/* Back button container with explicit dimensions */}
      <View style={styles.backButtonWrapper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke langkah sebelumnya"
          onPress={onBack}
          style={({ pressed }) => [
            styles.fullSizeTouch,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.backButtonSurface}>
            <ArrowLeft size={22} color={ONBOARDING_COLORS.text} />
          </View>
        </Pressable>
      </View>

      {/* Continue button wrapped in standard flex View to avoid Android NativeWind Pressable flex-shrink */}
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
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.continueSurface}>
            <Text style={styles.continueText}>{continueLabel}</Text>
          </View>
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
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  continueButtonWrapper: {
    flex: 1,
    minHeight: 56,
    alignSelf: "stretch",
  },
  fullWidthTouch: {
    width: "100%",
    minHeight: 56,
    alignSelf: "stretch",
  },
  fullSizeTouch: {
    width: "100%",
    height: "100%",
    minHeight: 56,
    alignSelf: "stretch",
  },
  backButtonSurface: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: ONBOARDING_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.12)",
    elevation: 2,
  },
  continueSurface: {
    width: "100%",
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: ONBOARDING_COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 3,
  },
  continueText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.82,
  },
});
