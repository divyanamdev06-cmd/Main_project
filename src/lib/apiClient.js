import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("jobnest_auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = String(err?.config?.url || "");
    if (status === 401 && !url.includes("/user/login") && !url.includes("/user/signup")) {
      try {
        localStorage.removeItem("jobnest_auth");
      } catch {
        /* ignore */
      }
      const path = window.location.pathname || "";
      if (!path.startsWith("/login") && !path.startsWith("/signup")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

/**
 * Throws if the server returned HTTP 2xx but JSON body says success: false.
 * (Axios would not reject those without this check.)
 */
export function assertApiSuccess(res) {
  const payload = res?.data;
  if (payload && Object.prototype.hasOwnProperty.call(payload, "success") && payload.success === false) {
    const err = new Error(
      typeof payload.message === "string" ? payload.message : "Request failed"
    );
    err.response = { data: payload };
    throw err;
  }
  return payload;
}

export async function apiGet(url, config) {
  const res = await apiClient.get(url, config);
  return assertApiSuccess(res);
}

export async function apiPost(url, body, config) {
  const res = await apiClient.post(url, body, config);
  return assertApiSuccess(res);
}

export async function apiPut(url, body, config) {
  const res = await apiClient.put(url, body, config);
  return assertApiSuccess(res);
}

export async function apiPatch(url, body, config) {
  const res = await apiClient.patch(url, body, config);
  return assertApiSuccess(res);
}

export async function apiDelete(url, config) {
  const res = await apiClient.delete(url, config);
  return assertApiSuccess(res);
}

/** Pick first array field from API JSON (handles minor response-shape drift). */
export function extractList(payload, keys = ["data"]) {
  if (!payload || typeof payload !== "object") return [];
  for (const k of keys) {
    if (Array.isArray(payload[k])) return payload[k];
  }
  return [];
}

export function getApiErrorMessage(err) {
  // Axios error
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Something went wrong. Please try again.";

  return typeof msg === "string" ? msg : "Something went wrong. Please try again.";
}

