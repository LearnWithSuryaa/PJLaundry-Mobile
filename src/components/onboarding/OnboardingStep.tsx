import {
  Check,
  Clock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  WashingMachine,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import type { OnboardingData } from "../../features/onboarding/onboardingData";
import { COLORS, RADIUS, SHADOWS } from "../../theme/tokens";

type OnboardingStepProps = {
  step: OnboardingData;
  isCompact: boolean;
};

export default function OnboardingStep({
  step,
  isCompact,
}: OnboardingStepProps) {
  const renderVisualCard = () => {
    switch (step.visualType) {
      case "pickup":
        return (
          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <View style={styles.badgeRow}>
                <View style={styles.courierIconCircle}>
                  <Truck size={16} color={COLORS.brandBlueDark} />
                </View>
                <Text style={styles.courierTitle}>Kurir PJLaundry</Text>
              </View>
              <View style={styles.statusPill}>
                <View style={styles.liveDot} />
                <Text style={styles.statusPillText}>Menuju Alamat</Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.infoRow}>
              <MapPin size={16} color={COLORS.textSecondary} style={styles.infoIcon} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Alamat Jemput</Text>
                <Text style={styles.infoValue}>
                  Jl. Melati No. 18, Kebayoran Baru
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Clock size={16} color={COLORS.textSecondary} style={styles.infoIcon} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Estimasi Kedatangan</Text>
                <Text style={styles.infoValue}>Pagi, 09:30 WIB</Text>
              </View>
            </View>
          </View>
        );

      case "tracking":
        return (
          <View style={styles.previewCard}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDotDone}>
                <Check size={12} color="#ffffff" strokeWidth={3} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitleDone}>
                  Diterima & Ditimbang (3.5 kg)
                </Text>
                <Text style={styles.timelineSubtitle}>
                  Berat terverifikasi dan dipilah
                </Text>
              </View>
            </View>

            <View style={styles.timelineConnectorDone} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDotActive}>
                <WashingMachine size={12} color="#ffffff" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitleActive}>
                  Sedang Dicuci & Setrika Uap
                </Text>
                <Text style={styles.timelineSubtitle}>
                  Proses 1 mesin khusus pakaianmu
                </Text>
              </View>
            </View>

            <View style={styles.timelineConnectorPending} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineDotPending}>
                <PackageCheck size={12} color={COLORS.textDisabled} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitlePending}>
                  Siap Diantar Kembali
                </Text>
                <Text style={styles.timelineSubtitle}>
                  Kemasan higienis bersegel
                </Text>
              </View>
            </View>
          </View>
        );

      case "care":
        return (
          <View style={styles.previewCard}>
            <View style={styles.pillarItem}>
              <View style={styles.pillarIconCircle}>
                <ShieldCheck size={18} color={COLORS.success} />
              </View>
              <View style={styles.pillarTextGroup}>
                <Text style={styles.pillarTitle}>1 Mesin 1 Pelanggan</Text>
                <Text style={styles.pillarSubtitle}>
                  Pakaian tidak pernah dicampur dengan pakaian orang lain
                </Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.pillarItem}>
              <View style={styles.pillarIconCircle}>
                <Sparkles size={18} color={COLORS.brandBlue} />
              </View>
              <View style={styles.pillarTextGroup}>
                <Text style={styles.pillarTitle}>Deterjen Ramah Serat</Text>
                <Text style={styles.pillarSubtitle}>
                  Aman untuk kulit sensitif dan menjaga kelembutan serat kain
                </Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.pillarItem}>
              <View style={styles.pillarIconCircle}>
                <Check size={18} color={COLORS.brandOrange} strokeWidth={2.5} />
              </View>
              <View style={styles.pillarTextGroup}>
                <Text style={styles.pillarTitle}>Garansi Cuci Ulang</Text>
                <Text style={styles.pillarSubtitle}>
                  Jika kurang bersih atau kusut, kami cuci ulang tanpa biaya tambahan
                </Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Visual Context Card Area */}
      <View
        style={[
          styles.illustrationBackdrop,
          isCompact && styles.compactIllustrationBackdrop,
          { backgroundColor: step.illustrationColor },
        ]}
      >
        {renderVisualCard()}
      </View>

      {/* Category Tag Pill */}
      <View style={styles.tagPill}>
        <Text style={styles.tagText}>{step.tag}</Text>
      </View>

      {/* Title & Description */}
      <Text style={[styles.title, isCompact && styles.compactTitle]}>
        {step.title}
      </Text>
      <Text
        style={[styles.description, isCompact && styles.compactDescription]}
      >
        {step.description}
      </Text>

      {/* Feature Badges Row */}
      <View style={styles.badgesRow}>
        {step.badges.map((badge, idx) => (
          <View key={idx} style={styles.badgeChip}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  illustrationBackdrop: {
    width: "100%",
    maxWidth: 380,
    height: 240,
    borderRadius: RADIUS.card,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  compactIllustrationBackdrop: {
    height: 195,
    marginBottom: 14,
    padding: 12,
  },
  previewCard: {
    width: "100%",
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.button,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courierIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  courierTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.successSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusPillText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "600",
  },
  previewDivider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 6,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 1,
  },

  // Timeline Styling for Tracking
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDotDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  timelineTitleDone: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  timelineConnectorDone: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.success,
    marginLeft: 9,
    marginVertical: 2,
  },
  timelineDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  timelineTitleActive: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  timelineConnectorPending: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.borderDefault,
    marginLeft: 9,
    marginVertical: 2,
  },
  timelineDotPending: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  timelineTitlePending: {
    color: COLORS.textDisabled,
    fontSize: 13,
    fontWeight: "500",
  },
  timelineSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  // Care Pillar Styling
  pillarItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  pillarIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pillarTextGroup: {
    flex: 1,
  },
  pillarTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  pillarSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  // Typography & Tags
  tagPill: {
    backgroundColor: COLORS.brandBlueSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: 10,
  },
  tagText: {
    color: COLORS.brandBlueDark,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    maxWidth: 380,
    color: COLORS.textPrimary,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  compactTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  description: {
    maxWidth: 360,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
  },
  compactDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  badgeChip: {
    backgroundColor: COLORS.surfacePrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  badgeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
});
