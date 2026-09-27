"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/** Pre-selects a form value from the URL, e.g. /membership?plan=student → plan = "student". */
export function useQueryPreset(param: string, allowed: string[], apply: (value: string) => void) {
  const searchParams = useSearchParams();
  const value = searchParams.get(param);

  useEffect(() => {
    if (value && allowed.includes(value)) apply(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the URL value changes
  }, [value]);
}
