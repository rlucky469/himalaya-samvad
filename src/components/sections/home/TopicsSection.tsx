import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reveal } from "@/components/ui/reveal";
import { TopicIcon } from "@/components/icons/topic-icons";
import { routes } from "@/config/routes";
import type { Topic } from "@/types/content";

export async function TopicsSection({ topics, articleCounts }: { topics: Topic[]; articleCounts: Record<string, number> }) {
  const t = await getTranslations("home.topics");
  return (
    <Section tone="mist">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, i) => {
          return (
            <Link
              key={topic.slug}
              //href={routes.topic(topic.slug)}
               href="#"
              {...reveal(i)}
              className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-soft hover:shadow-lift sm:p-7"
            >
              <span aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-primary-tint transition-transform duration-500 group-hover:scale-150" />
              <span className="relative flex items-start justify-between">
                <span className="inline-flex size-13 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-all duration-300 group-hover:rotate-6 group-hover:bg-primary group-hover:text-white">
                  <TopicIcon slug={topic.slug} aria-hidden className="size-6" />
                </span>
                {/* <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{t("articleCount", { count: articleCounts[topic.slug] ?? 0 })}</span> */}
              </span>
              <h3 className="relative mt-5 text-2xl">{topic.title}</h3>
              <p className="relative mt-2 flex-1 text-ink-soft">{topic.short}</p>
              {/* <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {t("cta")}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span> */}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
