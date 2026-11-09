import { Clock, ExternalLink, MapPin, Phone } from "lucide-react-native";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import type { Outlet } from "../../types/api";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

interface OutletCardProps {
  outlet: Outlet;
  onSelect?: (outlet: Outlet) => void;
}

export default function OutletCard({ outlet, onSelect }: OutletCardProps) {
  const handleCall = () => {
    const cleanPhone = outlet.phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Gagal Membuka Telepon", `Silakan hubungi manual ke nomor ${outlet.phone}`);
    });
  };

  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${outlet.latitude},${outlet.longitude}`;
    Linking.openURL(mapsUrl).catch(() => {
      Alert.alert("Gagal Membuka Peta", "Aplikasi peta tidak dapat dibuka di perangkat ini.");
    });
  };

  return (
    <View style={styles.card}>
      {/* Top Header: Nama Cabang & Badge Aktif */}
      <View style={styles.headerRow}>
        <View style={styles.nameContainer}>
          <Text style={styles.outletName}>{outlet.name}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, outlet.is_active ? styles.badgeActive : styles.badgeInactive]}>
              <View style={[styles.statusDot, outlet.is_active ? styles.dotGreen : styles.dotGray]} />
              <Text style={[styles.statusText, outlet.is_active ? styles.textActive : styles.textInactive]}>
                {outlet.is_active ? "Buka Sekarang" : "Tutup Sementara"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.infoRow}>
        <MapPin size={16} color={COLORS.brandBlueDark} style={styles.iconMargin} />
        <Text style={styles.addressText}>{outlet.address}</Text>
      </View>

      {/* Opening Hours */}
      <View style={styles.infoRow}>
        <Clock size={16} color={COLORS.textSecondary} style={styles.iconMargin} />
        <Text style={styles.detailText}>Jam Operasional: {outlet.opening_hours}</Text>
      </View>

      {/* Phone Contact */}
      <View style={styles.infoRow}>
        <Phone size={16} color={COLORS.textSecondary} style={styles.iconMargin} />
        <Text style={styles.detailText}>{outlet.phone}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Telepon outlet ${outlet.name}`}
          style={({ pressed }) => [styles.actionButton, styles.callButton, pressed && styles.pressed]}
          onPress={handleCall}
        >
          <Phone size={15} color={COLORS.brandBlueDark} />
          <Text style={styles.callButtonText}>Hubungi Outlet</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Buka rute peta ke ${outlet.name}`}
          style={({ pressed }) => [styles.actionButton, styles.mapsButton, pressed && styles.pressed]}
          onPress={handleOpenMaps}
        >
          <ExternalLink size={15} color={COLORS.textOnAccent} />
          <Text style={styles.mapsButtonText}>Buka di Maps</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  headerRow: {
    marginBottom: SPACING.sm,
  },
  nameContainer: {
    gap: 4,
  },
  outletName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeActive: {
    backgroundColor: COLORS.successSurface,
  },
  badgeInactive: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: {
    backgroundColor: COLORS.success,
  },
  dotGray: {
    backgroundColor: COLORS.textDisabled,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  textActive: {
    color: COLORS.success,
  },
  textInactive: {
    color: COLORS.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SPACING.xs + 2,
  },
  iconMargin: {
    marginTop: 2,
    marginRight: 8,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  callButton: {
    backgroundColor: COLORS.brandBlueSoft,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  mapsButton: {
    backgroundColor: COLORS.brandBlue,
  },
  mapsButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textOnAccent,
  },
  pressed: {
    opacity: 0.8,
  },
});

