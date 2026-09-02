export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Shared promise for the current refresh operation.
 *
 * null = no refresh currently happening
 * Promise<boolean> = a refresh is currently happening
 */
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token.
 *
 * If another request is already refreshing, wait for that
 * existing refresh instead of creating another one.
 */
async function refreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  isRetry = false
): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  /*
   * Access token expired.
   *
   * Only attempt refresh if this is NOT already a retry.
   */
  if (res.status === 403 && !isRetry || res.status === 401 && !isRetry) {
    const refreshed = await refreshToken();

    if (refreshed) {
      // Refresh succeeded.
      // Browser now has the new access_token cookie.
      // Retry the original request once.
      return apiFetch<T>(path, init, true);
    }
    console.log(res.status)
    // Refresh failed → user's session is no longer valid.
    throw new ApiError(
      401,
      "Session expired — please log in again"
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");

    let message = body || `Request failed (${res.status})`;
        console.error(
    `API Error ${res.status}:`,
    message
  );
  
    if (body) {
      try {
        const parsed = JSON.parse(body) as {
          message?: string | string[];
        };

        if (Array.isArray(parsed.message)) {
          message = parsed.message.join(" ");
        } else if (parsed.message) {
          message = parsed.message;
        }
      } catch {
        // Keep the raw response when the backend doesn't return JSON.
      }
    }

    throw new ApiError(res.status, message);
  }

  // Handle empty 204 responses gracefully.
  const text = await res.text();

  return (text ? JSON.parse(text) : undefined) as T;
}