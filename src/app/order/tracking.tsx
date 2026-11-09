import {
  Check,
  CheckCircle2,
  Clock,
  Home,
  Package,
  Truck,
  WashingMachine,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { formatRupiah } from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

// Daftar tahapan proses laundry untuk simulasi tracking
const TRACKING_STEPS = [
  {
    stepIndex: 0,
    statusKey: "penjemputan",
    title: "Penjemputan Kurir",
    description: "Kurir PJLaundry sedang dalam perjalanan ke alamat Anda untuk mengambil pakaian kotor.",
    icon: Truck,
    badgeText: "Kurir OTW",
  },
  {
    stepIndex: 1,
    statusKey: "dicuci",
    title: "Sedang Dicuci & Dirawat",
    description: "Cucian dipilah, dicuci dengan formula detergen pilihan, dan dikeringkan higienis.",
    icon: WashingMachine,
    badgeText: "Dalam Mesin Cuci",
  },
  {
    stepIndex: 2,
    statusKey: "selesai",
    title: "Selesai & Siap Diantar",
    description: "Pakaian sudah rapi disetrika uap, dikemas wangi, dan siap diantar kembali ke lokasi Anda.",
    icon: Package,
    badgeText: "Siap Antar",
  },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    orderNumber?: string;
    serviceName?: string;
    quantity?: string;
    slotName?: string;
    slotHours?: string;
    detergentName?: string;
    address?: string;
    paymentMethod?: string;
    grandTotal?: string;
  }>();

  // ==========================================================================
  // [MODUL 2 - useState]
  // Menyimpan indeks langkah proses cucian yang sedang berjalan (0 -> 1 -> 2)
  // ==========================================================================
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // ==========================================================================
  // [MODUL 2 - useEffect]
  // Simulasi timer tracking cucian ("Penjemputan" -> "Sedang Dicuci" -> "Selesai")
  // Timer otomatis memperbarui status cucian setiap 5 detik untuk keperluan demonstrasi
  // ==========================================================================
  useEffect(() => {
    if (!isSimulationActive) return;

    // Timer interval untuk simulasi progres status secara berkala
    const intervalId = setInterval(() => {
      setSecondsElapsed((sec) => sec + 1);

      setCurrentStepIndex((prevStep) => {
        if (prevStep < TRACKING_STEPS.length - 1) {
          // Berpindah ke tahap berikutnya: Penjemputan -> Sedang Dicuci -> Selesai
          return prevStep + 1;
        } else {
          // Jika sudah mencapai tahap terakhir "Selesai", hentikan simulasi timer
          setIsSimulationActive(false);
          clearInterval(intervalId);
          return prevStep;
        }
      });
    }, 5000); // Simulasi berubah setiap 5 detik

    // Cleanup timer saat unmount untuk mencegah memory leak
    return () => clearInterval(intervalId);
  }, [isSimulationActive]);

  // ==========================================================================
  // [MODUL 2 - Fungsi Router Lain]
  // router.dismiss() (menutup modal checkout) atau kembali ke katalog layanan
  // ==========================================================================
  const handleFinishAndClose = () => {
    // Menutup modal nested stack dan kembali ke layar katalog layanan
    if (router.canGoBack()) {
      router.dismiss();
    } else {
      router.replace("/services");
    }
  };

  const currentStep = TRACKING_STEPS[currentStepIndex];
  const isAllCompleted = currentStepIndex === TRACKING_STEPS.length - 1;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Header Pemantauan Status Cuci */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pemantauan Status Cuci</Text>
          <Text style={styles.headerSubtitle}>
            No. Ref: {params.orderNumber || "DEMO-PJL-20261019-9021"}
          </Text>
        </View>

        {/* 
          [MODUL 2 - Fungsi Router Lain]
          Tombol router.dismiss() di header
        */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup pelacakan pesanan dan kembali ke katalog"
          onPress={handleFinishAndClose}
          style={({ pressed }) => [styles.headerTouch, pressed && styles.pressed]}
        >
          <View style={styles.homeIconSurface}>
            <Home size={18} color={COLORS.brandBlueDark} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Status Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.statusBadge}>
              {isSimulationActive ? (
                <ActivityIndicator size="small" color={COLORS.brandBlueDark} />
              ) : (
                <CheckCircle2 size={16} color={COLORS.success} />
              )}
              <Text
                style={[
                  styles.statusBadgeText,
                  !isSimulationActive && styles.statusBadgeTextCompleted,
                ]}
              >
                {currentStep.badgeText}
              </Text>
            </View>

            <View style={styles.timerBadge}>
              <Clock size={13} color={COLORS.textSecondary} />
              <Text style={styles.timerBadgeText}>
                {isSimulationActive ? `Simulasi: ${secondsElapsed}s` : "Tahap Akhir"}
              </Text>
            </View>
          </View>

          <Text style={styles.heroStepTitle}>{currentStep.title}</Text>
          <Text style={styles.heroStepDesc}>{currentStep.description}</Text>

          {/* Progress Bar Horizontal */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${((currentStepIndex + 1) / TRACKING_STEPS.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* 
          [MODUL 2 - useEffect]
          Timeline Stepper: "Penjemputan" -> "Sedang Dicuci" -> "Selesai"
        */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            Tahapan Pelacakan Cucian (useEffect Timer)
          </Text>

          <View style={styles.timelineList}>
            {TRACKING_STEPS.map((step, idx) => {
              const isPassed = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;
              const StepIcon = step.icon;

              return (
                <View key={step.stepIndex} style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    {/* Circle Node */}
                    <View
                      style={[
                        styles.timelineNode,
                        isPassed && styles.timelineNodePassed,
                        isCurrent && styles.timelineNodeCurrent,
                      ]}
                    >
                      {isPassed ? (
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <StepIcon
                          size={14}
                          color={
                            isCurrent
                              ? COLORS.brandBlueDark
                              : COLORS.textDisabled
                          }
                        />
                      )}
                    </View>

                    {/* Connecting Line */}
                    {idx < TRACKING_STEPS.length - 1 ? (
                      <View
                        style={[
                          styles.timelineLine,
                          isPassed && styles.timelineLinePassed,
                        ]}
                      />
                    ) : null}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        isCurrent && styles.timelineTitleCurrent,
                        isPassed && styles.timelineTitlePassed,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.timelineDesc}>{step.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Rincian Pesanan Aktif */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Informasi Pesanan</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Layanan:</Text>
            <Text style={styles.infoVal}>
              {params.serviceName || "Kiloan Komplit"} ({params.quantity || "3 kg"})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Slot Jadwal:</Text>
            <Text style={styles.infoVal}>
              {params.slotName || "Slot Pagi"} ({params.slotHours || "09:00 - 11:30"})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Formula Pewangi:</Text>
            <Text style={styles.infoVal}>
              {params.detergentName || "Lavender Relaxing"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Metode Pembayaran:</Text>
            <Text style={styles.infoVal}>
              {params.paymentMethod || "QRIS Instan"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Pembayaran:</Text>
            <Text style={styles.infoValBold}>
              {formatRupiah(parseInt(params.grandTotal || "27000", 10))}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 
        Bottom Action:
        [MODUL 2 - Fungsi Router Lain]
        Tombol router.dismiss() untuk kembali ke katalog layanan
      */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Selesai dan kembali ke katalog layanan"
          onPress={handleFinishAndClose}
          style={({ pressed }) => [styles.fullTouch, pressed && styles.pressed]}
        >
          <View style={styles.buttonSurface}>
            <Text style={styles.buttonText}>
              {isAllCompleted
                ? "Selesai (Kembali ke Katalog)"
                : "Tutup Pemantauan (router.dismiss)"}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: COLORS.surfacePrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerTouch: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIconSurface: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  heroCard: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    ...SHADOWS.card,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandBlueSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  statusBadgeTextCompleted: {
    color: COLORS.success,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerBadgeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  heroStepTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  heroStepDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.brandBlue,
    borderRadius: 3,
  },
  card: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 64,
  },
  timelineLeftColumn: {
    alignItems: "center",
    width: 32,
    marginRight: 12,
  },
  timelineNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineNodePassed: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  timelineNodeCurrent: {
    backgroundColor: COLORS.brandBlueSoft,
    borderColor: COLORS.brandBlue,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.borderDefault,
    marginVertical: 4,
  },
  timelineLinePassed: {
    backgroundColor: COLORS.success,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  timelineTitleCurrent: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  timelineTitlePassed: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  timelineDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  infoValBold: {
    fontSize: 14,
    color: COLORS.brandBlueDark,
    fontWeight: "800",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.surfacePrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
    ...SHADOWS.card,
  },
  fullTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  buttonSurface: {
    minHeight: TOUCH_TARGET.min,
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});
