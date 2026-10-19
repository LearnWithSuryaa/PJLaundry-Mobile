import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Info,
  MapPin,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  LaundryService,
  PickupDateOption,
} from "../../features/services/servicesData";
import {
  formatRupiah,
  generateDemoOrderNumber,
  isSlotAvailable,
  PICKUP_TIME_SLOTS,
} from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, TOUCH_TARGET } from "../../theme/tokens";

type PickupScheduleModalProps = {
  visible: boolean;
  selectedService: LaundryService | null;
  quantity: number;
  estimatedTotal: number;
  pickupAddress: string;
  onAddressChange: (address: string) => void;
  pickupDates: PickupDateOption[];
  selectedDateId: string;
  onSelectDate: (id: string) => void;
  selectedSlotId: string;
  onSelectSlot: (id: string) => void;
  orderNotes: string;
  onNotesChange: (notes: string) => void;
  orderConfirmed: boolean;
  onConfirmOrder: (orderNumber: string) => void;
  onClose: () => void;
};

export default function PickupScheduleModal({
  visible,
  selectedService,
  quantity,
  estimatedTotal,
  pickupAddress,
  onAddressChange,
  pickupDates,
  selectedDateId,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  orderNotes,
  onNotesChange,
  orderConfirmed,
  onConfirmOrder,
  onClose,
}: PickupScheduleModalProps) {
  const insets = useSafeAreaInsets();

  // Internal state for validation, loading, and demo order id
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDemoOrderNumber, setCurrentDemoOrderNumber] = useState<string>("DEMO-PJL-20261018-8821");

  const selectedDate = useMemo(
    () => pickupDates.find((d) => d.id === selectedDateId) ?? pickupDates[0],
    [pickupDates, selectedDateId]
  );

  const selectedSlot = useMemo(
    () =>
      PICKUP_TIME_SLOTS.find((s) => s.id === selectedSlotId) ??
      PICKUP_TIME_SLOTS[0],
    [selectedSlotId]
  );

  const handleSelectDate = (dateId: string) => {
    onSelectDate(dateId);
    const isCurrentSlotValid = isSlotAvailable(selectedSlot, dateId);
    if (!isCurrentSlotValid) {
      const firstAvailable = PICKUP_TIME_SLOTS.find((s) =>
        isSlotAvailable(s, dateId)
      );
      if (firstAvailable) {
        onSelectSlot(firstAvailable.id);
      }
    }
  };

  const handleClose = () => {
    setAddressError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleAddressTextChange = (text: string) => {
    onAddressChange(text);
    if (addressError && text.trim().length >= 10) {
      setAddressError(null);
    }
  };

  const handleAttemptConfirm = () => {
    const trimmed = pickupAddress.trim();
    if (trimmed.length < 10) {
      setAddressError(
        "Alamat penjemputan wajib diisi lengkap (minimal 10 karakter jalan/nomor rumah)."
      );
      return;
    }

    const orderNumber = generateDemoOrderNumber();
    setCurrentDemoOrderNumber(orderNumber);
    setAddressError(null);
    setIsSubmitting(true);

    // Simulate 500ms network verification before updating to success state
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmOrder(orderNumber);
    }, 500);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable
          style={styles.modalOverlayDismiss}
          onPress={handleClose}
          accessibilityLabel="Tutup jendela pemesanan"
        />
        <View
          style={[
            styles.modalSheet,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.modalDragHandle} />

          {!orderConfirmed ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollBody}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header Title & Close */}
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalHeaderTitleGroup}>
                  <Text style={styles.modalTitle}>Ringkasan Pemesanan</Text>
                  <Text style={styles.modalSubtitle}>
                    Konfirmasi penjemputan cucian Anda
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tutup dialog"
                  onPress={handleClose}
                  style={({ pressed }) => [
                    styles.touchTarget,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.modalCloseButtonSurface}>
                    <X size={18} color={COLORS.textPrimary} />
                  </View>
                </Pressable>
              </View>

              {/* Service Summary Card with Price Breakdown */}
              {selectedService ? (
                <View style={styles.modalOrderSummaryCard}>
                  <View style={styles.modalServiceRow}>
                    <Text style={styles.modalServiceName}>
                      {selectedService.name}
                    </Text>
                    <Text style={styles.modalServicePrice}>
                      {formatRupiah(estimatedTotal)}
                    </Text>
                  </View>
                  <Text style={styles.modalServiceDetail}>
                    Beban: {quantity} {selectedService.unit} · Pengerjaan:{" "}
                    {selectedService.duration}
                  </Text>
                  <View style={styles.feeBreakdownRow}>
                    <Text style={styles.feeBreakdownLabel}>
                      Ongkir Antar-Jemput:
                    </Text>
                    <Text style={styles.feeBreakdownValue}>
                      Gratis (Radius Terdekat)
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Pickup Address Field with Validation */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <MapPin size={16} color={COLORS.brandBlue} />
                  <Text style={styles.formLabel}>Alamat Penjemputan *</Text>
                </View>
                <TextInput
                  style={[
                    styles.formTextInput,
                    addressError ? styles.formTextInputError : null,
                  ]}
                  value={pickupAddress}
                  onChangeText={handleAddressTextChange}
                  placeholder="Masukkan alamat lengkap rumah, kantor, atau nomor kamar"
                  placeholderTextColor={COLORS.textDisabled}
                />
                {addressError ? (
                  <View style={styles.errorRow}>
                    <AlertTriangle size={14} color={COLORS.error} />
                    <Text style={styles.errorText}>{addressError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Date Selection: Level 1 */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Calendar size={16} color={COLORS.brandBlue} />
                  <Text style={styles.formLabel}>
                    1. Pilih Tanggal Penjemputan
                  </Text>
                </View>
                <View style={styles.dateSelectorRow}>
                  {pickupDates.map((item) => {
                    const isDateActive = selectedDateId === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Pilih tanggal ${item.fullDescription}`}
                        accessibilityState={{ selected: isDateActive }}
                        onPress={() => handleSelectDate(item.id)}
                        style={({ pressed }) => [
                          styles.dateChipTouch,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.dateChipSurface,
                            isDateActive
                              ? styles.dateChipSurfaceActive
                              : styles.dateChipSurfaceInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dateChipDay,
                              isDateActive && styles.dateChipDayActive,
                            ]}
                          >
                            {item.dayLabel}
                          </Text>
                          <Text
                            style={[
                              styles.dateChipDate,
                              isDateActive && styles.dateChipDateActive,
                            ]}
                          >
                            {item.dateLabel}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Time Slot Selection: Level 2 with Availability Logic */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Clock size={16} color={COLORS.brandBlue} />
                  <Text style={styles.formLabel}>
                    2. Pilih Jam Kedatangan Kurir
                  </Text>
                </View>

                <View style={styles.timeSlotCardsContainer}>
                  {PICKUP_TIME_SLOTS.map((slot) => {
                    const isSlotActive = selectedSlotId === slot.id;
                    const available = isSlotAvailable(slot, selectedDateId);

                    return (
                      <Pressable
                        key={slot.id}
                        accessibilityRole="button"
                        accessibilityLabel={`${slot.slotName}, jam ${slot.hours}, status ${available ? "tersedia" : "penuh"}`}
                        accessibilityState={{
                          selected: isSlotActive,
                          disabled: !available,
                        }}
                        disabled={!available}
                        onPress={() => onSelectSlot(slot.id)}
                        style={({ pressed }) => [
                          styles.timeSlotTouchTarget,
                          !available && styles.timeSlotDisabled,
                          pressed && available && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.timeSlotCardSurface,
                            isSlotActive
                              ? styles.timeSlotCardSurfaceActive
                              : styles.timeSlotCardSurfaceInactive,
                            !available && styles.timeSlotSurfaceDisabled,
                          ]}
                        >
                          <View
                            style={[
                              styles.timeSlotIconCircle,
                              isSlotActive
                                ? styles.timeSlotIconCircleActive
                                : styles.timeSlotIconCircleInactive,
                            ]}
                          >
                            <Clock
                              size={18}
                              color={
                                isSlotActive
                                  ? COLORS.brandBlue
                                  : COLORS.textSecondary
                              }
                            />
                          </View>

                          <View style={styles.timeSlotDetails}>
                            <View style={styles.timeSlotHeaderRow}>
                              <Text
                                style={[
                                  styles.timeSlotTitle,
                                  isSlotActive && styles.timeSlotTitleActive,
                                  !available && styles.timeSlotTitleDisabled,
                                ]}
                              >
                                {slot.slotName}
                              </Text>
                              <View style={styles.slotBadgeRow}>
                                <Text style={styles.timeSlotHours}>
                                  {slot.hours}
                                </Text>
                                <View
                                  style={[
                                    styles.slotAvailabilityBadge,
                                    available
                                      ? styles.slotBadgeAvailable
                                      : styles.slotBadgeFull,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.slotBadgeText,
                                      available
                                        ? styles.slotBadgeTextAvailable
                                        : styles.slotBadgeTextFull,
                                    ]}
                                  >
                                    {available ? "Tersedia" : "Penuh"}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <Text style={styles.timeSlotNote}>{slot.note}</Text>
                          </View>

                          <View
                            style={[
                              styles.radioIndicator,
                              isSlotActive && styles.radioIndicatorSelected,
                              !available && styles.radioIndicatorDisabled,
                            ]}
                          >
                            {isSlotActive ? (
                              <View style={styles.radioIndicatorDot} />
                            ) : null}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Selected Schedule Live Summary Badge */}
              <View style={styles.scheduleBadgeContainer}>
                <Text style={styles.scheduleBadgeTitle}>Jadwal Terpilih:</Text>
                <Text style={styles.scheduleBadgeValue}>
                  {selectedDate.fullDescription} · {selectedSlot.slotName} (
                  {selectedSlot.hours})
                </Text>
              </View>

              {/* Notes Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Catatan Khusus Pakaian (Opsional)
                </Text>
                <TextInput
                  style={[styles.formTextInput, styles.formTextArea]}
                  value={orderNotes}
                  onChangeText={onNotesChange}
                  placeholder="Contoh: Pisahkan kemeja putih, hubungi jika tiba di depan pagar."
                  placeholderTextColor={COLORS.textDisabled}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Submit Button with Double-Submit Prevention */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Konfirmasi dan jadwalkan penjemputan sekarang"
                disabled={isSubmitting}
                onPress={handleAttemptConfirm}
                style={({ pressed }) => [
                  styles.confirmButtonTouch,
                  pressed && !isSubmitting && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.confirmButtonSurface,
                    isSubmitting && styles.confirmButtonSurfaceDisabled,
                  ]}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.confirmButtonText}>
                        Memverifikasi Jadwal...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.confirmButtonText}>
                      Jadwalkan Penjemputan Sekarang
                    </Text>
                  )}
                </View>
              </Pressable>
            </ScrollView>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Check size={36} color={COLORS.success} strokeWidth={3} />
              </View>
              <Text style={styles.successTitle}>
                Pesanan Berhasil Dijadwalkan!
              </Text>
              <Text style={styles.successDescription}>
                Kurir PJLaundry siap menjemput cucian Anda pada{" "}
                {selectedDate.fullDescription}, slot {selectedSlot.slotName} (
                {selectedSlot.hours}).
              </Text>

              {/* Demo Status & Order Number Badge */}
              <View style={styles.demoReferenceBox}>
                <View style={styles.demoStatusPill}>
                  <Text style={styles.demoStatusText}>
                    STATUS: SIMULASI DIKONFIRMASI
                  </Text>
                </View>
                <Text style={styles.demoOrderNumberText}>
                  No. Referensi: {currentDemoOrderNumber}
                </Text>
              </View>

              {/* Order Recap */}
              <View style={styles.successOrderSummary}>
                <Text style={styles.successSummaryRow}>
                  <Text style={styles.boldText}>Paket: </Text>
                  {selectedService?.name} ({quantity} {selectedService?.unit})
                </Text>
                <Text style={styles.successSummaryRow}>
                  <Text style={styles.boldText}>Subtotal: </Text>
                  {formatRupiah(estimatedTotal)}
                </Text>
                <Text style={styles.successSummaryRow}>
                  <Text style={styles.boldText}>Biaya Antar-Jemput: </Text>
                  Gratis (Promo Radius Terdekat)
                </Text>
                <Text style={styles.successSummaryRow}>
                  <Text style={styles.boldText}>Alamat: </Text>
                  {pickupAddress}
                </Text>
                {orderNotes.trim() ? (
                  <Text style={styles.successSummaryRow}>
                    <Text style={styles.boldText}>Catatan: </Text>
                    {orderNotes}
                  </Text>
                ) : null}
              </View>

              {/* Explicit Prototype Disclaimer Notice */}
              <View style={styles.prototypeNoticeCard}>
                <Info size={16} color={COLORS.warning} style={styles.noticeIcon} />
                <Text style={styles.prototypeNoticeText}>
                  Mode Simulasi Prototype: Ini adalah alur simulasi interaksi
                  antarmuka. Data tersimpan di memori lokal dan tidak memanggil
                  armada kurir operasional nyata.
                </Text>
              </View>

              <View style={styles.successButtonWrapper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tutup dialog dan kembali ke daftar layanan"
                  onPress={handleClose}
                  style={({ pressed }) => [
                    styles.fullWidthTouch,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.confirmButtonSurface}>
                    <Text style={styles.confirmButtonText}>
                      Kembali ke Katalog
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalOverlayDismiss: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: COLORS.surfacePrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "90%",
    ...SHADOWS.modal,
  },
  modalDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderDefault,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalScrollBody: {
    paddingBottom: 24,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalHeaderTitleGroup: {
    flex: 1,
    paddingRight: 10,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  touchTarget: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButtonSurface: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  modalOrderSummaryCard: {
    backgroundColor: COLORS.brandBlueSoft,
    borderRadius: RADIUS.input,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.brandBlueSoft,
  },
  modalServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalServiceName: {
    color: COLORS.brandBlueDark,
    fontSize: 15,
    fontWeight: "700",
  },
  modalServicePrice: {
    color: COLORS.brandBlueDark,
    fontSize: 16,
    fontWeight: "700",
  },
  modalServiceDetail: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  feeBreakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(57, 152, 229, 0.2)",
  },
  feeBreakdownLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  feeBreakdownValue: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "700",
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  formLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  formTextInput: {
    minHeight: TOUCH_TARGET.min,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  formTextInputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorSurface,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "500",
  },
  formTextArea: {
    minHeight: 76,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  dateSelectorRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateChipTouch: {
    flex: 1,
    minHeight: 52,
  },
  dateChipSurface: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.input,
    alignItems: "center",
    justifyContent: "center",
  },
  dateChipSurfaceActive: {
    backgroundColor: COLORS.brandBlue,
    borderWidth: 1.5,
    borderColor: COLORS.brandBlueDark,
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  dateChipSurfaceInactive: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
  },
  dateChipDay: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  dateChipDayActive: {
    color: COLORS.textOnAccent,
    fontWeight: "700",
  },
  dateChipDate: {
    fontSize: 11,
    marginTop: 2,
    color: COLORS.textSecondary,
  },
  dateChipDateActive: {
    color: COLORS.textOnAccent,
    fontWeight: "600",
  },
  timeSlotCardsContainer: {
    gap: 10,
  },
  timeSlotTouchTarget: {
    width: "100%",
    minHeight: TOUCH_TARGET.min,
  },
  timeSlotDisabled: {
    opacity: 0.5,
  },
  timeSlotCardSurface: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: RADIUS.input,
    gap: 12,
  },
  timeSlotCardSurfaceActive: {
    backgroundColor: COLORS.surfacePrimary,
    borderWidth: 1.5,
    borderColor: COLORS.brandBlue,
    elevation: 2,
  },
  timeSlotCardSurfaceInactive: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
  },
  timeSlotSurfaceDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
    borderColor: COLORS.borderDefault,
  },
  timeSlotIconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.input,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  timeSlotIconCircleActive: {
    backgroundColor: COLORS.brandBlueSoft,
  },
  timeSlotIconCircleInactive: {
    backgroundColor: COLORS.surfacePrimary,
  },
  timeSlotDetails: {
    flex: 1,
  },
  timeSlotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  timeSlotTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  timeSlotTitleActive: {
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  timeSlotTitleDisabled: {
    color: COLORS.textDisabled,
  },
  slotBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeSlotHours: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  slotAvailabilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  slotBadgeAvailable: {
    backgroundColor: COLORS.successSurface,
  },
  slotBadgeFull: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  slotBadgeTextAvailable: {
    color: COLORS.success,
  },
  slotBadgeTextFull: {
    color: COLORS.textDisabled,
  },
  timeSlotNote: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  radioIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.borderDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  radioIndicatorSelected: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlue,
  },
  radioIndicatorDisabled: {
    borderColor: COLORS.borderDefault,
  },
  radioIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfacePrimary,
  },
  scheduleBadgeContainer: {
    backgroundColor: COLORS.brandOrangeSoft,
    borderRadius: RADIUS.input,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.brandOrange,
  },
  scheduleBadgeTitle: {
    color: COLORS.textOnWarm,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scheduleBadgeValue: {
    color: COLORS.textOnWarm,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  confirmButtonTouch: {
    width: "100%",
    minHeight: TOUCH_TARGET.min,
    marginTop: 8,
  },
  fullWidthTouch: {
    width: "100%",
    minHeight: TOUCH_TARGET.min,
  },
  successButtonWrapper: {
    alignSelf: "stretch",
    marginTop: 12,
  },
  confirmButtonSurface: {
    width: "100%",
    minHeight: 52,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonSurfaceDisabled: {
    backgroundColor: COLORS.brandBlueDark,
    opacity: 0.8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButtonText: {
    color: COLORS.textOnAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.successSurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  successDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 8,
  },
  demoReferenceBox: {
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  demoStatusPill: {
    backgroundColor: COLORS.brandBlueSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  demoStatusText: {
    color: COLORS.brandBlueDark,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  demoOrderNumberText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  successOrderSummary: {
    width: "100%",
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.input,
    padding: 14,
    marginTop: 14,
    marginBottom: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  successSummaryRow: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
  },
  prototypeNoticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.warningSurface,
    borderRadius: RADIUS.input,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(168, 100, 8, 0.2)",
    marginBottom: 8,
  },
  noticeIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  prototypeNoticeText: {
    flex: 1,
    color: COLORS.textOnWarm,
    fontSize: 11,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.85,
  },
});
