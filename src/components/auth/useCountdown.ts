"use client";

import { useEffect, useState } from "react";

/** Seconds left until an OTP can be resent. `restart(n)` starts a new countdown. */
export function useCountdown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);
  return { seconds, restart: setSeconds };
}
