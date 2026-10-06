"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, Expand, LayoutGrid, Loader2, Lock, LogIn, Minimize, RotateCcw, ShieldCheck, UserPlus, X, ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { fetchMagazinePages } from "@/services/magazine.service";
import { routes } from "@/config/routes";
import type { MagazinePage, MagazinePagesResponse } from "@/types/api";
import { useReaderProtection } from "./useReaderProtection";
import { ZoomViewer } from "./ZoomViewer";
import { cn } from "@/lib/utils";

interface MagazineReaderProps {
  slug: string;
  title: string;
  backHref: string;
  /** Private share link: unlocks every page without login */
  shareToken?: string;
}

type Orientation = "portrait" | "landscape";
const TOOLBAR_SPACE = 150;

function createPageElement(page: MagazinePage, isCover: boolean) {
  const el = document.createElement("div");
  el.className = "hs-page";
  el.dataset.density = isCover ? "hard" : "soft";
  const img = document.createElement("div");
  img.className = "hs-page__img";
  img.style.backgroundImage = `url("${page.src}")`;
  el.appendChild(img);
  return el;
}

function createLockedPageElement(title: string, text: string) {
  const el = document.createElement("div");
  el.className = "hs-page hs-page--locked";
  el.dataset.density = "soft";
  el.innerHTML = `<div class="hs-locked"><div class="hs-locked__icon">🔒</div><p class="hs-locked__title"></p><p class="hs-locked__text"></p></div>`;
  el.querySelector(".hs-locked__title")!.textContent = title;
  el.querySelector(".hs-locked__text")!.textContent = text;
  return el;
}

