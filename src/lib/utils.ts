import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pick<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in source) acc[key] = source[key];
    return acc;
  }, {} as Pick<T, K>);
}

export function mailto(email: string) {
  return `mailto:${email}`;
}

export function whatsappLink(number: string, text?: string) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
