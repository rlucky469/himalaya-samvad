// Public (browser-safe) environment values. Change them in .env.local
export const env = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1").replace(/\/$/, ""),
  // While true, every API call is answered by src/services/api/mock.ts instead of the backend
  useMockApi: process.env.NEXT_PUBLIC_API_MOCK !== "false",
} as const;
