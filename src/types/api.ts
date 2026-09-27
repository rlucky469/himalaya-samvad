// ---------- Shared ----------
export type Locale = "hi" | "en";
export type OtpChannel = "mobile" | "email";

export interface ApiErrorBody {
  message?: string;
  code?: string;
  /** Field-level errors, e.g. { email: "EMAIL_TAKEN" } */
  errors?: Record<string, string>;
}

// ---------- Auth ----------
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export interface AuthSession {
  accessToken: string;
  /** ISO date */
  expiresAt: string;
  user: AuthUser;
}

export interface MobileNumber {
  countryCode: "+91";
  number: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: MobileNumber;
  city: string;
  password: string;
  acceptedTerms: true;
  locale: Locale;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  mobile: string;
  /** The backend sends both OTPs right after registration */
  verification: Record<OtpChannel, boolean>;
}

export interface SendOtpPayload {
  userId?: string;
  channel: OtpChannel;
  /** Email address or 10-digit mobile number */
  target: string;
  purpose: "verify" | "reset";
}

export interface SendOtpResponse {
  sent: true;
  retryAfterSeconds: number;
}

export interface VerifyOtpPayload {
  userId: string;
  channel: OtpChannel;
  target: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: true;
  verification: Record<OtpChannel, boolean>;
  /** Returned once both channels are verified */
  session?: AuthSession;
}

export interface LoginPayload {
  /** Email or 10-digit mobile number */
  identifier: string;
  identifierType: "email" | "mobile";
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordPayload {
  identifier: string;
  identifierType: "email" | "mobile";
}

export interface ForgotPasswordResponse {
  sent: true;
  /** e.g. "98******10" or "na***@gmail.com", shown on the reset screen */
  maskedTarget: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  identifierType: "email" | "mobile";
  otp: string;
  newPassword: string;
}

// ---------- Forms ----------
export interface ContactPayload {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  locale: Locale;
  /** Sent as multipart/form-data field "attachment" when present */
  attachment?: File | null;
}

export interface MembershipPayload {
  name: string;
  email: string;
  mobile: MobileNumber;
  address: { line: string; city: string; state: string; pincode: string };
  plan: string;
  organization?: string;
  message?: string;
  consentUpdates: boolean;
  locale: Locale;
}

export interface AdvertiseEnquiryPayload {
  name: string;
  organization: string;
  email: string;
  mobile: MobileNumber;
  adSlot: string;
  issueMonth?: string;
  message: string;
  locale: Locale;
}

export interface NewsletterPayload {
  email: string;
  locale: Locale;
}

export interface FormSubmitResponse {
  id: string;
  receivedAt: string;
}

// ---------- Magazine ----------
export interface MagazinePage {
  number: number;
  src: string;
  thumb: string;
  width: number;
  height: number;
}

export interface MagazinePagesResponse {
  slug: string;
  totalPages: number;
  previewPages: number;
  unlocked: boolean;
  pages: MagazinePage[];
}
