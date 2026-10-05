import { Check, Clock, Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";
import type { LaundryService } from "../../features/services/servicesData";
import { formatRupiah } from "../../features/services/servicesData";

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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${service.name}, ${formatRupiah(service.price)} per ${service.unit}, estimasi pengerjaan ${service.duration}`}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelect(service)}
      style={({ pressed }) => [styles.cardTouchTarget, pressed && styles.pressed]}
    >
      <View
        style={[styles.cardSurface, isSelected && styles.cardSurfaceSelected]}
      >
        {/* Header Row: Icon, Titles, Badges */}
        <View
          style={[
            styles.cardHeaderRow,
            isNarrow && styles.cardHeaderRowNarrow,
          ]}
        >
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.serviceIconTile,
                {
                  backgroundColor: service.isExpress
                    ? ONBOARDING_COLORS.peach
                    : ONBOARDING_COLORS.lightBlue,
                },
              ]}
            >
              <ServiceIcon size={24} color={ONBOARDING_COLORS.text} />
            </View>
            <View style={styles.titleInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.isExpress ? (
                  <View style={styles.expressPill}>
                    <Text style={styles.expressPillText}>Prioritas</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.serviceTagline}>{service.tagline}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceNumber}>
              {formatRupiah(service.price)}
            </Text>
            <Text style={styles.priceUnit}>/ {service.unit}</Text>
          </View>
        </View>

        {/* Features list */}
        <View style={styles.featuresList}>
          {service.features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Check
                size={14}
                color="#2e7d32"
                strokeWidth={2.5}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Meta row: duration & selection radio */}
        <View style={styles.cardFooterRow}>
          <View style={styles.durationPill}>
            <Clock size={13} color="#444444" />
            <Text style={styles.durationText}>
              Selesai dalam {service.duration}
            </Text>
          </View>

          <View
            style={[
              styles.radioIndicator,
              isSelected && styles.radioIndicatorSelected,
            ]}
          >
            {isSelected ? <View style={styles.radioIndicatorDot} /> : null}
          </View>
        </View>

        {/* Expanded Quantity Configurator if selected */}
        {isSelected ? (
          <View style={styles.quantitySection}>
            <View style={styles.quantityHeader}>
              <Text style={styles.quantityLabel}>
                Atur Jumlah ({service.unit}):
              </Text>
              <Text style={styles.subtotalText}>
                Subtotal: {formatRupiah(service.price * quantity)}
              </Text>
            </View>

            <View style={styles.quantityControlRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Kurangi jumlah ${service.unit}`}
                onPress={onDecreaseQuantity}
                disabled={quantity <= service.minOrder}
                style={({ pressed }) => [
                  styles.qtyTouchTarget,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.qtyButtonSurface,
                    quantity <= service.minOrder && styles.qtyButtonDisabled,
                  ]}
                >
                  <Minus size={18} color={ONBOARDING_COLORS.text} />
                </View>
              </Pressable>

              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyNumber}>{quantity}</Text>
                <Text style={styles.qtyUnit}>{service.unit}</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Tambah jumlah ${service.unit}`}
                onPress={onIncreaseQuantity}
                style={({ pressed }) => [
                  styles.qtyTouchTarget,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.qtyButtonSurface}>
                  <Plus size={18} color={ONBOARDING_COLORS.text} />
                </View>
              </Pressable>
            </View>

            {quantity === service.minOrder && service.minOrder > 1 ? (
              <Text style={styles.minOrderHint}>
                Minimal pemesanan paket ini adalah {service.minOrder}{" "}
                {service.unit}.
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardTouchTarget: {
    width: "100%",
  },
  cardSurface: {
    backgroundColor: ONBOARDING_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(51, 51, 51, 0.06)",
    elevation: 2,
  },
  cardSurfaceSelected: {
    borderColor: ONBOARDING_COLORS.blue,
    backgroundColor: "#ffffff",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardHeaderRowNarrow: {
    flexDirection: "column",
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  serviceIconTile: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  titleInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  serviceName: {
    color: ONBOARDING_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  expressPill: {
    backgroundColor: ONBOARDING_COLORS.peach,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expressPillText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },
  serviceTagline: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  priceNumber: {
    color: ONBOARDING_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  priceUnit: {
    color: "#666666",
    fontSize: 12,
    marginTop: 2,
  },
  featuresList: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 51, 51, 0.06)",
    gap: 6,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    flexShrink: 0,
  },
  featureText: {
    color: "#444444",
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 51, 51, 0.06)",
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: ONBOARDING_COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  durationText: {
    color: "#444444",
    fontSize: 12,
    fontWeight: "600",
  },
  radioIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioIndicatorSelected: {
    borderColor: ONBOARDING_COLORS.blue,
    backgroundColor: ONBOARDING_COLORS.blue,
  },
  radioIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  quantitySection: {
    marginTop: 14,
    padding: 14,
    backgroundColor: ONBOARDING_COLORS.background,
    borderRadius: 12,
  },
  quantityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  quantityLabel: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  subtotalText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  quantityControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  qtyTouchTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonSurface: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ONBOARDING_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 2,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    minWidth: 70,
    justifyContent: "center",
  },
  qtyNumber: {
    color: ONBOARDING_COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },
  qtyUnit: {
    color: "#555555",
    fontSize: 14,
    fontWeight: "600",
  },
  minOrderHint: {
    color: "#666666",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
  pressed: {
    opacity: 0.82,
  },
});
