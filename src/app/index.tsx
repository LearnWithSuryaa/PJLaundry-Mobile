import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import OnboardingActions from "../components/onboarding/OnboardingActions";
import OnboardingStep from "../components/onboarding/OnboardingStep";
import PaginationDots from "../components/onboarding/PaginationDots";
import {
  ONBOARDING_COLORS,
  ONBOARDING_STEPS,
} from "../features/onboarding/onboardingData";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 360 || height < 700;

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === ONBOARDING_STEPS.length - 1;
  const activeStep = ONBOARDING_STEPS[activeStepIndex];

  const handleContinue = () => {
    if (isLastStep) {
      router.replace("/services");
      return;
    }
    setActiveStepIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (isFirstStep) return;
    setActiveStepIndex((prev) => prev - 1);
  };

  const handleSkip = () => {
    router.replace("/services");
  };

  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ONBOARDING_COLORS.background}
      />

      <View style={styles.container}>
        {/* Header with Brand & Skip Button */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <Text style={styles.brandTitle}>PJLaundry</Text>
            <Text style={styles.brandSubtitle}>Solusi Laundry Modern</Text>
          </View>

          {!isLastStep ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lewati pengenalan dan langsung ke katalog layanan"
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipTouchTarget,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.skipButtonSurface}>
                <Text style={styles.skipText}>Lewati</Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        {/* Scrollable Center Content */}
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <OnboardingStep step={activeStep} isCompact={isCompact} />
        </ScrollView>

        {/* Bottom Navigation Footer with Safe Spacing */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom + 12, 28) },
          ]}
        >
          <PaginationDots
            activeIndex={activeStepIndex}
            steps={ONBOARDING_STEPS}
            onSelectStep={handleSelectStep}
          />
          <OnboardingActions
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.background,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 6,
  },
  brandGroup: {
    justifyContent: "center",
  },
  brandTitle: {
    color: ONBOARDING_COLORS.text,
    fontSize: 19,
    fontWeight: "700",
  },
  brandSubtitle: {
    color: "#666666",
    fontSize: 12,
    marginTop: 2,
  },
  skipTouchTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  skipButtonSurface: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: ONBOARDING_COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.12)",
    elevation: 1,
  },
  skipText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  skipPlaceholder: {
    width: 60,
  },
  scrollBody: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "stretch",
  },
  pressed: {
    opacity: 0.82,
  },
});
