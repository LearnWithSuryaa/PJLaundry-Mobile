import type { LaundryService } from "./servicesData";
import {
  Footprints,
  Layers,
  PackageCheck,
  Shirt,
  WashingMachine,
  Wind,
} from "lucide-react-native";

const API_BASE_URL = "https://pj-laundry-backend.vercel.app/api/v1";

export interface ServiceApiItem {
  id: string;
  name: string;
  category: "kiloan" | "satuan" | "special";
  price: number;
  unit: string;
  min_order: number;
  max_order: number;
  duration: string;
  icon: string;
  is_express: boolean;
  tagline: string;
  features: string[];
  is_active: boolean;
}

export interface PromoApiItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type LaundryPromo = PromoApiItem;

const SERVICE_ICONS = {
  Footprints,
  Layers,
  PackageCheck,
  Shirt,
  WashingMachine,
  Wind,
} as const;

const getServiceIcon = (iconName: string) =>
  SERVICE_ICONS[iconName as keyof typeof SERVICE_ICONS] ?? WashingMachine;

const requestJson = async <T>(endpoint: string): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    fetch(`${API_BASE_URL}${endpoint}`)
      .then((response) => {
        if (!response.ok) {
          reject(
            new Error(`Permintaan ${endpoint} gagal (${response.status})`),
          );
          return;
        }

        return response.json() as Promise<T>;
      })
      .then((payload) => {
        if (payload !== undefined) {
          resolve(payload);
        }
      })
      .catch((error: unknown) => {
        reject(
          error instanceof Error
            ? error
            : new Error("Terjadi kesalahan saat menghubungi server"),
        );
      });
  });

export const getServices = (): Promise<LaundryService[]> =>
  requestJson<ApiResponse<ServiceApiItem[]>>("/services").then((response) => {
    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data.map((service) => ({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      unit: service.unit,
      minOrder: service.min_order,
      maxOrder: service.max_order,
      duration: service.duration,
      icon: getServiceIcon(service.icon),
      isExpress: service.is_express,
      tagline: service.tagline,
      features: service.features,
    }));
  });

export const getPromos = (): Promise<LaundryPromo[]> =>
  requestJson<ApiResponse<PromoApiItem[]>>("/promos").then((response) => {
    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data;
  });
