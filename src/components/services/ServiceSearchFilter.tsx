import { Clock, Search, ShieldCheck, X } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ONBOARDING_COLORS } from "../../features/onboarding/onboardingData";
import type { ServiceCategory } from "../../features/services/servicesData";
import { CATEGORIES, SERVICES } from "../../features/services/servicesData";

type ServiceSearchFilterProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategoryId: ServiceCategory;
  onSelectCategory: (categoryId: ServiceCategory) => void;
};

export default function ServiceSearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
}: ServiceSearchFilterProps) {
  return (
    <View style={styles.container}>
      {/* Hero Context Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTextGroup}>
          <Text style={styles.heroTitle}>Pilihan Perawatan Cucian</Text>
          <Text style={styles.heroDescription}>
            Pilih paket sesuai jenis kain, tentukan estimasi beban, dan kurir kami
            siap menjemput langsung ke alamatmu.
          </Text>
        </View>
        <View style={styles.guaranteeRow}>
          <View style={styles.guaranteeItem}>
            <ShieldCheck size={16} color={ONBOARDING_COLORS.text} />
            <Text style={styles.guaranteeText}>Garansi Bersih</Text>
          </View>
          <View style={styles.guaranteeDot} />
          <View style={styles.guaranteeItem}>
            <Clock size={16} color={ONBOARDING_COLORS.text} />
            <Text style={styles.guaranteeText}>Tepat Waktu</Text>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <Search size={18} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari layanan (misal: kemeja, kiloan, sepatu)..."
          placeholderTextColor="#777777"
          value={searchQuery}
          onChangeText={onSearchChange}
          accessibilityLabel="Cari paket layanan laundry"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hapus pencarian"
            onPress={() => onSearchChange("")}
            style={({ pressed }) => [
              styles.clearButtonTouchTarget,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.clearButtonSurface}>
              <X size={16} color="#666666" />
            </View>
          </Pressable>
        ) : null}
      </View>

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          const count =
            cat.id === "all"
              ? SERVICES.length
              : SERVICES.filter((s) => s.category === cat.id).length;

          return (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={`Kategori ${cat.label}, berisi ${count} layanan`}
              accessibilityState={{ selected: isActive }}
              onPress={() => onSelectCategory(cat.id)}
              style={({ pressed }) => [
                styles.categoryChipTouch,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.categoryChipSurface,
                  isActive && styles.categoryChipSurfaceActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label} ({count})
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  heroCard: {
    backgroundColor: ONBOARDING_COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.06)",
    elevation: 2,
  },
  heroTextGroup: {
    marginBottom: 14,
  },
  heroTitle: {
    color: ONBOARDING_COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  heroDescription: {
    color: "#4a4a4a",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(51, 51, 51, 0.08)",
    gap: 10,
  },
  guaranteeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  guaranteeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#888888",
  },
  guaranteeText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_COLORS.surface,
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 12,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: ONBOARDING_COLORS.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  clearButtonTouchTarget: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonSurface: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
  },
  categoryChipTouch: {
    minHeight: 44,
    justifyContent: "center",
  },
  categoryChipSurface: {
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ONBOARDING_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.12)",
    elevation: 1,
  },
  categoryChipSurfaceActive: {
    backgroundColor: ONBOARDING_COLORS.text,
    borderColor: ONBOARDING_COLORS.text,
  },
  categoryChipText: {
    color: ONBOARDING_COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  pressed: {
    opacity: 0.82,
  },
});
