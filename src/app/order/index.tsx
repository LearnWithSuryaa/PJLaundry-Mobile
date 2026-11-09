import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Droplets,
  MapPin,
  Sparkles,
  X,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DETERGENT_OPTIONS,
  formatRupiah,
  getUpcomingPickupDates,
  PICKUP_TIME_SLOTS,
  SERVICES,
} from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

export default function OrderPickupFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ serviceId?: string; quantity?: string }>();

  // Mendapatkan layanan yang dipilih dari parameter router
  const selectedService = useMemo(() => {
    return SERVICES.find((s) => s.id === params.serviceId) ?? SERVICES[0];
  }, [params.serviceId]);

  const quantity = Math.max(
    selectedService.minOrder,
    parseInt(params.quantity || `${selectedService.minOrder}`, 10) || selectedService.minOrder
  );
  // [MODUL 2 - useState]
  const [selectedSlotId, setSelectedSlotId] = useState<string>("pagi");

  // pewangi 
  const [selectedDetergentId, setSelectedDetergentId] = useState<string>("lavender");

  // State pendukung form penjemputan
  const [selectedDateId, setSelectedDateId] = useState<string>("today");
  const [pickupAddress, setPickupAddress] = useState<string>(
    "Jl. Melati No. 18, Kebayoran Baru, Jakarta Selatan"
  );
  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState<string>("");

  //  harga dan ongkir 
  const [subtotalService, setSubtotalService] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [detergentFee, setDetergentFee] = useState<number>(0);
  const [totalEstimated, setTotalEstimated] = useState<number>(0);

  const pickupDates = useMemo(() => getUpcomingPickupDates(), []);

  // [MODUL 2 - useEffect]
  // Otomatis hitung total harga + ongkir + biaya detergen secara reaktif
  // ketika quantity, paket layanan, atau opsi detergen berubah
  useEffect(() => {
    const timerId = setTimeout(() => {
      const baseSubtotal = selectedService.price * quantity;
      const detergent = DETERGENT_OPTIONS.find((d) => d.id === selectedDetergentId);
      const extraDetergent = detergent ? detergent.extraPrice : 0;

      // Logika perhitungan ongkir: Gratis jika subtotal >= 30.000, selain itu Rp 5.000
      const calculatedDelivery = baseSubtotal >= 30000 ? 0 : 5000;
      const finalTotal = baseSubtotal + extraDetergent + calculatedDelivery;

      setSubtotalService(baseSubtotal);
      setDetergentFee(extraDetergent);
      setDeliveryFee(calculatedDelivery);
      setTotalEstimated(finalTotal);
    }, 0);

    return () => clearTimeout(timerId);
  }, [selectedService, quantity, selectedDetergentId]);

  // ==========================================================================
  // [MODUL 2 - Fungsi Router Lain]
  // router.dismiss() (menutup modal checkout) atau router.canGoBack() untuk
  // validasi pembatalan order penjemputan
  // ==========================================================================
  const handleCancelOrder = () => {
    if (router.canGoBack()) {
      // Menutup modal checkout dan kembali ke katalog layanan
      router.dismiss();
    } else {
      router.replace("/services");
    }
  };

  // ==========================================================================
  // [MODUL 2 - push() & back()]
  // Navigasi dari Form Jadwal -> Ringkasan Pembayaran menggunakan router.push()
  // ==========================================================================
  const handleProceedToSummary = () => {
    if (pickupAddress.trim().length < 8) {
      setAddressError("Alamat penjemputan wajib diisi lengkap (minimal 8 karakter).");
      return;
    }
    setAddressError(null);

    // Navigasi ke Ringkasan Pembayaran dengan mengirimkan parameter
    router.push({
      pathname: "/order/summary",
      params: {
        serviceId: selectedService.id,
        quantity: quantity.toString(),
        slotId: selectedSlotId,
        detergentId: selectedDetergentId,
        dateId: selectedDateId,
        address: pickupAddress,
        notes: orderNotes,
        subtotal: subtotalService.toString(),
        deliveryFee: deliveryFee.toString(),
        detergentFee: detergentFee.toString(),
        total: totalEstimated.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Header Modal Form */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Jadwal Penjemputan</Text>
          <Text style={styles.headerSubtitle}>
            Langkah 1 dari 2: Isi jadwal & preferensi cuci
          </Text>
        </View>

        {/* 
          [MODUL 2 - Fungsi Router Lain]
          Tombol Tutup Modal menggunakan router.dismiss()
        */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup formulir pemesanan"
          onPress={handleCancelOrder}
          style={({ pressed }) => [styles.closeTouchTarget, pressed && styles.pressed]}
        >
          <View style={styles.closeButtonSurface}>
            <X size={20} color={COLORS.textPrimary} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ringkasan Singkat Paket Terpilih */}
        <View style={styles.servicePreviewCard}>
          <View style={styles.servicePreviewHeader}>
            <Text style={styles.serviceName}>{selectedService.name}</Text>
            <Text style={styles.servicePrice}>
              {formatRupiah(subtotalService)}
            </Text>
          </View>
          <Text style={styles.serviceSubDetail}>
            Jumlah: {quantity} {selectedService.unit} · Durasi: {selectedService.duration}
          </Text>
        </View>

        {/* Form Group 1: Alamat Penjemputan */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <MapPin size={18} color={COLORS.brandBlue} />
            <Text style={styles.sectionTitle}>Alamat Penjemputan</Text>
          </View>

          <TextInput
            style={[
              styles.textInput,
              addressError ? styles.textInputError : null,
            ]}
            value={pickupAddress}
            onChangeText={(text) => {
              setPickupAddress(text);
              if (addressError && text.trim().length >= 8) {
                setAddressError(null);
              }
            }}
            placeholder="Tuliskan nama jalan, no. rumah/kos, patokan"
            placeholderTextColor={COLORS.textDisabled}
          />
          {addressError ? (
            <View style={styles.errorRow}>
              <AlertTriangle size={14} color={COLORS.error} />
              <Text style={styles.errorText}>{addressError}</Text>
            </View>
          ) : null}
        </View>

        {/* Form Group 2: Tanggal Penjemputan */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Calendar size={18} color={COLORS.brandBlue} />
            <Text style={styles.sectionTitle}>Pilih Tanggal</Text>
          </View>
          <View style={styles.datesRow}>
            {pickupDates.map((d) => {
              const isActive = selectedDateId === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setSelectedDateId(d.id)}
                  style={({ pressed }) => [
                    styles.dateChip,
                    isActive && styles.dateChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateChipDay,
                      isActive && styles.dateChipTextActive,
                    ]}
                  >
                    {d.dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipDate,
                      isActive && styles.dateChipTextActive,
                    ]}
                  >
                    {d.dateLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 
          [MODUL 2 - useState]
          Komponen Pemilihan Slot Waktu Jemput 
        */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Clock size={18} color={COLORS.brandBlue} />
            <Text style={styles.sectionTitle}>Slot Waktu Jemput (useState)</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Pilih rentang jam kedatangan kurir ke lokasi Anda:
          </Text>

          <View style={styles.slotsColumn}>
            {PICKUP_TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedSlotId(slot.id)}
                  style={({ pressed }) => [
                    styles.slotCard,
                    isSelected && styles.slotCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.slotLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleActive,
                      ]}
                    >
                      {isSelected ? (
                        <View style={styles.radioInnerDot} />
                      ) : null}
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.slotName,
                          isSelected && styles.slotNameActive,
                        ]}
                      >
                        {slot.slotName} ({slot.hours})
                      </Text>
                      <Text style={styles.slotNote}>{slot.note}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 
          [MODUL 2 - useState]
          Komponen Pemilihan Opsi Detergen Khusus / Pewangi
        */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Droplets size={18} color={COLORS.brandBlue} />
            <Text style={styles.sectionTitle}>Opsi Detergen & Pewangi (useState)</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Pilih aroma dan formula perlindungan serat kain favorit Anda:
          </Text>

          <View style={styles.detergentGrid}>
            {DETERGENT_OPTIONS.map((opt) => {
              const isSelected = selectedDetergentId === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setSelectedDetergentId(opt.id)}
                  style={({ pressed }) => [
                    styles.detergentCard,
                    isSelected && styles.detergentCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.detergentHeader}>
                    <Text
                      style={[
                        styles.detergentName,
                        isSelected && styles.detergentNameActive,
                      ]}
                    >
                      {opt.name}
                    </Text>
                    {isSelected ? (
                      <Check size={16} color={COLORS.brandBlueDark} strokeWidth={2.5} />
                    ) : null}
                  </View>

                  <Text style={styles.detergentDesc}>{opt.description}</Text>

                  <View style={styles.detergentPriceBadge}>
                    <Text
                      style={[
                        styles.detergentPriceText,
                        isSelected && styles.detergentPriceTextActive,
                      ]}
                    >
                      {opt.extraPrice === 0
                        ? "Termasuk (Gratis)"
                        : `+${formatRupiah(opt.extraPrice)}`}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Catatan Tambahan */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catatan Tambahan (Opsional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={orderNotes}
            onChangeText={setOrderNotes}
            placeholder="Contoh: Pisahkan kemeja putih, hubungi jika tiba di depan pagar."
            placeholderTextColor={COLORS.textDisabled}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 
          [MODUL 2 - useEffect]
          Kotak Ringkasan Otomatis dari Hasil Hitung useEffect
        */}
        <View style={styles.calculationBox}>
          <View style={styles.calculationHeader}>
            <Sparkles size={16} color={COLORS.brandBlueDark} />
            <Text style={styles.calculationTitle}>
              Kalkulasi Otomatis (useEffect)
            </Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Subtotal Layanan:</Text>
            <Text style={styles.calculationVal}>
              {formatRupiah(subtotalService)}
            </Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Biaya Detergen Khusus:</Text>
            <Text style={styles.calculationVal}>
              {detergentFee === 0 ? "Gratis" : formatRupiah(detergentFee)}
            </Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Ongkos Kirim Kurir:</Text>
            <Text
              style={[
                styles.calculationVal,
                deliveryFee === 0 && styles.freeOngkir,
              ]}
            >
              {deliveryFee === 0 ? "Gratis (Promo)" : formatRupiah(deliveryFee)}
            </Text>
          </View>
          <View style={styles.calcDivider} />
          <View style={styles.calculationRow}>
            <Text style={styles.calculationTotalLabel}>Estimasi Total:</Text>
            <Text style={styles.calculationTotalVal}>
              {formatRupiah(totalEstimated)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 
        Bottom Action Bar:
        [MODUL 2 - push() & back()]
        Tombol untuk push() ke Ringkasan Pembayaran
      */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomTotalCaption}>Total Tagihan</Text>
          <Text style={styles.bottomTotalAmount}>
            {formatRupiah(totalEstimated)}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lanjut ke Ringkasan Pembayaran"
          onPress={handleProceedToSummary}
          style={({ pressed }) => [styles.continueTouch, pressed && styles.pressed]}
        >
          <View style={styles.continueSurface}>
            <Text style={styles.continueText}>Lanjut Bayar</Text>
            <ArrowRight size={18} color="#FFFFFF" />
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
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeTouchTarget: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonSurface: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: SPACING.base,
    gap: SPACING.base,
  },
  servicePreviewCard: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  servicePreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  serviceSubDetail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surfaceSecondary,
    marginTop: 8,
  },
  textInputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
  },
  datesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
  },
  dateChipActive: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  dateChipDay: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  dateChipDate: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  dateChipTextActive: {
    color: COLORS.brandBlueDark,
  },
  slotsColumn: {
    gap: 8,
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSecondary,
  },
  slotCardActive: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  slotLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.borderDefault,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfacePrimary,
  },
  radioCircleActive: {
    borderColor: COLORS.brandBlue,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brandBlue,
  },
  slotName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  slotNameActive: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  slotNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detergentGrid: {
    gap: 10,
  },
  detergentCard: {
    padding: 12,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSecondary,
  },
  detergentCardActive: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  detergentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detergentName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  detergentNameActive: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  detergentDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  detergentPriceBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  detergentPriceText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  detergentPriceTextActive: {
    color: COLORS.brandBlueDark,
  },
  calculationBox: {
    backgroundColor: COLORS.brandBlueSoft,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  calculationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  calculationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  calculationLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  calculationVal: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  freeOngkir: {
    color: COLORS.success,
    fontWeight: "700",
  },
  calcDivider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
    marginVertical: 8,
  },
  calculationTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  calculationTotalVal: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.brandBlueDark,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.surfacePrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
    ...SHADOWS.card,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomTotalCaption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomTotalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brandBlueDark,
    marginTop: 2,
  },
  continueTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  continueSurface: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: 20,
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});
