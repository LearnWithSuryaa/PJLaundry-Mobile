import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  Filter,
  MessageSquare,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Send,
  Star,
  X,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ServerHealthBadge from "../../components/common/ServerHealthBadge";
import OutletCard from "../../components/outlets/OutletCard";
import ReviewCard from "../../components/reviews/ReviewCard";
import {
  fetchCustomerReviews,
  fetchOutlets,
  getBackendHealth,
  postReview,
  validateOutletObject,
} from "../../services/outletReviewService";
import type { HealthData, Outlet, Review } from "../../types/api";
import { COLORS, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from "../../theme/tokens";

type ActiveTab = "outlets" | "reviews";

export default function OutletsAndReviewsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();

  // Tab State: otomatis ke "reviews" jika dipanggil dengan params tab=reviews
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    params.tab === "reviews" ? "reviews" : "outlets"
  );

  // Sync tab jika params berubah
  useEffect(() => {
    if (params.tab === "reviews") {
      setActiveTab("reviews");
      setIsFormVisible(true);
    }
  }, [params.tab]);

  // API Data States (Object dari response API menggunakan Interface)
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "all">("all");

  // Form Input Ulasan Baru (Selalu Terbuka agar Langsung Terlihat di iOS / Android)
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [newServiceName, setNewServiceName] = useState<string>("Cuci Komplit Reguler");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const availableServices = [
    "Cuci Komplit Reguler",
    "Express Kilat 6 Jam",
    "Cuci Bed Cover",
    "Dry Clean Jas & Gaun",
    "Shoes & Bag Spa",
  ];

  /**
   * [MODUL 3 - POST API CALL]
   * Mengirim ulasan pengalaman pelanggan ke server menggunakan:
   * 1. custom async function
   * 2. fetch() method POST
   * 3. .then() chaining
   * 4. .resolve() dan .reject() untuk validasi form & response
   */
  const handleSubmitReview = async () => {
    if (!newCustomerName.trim()) {
      Alert.alert("Nama Wajib Diisi", "Silakan masukkan nama Anda sebelum mengirim ulasan.");
      return;
    }
    if (!newComment.trim()) {
      Alert.alert("Pengalaman Wajib Diisi", "Silakan ceritakan pengalaman Anda mencuci di PJLaundry.");
      return;
    }

    setIsSubmittingReview(true);

    postReview({
      customer_name: newCustomerName.trim(),
      rating: newRating,
      comment: newComment.trim(),
      service_name: newServiceName,
    })
      .then((createdReview: Review) => {
        // Tambahkan review ke list state
        setReviews((prev) => [createdReview, ...prev]);
        setNewCustomerName("");
        setNewComment("");
        setNewRating(5);
        setIsFormVisible(false);
        Alert.alert(
          "Ulasan Terkirim!",
          "Terima kasih telah membagikan pengalaman Anda. Data telah berhasil dikirim ke server PJLaundry."
        );
      })
      .catch((err: Error) => {
        Alert.alert("Gagal Mengirim", err.message || "Terjadi kendala saat mengirim ke server.");
      })
      .finally(() => {
        setIsSubmittingReview(false);
      });
  };

  /**
   * 4. IMPLEMENTASI custom async function
   * Mengambil semua data secara asynchronous dari API backend
   * Menggunakan Promise.all untuk eksekusi paralel yang efisien
   */
  const loadAllData = async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage(null);

    try {
      // 5. IMPLEMENTASI .then() pada pemanggilan Promise
      getBackendHealth()
        .then((healthResult) => {
          setHealth(healthResult);
        })
        .catch((err) => {
          console.warn("Gagal mengecek kesehatan server:", err);
        });

      // Mengambil data outlet & ulasan secara paralel
      const [outletsData, reviewsData] = await Promise.all([
        fetchOutlets(),
        fetchCustomerReviews(),
      ]);

      // 6. Validasi setiap objek outlet menggunakan Promise resolve/reject
      const validatedOutlets: Outlet[] = [];
      for (const item of outletsData) {
        try {
          const valid = await validateOutletObject(item);
          validatedOutlets.push(valid);
        } catch (validationErr) {
          console.warn("Item outlet tidak lolos validasi:", validationErr);
        }
      }

      setOutlets(validatedOutlets);
      setReviews(reviewsData);
    } catch (error: any) {
      console.error("[loadAllData Error]:", error);
      setErrorMessage(
        error?.message || "Terjadi kendala saat menghubungi server PJLaundry."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter Outlets berdasarkan pencarian
  const filteredOutlets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return outlets;
    return outlets.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }, [outlets, searchQuery]);

  // Filter Reviews berdasarkan rating bintang
  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === "all") return reviews;
    return reviews.filter((r) => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  // Rata-rata rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cabang & Ulasan</Text>
          <Text style={styles.headerSubtitle}>PJLaundry Multi-Outlet</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Muat ulang data"
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
          onPress={() => loadAllData()}
        >
          <RefreshCw size={18} color={COLORS.brandBlueDark} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          activeTab === "reviews" && styles.scrollContentReviews,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAllData(true)}
            colors={[COLORS.brandBlue]}
            tintColor={COLORS.brandBlue}
          />
        }
      >
        {/* Backend Health Status Badge */}
        <ServerHealthBadge health={health} loading={loading} />

        {/* Tab Switcher: Outlets vs Reviews */}
        <View style={styles.tabContainer}>
          <Pressable
            accessibilityRole="tab"
            style={[styles.tabButton, activeTab === "outlets" && styles.tabButtonActive]}
            onPress={() => setActiveTab("outlets")}
          >
            <Building2
              size={16}
              color={activeTab === "outlets" ? COLORS.brandBlueDark : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "outlets" && styles.tabTextActive,
              ]}
            >
              Outlet ({outlets.length})
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            style={[styles.tabButton, activeTab === "reviews" && styles.tabButtonActive]}
            onPress={() => setActiveTab("reviews")}
          >
            <MessageSquare
              size={16}
              color={activeTab === "reviews" ? COLORS.brandBlueDark : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.tabTextActive,
              ]}
            >
              Ulasan ({reviews.length})
            </Text>
          </Pressable>
        </View>

        {/* Loading Indicator */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandBlue} />
            <Text style={styles.loadingText}>Memuat data dari server backend...</Text>
          </View>
        ) : null}

        {/* Error Message & Retry Button */}
        {errorMessage && !loading ? (
          <View style={styles.errorBox}>
            <View style={styles.errorHeaderRow}>
              <X size={18} color={COLORS.error} />
              <Text style={styles.errorTitle}>Gagal Mengambil Data dari Server</Text>
            </View>
            <Text style={styles.errorDescription}>{errorMessage}</Text>
            
            <View style={styles.errorActionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.retryButton}
                onPress={() => loadAllData()}
              >
                <RefreshCw size={14} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.fallbackButton}
                onPress={async () => {
                  const fallback = await import("../../services/outletReviewService").then(m => m.getFallbackOutlets());
                  setOutlets(fallback);
                  setErrorMessage(null);
                }}
              >
                <Text style={styles.fallbackButtonText}>Gunakan Data Cadangan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ================= TAB 1: OUTLETS ================= */}
        {!loading && activeTab === "outlets" ? (
          <View>
            {/* Banner Ajakan Menulis Ulasan */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Buka tab tulis ulasan pengalaman"
              onPress={() => {
                setActiveTab("reviews");
                setIsFormVisible(true);
              }}
              style={({ pressed }) => [
                styles.reviewPromoBanner,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.reviewPromoLeft}>
                <View style={styles.reviewPromoIcon}>
                  <PenLine size={18} color={COLORS.brandBlueDark} />
                </View>
                <View>
                  <Text style={styles.reviewPromoTitle}>Pernah Mencuci di PJLaundry?</Text>
                  <Text style={styles.reviewPromoSubtitle}>Tulis pengalaman Anda & bantu pelanggan lain →</Text>
                </View>
              </View>
              <ChevronRight size={18} color={COLORS.brandBlueDark} />
            </Pressable>

            {/* Search Outlet */}
            <View style={styles.searchBar}>
              <Search size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari outlet atau area terdekat..."
                placeholderTextColor={COLORS.textDisabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {filteredOutlets.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Building2 size={40} color={COLORS.textDisabled} />
                <Text style={styles.emptyTitle}>Outlet Tidak Ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                  Tidak ada cabang outlet yang cocok dengan pencarian "{searchQuery}"
                </Text>
              </View>
            ) : (
              filteredOutlets.map((outlet) => (
                <OutletCard key={outlet.id} outlet={outlet} />
              ))
            )}
          </View>
        ) : null}

        {/* ================= TAB 2: REVIEWS ================= */}
        {!loading && activeTab === "reviews" ? (
          <View>
            {/* Rating Summary Card (Hanya muncul jika ada ulasan) */}
            {reviews.length > 0 ? (
              <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.summaryScore}>{averageRating}</Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        color={COLORS.brandOrange}
                        fill={COLORS.brandOrange}
                      />
                    ))}
                  </View>
                  <Text style={styles.summarySubtext}>Kepuasan 98% Pelanggan</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRight}>
                  <Text style={styles.summaryTotal}>{reviews.length} Ulasan Terverifikasi</Text>
                  <Text style={styles.summaryNote}>
                    Semua ulasan asli dari pelanggan yang telah melakukan order di PJLaundry.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Tombol Buka Form Tulis Pengalaman (Jika ada ulasan dan form sedang ditutup) */}
            {reviews.length > 0 && !isFormVisible ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tulis ulasan pengalaman Anda"
                onPress={() => setIsFormVisible(true)}
                style={({ pressed }) => [
                  styles.openFormButton,
                  pressed && styles.pressed,
                ]}
              >
                <PenLine size={16} color={COLORS.brandBlueDark} />
                <Text style={styles.openFormButtonText}>+ Tulis Pengalaman Anda</Text>
              </Pressable>
            ) : null}

            {/* FORM INPUT ULASAN / PENGALAMAN (Muncul otomatis jika belum ada ulasan, atau saat tombol dibuka) */}
            {reviews.length === 0 || isFormVisible ? (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <View style={styles.formTitleRow}>
                    <PenLine size={18} color={COLORS.brandBlueDark} />
                    <Text style={styles.formTitle}>
                      {reviews.length === 0
                        ? "Belum Ada Ulasan. Tulis Pengalaman Anda!"
                        : "Tulis Pengalaman Anda"}
                    </Text>
                  </View>
                  {reviews.length > 0 ? (
                    <Pressable
                      onPress={() => setIsFormVisible(false)}
                      style={styles.closeFormButton}
                    >
                      <X size={18} color={COLORS.textSecondary} />
                    </Pressable>
                  ) : null}
                </View>

                <Text style={styles.formSubtitle}>
                  Bagikan pengalaman mencuci Anda di PJLaundry agar data ulasan masuk langsung ke server.
                </Text>

                {/* Input Nama */}
                <Text style={styles.inputLabel}>Nama Anda</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Contoh: Budi Santoso"
                  placeholderTextColor={COLORS.textDisabled}
                  value={newCustomerName}
                  onChangeText={setNewCustomerName}
                />

                {/* Pilihan Rating Bintang */}
                <Text style={styles.inputLabel}>Beri Rating</Text>
                <View style={styles.starPickerRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setNewRating(s)}
                      style={styles.starPickTarget}
                    >
                      <Star
                        size={28}
                        color={s <= newRating ? COLORS.brandOrange : COLORS.borderDefault}
                        fill={s <= newRating ? COLORS.brandOrange : "transparent"}
                      />
                    </Pressable>
                  ))}
                  <Text style={styles.ratingNumberLabel}>{newRating} dari 5 Bintang</Text>
                </View>

                {/* Pilihan Layanan yang Digunakan */}
                <Text style={styles.inputLabel}>Layanan yang Digunakan</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.serviceChipsScroll}
                  contentContainerStyle={styles.serviceChipsContent}
                >
                  {availableServices.map((svc) => {
                    const isSelected = newServiceName === svc;
                    return (
                      <Pressable
                        key={svc}
                        onPress={() => setNewServiceName(svc)}
                        style={[
                          styles.serviceChip,
                          isSelected && styles.serviceChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.serviceChipText,
                            isSelected && styles.serviceChipTextActive,
                          ]}
                        >
                          {svc}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Input Komentar / Pengalaman */}
                <Text style={styles.inputLabel}>Tulis Pengalaman Anda</Text>
                <TextInput
                  style={styles.textAreaField}
                  placeholder="Tulis pengalaman Anda mencuci di PJLaundry..."
                  placeholderTextColor={COLORS.textDisabled}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Tombol Simpan Ulasan di dalam Card Form */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Simpan dan kirim ulasan ke API server"
                  onPress={handleSubmitReview}
                  disabled={isSubmittingReview}
                  style={[styles.actionSubmitBtn, isSubmittingReview && styles.buttonDisabled]}
                >
                  {isSubmittingReview ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <CheckCircle size={18} color="#FFFFFF" />
                      <Text style={styles.actionSubmitBtnText}>Simpan & Kirim Ulasan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Filter Pills (Hanya jika ada ulasan) */}
            {reviews.length > 0 ? (
              <View style={styles.filterRow}>
                <Pressable
                  style={[
                    styles.filterPill,
                    selectedRatingFilter === "all" && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedRatingFilter("all")}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedRatingFilter === "all" && styles.filterPillTextActive,
                    ]}
                  >
                    Semua ({reviews.length})
                  </Text>
                </Pressable>

                {[5, 4, 3].map((starVal) => {
                  const count = reviews.filter((r) => r.rating === starVal).length;
                  const isActive = selectedRatingFilter === starVal;
                  return (
                    <Pressable
                      key={starVal}
                      style={[styles.filterPill, isActive && styles.filterPillActive]}
                      onPress={() => setSelectedRatingFilter(starVal)}
                    >
                      <Star
                        size={12}
                        color={isActive ? COLORS.brandOrange : COLORS.textSecondary}
                        fill={isActive ? COLORS.brandOrange : "transparent"}
                      />
                      <Text
                        style={[
                          styles.filterPillText,
                          isActive && styles.filterPillTextActive,
                        ]}
                      >
                        {starVal} Bintang ({count})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {/* Daftar Ulasan */}
            {reviews.length > 0 && filteredReviews.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MessageSquare size={40} color={COLORS.textDisabled} />
                <Text style={styles.emptyTitle}>Tidak Ada Ulasan</Text>
                <Text style={styles.emptySubtitle}>
                  Tidak ada ulasan dengan filter {selectedRatingFilter} bintang.
                </Text>
              </View>
            ) : (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* STICKY FOOTER: Tombol Simpan Selalu Terlihat di Bagian Bawah Layar iPhone/Android */}
      {!loading && activeTab === "reviews" ? (
        <View style={styles.stickyFooterBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Simpan dan kirim ulasan ke API server"
            onPress={handleSubmitReview}
            disabled={isSubmittingReview}
            style={[styles.actionSubmitBtn, isSubmittingReview && styles.buttonDisabled]}
          >
            {isSubmittingReview ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <CheckCircle size={18} color="#FFFFFF" />
                <Text style={styles.actionSubmitBtnText}>Simpan & Kirim Ulasan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfacePrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  headerButton: {
    width: TOUCH_TARGET.min,
    height: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.surfaceSecondary,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  scrollContentReviews: {
    paddingBottom: 110,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.button,
    padding: 4,
    marginBottom: SPACING.base,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: RADIUS.input,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: COLORS.surfacePrimary,
    ...SHADOWS.subtle,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  reviewPromoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.brandOrangeSoft,
    borderWidth: 1,
    borderColor: COLORS.brandOrange,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.base,
  },
  reviewPromoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  reviewPromoIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfacePrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewPromoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  reviewPromoSubtitle: {
    fontSize: 11,
    color: COLORS.textOnWarm,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.base,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    marginBottom: SPACING.base,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: SPACING.base,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    marginBottom: SPACING.base,
  },
  errorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  errorDescription: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2,
    lineHeight: 18,
  },
  errorActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  fallbackButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fallbackButtonText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    marginBottom: SPACING.md,
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  summaryLeft: {
    alignItems: "center",
    paddingRight: SPACING.base,
  },
  summaryScore: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  summarySubtext: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: "80%",
    backgroundColor: COLORS.borderDefault,
    marginRight: SPACING.base,
  },
  summaryRight: {
    flex: 1,
  },
  summaryTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  summaryNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfacePrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  filterPillActive: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlueSoft,
  },
  filterPillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  filterPillTextActive: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  openFormButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brandBlueSoft,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    marginBottom: SPACING.md,
    gap: 8,
  },
  openFormButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandBlueDark,
  },
  formContainer: {
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    marginBottom: SPACING.base,
    ...SHADOWS.card,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  closeFormButton: {
    padding: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  inputField: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.base,
    height: 44,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  starPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  starPickTarget: {
    padding: 2,
  },
  ratingNumberLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandOrange,
    marginLeft: 8,
  },
  serviceChipsScroll: {
    marginVertical: 4,
  },
  serviceChipsContent: {
    gap: 8,
  },
  serviceChip: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  serviceChipActive: {
    backgroundColor: COLORS.brandBlueSoft,
    borderColor: COLORS.brandBlue,
  },
  serviceChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  serviceChipTextActive: {
    color: COLORS.brandBlueDark,
    fontWeight: "700",
  },
  textAreaField: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    minHeight: 85,
  },
  actionSubmitBtn: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#0284C7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#0369A1",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 12,
  },
  actionSubmitBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  stickyFooterBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  stickySubmitButton: {
    marginTop: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});

