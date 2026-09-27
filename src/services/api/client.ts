import { env } from "@/config/env";
import { ApiError } from "./errors";
import { sessionStore } from "./session-storage";
import { mockRequest } from "./mock";
import type { ApiErrorBody } from "@/types/api";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: Method;
  /** JSON body */
  body?: unknown;
  /** Multipart body (file uploads) — takes precedence over `body` */
  formData?: FormData;
  /** Attach the logged-in user's token */
  auth?: boolean;
  signal?: AbortSignal;
}

/**
 * Single entry point for every backend call.
 * With NEXT_PUBLIC_API_MOCK=true the request is answered locally by ./mock.ts.
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "POST", body, formData, auth = false, signal } = options;

  if (env.useMockApi) return mockRequest<T>(endpoint, method, formData ?? body);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (!formData && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = sessionStore.token();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
      credentials: "include",
      signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(0, { message: "Network error" });
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}
