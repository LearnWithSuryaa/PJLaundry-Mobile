import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import PickupScheduleModal from "../components/services/PickupScheduleModal";
import ServiceBottomBar from "../components/services/ServiceBottomBar";
import ServiceCard from "../components/services/ServiceCard";
import ServiceHeader from "../components/services/ServiceHeader";
import ServiceSearchFilter from "../components/services/ServiceSearchFilter";
import type {
  LaundryService,
  ServiceCategory,
} from "../features/services/servicesData";
import {
  getUpcomingPickupDates,
  SERVICES,
} from "../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../theme/tokens";

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  // Filter & Search State
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Service Selection State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    "kiloan-komplit"
  );
  const [quantity, setQuantity] = useState<number>(3);

  // Modal & Booking State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(
    "Jl. Melati No. 18, Kebayoran Baru"
  );
  const [selectedDateId, setSelectedDateId] = useState<string>("today");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("pagi");
  const [orderNotes, setOrderNotes] = useState("");

  const pickupDates = useMemo(() => getUpcomingPickupDates(), []);

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) ?? null,
    [selectedServiceId]
  );

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchCategory =
        selectedCategoryId === "all" || service.category === selectedCategoryId;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === "" ||
        service.name.toLowerCase().includes(query) ||
        service.tagline.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [selectedCategoryId, searchQuery]);

  const handleSelectService = (service: LaundryService) => {
    if (selectedServiceId === service.id) return;
    setSelectedServiceId(service.id);
    setQuantity(service.minOrder);
  };

  const handleDecreaseQuantity = () => {
    if (!selectedService) return;
    setQuantity((prev) => Math.max(selectedService.minOrder, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (!selectedService) return;
    setQuantity((prev) => Math.min(selectedService.maxOrder, prev + 1));
  };

  const estimatedTotal = selectedService
    ? selectedService.price * quantity
    : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.surfacePrimary}
      />

      <View style={styles.container}>
        <ServiceHeader />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: selectedService ? 130 + insets.bottom : 32 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ServiceSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          <View style={styles.servicesList}>
            {filteredServices.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Layanan Tidak Ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                  Tidak ada paket cucian yang cocok dengan kata kunci &quot;
                  {searchQuery}&quot;. Coba gunakan kata kunci lain atau reset
                  filter.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reset pencarian dan kategori"
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedCategoryId("all");
                  }}
                  style={({ pressed }) => [
                    styles.resetButtonTouch,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.resetButtonSurface}>
                    <Text style={styles.resetButtonText}>Tampilkan Semua</Text>
                  </View>
                </Pressable>
              </View>
            ) : (
              filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServiceId === service.id}
                  quantity={quantity}
                  isNarrow={isNarrow}
                  onSelect={handleSelectService}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  onIncreaseQuantity={handleIncreaseQuantity}
                />
              ))
            )}
          </View>
        </ScrollView>

        {selectedService ? (
          <ServiceBottomBar
            selectedService={selectedService}
            quantity={quantity}
            estimatedTotal={estimatedTotal}
            onOpenOrderModal={() => {
              setOrderConfirmed(false);
              setIsModalVisible(true);
            }}
          />
        ) : null}
      </View>

      <PickupScheduleModal
        visible={isModalVisible}
        selectedService={selectedService}
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
    paddingTop: 18,
  },
  servicesList: {
    gap: SPACING.md,
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  resetButtonTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  resetButtonSurface: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: 20,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.brandBlueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.brandBlueSoft,
  },
  resetButtonText: {
    color: COLORS.brandBlueDark,
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});
