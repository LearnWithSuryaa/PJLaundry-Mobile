import {
  Footprints,
  Layers,
  PackageCheck,
  Shirt,
  WashingMachine,
  Wind,
} from "lucide-react-native";

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
  icon: typeof WashingMachine;
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

export type SimulatedOrder = {
  orderNumber: string;
  serviceName: string;
  quantity: number;
  unit: string;
  subtotal: number;
  pickupFee: number;
  total: number;
  pickupAddress: string;
  scheduleDate: string;
  scheduleSlot: string;
  orderNotes?: string;
  status: "SIMULASI_TERKONFIRMASI";
  timestamp: string;
};

export const MAX_ORDER_LIMITS = {
  kiloan: 50,
  satuan: 20,
  special: 10,
} as const;

export const SERVICES: LaundryService[] = [
  {
    id: "kiloan-komplit",
    name: "Kiloan Komplit",
    category: "kiloan",
    price: 8000,
    unit: "kg",
    minOrder: 3,
    maxOrder: 50,
    duration: "2 Hari",
    icon: Layers,
    tagline: "Cuci bersih, kering menyeluruh, dan setrika uap rapi.",
    features: [
      "Setrika uap halus anti kusut",
      "Deterjen ramah serat kain",
      "Kemas rapi per pack wangi",
    ],
  },
  {
    id: "kiloan-express",
    name: "Kiloan Kilat 24 Jam",
    category: "kiloan",
    price: 13000,
    unit: "kg",
    minOrder: 3,
    maxOrder: 50,
    duration: "24 Jam",
    icon: WashingMachine,
    isExpress: true,
    tagline: "Prioritas kilat untuk kebutuhan cucian mendesak.",
    features: [
      "Prioritas pengerjaan 1 mesin 1 pelanggan",
      "Setrika uap mendalam",
      "Antar jemput terjadwal tepat waktu",
    ],
  },
  {
    id: "kiloan-lipat",
    name: "Cuci Lipat Hemat",
    category: "kiloan",
    price: 6000,
    unit: "kg",
    minOrder: 3,
    maxOrder: 50,
    duration: "2 Hari",
    icon: Wind,
    tagline: "Pilihan praktis dan ekonomis untuk pakaian harian.",
    features: [
      "Pencucian dan pengeringan 100%",
      "Dipilah dan dilipat rapi",
      "Aroma segar tahan lama",
    ],
  },
  {
    id: "satuan-kemeja",
    name: "Kemeja & Blouse",
    category: "satuan",
    price: 15000,
    unit: "pcs",
    minOrder: 1,
    maxOrder: 20,
    duration: "2 Hari",
    icon: Shirt,
    tagline: "Perawatan presisi untuk kerah tegak dan kain halus.",
    features: [
      "Pembersihan noda membandel pada kerah",
      "Setrika uap presisi tinggi",
      "Gantungan baju (hanger) gratis",
    ],
  },
  {
    id: "satuan-jas",
    name: "Jas & Blazer Formal",
    category: "satuan",
    price: 35000,
    unit: "pcs",
    minOrder: 1,
    maxOrder: 10,
    duration: "3 Hari",
    icon: PackageCheck,
    tagline: "Dry cleaning profesional menjaga struktur bahan.",
    features: [
      "Dry cleaning solvent khusus serat wol & jas",
      "Anti susut dan anti jamur",
      "Suit cover pelindung debu eksklusif",
    ],
  },
  {
    id: "special-bedcover",
    name: "Bed Cover & Selimut",
    category: "special",
    price: 25000,
    unit: "pcs",
    minOrder: 1,
    maxOrder: 10,
    duration: "3 Hari",
    icon: Layers,
    tagline: "Pencucian menyeluruh bebas tungau dan debu serat.",
    features: [
      "Mesin kapasitas besar pencucian optimal",
      "Pengeringan suhu terkontrol",
      "Aroma menenangkan untuk tidur lelap",
    ],
  },
  {
    id: "special-sepatu",
    name: "Sepatu Sneakers & Kulit",
    category: "special",
    price: 30000,
    unit: "pasang",
    minOrder: 1,
    maxOrder: 10,
    duration: "3 Hari",
    icon: Footprints,
    tagline: "Deep cleaning sol, upper, dan tali sepatu.",
    features: [
      "Pembersih khusus disesuaikan bahan sepatu",
      "Treatment anti bakteri & bau kaki",
      "Pengeringan non-heat anti retak sol",
    ],
  },
];

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

export const generateDemoOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DEMO-PJL-${dateStr}-${randomSuffix}`;
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
