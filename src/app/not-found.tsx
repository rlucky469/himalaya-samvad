import Link from "next/link";
import "@/styles/fonts";
import "@/styles/globals.css";

// Shown only for requests that never reach a locale (e.g. a broken static path).
export default function GlobalNotFound() {
  return (
    <html lang="hi">
      <body className="flex min-h-screen items-center justify-center bg-canvas p-6 text-center">
        <div>
          <p className="font-serif text-7xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl">यह पृष्ठ नहीं मिला · Page not found</h1>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-cta px-6 py-3 font-semibold text-white">
            मुखपृष्ठ · Home
          </Link>
        </div>
      </body>
    </html>
  );
}
