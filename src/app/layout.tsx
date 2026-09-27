import type { ReactNode } from "react";

// The real root layout (with <html>) is app/[locale]/layout.tsx.
// This pass-through exists so app/not-found.tsx can render for URLs outside any locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
