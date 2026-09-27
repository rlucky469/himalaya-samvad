import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { articleImage } from "@/lib/media";
import type { Article } from "@/types/content";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  topicTitle: string;
  variant?: "grid" | "featured" | "compact";
  className?: string;
  priority?: boolean;
}

export async function ArticleCard({ article, topicTitle, variant = "grid", className, priority }: ArticleCardProps) {
  const t = await getTranslations("common");
  const href = routes.article(article.slug);
  const image = articleImage(article.slug);

  if (variant === "compact") {
    return (
      <Link href={href} className={cn("group flex gap-4 rounded-card border border-line bg-surface p-3.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft hover:shadow-lift sm:p-4", className)}>
        <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
          <Image src={image} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        </span>
        <span className="flex min-w-0 flex-col justify-center">
          <span className="text-xs font-semibold text-accent">
            {topicTitle} <span className="font-normal text-muted">• {t("minutesRead", { count: article.readMinutes })}</span>
          </span>
          <span className="mt-1 line-clamp-2 font-serif text-base font-bold leading-snug text-primary transition-colors group-hover:text-accent sm:text-lg">{article.title}</span>
          <span className="mt-1 text-xs text-muted">{article.author}</span>
        </span>
      </Link>
    );
  }

  const featured = variant === "featured";
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft hover:shadow-lift",
        className,
      )}
    >
      <span className={cn("relative block overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[16/10]")}>
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-white shadow">{topicTitle}</span>
        <span className="absolute right-4 top-4 inline-flex size-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4.5" />
        </span>
      </span>
      <span className={cn("flex flex-1 flex-col", featured ? "p-6 sm:p-7" : "p-5 sm:p-6")}>
        <span className={cn("font-serif font-bold leading-snug text-primary transition-colors group-hover:text-accent", featured ? "text-xl sm:text-2xl" : "text-lg")}>
          {article.title}
        </span>
        <span className={cn("mb-5 mt-2.5 text-ink-soft", featured ? "line-clamp-3" : "line-clamp-2 text-[0.95rem]")}>{article.excerpt}</span>
        <span className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
          <span className="font-medium text-ink-soft">{article.author}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" />
            {t("minutesRead", { count: article.readMinutes })}
          </span>
        </span>
      </span>
    </Link>
  );
}
