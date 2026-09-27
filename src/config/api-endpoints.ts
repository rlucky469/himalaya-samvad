/**
 * Node.js backend endpoints (relative to NEXT_PUBLIC_API_BASE_URL).
 * When the backend is ready, only these paths (and the base URL) may need changing.
 */
export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    sendOtp: "/auth/otp/send",
    verifyOtp: "/auth/otp/verify",
    forgotPassword: "/auth/password/forgot",
    resetPassword: "/auth/password/reset",
  },
  forms: {
    contact: "/forms/contact",
    membership: "/forms/membership",
    advertise: "/forms/advertise",
    newsletter: "/newsletter/subscribe",
  },
} as const;

// Served by this Next.js app for now (src/app/api/magazine). Move to the backend later if needed.
export const magazineEndpoints = {
  pages: (slug: string) => `/api/magazine/${slug}/pages`,
} as const;
