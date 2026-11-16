import {
  Footprints,
  Layers,
  PackageCheck,
  Shirt,
  WashingMachine,
  Wind,
} from "lucide-react-native";
import type { LaundryService } from "./servicesData";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://pj-laundry-backend.vercel.app/api/v1";

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

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export interface CreateOrderPayload {
  service_id: string;
  quantity: number;
  pickup_address: string;
  pickup_date: string;
  pickup_slot: string;
  detergent_id: string;
  notes?: string;
  payment_method: "qris" | "tunai";
}

export interface OrderApiItem extends CreateOrderPayload {
  id: string;
  order_number?: string;
  status: string;
  total_amount?: number;
  created_at: string;
}

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

const requestJson = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    fetch(endpoint, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    })
      .then((response) => {
        if (!response.ok) {
        return response
          .json()
          .catch(() => null)
          .then((body: { message?: string } | null) => {
            throw new ApiRequestError(
              body?.message ??
                `Permintaan ${endpoint} gagal (${response.status})`,
              response.status,
            );
          });
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
  requestJson<ApiResponse<ServiceApiItem[]>>(`${API_BASE_URL}/services`).then((response) => {
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

export const getServiceById = async (
  serviceId: string,
): Promise<LaundryService | null> => {
  const services = await getServices();
  return services.find((service) => service.id === serviceId) ?? null;
};

export const getPromos = (): Promise<LaundryPromo[]> =>
  requestJson<ApiResponse<PromoApiItem[]>>(`${API_BASE_URL}/promos`).then((response) => {
    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data;
  });

export const createOrder = (
  payload: CreateOrderPayload,
  accessToken: string,
): Promise<OrderApiItem> =>
  requestJson<ApiResponse<OrderApiItem>>(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (!response.success || !response.data) {
      throw new Error(response.message || "Pesanan tidak dapat dibuat.");
    }

    return response.data;
  });

export const getMyOrders = (accessToken: string): Promise<OrderApiItem[]> =>
  requestJson<ApiResponse<OrderApiItem[]>>(`${API_BASE_URL}/orders/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    if (!response.success || !Array.isArray(response.data)) {
      throw new Error(response.message || "Riwayat pesanan tidak dapat dimuat.");
    }

    return response.data;
  });
