"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, FileText, Hash, LayoutGrid, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import type { SearchItem } from "@/types/search";
import { Portal } from "@/components/ui/Portal";
import { cn } from "@/lib/utils";

const groupIcons = { pages: LayoutGrid, topics: Hash, articles: FileText } as const;
const normalize = (s: string) => s.toLocaleLowerCase().normalize("NFC");

/** Instant site search over pages, topics and article summaries (Ctrl/⌘ + K). */
export function SiteSearch({ items, triggerClassName }: { items: SearchItem[]; triggerClassName?: string }) {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return items.filter((item) => normalize(`${item.title} ${item.description ?? ""}`).includes(q)).slice(0, 12);
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (item: SearchItem) => {
      close();
      router.push(item.href);
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(id);
    };
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[active]) go(results[active]);
  };

  const grouped = (["pages", "topics", "articles"] as const)
    .map((group) => ({ group, entries: results.filter((r) => r.group === group) }))
    .filter((g) => g.entries.length);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tc("search")}
        className={cn("inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-tint", triggerClassName)}
      >
        <Search className="size-5" />
      </button>

      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-start justify-center bg-primary-deep/60 px-4 pt-[12vh] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => e.target === e.currentTarget && close()}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={t("title")}
                className="w-full max-w-2xl overflow-hidden rounded-panel bg-surface shadow-lift"
                initial={{ y: -16, scale: 0.98, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -10, scale: 0.98, opacity: 0 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
              >
                <div className="flex items-center gap-3 border-b border-line px-5">
                  <Search aria-hidden className="size-5 shrink-0 text-muted" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onInputKey}
                    placeholder={t("placeholder")}
                    aria-label={t("title")}
                    className="h-16 w-full bg-transparent text-lg text-ink outline-none placeholder:text-muted"
                  />
                  <button type="button" onClick={close} aria-label={tc("close")} className="rounded-full p-2 text-muted hover:bg-mist hover:text-ink">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-3">
                  {query.trim().length < 2 ? (
                    <p className="px-3 py-6 text-center text-sm text-muted">{t("hint")}</p>
                  ) : results.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-muted">{t("noResults", { query })}</p>
                  ) : (
                    grouped.map(({ group, entries }) => {
                      const Icon = groupIcons[group];
                      return (
                        <div key={group} className="mb-2">
                          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-accent">{t(`groups.${group}`)}</p>
                          <ul>
                            {entries.map((item) => {
                              const index = results.indexOf(item);
                              return (
                                <li key={item.href}>
                                  <button
                                    type="button"
                                    onMouseEnter={() => setActive(index)}
                                    onClick={() => go(item)}
                                    className={cn(
                                      "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                                      index === active ? "bg-primary-tint" : "hover:bg-mist",
                                    )}
                                  >
                                    <Icon aria-hidden className="mt-1 size-4 shrink-0 text-secondary" />
                                    <span className="min-w-0 flex-1">
                                      <span className="block font-semibold leading-snug text-primary">{item.title}</span>
                                      {item.description && <span className="mt-0.5 line-clamp-1 block text-sm text-muted">{item.description}</span>}
                                    </span>
                                    <ArrowRight aria-hidden className={cn("mt-1 size-4 shrink-0 text-cta transition-opacity", index === active ? "opacity-100" : "opacity-0")} />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
