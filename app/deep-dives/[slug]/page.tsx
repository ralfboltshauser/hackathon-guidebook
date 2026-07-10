import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { TrackView } from "@/app/TrackView";
import { DeepDiveHeader } from "@/components/deep-dives/DeepDiveHeader";
import { DraftBadge } from "@/components/deep-dives/DraftBadge";
import { deepDives, getDeepDive, getDeepDiveOgImagePath } from "@/lib/deep-dives";
import { siteAuthors, siteTitle } from "@/lib/site";

type DeepDivePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return deepDives.map((deepDive) => ({ slug: deepDive.slug }));
}

export async function generateMetadata({
  params,
}: DeepDivePageProps): Promise<Metadata> {
  const { slug } = await params;
  const deepDive = getDeepDive(slug);

  if (!deepDive) {
    return {};
  }

  return {
    title: `${deepDive.title} (Draft)`,
    description: deepDive.description,
    alternates: {
      canonical: `/deep-dives/${deepDive.slug}`,
    },
    authors: siteAuthors,
    keywords: [
      "hackathon",
      "hackathon guide",
      "hackathon deep dive",
      deepDive.title,
      deepDive.phase,
      deepDive.artifact,
    ],
    openGraph: {
      title: `${deepDive.socialTitle} | ${siteTitle}`,
      description: deepDive.socialDescription,
      url: `/deep-dives/${deepDive.slug}`,
      siteName: siteTitle,
      type: "article",
      authors: siteAuthors.map((author) => author.name),
      tags: ["hackathon", deepDive.phase, deepDive.artifact, deepDive.status],
      images: [
        {
          url: getDeepDiveOgImagePath(deepDive.slug),
          width: 1200,
          height: 630,
          alt: `${deepDive.title} draft deep dive from Hackathon Guidebook`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${deepDive.socialTitle} | ${siteTitle}`,
      description: deepDive.socialDescription,
      images: [
        {
          url: getDeepDiveOgImagePath(deepDive.slug),
          alt: `${deepDive.title} draft deep dive from Hackathon Guidebook`,
        },
      ],
    },
  };
}

export default async function DeepDivePage({ params }: DeepDivePageProps) {
  const { slug } = await params;
  const deepDive = getDeepDive(slug);

  if (!deepDive) {
    notFound();
  }

  const { default: Content } = await deepDive.loadContent();

  const related = deepDives
    .filter((d) => d.slug !== deepDive.slug)
    .filter((d) => d.phase === deepDive.phase)
    .slice(0, 3);

  const otherDives = related.length > 0
    ? related
    : deepDives.filter((d) => d.slug !== deepDive.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-page font-serif text-ink">
      <TrackView event="deep_dive_view" props={{ slug: deepDive.slug }} />
      <DeepDiveHeader />

      <article>
        {/* Wide article header */}
        <header className="border-b border-ink/15">
          <div className="mx-auto max-w-[56rem] px-4 py-10 sm:px-6 lg:py-14">
            <Link
              href="/deep-dives"
              className="inline-flex items-center gap-2 font-sans text-sm text-ink/50 transition-colors hover:text-accent"
            >
              <ArrowLeft aria-hidden="true" size={14} />
              Deep dives
            </Link>

            <div className="mt-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <DraftBadge />
                <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted">
                  {deepDive.phase} · {deepDive.artifact} · {deepDive.readTime}
                </span>
              </div>
              <h1 className="text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[0.93]">
                {deepDive.title}
              </h1>
              <p className="mt-6 font-sans text-lg leading-7 text-ink/60">
                {deepDive.description}
              </p>
            </div>
          </div>
        </header>

        {/* Centered narrow prose */}
        <div className="mx-auto max-w-[56rem] px-4 py-14 sm:px-6 lg:py-20">
          <Content />
        </div>
      </article>

      {/* Related articles footer */}
      {otherDives.length > 0 && (
        <footer className="border-t border-ink/15">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-muted">
              {related.length > 0 ? `More from ${deepDive.phase}` : "More deep dives"}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {otherDives.map((item) => (
                <Link
                  key={item.slug}
                  href={`/deep-dives/${item.slug}`}
                  className="group flex flex-col justify-between border border-ink/15 bg-page p-5 transition-colors hover:border-accent/40 hover:bg-panel"
                >
                  <div>
                    <h3 className="text-xl leading-snug text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-6 text-ink/50">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted">
                      {item.artifact} · {item.readTime}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={14}
                      className="text-ink/25 transition-colors group-hover:text-accent"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
