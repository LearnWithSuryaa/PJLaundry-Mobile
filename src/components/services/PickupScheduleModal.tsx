import { Calendar, Check, Clock, MapPin, X } from "lucide-react-native";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";
import type {
  LaundryService,
  PickupDateOption,
} from "../../features/services/servicesData";
import {
  formatRupiah,
  PICKUP_TIME_SLOTS,
} from "../../features/services/servicesData";

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
  onConfirmOrder: () => void;
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

  const selectedDate =
    pickupDates.find((d) => d.id === selectedDateId) ?? pickupDates[0];
  const selectedSlot =
    PICKUP_TIME_SLOTS.find((s) => s.id === selectedSlotId) ??
    PICKUP_TIME_SLOTS[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable
          style={styles.modalOverlayDismiss}
          onPress={onClose}
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
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.touchTarget44,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.modalCloseButtonSurface}>
                    <X size={20} color={ONBOARDING_COLORS.text} />
                  </View>
                </Pressable>
              </View>

              {/* Service Summary Card */}
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
                    Jumlah: {quantity} {selectedService.unit} · Pengerjaan:{" "}
                    {selectedService.duration}
                  </Text>
                </View>
              ) : null}

              {/* Pickup Address Field */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <MapPin size={16} color={ONBOARDING_COLORS.text} />
                  <Text style={styles.formLabel}>Alamat Penjemputan</Text>
                </View>
                <TextInput
                  style={styles.formTextInput}
                  value={pickupAddress}
                  onChangeText={onAddressChange}
                  placeholder="Masukkan alamat lengkap rumah atau kantor"
                  placeholderTextColor="#888888"
                />
              </View>

              {/* Date Selection: Level 1 */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Calendar size={16} color={ONBOARDING_COLORS.text} />
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
                        onPress={() => onSelectDate(item.id)}
                        style={({ pressed }) => [
                          styles.dateChipTouch,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.dateChipSurface,
                            isDateActive && styles.dateChipSurfaceActive,
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

              {/* Time Slot Selection: Level 2 */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Clock size={16} color={ONBOARDING_COLORS.text} />
                  <Text style={styles.formLabel}>
                    2. Pilih Jam Kedatangan Kurir
                  </Text>
                </View>

                <View style={styles.timeSlotCardsContainer}>
                  {PICKUP_TIME_SLOTS.map((slot) => {
                    const isSlotActive = selectedSlotId === slot.id;
                    return (
                      <Pressable
                        key={slot.id}
                        accessibilityRole="button"
                        accessibilityLabel={`${slot.slotName}, jam ${slot.hours}, ${slot.note}`}
                        accessibilityState={{ selected: isSlotActive }}
                        onPress={() => onSelectSlot(slot.id)}
                        style={({ pressed }) => [
                          styles.timeSlotTouchTarget,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.timeSlotCardSurface,
                            isSlotActive && styles.timeSlotCardSurfaceActive,
                          ]}
                        >
                          <View
                            style={[
                              styles.timeSlotIconCircle,
                              isSlotActive && styles.timeSlotIconCircleActive,
                            ]}
                          >
                            <Clock
                              size={18}
                              color={
                                isSlotActive
                                  ? ONBOARDING_COLORS.text
                                  : "#666666"
                              }
                            />
                          </View>

                          <View style={styles.timeSlotDetails}>
                            <View style={styles.timeSlotHeaderRow}>
                              <Text
                                style={[
                                  styles.timeSlotTitle,
                                  isSlotActive && styles.timeSlotTitleActive,
                                ]}
                              >
                                {slot.slotName}
                              </Text>
                              <Text style={styles.timeSlotHours}>
                                {slot.hours}
                              </Text>
                            </View>
                            <Text style={styles.timeSlotNote}>{slot.note}</Text>
                          </View>

                          <View
                            style={[
                              styles.radioIndicator,
                              isSlotActive && styles.radioIndicatorSelected,
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
                  placeholder="Contoh: Pisahkan pakaian putih, hubungi saat tiba di depan pagar."
                  placeholderTextColor="#888888"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Submit Button */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Konfirmasi dan jadwalkan penjemputan sekarang"
                onPress={onConfirmOrder}
                style={({ pressed }) => [
                  styles.confirmButtonTouch,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.confirmButtonSurface}>
                  <Text style={styles.confirmButtonText}>
                    Jadwalkan Penjemputan Sekarang
                  </Text>
                </View>
              </Pressable>
            </ScrollView>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Check size={36} color="#2e7d32" strokeWidth={3} />
              </View>
              <Text style={styles.successTitle}>
                Pesanan Berhasil Dijadwalkan!
              </Text>
              <Text style={styles.successDescription}>
                Kurir PJLaundry akan menjemput cucian Anda pada{" "}
                {selectedDate.fullDescription}, slot {selectedSlot.slotName} (
                {selectedSlot.hours}).
              </Text>

              <View style={styles.successOrderSummary}>
                <Text style={styles.successSummaryRow}>
                  Paket: {selectedService?.name}
                </Text>
                <Text style={styles.successSummaryRow}>
                  Estimasi Muatan: {quantity} {selectedService?.unit}
                </Text>
                <Text style={styles.successSummaryRow}>
                  Total Estimasi: {formatRupiah(estimatedTotal)}
                </Text>
                <Text style={styles.successSummaryRow}>
                  Alamat: {pickupAddress}
                </Text>
                {orderNotes.trim() ? (
                  <Text style={styles.successSummaryRow}>
                    Catatan: {orderNotes}
                  </Text>
                ) : null}
              </View>

              <View style={styles.successButtonWrapper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tutup dialog dan kembali ke daftar layanan"
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.fullWidthTouch,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.confirmButtonSurface}>
                    <Text style={styles.confirmButtonText}>Kembali ke Katalog</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayDismiss: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: ONBOARDING_COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "90%",
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cccccc",
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
    color: ONBOARDING_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: "#666666",
    fontSize: 13,
    marginTop: 2,
  },
  touchTarget44: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButtonSurface: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ONBOARDING_COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
  },
  modalOrderSummaryCard: {
    backgroundColor: ONBOARDING_COLORS.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
  },
  modalServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalServiceName: {
    color: ONBOARDING_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  modalServicePrice: {
    color: ONBOARDING_COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  modalServiceDetail: {
    color: "#555555",
    fontSize: 12,
    marginTop: 6,
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
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  formTextInput: {
    minHeight: 48,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: ONBOARDING_COLORS.text,
  },
  formTextArea: {
    minHeight: 74,
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
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  dateChipSurfaceActive: {
    backgroundColor: ONBOARDING_COLORS.peach,
    borderColor: ONBOARDING_COLORS.text,
    elevation: 2,
  },
  dateChipDay: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  dateChipDayActive: {
    fontWeight: "700",
  },
  dateChipDate: {
    color: "#666666",
    fontSize: 11,
    marginTop: 2,
  },
  dateChipDateActive: {
    color: ONBOARDING_COLORS.text,
    fontWeight: "600",
  },
  timeSlotCardsContainer: {
    gap: 10,
  },
  timeSlotTouchTarget: {
    width: "100%",
    minHeight: 56,
  },
  timeSlotCardSurface: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fbfbfb",
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    gap: 12,
  },
  timeSlotCardSurfaceActive: {
    backgroundColor: "#ffffff",
    borderColor: ONBOARDING_COLORS.blue,
    elevation: 2,
  },
  timeSlotIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  timeSlotIconCircleActive: {
    backgroundColor: ONBOARDING_COLORS.lightBlue,
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
    color: ONBOARDING_COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  timeSlotTitleActive: {
    fontWeight: "700",
  },
  timeSlotHours: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  timeSlotNote: {
    color: "#666666",
    fontSize: 11,
    marginTop: 2,
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
  scheduleBadgeContainer: {
    backgroundColor: ONBOARDING_COLORS.peach,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
  },
  scheduleBadgeTitle: {
    color: ONBOARDING_COLORS.text,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scheduleBadgeValue: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  confirmButtonTouch: {
    width: "100%",
    minHeight: 52,
    marginTop: 8,
  },
  fullWidthTouch: {
    width: "100%",
    minHeight: 52,
  },
  successButtonWrapper: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  confirmButtonSurface: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: ONBOARDING_COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 3,
  },
  confirmButtonText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    color: ONBOARDING_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  successDescription: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  successOrderSummary: {
    width: "100%",
    backgroundColor: ONBOARDING_COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginVertical: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
  },
  successSummaryRow: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.82,
  },
});
