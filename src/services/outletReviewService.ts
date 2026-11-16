/**
 * [MODUL 3 - PEMROGRAMAN ASYNCHRONOUS & API CALL]
 * Implementasi Wajib:
 * 1. interface (ApiResponse, Outlet, Review, HealthData)
 * 2. Object dari response API (JSON Deserialization ke Typed Object)
 * 3. fetch() (Native Web API untuk HTTP Request)
 * 4. custom async function (async/await untuk API processing)
 * 5. .then() (Promise chaining)
 * 6. .resolve() dan .reject() (Pembuatan Promise kustom & validasi)
 */

import type { ApiResponse, HealthData, Outlet, Review } from "../types/api";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://pj-laundry-backend.vercel.app/api/v1";

/**
 * 6. IMPLEMENTASI .resolve() dan .reject()
 * Utility async helper berbasis new Promise dengan executor (resolve, reject).
 * Digunakan untuk:
 * - Menangani timeout jaringan
 * - Simulasi delay yang terkontrol (mengacu ke Modul 3 Halaman 9-11)
 */
export const delayWithPromise = (ms: number, shouldSucceed = true): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        // Pemanggilan resolve() ketika operasi berhasil
        resolve(`Operasi berhasil diselesaikan dalam ${ms}ms`);
      } else {
        // Pemanggilan reject() ketika operasi gagal
        reject(new Error(`Operasi gagal/timeout setelah ${ms}ms`));
      }
    }, ms);
  });
};

/**
 * 6. IMPLEMENTASI .resolve() dan .reject()
 * Validasi objek Outlet yang diterima dari backend.
 * Mengembalikan Promise.resolve jika valid, atau Promise.reject jika data korup.
 */
export function validateOutletObject(outlet: Outlet): Promise<Outlet> {
  if (!outlet || !outlet.id || !outlet.name) {
    return Promise.reject(new Error("Data outlet tidak valid: properti id atau nama kosong"));
  }
  return Promise.resolve(outlet);
}

/**
 * 3 & 4 & 5. IMPLEMENTASI fetch(), custom async function, dan .then()
 * Endpoint: GET /health
 * Mengecek status server backend dan database latency
 */
export async function getBackendHealth(): Promise<HealthData> {
  const url = `${API_BASE_URL}/health`;

  // Menggunakan fetch() dengan method chaining .then()
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        // Menggunakan reject melalui Error
        throw new Error(`Server health check gagal dengan HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((jsonResult: ApiResponse<HealthData>) => {
      // 2. Memetakan hasil response API ke dalam Object TypeScript
      const healthObject: HealthData = {
        status: jsonResult.data.status,
        service: jsonResult.data.service,
        version: jsonResult.data.version,
        environment: jsonResult.data.environment,
        uptimeSeconds: jsonResult.data.uptimeSeconds,
        timestamp: jsonResult.data.timestamp,
        database: {
          status: jsonResult.data.database?.status ?? "unknown",
          latencyMs: jsonResult.data.database?.latencyMs ?? 0,
        },
      };
      return healthObject;
    })
    .catch((error: Error) => {
      console.warn("[HealthCheck API Error]:", error.message);
      throw error;
    });
}

/**
 * 3, 4, 5. IMPLEMENTASI custom async function, fetch(), dan .then()
 * Endpoint: GET /outlets
 * Mengambil daftar cabang outlet resmi PJLaundry
 */
export async function fetchOutlets(): Promise<Outlet[]> {
  const url = `${API_BASE_URL}/outlets`;

  try {
    // 3. Memanggil endpoint dengan fetch()
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data outlet: HTTP ${response.status} ${response.statusText}`);
    }

    // Menggunakan .then() untuk parsing JSON
    const result: ApiResponse<Outlet[]> = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || "Format data outlet tidak sesuai");
    }

    // 2. Memasukkan array response API ke dalam Object bertipe Interface Outlet
    const outletsList: Outlet[] = result.data.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      address: String(item.address),
      phone: String(item.phone),
      opening_hours: String(item.opening_hours),
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      is_active: Boolean(item.is_active),
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
    }));

    return outletsList;
  } catch (error) {
    console.warn("[fetchOutlets]: Gagal mengambil data outlet:", error);
    throw error;
  }
}

/**
 * 3, 4, 5. IMPLEMENTASI custom async function, fetch(), dan .then()
 * Endpoint: GET /reviews
 * Mengambil daftar ulasan pelanggan — jika kosong kembalikan array kosong []
 * agar UI menampilkan form input ulasan
 */
export async function fetchCustomerReviews(): Promise<Review[]> {
  const url = `${API_BASE_URL}/reviews`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gagal mengambil ulasan: HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((result: ApiResponse<Review[]>) => {
      // Jika data kosong → kembalikan [] agar UI tampilkan form tulis ulasan
      if (!result.data || result.data.length === 0) {
        return [];
      }

      // 2. Mapping ke Object Interface Review
      return result.data.map((item) => ({
        id: String(item.id),
        customer_name: String(item.customer_name || "Pelanggan Setia"),
        rating: Number(item.rating || 5),
        comment: String(item.comment || ""),
        service_name: item.service_name ? String(item.service_name) : undefined,
        created_at: String(item.created_at || new Date().toISOString()),
        avatar_url: item.avatar_url,
      }));
    })
    .catch((error: Error) => {
      console.warn("[fetchCustomerReviews] Error:", error.message);
      throw error;
    });
}

/**
 * [MODUL 3 - POST REQUEST]
 * Endpoint: POST /api/v1/reviews
 * Mengirim ulasan baru dari pelanggan ke backend
 * Implementasi: fetch() + custom async function + .then() + .resolve() + .reject()
 */
export interface NewReviewPayload {
  customer_name: string;
  rating: number;
  comment: string;
  service_name?: string;
}

export async function postReview(payload: NewReviewPayload): Promise<Review> {
  // 6. Validasi input menggunakan Promise.reject() sebelum mengirim ke API
  return new Promise<NewReviewPayload>((resolve, reject) => {
    if (!payload.customer_name.trim()) {
      reject(new Error("Nama tidak boleh kosong"));
      return;
    }
    if (!payload.comment.trim()) {
      reject(new Error("Ulasan tidak boleh kosong"));
      return;
    }
    if (payload.rating < 1 || payload.rating > 5) {
      reject(new Error("Rating harus antara 1 sampai 5 bintang"));
      return;
    }
    // Semua valid → lanjutkan dengan resolve()
    resolve(payload);
  })
    // 5. .then() chaining — kirim ke server setelah validasi lolos
    .then((validatedPayload) => {
      return fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(validatedPayload),
      });
    })
    .then((response) => {
      return response.json().then((body: ApiResponse<Review> | { success: false; message: string }) => {
        if (!response.ok) {
          // Server menolak → reject dengan pesan dari server
          throw new Error(
            (body as { message: string }).message ||
              `Server error: HTTP ${response.status}`
          );
        }
        return body as ApiResponse<Review>;
      });
    })
    .then((result: ApiResponse<Review>) => {
      // Mapping response server ke Object Review
      const saved: Review = {
        id: String(result.data?.id ?? Date.now()),
        customer_name: payload.customer_name,
        rating: payload.rating,
        comment: payload.comment,
        service_name: payload.service_name,
        created_at: result.data?.created_at ?? new Date().toISOString(),
      };
      return saved;
    })
    .catch((error: Error) => {
      console.warn("[postReview] Gagal mengirim ulasan:", error.message);
      throw error;
    });
}
