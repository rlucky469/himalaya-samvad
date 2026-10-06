import { ArrowRight, BookOpen, HeartHandshake, MapPin, Newspaper, PenLine, Send, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IssueCover } from "@/components/cards/IssueCover";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArticleFilter } from "@/components/sections/articles/ArticleFilter";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { issueCover } from "@/lib/media";
import type { Article, Issue, Topic } from "@/types/content";

/** readHref lets a private share page open the reader through its share link */
export async function IssueHero({ issue, readHref = routes.reader(issue.slug) }: { issue: Issue; readHref?: string }) {
  const t = await getTranslations("issues.labels");
  const tn = await getTranslations("nav");
  return (
    <section className="relative overflow-hidden bg-mist bg-contour">
      <div aria-hidden className="absolute -right-32 top-10 size-[28rem] rounded-full bg-cta-soft blur-3xl" />
      <div className="container-site relative py-12 sm:py-16 lg:py-20">
        <Breadcrumbs tone="light" items={[{ label: tn("currentIssue"), href: routes.issue(issue.slug) }]} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="animate-fade-up">
            <IssueCover src={issueCover(issue.slug)} alt={t("coverAlt", { issue: issue.label })} priority />
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-white">
              <span aria-hidden className="size-1.5 rounded-full bg-white" />
              {issue.label} • {issue.month}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.3rem]">{issue.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{issue.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-ink-soft">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
                <Newspaper aria-hidden className="size-4 text-primary" />
                {t("issueNumber", { number: issue.number })}
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
                <BookOpen aria-hidden className="size-4 text-primary" />
                {t("monthly")}
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
                <MapPin aria-hidden className="size-4 text-primary" />
                {t("place")}
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={readHref} size="lg" icon={<BookOpen />} iconPosition="start">
                {t("readOnline")}
              </ButtonLink>
              <Link href={routes.membershipApply} className="inline-flex items-center gap-1.5 px-2 py-3 font-semibold text-primary hover:text-accent">
                <UserPlus aria-hidden className="size-4.5" />
                {t("subscribeLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Editorial({ issue }: { issue: Issue }) {
  const t = await getTranslations("issues.labels");
  const { editorial } = issue;
  const quoteAfter = 2;
  return (
    <Section tone="white">
      <article className="mx-auto max-w-prose">
        <div {...reveal(0)}>
          <Eyebrow>{t("editorialEyebrow")}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{editorial.title}</h2>
          <span aria-hidden className="mt-5 block h-1 w-16 rounded-full bg-cta" />
        </div>
        <div className="prose-reading mt-8 font-serif">
          {editorial.paragraphs.map((p, i) => (
            <div key={i}>
              <p className={i === 0 ? "drop-cap" : undefined}>{p}</p>
              {i === quoteAfter && (
                <blockquote {...reveal(0, "zoom")} className="my-10 border-y-2 border-cta py-7 text-center font-serif text-2xl font-semibold italic leading-relaxed text-primary sm:text-[1.7rem]">
                  “{editorial.pullQuote}”
                </blockquote>
              )}
            </div>
          ))}
          <p className="font-semibold text-primary">{editorial.welcome}</p>
        </div>
        <footer className="mt-10 flex justify-end">
          <div className="text-right">
            <p className="font-serif text-xl font-bold text-primary">{editorial.signature}</p>
            <p className="text-muted">{editorial.signatureOrg}</p>
          </div>
        </footer>
      </article>
    </Section>
  );
}

export async function InThisIssue({ articles, topics, labels }: { articles: Article[]; topics: Topic[]; labels: { all: string; filter: string; empty: string } }) {
  const t = await getTranslations("issues.labels");
  const titles = Object.fromEntries(topics.map((tp) => [tp.slug, tp.title]));
  const items = await Promise.all(
    articles.map(async (a, i) => ({
      key: a.slug,
      topic: a.topic,
      featured: i === 0,
      content: <ArticleCard article={a} topicTitle={titles[a.topic]} variant={i === 0 ? "featured" : "grid"} />,
    })),
  );
  return (
    <Section tone="mist" id="articles">
      <SectionHeading eyebrow={t("inThisIssueEyebrow")} title={t("inThisIssueTitle")} subtitle={t("inThisIssueSubtitle")} />
      <ArticleFilter topics={topics.map((tp) => ({ slug: tp.slug, title: tp.title }))} items={items} allLabel={labels.all} filterLabel={labels.filter} emptyLabel={labels.empty} />
    </Section>
  );
}

export async function Gratitude({ text }: { text: string }) {
  const t = await getTranslations("issues.labels");
  return (
    <Section tone="white" spacing="md">
      <div {...reveal(0, "zoom")} className="mx-auto max-w-3xl text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-cta-soft text-cta">
          <HeartHandshake className="size-7" />
        </span>
        <Eyebrow className="mt-5 justify-center">{t("gratitudeEyebrow")}</Eyebrow>
        <p className="font-serif text-xl leading-relaxed text-primary sm:text-2xl">{text}</p>
      </div>
    </Section>
  );
}

export async function NextIssueCta() {
  const t = await getTranslations("issues.labels");
  const tj = await getTranslations("home.join");
  const email = siteConfig.contact.emails.editor;
  return (
    <Section tone="white" spacing="sm" className="pb-20 sm:pb-24">
      <div {...reveal(0)} className="relative isolate overflow-hidden rounded-panel bg-primary px-6 py-12 text-white sm:px-12">
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-mountain-silhouette" />
        <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-cta">{t("nextIssueEyebrow")}</p>
            <h2 className="mt-2 text-2xl text-white sm:text-3xl">{t("nextIssueTitle")}</h2>
            <p className="mt-3 text-on-dark-muted">{t("nextIssueText")}</p>
            <a href={`mailto:${email}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-white underline decoration-cta underline-offset-4">
              <Send aria-hidden className="size-4" />
              {email}
            </a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
            <ButtonLink href={routes.contactForm} icon={<PenLine />} iconPosition="start">
              {tj("writeCta")}
            </ButtonLink>
            <ButtonLink href={routes.membershipApply} variant="outlineLight" icon={<ArrowRight />}>
              {tj("subscribeCta")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
