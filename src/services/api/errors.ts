import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody = {}) {
    super(body.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.errors;
  }

  /** status 0 = the request never reached the server */
  get isNetworkError() {
    return this.status === 0;
  }
}
