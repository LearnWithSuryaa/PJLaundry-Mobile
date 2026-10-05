import {
  MapPin,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react-native";

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
  background: "#fff9d2",
  surface: "#ffffff",
  peach: "#ffebcc",
  lightBlue: "#bfddf0",
  blue: "#8cc0eb",
  text: "#333333",
} as const;

export const ONBOARDING_STEPS: OnboardingData[] = [
  {
    id: "pickup",
    tag: "Layanan Antar Jemput",
    title: "Bebas Repot, Cucian Dijemput ke Depan Pintu",
    description:
      "Jadwalkan waktu penjemputan dari rumah atau kantor. Kurir PJLaundry siap mengambil cucian tepat waktu.",
    icon: Truck,
    illustrationColor: ONBOARDING_COLORS.peach,
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
    illustrationColor: ONBOARDING_COLORS.lightBlue,
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
    illustrationColor: ONBOARDING_COLORS.peach,
    visualType: "care",
    badges: [
      "1 Mesin 1 Pelanggan",
      "Deterjen Hipoalergenik",
      "Garansi Cuci Ulang",
    ],
  },
];
