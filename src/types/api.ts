/**
 * [MODUL 3 - INTERFACE & API TYPES]
 * Tipe data TypeScript dan Interface untuk HTTP API Response
 * Endpoint: /health, /outlets, /reviews
 */

// Generic API Response Wrapper dari backend PJLaundry
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}



// Interface Outlet (Endpoint: GET /api/v1/outlets)
export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface Review Pelanggan (Endpoint: GET /api/v1/reviews)
export interface Review {
  id: string;
  customer_name: string;
  rating: number; // 1 - 5
  comment: string;
  service_name?: string;
  created_at: string;
  avatar_url?: string;
}

// Interface Health Check (Endpoint: GET /api/v1/health)
export interface HealthData {
  status: string;
  service: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    status: string;
    latencyMs: number;
  };
}

export interface ApiError {
  message: string;
  code?: number;
}

