import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import "../global.css";
import { AuthProvider, useAuth } from "../features/auth/AuthProvider";
import { COLORS } from "../theme/tokens";

const protectedRoutes = new Set(["orders", "checkout", "payment"]);

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
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
    </AuthProvider>
  );
}

function RouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const routeName = pathname.split("/")[1] ?? "";

  useEffect(() => {
    if (isLoading) return;

    if (routeName === "auth" && session) {
      router.replace("/services");
      return;
    }

    if (protectedRoutes.has(routeName) && !session) {
      router.replace("/auth");
    }
  }, [isLoading, routeName, router, session]);

  return null;
}
