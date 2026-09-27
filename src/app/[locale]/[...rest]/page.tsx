import { notFound } from "next/navigation";

// Any unknown URL inside a locale renders the localized not-found page
export default function CatchAll() {
  notFound();
}
