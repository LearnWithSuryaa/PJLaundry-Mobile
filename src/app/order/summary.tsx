import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DETERGENT_OPTIONS,
  formatRupiah,
  generateDemoOrderNumber,
  PICKUP_TIME_SLOTS,
  SERVICES,
} from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    serviceId?: string;
    quantity?: string;
    slotId?: string;
    detergentId?: string;
    dateId?: string;
    address?: string;
    notes?: string;
    subtotal?: string;
    deliveryFee?: string;
    detergentFee?: string;
    total?: string;
  }>();

  // Layanan terpilih
  const selectedService = useMemo(() => {
    return SERVICES.find((s) => s.id === params.serviceId) ?? SERVICES[0];
  }, [params.serviceId]);

  const quantity = parseInt(params.quantity || "1", 10);
  const baseSubtotal = parseInt(params.subtotal || "0", 10) || selectedService.price * quantity;
  const initialDeliveryFee = parseInt(params.deliveryFee || "0", 10);
  const initialDetergentFee = parseInt(params.detergentFee || "0", 10);

  const selectedSlot = useMemo(() => {
    return (
      PICKUP_TIME_SLOTS.find((s) => s.id === params.slotId) ??
      PICKUP_TIME_SLOTS[0]
    );
  }, [params.slotId]);

  const selectedDetergent = useMemo(() => {
    return (
      DETERGENT_OPTIONS.find((d) => d.id === params.detergentId) ??
      DETERGENT_OPTIONS[0]
    );
  }, [params.detergentId]);

  // [MODUL 2 - useState]
  //  Pilihan metode bayar 
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "tunai">("qris");

  // State untuk biaya administrasi dan total final setelah penyesuaian metode bayar
  const [adminFee, setAdminFee] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // ==========================================================================
  // [MODUL 2 - useEffect]
  // Otomatis hitung total harga + ongkir + biaya admin metode bayar secara dinamis
  // (misal QRIS bebas biaya admin Rp 0, sedangkan Tunai ada rounding/biaya verifikasi)
  // ==========================================================================
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Biaya admin: QRIS gratis (0), Tunai disiapkan tanpa biaya atau biaya verifikasi
      const calculatedAdminFee = paymentMethod === "qris" ? 0 : 0;
      const finalAmount =
        baseSubtotal + initialDeliveryFee + initialDetergentFee + calculatedAdminFee;

      setAdminFee(calculatedAdminFee);
      setGrandTotal(finalAmount);
    }, 0);

    return () => clearTimeout(timerId);
  }, [paymentMethod, baseSubtotal, initialDeliveryFee, initialDetergentFee]);

  // ==========================================================================
  // [MODUL 2 - push() & back()]
  // router.back() untuk kembali ke Form Jadwal Penjemputan
  // ==========================================================================
  const handleBackToForm = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/order");
    }
  };

  // ==========================================================================
  // [MODUL 2 - Fungsi Router Lain]
  // router.dismiss() untuk membatalkan seluruh flow order dan menutup modal
  // serta router.canGoBack() untuk validasi keamanan navigasi
  // ==========================================================================
  const handleDismissOrder = () => {
    Alert.alert(
      "Batalkan Pemesanan?",
      "Detail penjemputan yang telah diisi akan dibatalkan.",
      [
        { text: "Lanjutkan Isi Form", style: "cancel" },
        {
          text: "Ya, Batalkan",
          style: "destructive",
          onPress: () => {
            // [MODUL 2 - Fungsi Router Lain] Menutup modal checkout dan kembali ke katalog
            if (router.canGoBack()) {
              router.dismiss();
            } else {
              router.replace("/services");
            }
          },
        },
      ]
    );
  };

  // ==========================================================================
  // [MODUL 2 - push() & back()]
  // Navigasi router.push() dari Ringkasan Pembayaran -> Pemantauan Status Cuci
  // ==========================================================================
  const handleConfirmAndPay = () => {
    const orderNumber = generateDemoOrderNumber();

    // Navigasi ke halaman pelacakan cucian (tracking)
    router.push({
      pathname: "/order/tracking",
      params: {
        orderNumber,
        serviceName: selectedService.name,
        quantity: `${quantity} ${selectedService.unit}`,
        slotName: selectedSlot.slotName,
        slotHours: selectedSlot.hours,
        detergentName: selectedDetergent.name,
        address: params.address || "Alamat penjemputan",
        paymentMethod: paymentMethod === "qris" ? "QRIS Instan" : "Tunai saat Dijemput",
        grandTotal: grandTotal.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Header Ringkasan Pesanan */}
      <View style={styles.header}>
        {/* 
          [MODUL 2 - push() & back()] 
          Tombol router.back() untuk kembali ke layar Form Jadwal 
        */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke formulir jadwal"
          onPress={handleBackToForm}
          style={({ pressed }) => [styles.navTouch, pressed && styles.pressed]}
        >
          <View style={styles.iconCircle}>
            <ArrowLeft size={20} color={COLORS.textPrimary} />
          </View>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Ringkasan Pembayaran</Text>
          <Text style={styles.headerSubtitle}>Langkah 2 dari 2: Verifikasi & Bayar</Text>
        </View>

        {/* 
          [MODUL 2 - Fungsi Router Lain] 
          Tombol router.dismiss() untuk membatalkan pesanan
        */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Batalkan pesanan dan tutup checkout"
          onPress={handleDismissOrder}
          style={({ pressed }) => [styles.navTouch, pressed && styles.pressed]}
        >
          <View style={styles.iconCircle}>
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
      >
        {/* Card Rincian Layanan & Penjemputan */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Rincian Penjemputan</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Paket Layanan</Text>
            <Text style={styles.detailValueBold}>{selectedService.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Beban / Qty</Text>
            <Text style={styles.detailValue}>
              {quantity} {selectedService.unit}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelWithIcon}>
              <Clock size={14} color={COLORS.brandBlue} />
              <Text style={styles.detailLabel}>Slot Penjemputan</Text>
            </View>
            <Text style={styles.detailValue}>
              {selectedSlot.slotName} ({selectedSlot.hours})
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelWithIcon}>
              <Sparkles size={14} color={COLORS.brandBlue} />
              <Text style={styles.detailLabel}>Pewangi Pakaian</Text>
            </View>
            <Text style={styles.detailValue}>{selectedDetergent.name}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.addressBlock}>
            <View style={styles.labelWithIcon}>
              <MapPin size={14} color={COLORS.brandBlue} />
              <Text style={styles.detailLabel}>Alamat Antar-Jemput</Text>
            </View>
            <Text style={styles.addressText}>
              {params.address || "Jl. Melati No. 18, Kebayoran Baru"}
            </Text>
          </View>
        </View>

        {/* 
          [MODUL 2 - useState]
          Komponen Pilihan Metode Pembayaran (QRIS / Tunai)
        */}
        <View style={styles.card}>
          <View style={styles.methodHeader}>
            <CreditCard size={18} color={COLORS.brandBlue} />
            <Text style={styles.cardHeaderTitle}>Metode Bayar (useState)</Text>
          </View>
          <Text style={styles.methodSubtitle}>
            Pilih metode transaksi yang paling mudah bagi Anda:
          </Text>

          {/* Opsi QRIS */}
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: paymentMethod === "qris" }}
            onPress={() => setPaymentMethod("qris")}
            style={({ pressed }) => [
              styles.paymentOptionCard,
              paymentMethod === "qris" && styles.paymentOptionActive,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconBadge}>
                <QrCode size={22} color={COLORS.brandBlueDark} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>QRIS (GoPay, OVO, BCA, DANA)</Text>
                <Text style={styles.paymentCaption}>
                  Scan instan & otomatis terverifikasi
                </Text>
              </View>
            </View>
            {paymentMethod === "qris" ? (
              <CheckCircle2 size={20} color={COLORS.brandBlue} />
            ) : null}
          </Pressable>

          {/* Opsi Tunai (COD) */}
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: paymentMethod === "tunai" }}
            onPress={() => setPaymentMethod("tunai")}
            style={({ pressed }) => [
              styles.paymentOptionCard,
              paymentMethod === "tunai" && styles.paymentOptionActive,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconBadge}>
                <Banknote size={22} color={COLORS.brandBlueDark} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Tunai (Bayar saat Jemput)</Text>
                <Text style={styles.paymentCaption}>
                  Bayar langsung ke kurir saat timbang cucian
                </Text>
              </View>
            </View>
            {paymentMethod === "tunai" ? (
              <CheckCircle2 size={20} color={COLORS.brandBlue} />
            ) : null}
          </Pressable>
        </View>


        {/* 
          [MODUL 2 - useEffect]
          Rincian Perhitungan Tagihan Hasil Otomatis useEffect
        */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>
            Rincian Pembayaran (useEffect)
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal Cucian</Text>
            <Text style={styles.detailValue}>{formatRupiah(baseSubtotal)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Biaya Formula Pewangi</Text>
            <Text style={styles.detailValue}>
              {initialDetergentFee === 0
                ? "Gratis"
                : formatRupiah(initialDetergentFee)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ongkos Kirim Kurir</Text>
            <Text
              style={[
                styles.detailValue,
                initialDeliveryFee === 0 && styles.freeBadge,
              ]}
            >
              {initialDeliveryFee === 0
                ? "Gratis (Promo Radius)"
                : formatRupiah(initialDeliveryFee)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Biaya Layanan/Admin</Text>
            <Text style={styles.detailValue}>
              {adminFee === 0 ? "Gratis (Rp 0)" : formatRupiah(adminFee)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total yang Harus Dibayar</Text>
            <Text style={styles.totalValue}>{formatRupiah(grandTotal)}</Text>
          </View>
        </View>

        {/* Jaminan Keamanan Transaksi */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={20} color={COLORS.success} />
          <Text style={styles.guaranteeText}>
            Garansi cuci ulang gratis jika pakaian tidak wangi atau kurang bersih.
          </Text>
        </View>
      </ScrollView>

      {/* 
        Bottom Action:
        [MODUL 2 - push() & back()]
        Tombol untuk konfirmasi pesanan dan router.push() ke Tracking Cucian
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
            {formatRupiah(grandTotal)}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Konfirmasi dan bayar sekarang"
          onPress={handleConfirmAndPay}
          style={({ pressed }) => [styles.payTouch, pressed && styles.pressed]}
        >
          <View style={styles.paySurface}>
            <Text style={styles.payText}>Konfirmasi Pesanan</Text>
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
  headerCenter: {
    flex: 1,
    alignItems: "center",
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
  navTouch: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
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
  card: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  detailValueBold: {
    fontSize: 14,
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
    marginVertical: 10,
  },
  addressBlock: {
    gap: 6,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginTop: -6,
  },
  paymentOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSecondary,
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  paymentIconBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  paymentCaption: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  freeBadge: {
    color: COLORS.success,
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brandBlueDark,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.successSurface,
    padding: 12,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  guaranteeText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "600",
    flex: 1,
    lineHeight: 16,
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
  payTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  paySurface: {
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
  payText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});
