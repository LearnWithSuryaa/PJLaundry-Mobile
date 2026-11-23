import { Building2, WashingMachine } from "lucide-react-native";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, RADIUS, TOUCH_TARGET } from "../../theme/tokens";

const ITEMS = [
  { route: "/services", label: "Layanan", icon: WashingMachine },
  { route: "/outlets", label: "Outlet", icon: Building2 },
] as const;

export default function MainBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {ITEMS.map(({ route, label, icon: Icon }) => {
        const isActive =
          route === "/services"
            ? pathname.startsWith("/services")
            : pathname.startsWith("/outlets");

        return (
          <Pressable
            key={route}
            accessibilityRole="tab"
            accessibilityLabel={`Buka ${label}`}
            accessibilityState={{ selected: isActive }}
            onPress={() => router.replace(route)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <Icon
              size={20}
              color={isActive ? COLORS.brandBlueDark : COLORS.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.surfacePrimary,
    borderTopColor: COLORS.borderDefault,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  item: {
    minWidth: 100,
    minHeight: TOUCH_TARGET.min,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.input,
    gap: 3,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  activeLabel: {
    color: COLORS.brandBlueDark,
  },
  pressed: {
    opacity: 0.7,
  },
});
