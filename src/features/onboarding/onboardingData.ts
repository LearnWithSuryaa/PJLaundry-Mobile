import {
  MapPin,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react-native";

import { COLORS } from "../../theme/tokens";

export type OnboardingVisualType = "pickup" | "tracking" | "care";

export type OnboardingData = {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: LucideIcon;
  illustrationColor: string;
  visualType: OnboardingVisualType;
  badges: string[];
};

export const ONBOARDING_COLORS = {
  background: COLORS.bgPrimary,
  surface: COLORS.surfacePrimary,
  surfaceSecondary: COLORS.surfaceSecondary,
  border: COLORS.borderDefault,
  peach: COLORS.brandOrangeSoft,
  lightBlue: COLORS.brandBlueSoft,
  yellow: COLORS.brandYellow,
  blue: COLORS.brandBlue,
  blueDark: COLORS.brandBlueDark,
  text: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
} as const;

export const ONBOARDING_STEPS: OnboardingData[] = [
  {
    id: "pickup",
    tag: "Layanan Antar Jemput",
    title: "Bebas Repot, Cucian Dijemput ke Depan Pintu",
    description:
      "Jadwalkan waktu penjemputan dari rumah atau kantor. Kurir PJLaundry siap mengambil cucian tepat waktu.",
    icon: Truck,
    illustrationColor: COLORS.brandOrangeSoft,
    visualType: "pickup",
    badges: ["Gratis Ongkir Terdekat", "Jadwal Fleksibel", "Konfirmasi Cepat"],
  },
  {
    id: "tracking",
    tag: "Transparansi Proses",
    title: "Pantau Status Cucian Secara Real-Time",
    description:
      "Ketahui setiap tahapan cucianmu langsung dari ponsel, mulai dari penimbangan berat hingga siap diantar kembali.",
    icon: MapPin,
    illustrationColor: COLORS.brandBlueSoft,
    visualType: "tracking",
    badges: ["Timbangan Akurat", "Update Berkala", "Riwayat Rapi"],
  },
  {
    id: "care",
    tag: "Jaminan Kualitas",
    title: "Standar Higienis dengan Garansi Bersih",
    description:
      "Pakaian dicuci terpisah untuk setiap pelanggan dengan deterjen ramah serat kain dan setrika uap presisi.",
    icon: ShieldCheck,
    illustrationColor: COLORS.brandBlueSoft,
    visualType: "care",
    badges: [
      "1 Mesin 1 Pelanggan",
      "Deterjen Hipoalergenik",
      "Garansi Cuci Ulang",
    ],
  },
];
