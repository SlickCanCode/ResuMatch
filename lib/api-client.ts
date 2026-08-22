export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
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

  if (!res.ok) {
    if (res.status === 401) {
      throw new ApiError(401, "Session expired — please log in again");
    }
    const body = await res.text().catch(() => "");
    let message = body || `Request failed (${res.status})`;

    if (body) {
      try {
        const parsed = JSON.parse(body) as { message?: string | string[] };
        if (Array.isArray(parsed.message)) {
          message = parsed.message.join(" ");
        } else if (parsed.message) {
          message = parsed.message;
        }
      } catch {
        // Keep the raw response when the backend does not return JSON.
      }
    }

    throw new ApiError(res.status, message);
  }

  // Handle empty 204 bodies gracefully
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}