export function MagazineReader({ slug, title, backHref, shareToken }: MagazineReaderProps) {
  const t = useTranslations("reader");
  const { status } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

  const [data, setData] = useState<MagazinePagesResponse | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [current, setCurrent] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useReaderProtection(rootRef);

  // 1. Ask for signed page URLs once we know whether the reader is logged in (a share link doesn't depend on login)
  const accessKey = shareToken ? "share" : status;
  useEffect(() => {
    if (accessKey === "loading") return;
    const controller = new AbortController();
    fetchMagazinePages(slug, controller.signal, shareToken)
      .then((res) => {
        setData(res);
        setError(false);
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [slug, accessKey, attempt, shareToken]);

  const lockedCount = data && !data.unlocked ? data.totalPages - data.pages.length : 0;

  // 2. Build the flipbook (page-flip manipulates the DOM directly, so pages are created outside React)
  useEffect(() => {
    const container = bookRef.current;
    if (!data || !container || !data.pages.length) return;
    let cancelled = false;

    const fit = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const ratio = data.pages[0].width / data.pages[0].height;
      const availableHeight = Math.max(360, window.innerHeight - TOOLBAR_SPACE);
      const spread = window.innerWidth >= 768 ? 2 : 1;
      container.style.maxWidth = `${Math.floor(availableHeight * ratio * spread)}px`;
    };
    fit();

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (cancelled) return;
      container.innerHTML = "";
      const host = document.createElement("div");
      container.appendChild(host);

      const elements = data.pages.map((page, i) => createPageElement(page, i === 0));
      if (lockedCount > 0) elements.push(createLockedPageElement(t("lockedTitle"), t("lockedText", { count: lockedCount })));
      elements.forEach((el) => host.appendChild(el));

      const flip = new PageFlip(host, {
        width: data.pages[0].width,
        height: data.pages[0].height,
        size: "stretch",
        minWidth: 280,
        maxWidth: 1400,
        minHeight: 380,
        maxHeight: 1980,
        showCover: true,
        usePortrait: true,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.45,
        flippingTime: 750,
        showPageCorners: true,
        startPage: Math.min(startPage - 1, elements.length - 1),
      });
      flip.loadFromHTML(elements);
      flip.on("flip", (e) => setCurrent(e.data));
      flip.on("changeOrientation", (e) => setOrientation(e.data));
      setOrientation(flip.getOrientation());
      setCurrent(flip.getCurrentPageIndex());
      flipRef.current = flip;
    })();

    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fit);
      try {
        flipRef.current?.destroy();
      } catch {
        // already torn down
      }
      flipRef.current = null;
      container.innerHTML = "";
    };
    // startPage is only used for the first render of each data set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lockedCount]);

  const next = useCallback(() => flipRef.current?.flipNext(), []);
  const prev = useCallback(() => flipRef.current?.flipPrev(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen || thumbsOpen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, zoomOpen, thumbsOpen]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch {
      // fullscreen not allowed (e.g. iOS Safari) — ignore
    }
  };

  const totalPages = data?.totalPages ?? 0;
  const readablePages = data?.pages ?? [];
  const onLockedPage = Boolean(data && lockedCount > 0 && current >= readablePages.length - (orientation === "landscape" ? 1 : 0));
  const visible = orientation === "landscape" && current > 0 ? [current, current + 1] : [current];
  const visiblePages = visible.map((i) => readablePages[i]).filter((p): p is MagazinePage => Boolean(p));
  const pageLabel = visiblePages.length ? visiblePages.map((p) => p.number).join("–") : String(Math.min(current + 1, totalPages));
  const nextPath = `${pathname}?page=${Math.min(current + 1, totalPages)}`;

  const toolbarButton = "inline-flex size-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40";

  return (
    <>
    <div ref={rootRef} data-protected className="relative flex h-dvh select-none flex-col overflow-hidden bg-[#0d1424] text-white">
      {/* Top toolbar */}
      <header className="relative z-20 flex items-center gap-2 border-b border-white/10 bg-black/30 px-3 py-2.5 backdrop-blur sm:gap-4 sm:px-5">
        <Link href={backHref} aria-label={t("back")} title={t("back")} className={toolbarButton}>
          <ArrowLeft className="size-5" />
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-base">{title}</p>
        {data && (
          <p className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums sm:block" aria-live="polite">
            {t("pageOf", { current: pageLabel, total: totalPages })}
          </p>
        )}
        <button type="button" onClick={() => setZoomOpen(true)} disabled={!visiblePages.length} aria-label={t("zoomIn")} title={t("zoomIn")} className={toolbarButton}>
          <ZoomIn className="size-5" />
        </button>
        <button type="button" onClick={() => setThumbsOpen(true)} disabled={!data} aria-label={t("thumbnails")} title={t("thumbnails")} className={toolbarButton}>
          <LayoutGrid className="size-5" />
        </button>
        <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? t("exitFullscreen") : t("fullscreen")} title={fullscreen ? t("exitFullscreen") : t("fullscreen")} className={cn(toolbarButton, "hidden sm:inline-flex")}>
          {fullscreen ? <Minimize className="size-5" /> : <Expand className="size-5" />}
        </button>
      </header>

      {/* Stage */}
      <div ref={stageRef} className="relative flex flex-1 items-center justify-center px-2 py-4 sm:px-16">
        {!data && !error && (
          <div className="flex flex-col items-center gap-3 text-white/70" role="status">
            <Loader2 className="size-8 animate-spin text-cta" />
            {t("loading")}
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-4 text-center" role="alert">
            <p className="max-w-sm text-white/80">{t("error")}</p>
            <button type="button" onClick={() => setAttempt((a) => a + 1)} className={buttonClasses("primary", "sm")}>
              <RotateCcw className="size-4" />
              {t("retry")}
            </button>
          </div>
        )}
        <div ref={bookRef} className={cn("hs-book w-full", !data && "hidden")} />

        {data && (
          <>
            <button type="button" onClick={prev} disabled={current === 0} aria-label={t("prev")} className="absolute left-1 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:inline-flex">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={next} aria-label={t("next")} className="absolute right-1 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:inline-flex">
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <footer className="relative z-20 flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-4 py-2.5 text-xs text-white/70 backdrop-blur">
        <p className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-cta" />
          {data && !data.unlocked ? t("previewNote", { count: data.previewPages }) : shareToken ? t("sharedNote") : t("protectedNote")}
        </p>
        <div className="flex items-center gap-1 sm:hidden">
          <button type="button" onClick={prev} aria-label={t("prev")} className={toolbarButton}>
            <ChevronLeft className="size-5" />
          </button>
          <span className="tabular-nums">{data ? `${pageLabel}/${totalPages}` : ""}</span>
          <button type="button" onClick={next} aria-label={t("next")} className={toolbarButton}>
            <ChevronRight className="size-5" />
          </button>
        </div>
        <p className="hidden md:block">{t("keyboardHint")}</p>
      </footer>

      {/* Locked: ask to log in */}
      <AnimatePresence>
        {onLockedPage && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="absolute inset-x-3 bottom-16 z-30 mx-auto max-w-md rounded-card bg-surface p-5 text-center text-ink shadow-lift sm:bottom-20 sm:p-6"
          >
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-cta-soft text-cta">
              <Lock className="size-6" />
            </span>
            <p className="mt-3 font-serif text-xl font-bold text-primary">{t("lockedTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("lockedText", { count: lockedCount })}</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link href={`${routes.login}?next=${encodeURIComponent(nextPath)}`} className={buttonClasses("primary", "md", "flex-1")}>
                <LogIn className="size-4" />
                {t("login")}
              </Link>
              <Link href={routes.register} className={buttonClasses("outline", "md", "flex-1")}>
                <UserPlus className="size-4" />
                {t("register")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnails */}
      <AnimatePresence>
        {thumbsOpen && data && (
          <motion.div className="absolute inset-0 z-40 flex flex-col bg-[#0d1424]/95 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="font-semibold">{t("thumbnails")}</p>
              <button type="button" onClick={() => setThumbsOpen(false)} aria-label={t("closeZoom")} className={toolbarButton}>
                <X className="size-5" />
              </button>
            </div>
            <ul className="grid flex-1 grid-cols-3 content-start gap-4 overflow-y-auto px-5 pb-8 sm:grid-cols-5 lg:grid-cols-8">
              {Array.from({ length: totalPages }, (_, i) => {
                const page = readablePages[i];
                const active = visible.includes(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={!page && i > readablePages.length}
                      onClick={() => {
                        flipRef.current?.turnToPage(Math.min(i, readablePages.length));
                        setThumbsOpen(false);
                      }}
                      className={cn("group block w-full text-center", !page && "cursor-not-allowed")}
                    >
                      <span
                        className={cn(
                          "relative block aspect-[1/1.414] overflow-hidden rounded bg-white/5 bg-cover bg-center ring-2 transition",
                          active ? "ring-cta" : "ring-transparent group-hover:ring-white/40",
                        )}
                        style={page ? { backgroundImage: `url("${page.thumb}")` } : undefined}
                      >
                        {!page && (
                          <span className="absolute inset-0 flex items-center justify-center text-white/40">
                            <Lock className="size-5" />
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block text-xs text-white/70">{i + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomOpen && visiblePages.length > 0 && (
          <ZoomViewer pages={visiblePages} labels={{ zoomIn: t("zoomIn"), zoomOut: t("zoomOut"), reset: t("resetZoom"), close: t("closeZoom") }} onClose={() => setZoomOpen(false)} />
        )}
      </AnimatePresence>

    </div>
    {/* Shown instead of the magazine if someone tries to print */}
    <p data-print-message className="p-10 text-center text-ink">
      {t("printBlocked")}
    </p>
    </>
  );
}
