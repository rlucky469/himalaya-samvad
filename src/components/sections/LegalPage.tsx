import { CalendarClock, Info } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { pageHero } from "@/lib/media";

interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
}

export function LegalPage({ doc, href, updatedLabel, draftNote }: { doc: LegalDoc; href: string; updatedLabel: string; draftNote: string }) {
  return (
    <>
      <PageHero title={doc.title} image={pageHero("legal")} breadcrumbs={[{ label: doc.title, href }]} />
      <Section tone="white">
        <div className="mx-auto max-w-prose">
          <p className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 text-sm text-muted">
            <CalendarClock aria-hidden className="size-4" />
            {updatedLabel}: {doc.updated}
          </p>
          {/* Remove this notice once the legal advisor has approved the text */}
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-cta/30 bg-cta-soft px-4 py-3 text-sm text-ink-soft">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-cta" />
            {draftNote}
          </p>
          <div className="prose-reading mt-8">
            <p className="text-lg">{doc.intro}</p>
            {doc.sections.map((section, i) => (
              <section key={section.title}>
                <h2>
                  <span className="mr-2 text-accent">{i + 1}.</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-3">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
