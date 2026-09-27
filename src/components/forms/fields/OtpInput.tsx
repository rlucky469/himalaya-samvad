"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  label: string;
  tone?: "default" | "success";
}

/** Six single-digit boxes with auto-advance, backspace and paste support. */
export function OtpInput({ id, value, onChange, length = 6, disabled, invalid, label, tone = "default" }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  return (
    <div role="group" aria-label={label} className="flex gap-2 sm:gap-2.5">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={i === 0 ? id : undefined}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`${label} ${i + 1}`}
          aria-invalid={invalid}
          value={digit}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, d);
            if (d && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digit && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!pasted) return;
            e.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          onFocus={(e) => e.target.select()}
          className={cn(
            "size-11 rounded-lg border-2 bg-surface text-center text-lg font-bold text-primary transition-all sm:size-12 short:size-10",
            "focus:border-cta focus:outline-none focus:ring-4 focus:ring-cta-soft",
            tone === "success"
              ? "border-nature/60 text-nature disabled:bg-surface"
              : invalid
                ? "border-accent"
                : digit
                  ? "border-primary/40"
                  : "border-line-strong disabled:bg-mist",
          )}
        />
      ))}
    </div>
  );
}
