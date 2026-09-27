"use client";

import { motion } from "motion/react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import type { MagazinePage } from "@/types/api";

interface ZoomViewerProps {
  pages: MagazinePage[];
  labels: { zoomIn: string; zoomOut: string; reset: string; close: string };
  onClose: () => void;
}

/** Full-screen pinch/scroll zoom of the current page(s). Pages are CSS backgrounds, never <img>. */
export function ZoomViewer({ pages, labels, onClose }: ZoomViewerProps) {
  const ratio = pages[0] ? pages[0].width / pages[0].height : 0.707;
  return (
    <motion.div className="fixed inset-0 z-[90] bg-black/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-protected>
      <TransformWrapper minScale={1} maxScale={5} initialScale={1} centerOnInit wheel={{ step: 0.15 }} doubleClick={{ mode: "toggle", step: 1.2 }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              {[
                { label: labels.zoomOut, Icon: Minus, onClick: () => zoomOut() },
                { label: labels.zoomIn, Icon: Plus, onClick: () => zoomIn() },
                { label: labels.reset, Icon: RotateCcw, onClick: () => resetTransform() },
                { label: labels.close, Icon: X, onClick: onClose },
              ].map(({ label, Icon, onClick }) => (
                <button key={label} type="button" onClick={onClick} aria-label={label} title={label} className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  <Icon className="size-5" />
                </button>
              ))}
            </div>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="flex h-[92vh] items-center justify-center gap-0.5">
                {pages.map((page) => (
                  <div
                    key={page.number}
                    className="h-full bg-white bg-cover bg-center shadow-2xl"
                    style={{ aspectRatio: String(ratio), backgroundImage: `url("${page.src}")`, maxWidth: `${92 / pages.length}vw` }}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </motion.div>
  );
}
