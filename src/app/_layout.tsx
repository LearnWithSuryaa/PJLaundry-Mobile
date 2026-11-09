import { Stack } from "expo-router";

import "../global.css";
import { COLORS } from "../theme/tokens";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="services/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="services/[id]"
        options={{
          title: "Detail Layanan",
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.surfacePrimary },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="outlets/index" options={{ headerShown: false }} />
      <Stack.Screen name="order" options={{ headerShown: false }} />
    </Stack>
  );
}
