import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { LaundryService } from "../../features/services/servicesData";
import { formatRupiah } from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, TOUCH_TARGET } from "../../theme/tokens";

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
          {({ pressed }) => (
            <View
              style={[
                styles.orderButtonSurface,
                pressed && styles.orderButtonSurfacePressed,
              ]}
            >
              <Text style={styles.orderButtonText}>Lanjut Pemesanan</Text>
            </View>
          )}
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
    backgroundColor: COLORS.surfacePrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
    paddingTop: 12,
    paddingHorizontal: 20,
    ...SHADOWS.card,
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
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  summaryTotal: {
    color: COLORS.brandBlueDark,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: -0.3,
  },
  orderButtonTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  orderButtonSurface: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: 22,
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.button,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonSurfacePressed: {
    backgroundColor: COLORS.brandBlueDark,
  },
  orderButtonText: {
    color: COLORS.textOnAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});
