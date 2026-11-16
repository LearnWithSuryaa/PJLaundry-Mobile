import type { LucideIcon } from "lucide-react-native";

export type ServiceCategory = "all" | "kiloan" | "satuan" | "special";

export type LaundryService = {
  id: string;
  name: string;
  category: "kiloan" | "satuan" | "special";
  price: number;
  unit: string;
  minOrder: number;
  maxOrder: number;
  duration: string;
  icon: LucideIcon;
  isExpress?: boolean;
  tagline: string;
  features: string[];
};

export type PickupDateOption = {
  id: string;
  dayLabel: string;
  dateLabel: string;
  fullDescription: string;
};

export type PickupTimeOption = {
  id: string;
  slotName: string;
  hours: string;
  note: string;
  cutOffHour: number; // Jam cut-off pemesanan untuk hari yang sama
};

export const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "kiloan", label: "Kiloan" },
  { id: "satuan", label: "Satuan" },
  { id: "special", label: "Spesial" },
];

export const PICKUP_TIME_SLOTS: PickupTimeOption[] = [
  {
    id: "pagi",
    slotName: "Slot Pagi",
    hours: "09:00 - 11:30",
    note: "Penjemputan awal sebelum jam kerja",
    cutOffHour: 10,
  },
  {
    id: "siang",
    slotName: "Slot Siang",
    hours: "13:00 - 15:30",
    note: "Penjemputan fleksibel jam istirahat",
    cutOffHour: 14,
  },
  {
    id: "sore",
    slotName: "Slot Sore",
    hours: "16:00 - 18:30",
    note: "Penjemputan santai sepulang kerja",
    cutOffHour: 17,
  },
];

export const formatRupiah = (amount: number): string =>
  `Rp ${amount.toLocaleString("id-ID")}`;

export const isSlotAvailable = (
  slot: PickupTimeOption,
  dateId: string,
): boolean => {
  // Hanya tanggal 'today' yang menerapkan batasan cut-off waktu lampau
  if (dateId !== "today") return true;
  const currentHour = new Date().getHours();
  return currentHour < slot.cutOffHour;
};

export const getUpcomingPickupDates = (): PickupDateOption[] => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const now = new Date();

  const createOption = (
    offsetDays: number,
    id: string,
    dayLabel: string,
  ): PickupDateOption => {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + offsetDays);
    const dateString = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;
    return {
      id,
      dayLabel,
      dateLabel: dateString,
      fullDescription: `${dayLabel}, ${dateString}`,
    };
  };

  return [
    createOption(0, "today", "Hari Ini"),
    createOption(1, "tomorrow", "Besok"),
    createOption(2, "day_after", "Lusa"),
  ];
};

export type DetergentOption = {
  id: string;
  name: string;
  description: string;
  extraPrice: number;
};

export const DETERGENT_OPTIONS: DetergentOption[] = [
  {
    id: "regular",
    name: "Reguler Floral Fresh",
    description: "Wangi bunga segar harian, bersih dan lembut",
    extraPrice: 0,
  },
  {
    id: "lavender",
    name: "Lavender Relaxing",
    description: "Aroma lavender menenangkan, tahan hingga 7 hari",
    extraPrice: 3000,
  },
  {
    id: "sensitive",
    name: "Sensitive Skin / Baby",
    description: "Bebas alergen, tanpa pewarna keras, lembut untuk bayi",
    extraPrice: 5000,
  },
  {
    id: "extra",
    name: "Extra Wangi & Anti-Bakteri",
    description: "Double konsentrat pewangi dengan proteksi kuman",
    extraPrice: 4000,
  },
];
