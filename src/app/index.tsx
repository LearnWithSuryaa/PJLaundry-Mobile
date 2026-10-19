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

import BrandLogo from "../components/common/BrandLogo";
import OnboardingActions from "../components/onboarding/OnboardingActions";
import OnboardingStep from "../components/onboarding/OnboardingStep";
import PaginationDots from "../components/onboarding/PaginationDots";
import { ONBOARDING_STEPS } from "../features/onboarding/onboardingData";
import { COLORS, RADIUS, TOUCH_TARGET } from "../theme/tokens";

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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgPrimary} />

      <View style={styles.container}>
        {/* Header with Official Logo & Accessible Skip Button */}
        <View style={styles.header}>
          <BrandLogo size={34} subtitle="Solusi Laundry Modern" />

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
    backgroundColor: COLORS.bgPrimary,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  skipTouchTarget: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  skipButtonSurface: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfacePrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    elevation: 1,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  skipPlaceholder: {
    width: TOUCH_TARGET.min,
  },
  scrollBody: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: "stretch",
  },
  pressed: {
    opacity: 0.75,
  },
});
