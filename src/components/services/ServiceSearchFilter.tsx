import { Clock, Search, ShieldCheck, X } from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { ServiceCategory } from "../../features/services/servicesData";
import { CATEGORIES, SERVICES } from "../../features/services/servicesData";
import { COLORS, RADIUS, SHADOWS, TOUCH_TARGET } from "../../theme/tokens";

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
      {/* Hero Context Banner with Brand Accent */}
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
            <ShieldCheck size={16} color={COLORS.brandBlue} />
            <Text style={styles.guaranteeText}>Garansi Bersih & Higienis</Text>
          </View>
          <View style={styles.guaranteeDot} />
          <View style={styles.guaranteeItem}>
            <Clock size={16} color={COLORS.brandOrange} />
            <Text style={styles.guaranteeText}>Antar Jemput Terjadwal</Text>
          </View>
        </View>
      </View>

      {/* Search Input Bar (Input Radius 12px, Min Height 48dp) */}
      <View style={styles.searchWrapper}>
        <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari layanan (misal: kemeja, kiloan, bedcover)..."
          placeholderTextColor={COLORS.textDisabled}
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
              <X size={14} color={COLORS.textSecondary} />
            </View>
          </Pressable>
        ) : null}
      </View>

      {/* Category Filter Chips with Brand Blue Active State */}
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
                  isActive
                    ? styles.categoryChipSurfaceActive
                    : styles.categoryChipSurfaceInactive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive
                      ? styles.categoryChipTextActive
                      : styles.categoryChipTextInactive,
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
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  heroTextGroup: {
    marginBottom: 14,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
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
    backgroundColor: COLORS.borderDefault,
  },
  guaranteeText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfacePrimary,
    borderRadius: RADIUS.input,
    marginTop: 16,
    paddingHorizontal: 14,
    minHeight: TOUCH_TARGET.min,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    ...SHADOWS.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 10,
  },
  clearButtonTouchTarget: {
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonSurface: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
  },
  categoryChipTouch: {
    minHeight: TOUCH_TARGET.min,
    justifyContent: "center",
  },
  categoryChipSurface: {
    minHeight: 38,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipSurfaceActive: {
    backgroundColor: COLORS.brandBlue,
    borderWidth: 1,
    borderColor: COLORS.brandBlue,
    shadowColor: COLORS.brandBlueDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryChipSurfaceInactive: {
    backgroundColor: COLORS.surfacePrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: COLORS.textOnAccent,
  },
  categoryChipTextInactive: {
    color: COLORS.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
});
