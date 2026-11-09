import { Stack, useRouter } from "expo-router";
import { Building2, ChevronRight, MapPin, PenLine } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import PickupScheduleModal from "../../components/services/PickupScheduleModal";
import ServiceBottomBar from "../../components/services/ServiceBottomBar";
import ServiceCard from "../../components/services/ServiceCard";
import ServiceHeader from "../../components/services/ServiceHeader";
import ServiceSearchFilter from "../../components/services/ServiceSearchFilter";
import type {
  LaundryService,
  ServiceCategory,
} from "../../features/services/servicesData";
import {
  getUpcomingPickupDates,
} from "../../features/services/servicesData";
import {
  getPromos,
  getServices,
  type LaundryPromo,
} from "../../features/services/servicesApi";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

export default function ServicesCatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  // 1. useState: Filter kategori, Search query, Counter jumlah/berat cucian
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    "kiloan-komplit"
  );
  const [quantity, setQuantity] = useState<number>(3);
  const [services, setServices] = useState<LaundryService[]>([]);
  const [promos, setPromos] = useState<LaundryPromo[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Modal & Booking State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(
    "Jl. Melati No. 18, Kebayoran Baru"
  );
  const [selectedDateId, setSelectedDateId] = useState<string>("today");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("pagi");
  const [orderNotes, setOrderNotes] = useState("");

  const loadCatalog = useCallback(() => {
    setIsLoadingCatalog(true);
    setCatalogError(null);

    Promise.all([getServices(), getPromos()])
      .then(([serviceData, promoData]) => {
        setServices(serviceData);
        setPromos(promoData.filter((promo) => promo.is_active));
        setSelectedServiceId((currentId) =>
          serviceData.some((service) => service.id === currentId)
            ? currentId
            : (serviceData[0]?.id ?? null),
        );
      })
      .catch((error: unknown) => {
        setCatalogError(
          error instanceof Error
            ? error.message
            : "Katalog layanan tidak dapat dimuat.",
        );
      })
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadCatalog, 0);
    return () => clearTimeout(timer);
  }, [loadCatalog]);

  // 2. useEffect: Log riwayat pencarian otomatis saat kata kunci berubah
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      console.log(`[Riwayat Pencarian]: "${searchQuery.trim()}"`);
    }
  }, [searchQuery]);

  const pickupDates = useMemo(() => getUpcomingPickupDates(), []);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchCategory =
        selectedCategoryId === "all" || service.category === selectedCategoryId;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === "" ||
        service.name.toLowerCase().includes(query) ||
        service.tagline.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [selectedCategoryId, searchQuery, services]);

  const handleSelectService = (service: LaundryService) => {
    if (selectedServiceId === service.id) return;
    setSelectedServiceId(service.id);
    setQuantity(service.minOrder);
  };

  // 3. push(): router.push("/services/[id]") dari daftar ke detail paket
  const handleViewDetail = (service: LaundryService) => {
    router.push({
      pathname: "/services/[id]",
      params: { id: service.id },
    } as any);
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
      <StatusBar style="dark" />

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
          {promos.length > 0 ? (
            <View style={styles.promoSection}>
              <Text style={styles.promoHeading}>Promo yang tersedia</Text>
              {promos.map((promo) => (
                <View key={promo.id} style={styles.promoCard}>
                  <Text style={styles.promoCode}>{promo.code}</Text>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDescription}>
                    {promo.description}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Banner Menuju Fitur Outlet & Review (Modul 3 - Anggota 2) */}
          <View style={styles.outletBannerCard}>
            <View style={styles.outletBannerLeft}>
              <View style={styles.outletIconCircle}>
                <Building2 size={20} color={COLORS.brandBlueDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.outletBannerTitle}>Cabang Outlet & Ulasan</Text>
                <Text style={styles.outletBannerSubtitle}>Cek cabang terdekat & bagikan pengalaman Anda</Text>
              </View>
            </View>

            {/* Quick Actions: Cabang & Tulis Ulasan */}
            <View style={styles.outletBannerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Lihat daftar cabang outlet"
                onPress={() => router.push("/outlets" as any)}
                style={({ pressed }) => [
                  styles.outletActionBtn,
                  styles.outletBtnOutline,
                  pressed && styles.pressed,
                ]}
              >
                <MapPin size={14} color={COLORS.brandBlueDark} />
                <Text style={styles.outletBtnOutlineText}>Lihat Cabang</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tulis ulasan pengalaman pelanggan"
                onPress={() =>
                  router.push({
                    pathname: "/outlets",
                    params: { tab: "reviews" },
                  } as any)
                }
                style={({ pressed }) => [
                  styles.outletActionBtn,
                  styles.outletBtnPrimary,
                  pressed && styles.pressed,
                ]}
              >
                <PenLine size={14} color={COLORS.textOnAccent} />
                <Text style={styles.outletBtnPrimaryText}>Tulis Ulasan</Text>
              </Pressable>
            </View>
          </View>

          {isLoadingCatalog ? (
            <View style={styles.statusState}>
              <Text style={styles.statusTitle}>Memuat katalog layanan...</Text>
              <Text style={styles.statusSubtitle}>
                Data layanan dan promo sedang diambil dari server.
              </Text>
            </View>
          ) : catalogError ? (
            <View style={styles.statusState}>
              <Text style={styles.statusTitle}>Katalog belum tersedia</Text>
              <Text style={styles.statusSubtitle}>{catalogError}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Coba muat ulang katalog layanan"
                onPress={loadCatalog}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ServiceSearchFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              <View style={styles.servicesList}>
                {filteredServices.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                      Layanan Tidak Ditemukan
                    </Text>
                    <Text style={styles.emptySubtitle}>
                      Tidak ada paket cucian yang cocok dengan kata kunci
                      &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain
                      atau reset filter.
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
                        <Text style={styles.resetButtonText}>
                          Tampilkan Semua
                        </Text>
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
                      onViewDetail={handleViewDetail}
                    />
                  ))
                )}
              </View>
            </>
          )}
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
  promoSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  promoHeading: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  promoCard: {
    backgroundColor: COLORS.brandOrangeSoft,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.brandOrange,
    padding: SPACING.base,
  },
  promoCode: {
    color: COLORS.textOnWarm,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  promoTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: SPACING.xs,
  },
  promoDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: SPACING.xs,
  },
  statusState: {
    alignItems: "center",
    backgroundColor: COLORS.surfacePrimary,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    marginTop: SPACING.base,
    padding: SPACING.xl,
  },
  statusTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  statusSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  retryButton: {
    alignItems: "center",
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.button,
    justifyContent: "center",
    marginTop: SPACING.base,
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: SPACING.xl,
  },
  retryButtonText: {
    color: COLORS.textOnAccent,
    fontSize: 14,
    fontWeight: "700",
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
  outletBannerCard: {
    backgroundColor: COLORS.brandBlueSoft,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "#CCE4F9",
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    gap: 12,
  },
  outletBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  outletIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  outletBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  outletBannerSubtitle: {
    fontSize: 11,
    color: COLORS.brandBlueDark,
    marginTop: 1,
  },
  outletBannerActions: {
    flexDirection: "row",
    gap: 8,
  },
  outletActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    gap: 6,
    minHeight: 40,
  },
  outletBtnOutline: {
    backgroundColor: COLORS.surfacePrimary,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
  },
  outletBtnOutlineText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  outletBtnPrimary: {
    backgroundColor: COLORS.brandBlue,
  },
  outletBtnPrimaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textOnAccent,
  },
  pressed: {
    opacity: 0.8,
  },
});
