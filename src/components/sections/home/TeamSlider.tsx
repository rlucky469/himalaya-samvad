"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TeamCard } from "@/components/cards/TeamCard";
import { reveal } from "@/components/ui/reveal";
import type { TeamMember } from "@/types/content";
import { cn } from "@/lib/utils";

interface TeamSliderProps {
  members: TeamMember[];
  labels: { region: string; prev: string; next: string };
}

const arrowClass =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-primary shadow-lift transition-all duration-300 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:flex";

/** 1 card per view on mobile, 2 on tablet, 4 on desktop — the rest scroll sideways */
export function TeamSlider({ members, labels }: TeamSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const slide = (direction: 1 | -1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => slide(-1)} disabled={edges.start} aria-label={labels.prev} className={cn(arrowClass, "-left-3 lg:-left-5")}>
        <ChevronLeft className="size-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        role="region"
        aria-label={labels.region}
        tabIndex={0}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-4 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:gap-5"
      >
        {members.map((member, i) => (
          <div key={member.id} {...reveal(i)} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
            <TeamCard member={member} />
          </div>
        ))}
      </div>

      <button type="button" onClick={() => slide(1)} disabled={edges.end} aria-label={labels.next} className={cn(arrowClass, "-right-3 lg:-right-5")}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}