import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  Zap,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import PickupScheduleModal from "../../components/services/PickupScheduleModal";
import {
  formatRupiah,
  getUpcomingPickupDates,
  SERVICES,
} from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, TOUCH_TARGET } from "../../theme/tokens";

type SpeedOption = "regular" | "express";

export default function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 4. useLocalSearchParams<{ id: string }>() untuk menangkap ID paket laundry
  const { id } = useLocalSearchParams<{ id: string }>();

  // Cari data layanan berdasarkan id dari URL dinamis
  const service = useMemo(() => {
    return SERVICES.find((s) => s.id === id);
  }, [id]);

  // 1. useState: Counter perkiraan berat cucian (kg/pcs) dan opsi kecepatan paket
  const [quantity, setQuantity] = useState<number>(
    service ? service.minOrder : 1,
  );
  const [speedOption, setSpeedOption] = useState<SpeedOption>(
    service?.isExpress ? "express" : "regular",
  );
  const [estimatedDuration, setEstimatedDuration] = useState("Regular 2 Hari");
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState(
    "Selesai dalam 48 jam kerja",
  );

  // Modal Booking State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(
    "Jl. Melati No. 18, Kebayoran Baru",
  );
  const [selectedDateId, setSelectedDateId] = useState<string>("today");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("pagi");
  const [orderNotes, setOrderNotes] = useState("");

  const pickupDates = useMemo(() => getUpcomingPickupDates(), []);

  // 2. useEffect: Mengupdate estimasi waktu pengerjaan otomatis saat paket dipilih
  useEffect(() => {
    const timer = setTimeout(() => {
      if (speedOption === "express") {
        setEstimatedDuration("Express 6 Jam");
        setEstimatedCompletionTime(
          "Prioritas mesin tunggal, cucian siap diantar dalam 6 jam.",
        );
      } else {
        setEstimatedDuration(service?.duration ?? "Regular 2 Hari");
        setEstimatedCompletionTime(
          "Pencucian bertahap higienis dengan waktu pengerjaan standar 2 hari kerja.",
        );
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [speedOption, service]);

  // Layanan lain untuk rekomendasi (eksplorasi layanan)
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return SERVICES.filter((s) => s.id !== service.id).slice(0, 3);
  }, [service]);

  // Hitung harga per unit sesuai kecepatan (Express +Rp 5.000/unit jika bukan default express)
  const effectivePrice = useMemo(() => {
    if (!service) return 0;
    if (speedOption === "express" && !service.isExpress) {
      return service.price + 5000;
    }
    return service.price;
  }, [service, speedOption]);

  const estimatedTotal = effectivePrice * quantity;

  // Handle Stepper
  const handleDecreaseQuantity = () => {
    if (!service) return;
    setQuantity((prev) => Math.max(service.minOrder, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (!service) return;
    setQuantity((prev) => Math.min(service.maxOrder, prev + 1));
  };

  // State jika layanan tidak ditemukan
  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* 5. Mengonfigurasi Stack.Screen title Detail Layanan */}
        <Stack.Screen
          options={{
            title: "Detail Layanan",
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.surfacePrimary },
            headerTintColor: COLORS.textPrimary,
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Layanan Tidak Ditemukan</Text>
          <Text style={styles.notFoundSubtitle}>
            Paket layanan dengan ID &quot;{id}&quot; tidak terdaftar di katalog.
          </Text>
          {/* 3. router.back() kembali ke katalog */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke katalog layanan"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButtonTouch,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.backButtonSurface}>
              <ArrowLeft size={16} color={COLORS.brandBlueDark} />
              <Text style={styles.backButtonText}>Kembali ke Katalog</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      {/* 5. Mengonfigurasi Stack.Screen name="services/[id]" options={{ title: "Detail Layanan" }} */}
      <Stack.Screen
        options={{
          title: "Detail Layanan",
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surfacePrimary },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke katalog layanan"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.headerBackTouch,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.headerBackSurface}>
                <ArrowLeft size={18} color={COLORS.textPrimary} />
              </View>
            </Pressable>
          ),
        }}
      />
      <StatusBar style="dark" />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 130 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Service Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View
                style={[
                  styles.serviceIconTile,
                  service.isExpress
                    ? styles.iconTileExpress
                    : styles.iconTileDefault,
                ]}
              >
                <ServiceIcon
                  size={26}
                  color={
                    service.isExpress ? COLORS.brandOrange : COLORS.brandBlue
                  }
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.heroTitleColumn}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>
                    Kategori {service.category.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.heroName}>{service.name}</Text>
              </View>
            </View>

            <Text style={styles.heroTagline}>{service.tagline}</Text>

            {/* Price & Turnaround Row */}
            <View style={styles.heroPriceRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceNumber}>
                  {formatRupiah(effectivePrice)}
                </Text>
                <Text style={styles.priceUnit}>/{service.unit}</Text>
              </View>

              <View style={styles.heroDurationBadge}>
                <Clock size={13} color={COLORS.textSecondary} strokeWidth={2} />
                <Text style={styles.heroDurationText}>{estimatedDuration}</Text>
              </View>
            </View>
          </View>

          {/* Speed Selector (Regular vs Express) -> Triggers useEffect */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Pilihan Kecepatan Pengerjaan
            </Text>
            <Text style={styles.sectionSubtitle}>
              Pilih mode pengerjaan untuk mempercepat waktu penyelesaian
              cucianmu.
            </Text>

            <View style={styles.speedOptionsGrid}>
              <Pressable
                accessibilityRole="radio"
                accessibilityLabel="Pilih mode regular 2 hari"
                accessibilityState={{ selected: speedOption === "regular" }}
                onPress={() => setSpeedOption("regular")}
                style={({ pressed }) => [
                  styles.speedCardTouch,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.speedCardSurface,
                    speedOption === "regular"
                      ? styles.speedCardSelected
                      : styles.speedCardUnselected,
                  ]}
                >
                  <View style={styles.speedHeaderRow}>
                    <Clock
                      size={18}
                      color={
                        speedOption === "regular"
                          ? COLORS.brandBlueDark
                          : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.speedOptionName,
                        speedOption === "regular" &&
                          styles.speedOptionNameActive,
                      ]}
                    >
                      Regular
                    </Text>
                  </View>
                  <Text style={styles.speedDurationText}>2 Hari Kerja</Text>
                  <Text style={styles.speedPriceHint}>Tarif Standar</Text>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="radio"
                accessibilityLabel="Pilih mode kilat express 6 jam"
                accessibilityState={{ selected: speedOption === "express" }}
                onPress={() => setSpeedOption("express")}
                style={({ pressed }) => [
                  styles.speedCardTouch,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.speedCardSurface,
                    speedOption === "express"
                      ? styles.speedCardSelectedExpress
                      : styles.speedCardUnselected,
                  ]}
                >
                  <View style={styles.speedHeaderRow}>
                    <Zap
                      size={18}
                      color={
                        speedOption === "express"
                          ? COLORS.brandOrange
                          : COLORS.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.speedOptionName,
                        speedOption === "express" &&
                          styles.speedOptionNameActiveExpress,
                      ]}
                    >
                      Express Kilat
                    </Text>
                  </View>
                  <Text style={styles.speedDurationText}>6 Jam Selesai</Text>
                  <Text style={styles.speedPriceHint}>Prioritas Cepat</Text>
                </View>
              </Pressable>
            </View>

            {/* Banner Estimasi Dinamis (diperbarui oleh useEffect) */}
            <View style={styles.estimationBanner}>
              <Info size={16} color={COLORS.information} />
              <View style={styles.estimationBannerTextGroup}>
                <Text style={styles.estimationBannerTitle}>
                  Estimasi: {estimatedDuration}
                </Text>
                <Text style={styles.estimationBannerSubtitle}>
                  {estimatedCompletionTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Stepper Counter: Perkiraan Berat Cucian (kg/pcs) */}
          <View style={styles.sectionCard}>
            <View style={styles.counterHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  Perkiraan Beban Cucian ({service.unit})
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Minimal {service.minOrder} {service.unit}, maks{" "}
                  {service.maxOrder} {service.unit}
                </Text>
              </View>

              {/* Stepper Component */}
              <View style={styles.stepperContainer}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Kurangi ${service.unit}`}
                  onPress={handleDecreaseQuantity}
                  disabled={quantity <= service.minOrder}
                  style={({ pressed }) => [
                    styles.stepperTouch,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.stepperBtn,
                      quantity <= service.minOrder && styles.stepperBtnDisabled,
                    ]}
                  >
                    <Minus
                      size={16}
                      color={
                        quantity <= service.minOrder
                          ? COLORS.textDisabled
                          : COLORS.textPrimary
                      }
                      strokeWidth={2.4}
                    />
                  </View>
                </Pressable>

                <View style={styles.stepperDisplay}>
                  <Text style={styles.stepperValue}>{quantity}</Text>
                  <Text style={styles.stepperUnitText}>{service.unit}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Tambah ${service.unit}`}
                  onPress={handleIncreaseQuantity}
                  disabled={quantity >= service.maxOrder}
                  style={({ pressed }) => [
                    styles.stepperTouch,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.stepperBtn,
                      quantity >= service.maxOrder && styles.stepperBtnDisabled,
                    ]}
                  >
                    <Plus
                      size={16}
                      color={
                        quantity >= service.maxOrder
                          ? COLORS.textDisabled
                          : COLORS.brandBlueDark
                      }
                      strokeWidth={2.4}
                    />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Total Calculation Row */}
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>
                Subtotal ({quantity} {service.unit} ×{" "}
                {formatRupiah(effectivePrice)})
              </Text>
              <Text style={styles.calcValue}>
                {formatRupiah(estimatedTotal)}
              </Text>
            </View>
          </View>

          {/* Service Features & Guarantees */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Standar Perawatan Layanan</Text>
            <View style={styles.featuresList}>
              {service.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={styles.featureCheckTile}>
                    <Check size={13} color={COLORS.success} strokeWidth={2.6} />
                  </View>
                  <Text style={styles.featureItemText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.guaranteeDivider} />

            <View style={styles.guaranteeRow}>
              <ShieldCheck size={18} color={COLORS.brandBlue} />
              <Text style={styles.guaranteeRowText}>
                Garansi cucian bersih, higienis, dan terpisah per pelanggan.
              </Text>
            </View>
          </View>

          {/* Rekomendasi Layanan Lain: router.push('/services/[id]') */}
          {relatedServices.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedSectionTitle}>
                Eksplorasi Layanan Lainnya
              </Text>
              <Text style={styles.relatedSectionSubtitle}>
                Bandingkan dengan paket cuci kiloan, dry clean satuan, atau
                sepatu.
              </Text>

              <View style={styles.relatedList}>
                {relatedServices.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Buka detail layanan ${item.name}`}
                      onPress={() =>
                        router.push({
                          pathname: "/services/[id]",
                          params: { id: item.id },
                        } as any)
                      }
                      style={({ pressed }) => [
                        styles.relatedCardTouch,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.relatedCardSurface}>
                        <View style={styles.relatedIconTile}>
                          <ItemIcon size={18} color={COLORS.brandBlue} />
                        </View>
                        <View style={styles.relatedContent}>
                          <Text style={styles.relatedName}>{item.name}</Text>
                          <Text style={styles.relatedPrice}>
                            {formatRupiah(item.price)}/{item.unit} ·{" "}
                            {item.duration}
                          </Text>
                        </View>
                        <View style={styles.viewBadge}>
                          <Text style={styles.viewBadgeText}>Lihat</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar: Total & Pesan Sekarang */}
        <View
          style={[
            styles.bottomStickyBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.bottomBarContent}>
            <View style={styles.bottomLeft}>
              <Text style={styles.bottomLabel}>
                Estimasi Biaya ({quantity} {service.unit})
              </Text>
              <Text style={styles.bottomTotal}>
                {formatRupiah(estimatedTotal)}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Pesan layanan sekarang, total ${formatRupiah(estimatedTotal)}`}
              onPress={() => {
                setOrderConfirmed(false);
                setIsModalVisible(true);
              }}
              style={({ pressed }) => [
                styles.orderButtonTouch,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.orderButtonSurface}>
                <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Booking / Pickup Schedule Modal */}
      <PickupScheduleModal
        visible={isModalVisible}
        selectedService={{
          ...service,
          price: effectivePrice,
          duration: estimatedDuration,
        }}
        quantity={quantity}
        estimatedTotal={estimatedTotal}
        pickupAddress={pickupAddress}
        onAddressChange={setPickupAddress}
        pickupDates={pickupDates}
        selectedDateId={selectedDateId}
        onSelectDate={setSelectedDateId}
        selectedSlotId={selectedSlotId}
        onSelectSlot={setSelectedSlotId}
        orderNotes={orderNotes}
        onNotesChange={setOrderNotes}
        orderConfirmed={orderConfirmed}
        onConfirmOrder={(_orderNum) => setOrderConfirmed(true)}
        onClose={() => {
          setIsModalVisible(false);
          setOrderConfirmed(false);
        }}
      />
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
    maxWidth: 600,
    alignSelf: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  headerBackTouch: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackSurface: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  heroCard: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  serviceIconTile: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.input,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileDefault: {
    backgroundColor: COLORS.brandBlueSoft,
  },
  iconTileExpress: {
    backgroundColor: COLORS.brandOrangeSoft,
  },
  heroTitleColumn: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  categoryPillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
  },
  heroTagline: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 12,
  },
  heroPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceNumber: {
    color: COLORS.brandBlueDark,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  priceUnit: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 2,
  },
  heroDurationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  heroDurationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3,
  },
  speedOptionsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  speedCardTouch: {
    flex: 1,
  },
  speedCardSurface: {
    borderRadius: RADIUS.input,
    padding: 12,
    borderWidth: 1.5,
  },
  speedCardUnselected: {
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSecondary,
  },
  speedCardSelected: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  speedCardSelectedExpress: {
    borderColor: COLORS.brandOrange,
    backgroundColor: COLORS.brandOrangeSoft,
  },
  speedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  speedOptionName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  speedOptionNameActive: {
    color: COLORS.brandBlueDark,
  },
  speedOptionNameActiveExpress: {
    color: COLORS.brandOrange,
  },
  speedDurationText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  speedPriceHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  estimationBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: COLORS.brandBlueSoft,
    padding: 12,
    borderRadius: RADIUS.sm,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D6E9FA",
  },
  estimationBannerTextGroup: {
    flex: 1,
  },
  estimationBannerTitle: {
    color: COLORS.brandBlueDark,
    fontSize: 12.5,
    fontWeight: "700",
  },
  estimationBannerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  counterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepperTouch: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  stepperDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
    minWidth: 50,
    justifyContent: "center",
  },
  stepperValue: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  stepperUnitText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  calcRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
  },
  calcLabel: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: "500",
  },
  calcValue: {
    color: COLORS.brandBlueDark,
    fontSize: 16,
    fontWeight: "700",
  },
  featuresList: {
    marginTop: 12,
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureCheckTile: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: COLORS.successSurface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  featureItemText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  guaranteeDivider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
    marginVertical: 14,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guaranteeRowText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedSectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  relatedSectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    marginTop: 2,
    marginBottom: 10,
  },
  relatedList: {
    gap: 8,
  },
  relatedCardTouch: {
    width: "100%",
  },
  relatedCardSurface: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    gap: 10,
  },
  relatedIconTile: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  relatedContent: {
    flex: 1,
  },
  relatedName: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: "700",
  },
  relatedPrice: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  viewBadge: {
    backgroundColor: COLORS.brandBlueSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  viewBadgeText: {
    color: COLORS.brandBlueDark,
    fontSize: 11,
    fontWeight: "700",
  },
  bottomStickyBar: {
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
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
    gap: 14,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  bottomTotal: {
    color: COLORS.brandBlueDark,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 1,
  },
  orderButtonTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  orderButtonSurface: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: 22,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonText: {
    color: COLORS.textOnAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  notFoundSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  backButtonTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  backButtonSurface: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandBlueSoft,
  },
  backButtonText: {
    color: COLORS.brandBlueDark,
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
});
