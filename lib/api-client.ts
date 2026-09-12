
export const API_BASE_URL = "/api/backend";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<boolean> | null = null;

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
      ...(isFormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  /*
   * Access token expired.
   *
   * Only attempt refresh if this is NOT already a retry.
   */
  if ((res.status === 401 || res.status === 403) && !isRetry) {
    const refreshed = await refreshToken();

    if (refreshed) {
      return apiFetch<T>(path, init, true);
    }

    throw new ApiError(
      401,
      "Session expired — please log in again"
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");

    let message = body || `Request failed (${res.status})`;

    console.error(`API Error ${res.status}:`, message);

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
        // Keep raw response.
      }
    }

    throw new ApiError(res.status, message);
  }

  const text = await res.text();

  return (text ? JSON.parse(text) : undefined) as T;
}

