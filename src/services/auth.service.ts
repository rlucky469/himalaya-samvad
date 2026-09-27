import { apiEndpoints } from "@/config/api-endpoints";
import { apiRequest } from "./api/client";
import type {
  AuthSession,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  Locale,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/api";
import type { ForgotValues, LoginValues, RegisterValues, ResetValues } from "@/lib/validation/schemas";
import { identifierType } from "@/lib/validation/schemas";

// ---------- Payload builders (form values → exact JSON the backend receives) ----------

export const buildRegisterPayload = (values: RegisterValues, locale: Locale): RegisterPayload => ({
  name: values.name,
  email: values.email.toLowerCase(),
  mobile: { countryCode: "+91", number: values.mobile },
  city: values.city,
  password: values.password,
  acceptedTerms: true,
  locale,
});

export const buildLoginPayload = (values: LoginValues): LoginPayload => ({
  identifier: values.identifier,
  identifierType: identifierType(values.identifier),
  password: values.password,
  rememberMe: values.rememberMe,
});

export const buildForgotPayload = (values: ForgotValues): ForgotPasswordPayload => ({
  identifier: values.identifier,
  identifierType: identifierType(values.identifier),
});

export const buildResetPayload = (identifier: string, values: ResetValues): ResetPasswordPayload => ({
  identifier,
  identifierType: identifierType(identifier),
  otp: values.otp,
  newPassword: values.password,
});

// ---------- Calls ----------

export const authService = {
  register: (payload: RegisterPayload) => apiRequest<RegisterResponse>(apiEndpoints.auth.register, { body: payload }),
  login: (payload: LoginPayload) => apiRequest<AuthSession>(apiEndpoints.auth.login, { body: payload }),
  logout: () => apiRequest<void>(apiEndpoints.auth.logout, { auth: true }),
  sendOtp: (payload: SendOtpPayload) => apiRequest<SendOtpResponse>(apiEndpoints.auth.sendOtp, { body: payload }),
  verifyOtp: (payload: VerifyOtpPayload) => apiRequest<VerifyOtpResponse>(apiEndpoints.auth.verifyOtp, { body: payload }),
  forgotPassword: (payload: ForgotPasswordPayload) => apiRequest<ForgotPasswordResponse>(apiEndpoints.auth.forgotPassword, { body: payload }),
  resetPassword: (payload: ResetPasswordPayload) => apiRequest<{ reset: true }>(apiEndpoints.auth.resetPassword, { body: payload }),
};
