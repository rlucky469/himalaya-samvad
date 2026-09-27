/** Only allow redirects to paths on this site (blocks "//evil.com" and absolute URLs). */
export function safeNextPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
