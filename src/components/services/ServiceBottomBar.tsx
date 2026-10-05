import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";
import type { LaundryService } from "../../features/services/servicesData";
import { formatRupiah } from "../../features/services/servicesData";

type ServiceBottomBarProps = {
  selectedService: LaundryService;
  quantity: number;
  estimatedTotal: number;
  onOpenOrderModal: () => void;
};

export default function ServiceBottomBar({
  selectedService,
  quantity,
  estimatedTotal,
  onOpenOrderModal,
}: ServiceBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomSummaryBar,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <View style={styles.bottomBarContent}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryCaption}>
            Estimasi Biaya ({quantity} {selectedService.unit})
          </Text>
          <Text style={styles.summaryTotal}>
            {formatRupiah(estimatedTotal)}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Lanjut pemesanan ${selectedService.name}, total ${formatRupiah(estimatedTotal)}`}
          onPress={onOpenOrderModal}
          style={({ pressed }) => [
            styles.orderButtonTouch,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.orderButtonSurface}>
            <Text style={styles.orderButtonText}>Lanjut Pemesanan</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSummaryBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ONBOARDING_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 51, 51, 0.12)",
    paddingTop: 12,
    paddingHorizontal: 20,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  summaryLeft: {
    flex: 1,
  },
  summaryCaption: {
    color: "#666666",
    fontSize: 12,
  },
  summaryTotal: {
    color: ONBOARDING_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  orderButtonTouch: {
    minHeight: 48,
    justifyContent: "center",
  },
  orderButtonSurface: {
    minHeight: 48,
    paddingHorizontal: 22,
    backgroundColor: ONBOARDING_COLORS.blue,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 3,
  },
  orderButtonText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.82,
  },
});
