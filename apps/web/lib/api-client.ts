const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  token?: string;
}

async function request<T>(path: string, init?: RequestInit, options?: RequestOptions): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

// Separate from `request`: fetch must set its own multipart Content-Type
// (with boundary) for FormData bodies, so we can't default to application/json here.
async function requestForm<T>(
  path: string,
  formData: FormData,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: "POST",
    cache: "no-store",
    body: formData,
    headers: {
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, undefined, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, options),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE" }, options),
  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    requestForm<T>(path, formData, options),
};
