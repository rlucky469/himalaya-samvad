import { z } from "zod";

/**
 * All form validation lives here. Error messages are keys of the "validation"
 * namespace in messages/*.json, so they are shown in the reader's language.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;
export const PINCODE_RE = /^[1-9]\d{5}$/;
export const OTP_RE = /^\d{6}$/;
// Letters in any script (Hindi or English), spaces, dots, apostrophes and hyphens
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
export const ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.txt";

// ---------- Field rules ----------

const name = z.string().trim().min(1, "required").min(2, "nameInvalid").max(60, "nameInvalid").regex(NAME_RE, "nameInvalid");
const email = z.string().trim().min(1, "required").max(120, "emailInvalid").regex(EMAIL_RE, "emailInvalid");

/** Accepts "98765 43210", "+91 9876543210" or "09876543210" and outputs "9876543210" */
const mobile = z
  .string()
  .trim()
  .min(1, "required")
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91(?=\d{10}$)|0(?=\d{10}$))/, ""))
  .pipe(z.string().regex(INDIAN_MOBILE_RE, "mobileInvalid"));

const city = z.string().trim().min(1, "required").min(2, "cityInvalid").max(50, "cityInvalid");
const password = z.string().min(8, "passwordMin").max(64, "passwordMin").regex(/(?=.*[A-Za-z])(?=.*\d)/, "passwordWeak");
const otp = z.string().trim().regex(OTP_RE, "otpInvalid");
const message = z.string().trim().min(10, "messageMin").max(2000, "messageMax");
const optionalMessage = z.string().trim().max(2000, "messageMax").optional().or(z.literal(""));
const requiredSelect = z.string().min(1, "selectRequired");

/** Email or 10-digit Indian mobile */
const identifier = z
  .string()
  .trim()
  .min(1, "required")
  .transform((v) => (v.includes("@") ? v.toLowerCase() : v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "")))
  .refine((v) => EMAIL_RE.test(v) || INDIAN_MOBILE_RE.test(v), "identifierInvalid");

export const identifierType = (value: string): "email" | "mobile" => (value.includes("@") ? "email" : "mobile");

const attachment = z
  .custom<File | null | undefined>((v) => v === null || v === undefined || (typeof File !== "undefined" && v instanceof File))
  .refine((f) => !f || ATTACHMENT_TYPES.includes(f.type) || /\.(pdf|docx?|txt)$/i.test(f.name), "fileType")
  .refine((f) => !f || f.size <= MAX_ATTACHMENT_BYTES, "fileSize")
  .optional();

// ---------- Auth ----------

export const registerSchema = z.object({
  name,
  email,
  mobile,
  city,
  password,
  acceptTerms: z.boolean().refine((v) => v, "termsRequired"),
});

export const loginSchema = z.object({
  identifier,
  password: z.string().min(1, "required"),
  rememberMe: z.boolean(),
});

export const forgotSchema = z.object({ identifier });

export const resetSchema = z
  .object({ otp, password, confirmPassword: z.string().min(1, "required") })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "passwordMismatch" });

export const otpSchema = z.object({ otp });

// ---------- Site forms ----------

export const contactSchema = z.object({
  name,
  email,
  mobile,
  subject: requiredSelect,
  message,
  attachment,
});

export const membershipSchema = z
  .object({
    name,
    email,
    mobile,
    address: z.string().trim().min(1, "required").max(200, "required"),
    city,
    state: z.string().trim().min(2, "required").max(50, "required"),
    pincode: z.string().trim().regex(PINCODE_RE, "pincodeInvalid"),
    plan: requiredSelect,
    organization: z.string().trim().max(120).optional().or(z.literal("")),
    message: optionalMessage,
    consentUpdates: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.plan === "institutional" && !v.organization) {
      ctx.addIssue({ code: "custom", path: ["organization"], message: "organizationRequired" });
    }
  });

export const advertiseSchema = z.object({
  name,
  organization: z.string().trim().min(2, "required").max(120, "required"),
  email,
  mobile,
  adSlot: requiredSelect,
  issueMonth: z.string().trim().max(40).optional().or(z.literal("")),
  message,
});

export const newsletterSchema = z.object({ email });

// ---------- Types (form output after trimming/normalising) ----------

export type RegisterValues = z.output<typeof registerSchema>;
export type LoginValues = z.output<typeof loginSchema>;
export type ForgotValues = z.output<typeof forgotSchema>;
export type ResetValues = z.output<typeof resetSchema>;
export type ContactValues = z.output<typeof contactSchema>;
export type MembershipValues = z.output<typeof membershipSchema>;
export type AdvertiseValues = z.output<typeof advertiseSchema>;
export type NewsletterValues = z.output<typeof newsletterSchema>;

/** 0 weak · 1 fair · 2 good · 3 strong — used by the password strength meter */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Za-z]/.test(value) && /\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) || (/[a-z]/.test(value) && /[A-Z]/.test(value))) score++;
  if (value.length >= 12) score++;
  return Math.max(0, score - 1) as 0 | 1 | 2 | 3;
}
