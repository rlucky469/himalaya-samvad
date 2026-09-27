import { apiEndpoints } from "@/config/api-endpoints";
import { ApiError } from "./errors";
import type { AuthSession, AuthUser } from "@/types/api";

/**
 * Fake backend used while NEXT_PUBLIC_API_MOCK=true.
 * It logs every payload to the browser console so the backend team can see the exact request shape.
 * The demo OTP is always 123456.
 */
export const MOCK_OTP = "123456";

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

function logPayload(endpoint: string, payload: unknown) {
  if (process.env.NODE_ENV === "production") return;
  const printable = payload instanceof FormData ? Object.fromEntries(payload.entries()) : payload;
  console.info(`%c[mock api] POST ${endpoint}`, "color:#f28c1b;font-weight:bold", printable);
}

function fakeSession(user: Partial<AuthUser> & { email: string }): AuthSession {
  return {
    accessToken: `mock.${toBase64Url(user.email)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    user: {
      id: user.id ?? "demo-user",
      name: user.name ?? user.email.split("@")[0],
      email: user.email,
      mobile: user.mobile ?? "",
      city: user.city ?? "",
      isEmailVerified: true,
      isMobileVerified: true,
    },
  };
}

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const bodyOf = (payload: unknown) => (payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {});

export async function mockRequest<T>(endpoint: string, method: string, payload?: unknown): Promise<T> {
  await delay();
  logPayload(endpoint, payload);
  const body = bodyOf(payload);
  const { auth, forms } = apiEndpoints;

  switch (endpoint) {
    case auth.register:
      return {
        userId: `demo-${Date.now()}`,
        email: body.email,
        mobile: (body.mobile as { number: string })?.number,
        verification: { mobile: false, email: false },
      } as T;

    case auth.sendOtp:
      return { sent: true, retryAfterSeconds: 30 } as T;

    case auth.verifyOtp: {
      if (body.otp !== MOCK_OTP) throw new ApiError(422, { code: "INVALID_OTP", message: "Invalid OTP", errors: { otp: "otpInvalid" } });
      // A real backend returns `session` only after both channels are verified
      return { verified: true, verification: { mobile: true, email: true }, session: fakeSession({ email: String(body.target).includes("@") ? String(body.target) : "reader@demo.himalayasamvad.in" }) } as T;
    }

    case auth.login: {
      const identifier = String(body.identifier ?? "");
      const email = identifier.includes("@") ? identifier : `${identifier}@demo.himalayasamvad.in`;
      return fakeSession({ email, mobile: identifier.includes("@") ? "" : identifier }) as T;
    }

    case auth.forgotPassword: {
      const id = String(body.identifier ?? "");
      const masked = id.includes("@") ? id.replace(/^(.{2}).*(@.*)$/, "$1***$2") : id.replace(/^(\d{2})\d{6}(\d{2})$/, "$1******$2");
      return { sent: true, maskedTarget: masked } as T;
    }

    case auth.resetPassword:
      if (body.otp !== MOCK_OTP) throw new ApiError(422, { code: "INVALID_OTP", errors: { otp: "otpInvalid" } });
      return { reset: true } as T;

    case auth.logout:
      return {} as T;

    case forms.contact:
    case forms.membership:
    case forms.advertise:
    case forms.newsletter:
      return { id: `demo-${Date.now()}`, receivedAt: new Date().toISOString() } as T;

    default:
      throw new ApiError(404, { message: `No mock for ${method} ${endpoint}` });
  }
}

export { fakeSession };
