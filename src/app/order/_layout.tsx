import { Stack } from "expo-router";

// ============================================================================
// [MODUL 2 - LAYOUT & STACK]
// Membuat Nested Stack app/order/_layout.tsx (dengan opsi presentation: "modal")
// Berfungsi untuk mengelola navigasi bertingkat alur pemesanan:
// 1. Form Jadwal Penjemputan (index.tsx)
// 2. Ringkasan Pembayaran (summary.tsx)
// 3. Pemantauan Status Cuci (tracking.tsx)
// ============================================================================

export default function OrderNestedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Layar 1: Form Penjemputan & Pemilihan Slot/Pewangi */}
      <Stack.Screen
        name="index"
        options={{
          title: "Form Penjemputan",
        }}
      />

      {/* Layar 2: Ringkasan Pembayaran & Pemilihan Metode Bayar */}
      <Stack.Screen
        name="summary"
        options={{
          title: "Ringkasan Pembayaran",
        }}
      />

      {/* Layar 3: Pemantauan Status Cuci (Tracking) */}
      <Stack.Screen
        name="tracking"
        options={{
          title: "Pemantauan Status Cuci",
        }}
      />
    </Stack>
  );
}
