import { Pressable, StyleSheet, View } from "react-native";

import type { OnboardingData } from "../../features/onboarding/onboardingData";
import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";

type PaginationDotsProps = {
  activeIndex: number;
  steps: OnboardingData[];
  onSelectStep?: (index: number) => void;
};

export default function PaginationDots({
  activeIndex,
  steps,
  onSelectStep,
}: PaginationDotsProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`Langkah ${activeIndex + 1} dari ${steps.length}`}
      style={styles.container}
    >
      {steps.map((step, index) => {
        const isActive = index === activeIndex;

        return (
          <Pressable
            key={step.id}
            accessibilityRole="button"
            accessibilityLabel={`Pindah ke langkah ${index + 1}: ${step.title}`}
            onPress={() => onSelectStep?.(index)}
            style={styles.dotTouch}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isActive
                    ? ONBOARDING_COLORS.blue
                    : ONBOARDING_COLORS.lightBlue,
                  width: isActive ? 32 : 8,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  dotTouch: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
