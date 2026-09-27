"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterItem {
  key: string;
  topic: string;
  featured?: boolean;
  content: ReactNode;
}

/** Topic chips + animated grid. Cards are rendered on the server and passed in as `content`. */
export function ArticleFilter({ topics, items, allLabel, filterLabel, emptyLabel }: { topics: { slug: string; title: string }[]; items: FilterItem[]; allLabel: string; filterLabel: string; emptyLabel: string }) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? items : items.filter((i) => i.topic === active);
  const usedTopics = topics.filter((t) => items.some((i) => i.topic === t.slug));

  return (
    <div>
      <div role="toolbar" aria-label={filterLabel} className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: "all", title: allLabel }, ...usedTopics].map((topic) => {
          const selected = active === topic.slug;
          const count = topic.slug === "all" ? items.length : items.filter((i) => i.topic === topic.slug).length;
          return (
            <button
              key={topic.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(topic.slug)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                selected ? "border-primary bg-primary text-white shadow-card" : "border-line-strong bg-surface text-ink-soft hover:border-primary hover:text-primary",
              )}
            >
              {topic.title}
              <span className={cn("rounded-full px-1.5 text-xs", selected ? "bg-white/20" : "bg-mist")}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong p-10 text-center text-muted">{emptyLabel}</p>
      ) : (
        <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <motion.li
                key={item.key}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 6) * 0.04 } }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={cn(item.featured && active === "all" && "sm:col-span-2")}
              >
                {item.content}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
