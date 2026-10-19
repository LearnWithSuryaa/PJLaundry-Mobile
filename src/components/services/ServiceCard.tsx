import { Check, Clock, Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LaundryService } from "../../features/services/servicesData";
import { formatRupiah } from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, TOUCH_TARGET } from "../../theme/tokens";

type ServiceCardProps = {
  service: LaundryService;
  isSelected: boolean;
  quantity: number;
  isNarrow: boolean;
  onSelect: (service: LaundryService) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
};

export default function ServiceCard({
  service,
  isSelected,
  quantity,
  isNarrow,
  onSelect,
  onDecreaseQuantity,
  onIncreaseQuantity,
}: ServiceCardProps) {
  const ServiceIcon = service.icon;

  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.cardSurface,
          isSelected ? styles.cardSurfaceSelected : styles.cardSurfaceUnselected,
        ]}
      >
        {/* Main Card Pressable */}
        <Pressable
          accessibilityRole="radio"
          accessibilityLabel={`Paket layanan ${service.name}, harga ${formatRupiah(service.price)} per ${service.unit}`}
          accessibilityState={{ selected: isSelected }}
          onPress={() => onSelect(service)}
          style={({ pressed }) => [
            styles.cardMainPressable,
            pressed && styles.pressed,
          ]}
        >
          {/* Card Body: 2 Columns (Icon Left, Main Content Right) */}
          <View style={styles.cardBodyRow}>
            {/* Left Column: Icon Tile (40x40) */}
            <View
              style={[
                styles.serviceIconTile,
                service.isExpress
                  ? styles.iconTileExpress
                  : isSelected
                  ? styles.iconTileSelected
                  : styles.iconTileDefault,
              ]}
            >
              <ServiceIcon
                size={20}
                color={
                  service.isExpress
                    ? COLORS.brandOrange
                    : isSelected
                    ? COLORS.brandBlueDark
                    : COLORS.brandBlue
                }
                strokeWidth={2.2}
              />
            </View>

            {/* Right Column: Full-width Content */}
            <View style={styles.mainContent}>
              {/* Service Name & Express Badge (Right padded for absolute radio) */}
              <View style={styles.nameRow}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.isExpress && (
                  <View style={styles.expressPill}>
                    <Text style={styles.expressPillText}>Kilat 24J</Text>
                  </View>
                )}
              </View>

              {/* Price & Turnaround Duration Row */}
              <View style={styles.priceMetaRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceNumber}>
                    {formatRupiah(service.price)}
                  </Text>
                  <Text style={styles.priceUnit}>/{service.unit}</Text>
                </View>

                <View style={styles.metaDividerDot} />

                <View style={styles.durationBadge}>
                  <Clock size={11} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={styles.durationText}>{service.duration}</Text>
                </View>
              </View>

              {/* Compact Service Tagline */}
              <Text style={styles.serviceTagline}>{service.tagline}</Text>

              {/* Compact Features List */}
              <View style={styles.featuresList}>
                {service.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Check
                      size={12}
                      color={COLORS.success}
                      strokeWidth={2.5}
                      style={styles.featureCheckIcon}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Absolute Radio Selection Indicator (Corner Overlay) */}
          <View
            style={[
              styles.radioIndicator,
              isSelected
                ? styles.radioIndicatorSelected
                : styles.radioIndicatorUnselected,
            ]}
          >
            {isSelected ? (
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            ) : null}
          </View>
        </Pressable>

        {/* Balanced Selected Footer */}
        {isSelected && (
          <View style={styles.selectedFooter}>
            <View style={styles.selectedPriceInfo}>
              <Text style={styles.footerLabel}>
                Subtotal · {quantity} {service.unit}
              </Text>
              <Text style={styles.subtotalHighlight}>
                {formatRupiah(service.price * quantity)}
              </Text>
              {quantity >= service.maxOrder ? (
                <Text style={styles.maxOrderHint}>
                  Maksimal {service.maxOrder} {service.unit}
                </Text>
              ) : quantity === service.minOrder && service.minOrder > 1 ? (
                <Text style={styles.minOrderHint}>
                  Min. {service.minOrder} {service.unit}
                </Text>
              ) : null}
            </View>

            <View style={styles.stepperContainer}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Kurangi jumlah ${service.unit}`}
                onPress={onDecreaseQuantity}
                disabled={quantity <= service.minOrder}
                style={({ pressed }) => [
                  styles.stepperTouchTarget,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.stepperButtonSurface,
                    quantity <= service.minOrder && styles.stepperButtonDisabled,
                  ]}
                >
                  <Minus
                    size={15}
                    color={
                      quantity <= service.minOrder
                        ? COLORS.textDisabled
                        : COLORS.textPrimary
                    }
                    strokeWidth={2.2}
                  />
                </View>
              </Pressable>

              <View style={styles.stepperDisplay}>
                <Text style={styles.stepperNumber}>{quantity}</Text>
                <Text style={styles.stepperUnit}>{service.unit}</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Tambah jumlah ${service.unit}`}
                onPress={onIncreaseQuantity}
                disabled={quantity >= service.maxOrder}
                style={({ pressed }) => [
                  styles.stepperTouchTarget,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.stepperButtonSurface,
                    quantity >= service.maxOrder && styles.stepperButtonDisabled,
                  ]}
                >
                  <Plus
                    size={15}
                    color={
                      quantity >= service.maxOrder
                        ? COLORS.textDisabled
                        : COLORS.brandBlueDark
                    }
                    strokeWidth={2.2}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
  },
  cardSurface: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    overflow: "hidden",
  },
  cardSurfaceUnselected: {
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  cardSurfaceSelected: {
    borderWidth: 2,
    borderColor: COLORS.brandBlue,
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardMainPressable: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    width: "100%",
    position: "relative",
  },
  cardBodyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  serviceIconTile: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.input,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  iconTileDefault: {
    backgroundColor: COLORS.brandBlueSoft,
  },
  iconTileSelected: {
    backgroundColor: COLORS.brandBlueSoft,
  },
  iconTileExpress: {
    backgroundColor: COLORS.brandOrangeSoft,
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingRight: 28,
  },
  serviceName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  expressPill: {
    backgroundColor: COLORS.brandOrangeSoft,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.brandOrange,
  },
  expressPillText: {
    color: COLORS.textOnWarm,
    fontSize: 10,
    fontWeight: "700",
  },
  priceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 3,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceNumber: {
    color: COLORS.brandBlueDark,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  priceUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  metaDividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textDisabled,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: RADIUS.full,
  },
  durationText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  serviceTagline: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 5,
  },
  featuresList: {
    marginTop: 7,
    gap: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  featureCheckIcon: {
    marginTop: 2.5,
    flexShrink: 0,
  },
  featureText: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    lineHeight: 17,
    flex: 1,
  },
  radioIndicator: {
    position: "absolute",
    top: 12,
    right: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  radioIndicatorUnselected: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: COLORS.surfacePrimary,
  },
  radioIndicatorSelected: {
    borderWidth: 0,
    backgroundColor: COLORS.brandBlue,
  },
  selectedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.brandBlueSoft,
    borderTopWidth: 1,
    borderTopColor: "#D6E9FA",
  },
  selectedPriceInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  footerLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "500",
  },
  subtotalHighlight: {
    color: COLORS.brandBlueDark,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 1,
  },
  minOrderHint: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    marginTop: 2,
  },
  maxOrderHint: {
    color: COLORS.warning,
    fontSize: 10.5,
    fontWeight: "600",
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  stepperTouchTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonSurface: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperButtonDisabled: {
    opacity: 0.35,
  },
  stepperDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
    minWidth: 46,
    justifyContent: "center",
  },
  stepperNumber: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  stepperUnit: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
