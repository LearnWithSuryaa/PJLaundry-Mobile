import { Activity, CheckCircle, Wifi, WifiOff } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import type { HealthData } from "../../types/api";
import { COLORS, RADIUS, SPACING } from "../../theme/tokens";

interface ServerHealthBadgeProps {
  health: HealthData | null;
  loading: boolean;
}

export default function ServerHealthBadge({ health, loading }: ServerHealthBadgeProps) {
  const isHealthy = health?.status === "ok";

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {loading ? (
          <Activity size={16} color={COLORS.brandBlueDark} style={styles.spinIcon} />
        ) : isHealthy ? (
          <CheckCircle size={16} color={COLORS.success} />
        ) : (
          <WifiOff size={16} color={COLORS.error} />
        )}
        <Text style={styles.serviceTitle}>
          {health?.service || "PJLaundry Backend REST API"}
        </Text>
      </View>

      <View style={[styles.statusPill, isHealthy ? styles.pillSuccess : styles.pillOffline]}>
        <View style={[styles.dot, isHealthy ? styles.dotGreen : styles.dotRed]} />
        <Text style={[styles.statusText, isHealthy ? styles.textGreen : styles.textRed]}>
          {loading ? "Memeriksa..." : isHealthy ? "Online" : "Offline"}
        </Text>
        {isHealthy && health?.database?.latencyMs ? (
          <Text style={styles.latencyText}>{health.database.latencyMs}ms</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfacePrimary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    marginBottom: SPACING.md,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  pillSuccess: {
    backgroundColor: COLORS.successSurface,
  },
  pillOffline: {
    backgroundColor: COLORS.errorSurface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: {
    backgroundColor: COLORS.success,
  },
  dotRed: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  textGreen: {
    color: COLORS.success,
  },
  textRed: {
    color: COLORS.error,
  },
  latencyText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  spinIcon: {
    opacity: 0.8,
  },
});

