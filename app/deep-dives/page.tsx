import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { DeepDiveHeader } from "@/components/deep-dives/DeepDiveHeader";
import { DraftBadge } from "@/components/deep-dives/DraftBadge";
import { AppLink } from "@/components/navigation/AppLink";
import { deepDiveLibrary, deepDives, getDeepDivePhases } from "@/lib/deep-dives";
import { siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: deepDiveLibrary.title,
  description: deepDiveLibrary.description,
  alternates: {
    canonical: "/deep-dives",
  },
  openGraph: {
    title: `${deepDiveLibrary.socialTitle} | ${siteTitle}`,
    description: deepDiveLibrary.description,
    url: "/deep-dives",
    siteName: siteTitle,
    type: "website",
    images: [
      {
        url: `${siteUrl}/deep-dives/opengraph-image`,
        width: 1200,
        height: 630,
        alt: deepDiveLibrary.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${deepDiveLibrary.socialTitle} | ${siteTitle}`,
    description: deepDiveLibrary.description,
    images: [
      {
        url: `${siteUrl}/deep-dives/opengraph-image`,
        alt: deepDiveLibrary.ogAlt,
      },
    ],
  },
};

export default function DeepDivesPage() {
  const phases = getDeepDivePhases();

  return (
    <main className="min-h-screen bg-page font-serif text-ink">
      <DeepDiveHeader />

      {/* Hero */}
      <section className="border-b border-ink/15">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Deep dives
          </p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)] font-light leading-[0.92]">
            {deepDiveLibrary.headline}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-7 text-ink/60">
            {deepDiveLibrary.intro}
          </p>
        </div>
      </section>

      {/* Phase-grouped article list */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="space-y-16">
          {phases.map((phase) => {
            const phaseDives = deepDives.filter((d) => d.phase === phase);

            return (
              <div key={phase}>
                {/* Phase header */}
                <div className="mb-6 flex items-baseline justify-between border-b border-ink/15 pb-3">
                  <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-muted">
                    {phase}
                  </h2>
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-ink/30">
                    {phaseDives.length}{" "}
                    {phaseDives.length === 1 ? "article" : "articles"}
                  </span>
                </div>

                {/* Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {phaseDives.map((dive) => (
                    <AppLink
                      key={dive.slug}
                      href={`/deep-dives/${dive.slug}`}
                      className="group flex flex-col justify-between border border-ink/15 bg-page p-6 transition-colors hover:border-accent/40 hover:bg-panel"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <DraftBadge />
                          <ArrowUpRight
                            aria-hidden="true"
                            size={16}
                            className="text-ink/25 transition-colors group-hover:text-accent"
                          />
                        </div>
                        <h3 className="mt-5 text-2xl leading-tight text-ink">
                          {dive.title}
                        </h3>
                        <p className="mt-3 font-sans text-sm leading-6 text-ink/55">
                          {dive.description}
                        </p>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-2 font-sans text-[10px] uppercase tracking-[0.18em] text-muted">
                        <span>{dive.artifact}</span>
                        <span aria-hidden="true">·</span>
                        <span>{dive.readTime}</span>
                      </div>
                    </AppLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
