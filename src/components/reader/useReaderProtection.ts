"use client";

import { useEffect, type RefObject } from "react";

/**
 * Discourages saving/printing while the reader is open: blocks the context menu, image dragging,
 * text selection and the Ctrl/⌘ + S / P shortcuts. (Screenshots can't be blocked by any website —
 * the per-reader watermark burned into each page covers that case.)
 */
export function useReaderProtection(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const block = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === "s" || key === "p")) e.preventDefault();
    };
    el.addEventListener("contextmenu", block);
    el.addEventListener("dragstart", block);
    el.addEventListener("selectstart", block);
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("contextmenu", block);
      el.removeEventListener("dragstart", block);
      el.removeEventListener("selectstart", block);
      window.removeEventListener("keydown", onKey);
    };
  }, [ref]);
}
