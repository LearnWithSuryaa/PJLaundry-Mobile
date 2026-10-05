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
};

export const SERVICES: LaundryService[] = [
  {
    id: "kiloan-komplit",
    name: "Kiloan Komplit",
    category: "kiloan",
    price: 8000,
    unit: "kg",
    minOrder: 3,
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
    duration: "2 Hari",
    icon: Shirt,
    tagline: "Perawatan presisi untuk kerah tegak dan kain halus.",
    features: [
      "Treatment noda khusus pada kerah dan manset",
      "Free hanger dan sarung pelindung",
      "Setrika detail tanpa lipatan ganda",
    ],
  },
  {
    id: "satuan-jas",
    name: "Jas & Blazer Formal",
    category: "satuan",
    price: 35000,
    unit: "pcs",
    minOrder: 1,
    duration: "3 Hari",
    icon: PackageCheck,
    tagline: "Dry clean khusus agar struktur bahu dan furing terjaga.",
    features: [
      "Metode dry clean profesional",
      "Sterilisasi uap anti jamur",
      "Suit cover eksklusif PJLaundry",
    ],
  },
  {
    id: "special-sepatu",
    name: "Deep Clean Sepatu",
    category: "special",
    price: 35000,
    unit: "pasang",
    minOrder: 1,
    duration: "3 Hari",
    icon: Footprints,
    tagline: "Pembersihan total dari upper, midsole, hingga insole.",
    features: [
      "Sikat khusus sesuai tipe material",
      "Semprotan anti-bakteri dan deodorizer",
      "Pengeringan suhu ruang aman",
    ],
  },
  {
    id: "special-bedcover",
    name: "Bed Cover Jumbo",
    category: "special",
    price: 30000,
    unit: "item",
    minOrder: 1,
    duration: "3 Hari",
    icon: Layers,
    tagline: "Pencucian kapasitas besar agar dakron tetap empuk.",
    features: [
      "Mesin drum besar bebas gumpalan",
      "Bebas tungau dan debu serat",
      "Packaging vacuum rapi dan higienis",
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
  },
  {
    id: "siang",
    slotName: "Slot Siang",
    hours: "13:00 - 15:30",
    note: "Penjemputan fleksibel jam istirahat",
  },
  {
    id: "sore",
    slotName: "Slot Sore",
    hours: "16:00 - 18:30",
    note: "Penjemputan santai sepulang kerja",
  },
];

export const formatRupiah = (amount: number): string =>
  `Rp ${amount.toLocaleString("id-ID")}`;

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
