import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DeepDiveHeader } from "@/components/deep-dives/DeepDiveHeader";
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

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(16, 16, 16, 0.07) 1px, transparent 1px)",
  backgroundSize: "25% 100%",
};

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
    <main className="min-h-screen bg-[#f7f7f4] font-sans text-[#101010] [--accent-strong:#2722aa] [--accent:#3834dc] [--ink:#101010] [--muted:#6f6f6f] [--page:#ffffff] [--panel-strong:#e7e7e3] [--panel:#f4f4f2]">
      <DeepDiveHeader />

      <div
        className="mx-auto max-w-[1024px] border-x border-black/10 bg-white"
        style={gridBackground}
      >
        <article>
          <header className="grid border-b border-black/15 sm:grid-cols-4">
            <div className="flex flex-col items-start gap-8 px-5 pb-5 pt-10 sm:px-6 sm:py-14">
              <p className="text-[10px] font-medium tracking-[0.14em] text-[#3834dc]">
                #003
              </p>
              <Link
                href="/deep-dives"
                className="inline-flex items-center gap-1.5 rounded-full border border-black bg-white px-3 py-1.5 text-[10px] transition-colors hover:border-[#3834dc] hover:text-[#3834dc]"
              >
                <ArrowLeft aria-hidden="true" size={11} />
                Deep Dives
              </Link>
            </div>

            <div className="px-5 pb-12 sm:col-span-3 sm:px-6 sm:py-14">
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-[#3834dc] px-3 py-1.5 text-white">
                  {deepDive.status}
                </span>
                <span className="rounded-full border border-black bg-white px-3 py-1.5">
                  {deepDive.phase}
                </span>
                <span className="rounded-full border border-black bg-white px-3 py-1.5">
                  {deepDive.artifact}
                </span>
                <span className="rounded-full border border-black bg-white px-3 py-1.5">
                  {deepDive.readTime}
                </span>
              </div>

              <h1 className="mt-9 max-w-3xl text-[clamp(2.65rem,6vw,4.8rem)] font-normal leading-[0.94] tracking-[-0.055em] text-[#101010]">
                {deepDive.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-7 text-black/58">
                {deepDive.description}
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 border-b border-black/15 bg-white lg:grid-cols-4">
            <aside className="min-w-0 border-b border-black/15 px-5 py-8 sm:px-6 lg:border-b-0 lg:border-r">
              <dl className="grid gap-6 text-[11px] sm:grid-cols-3 lg:sticky lg:top-20 lg:grid-cols-1">
                <div>
                  <dt className="text-black/38">Written by</dt>
                  <dd className="mt-1 text-black/72">{siteAuthors[0].name}</dd>
                </div>
                <div>
                  <dt className="text-black/38">Reading time</dt>
                  <dd className="mt-1 text-black/72">{deepDive.readTime}</dd>
                </div>
                <div>
                  <dt className="text-black/38">Working status</dt>
                  <dd className="mt-1 max-w-40 leading-5 text-black/72">
                    {deepDive.draftNote}
                  </dd>
                </div>
              </dl>
            </aside>

            <div className="min-w-0 px-5 py-12 sm:px-8 sm:py-16 lg:col-span-3 lg:px-12 lg:py-20">
              <div className="max-w-[42rem]">
                <Content />
              </div>
            </div>
          </div>
        </article>

        {otherDives.length > 0 && (
          <footer className="bg-white">
            <div className="flex items-center justify-between gap-5 border-b border-black/15 px-5 py-5 sm:px-6">
              <p className="text-[10px] text-black/48">
                {related.length > 0 ? `More from ${deepDive.phase}` : "More deep dives"}
              </p>
              <Link
                href="/deep-dives"
                className="text-[10px] text-[#3834dc] transition-colors hover:text-[#2722aa]"
              >
                View all
              </Link>
            </div>

            <div className="grid sm:grid-cols-3">
              {otherDives.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/deep-dives/${item.slug}`}
                  className={`group flex min-h-[270px] flex-col border-black/15 p-5 transition-colors hover:bg-[#fafaf7] sm:p-6 ${
                    index < otherDives.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""
                  }`}
                >
                  <span className="text-[10px] text-black/44">{item.phase}</span>
                  <h2 className="mt-7 text-2xl leading-[1.04] tracking-[-0.035em]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-black/54">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-8">
                    <span className="text-[10px] text-black/42">
                      {item.artifact} · {item.readTime}
                    </span>
                    <span className="rounded-full bg-[#3834dc] px-2.5 py-1 text-[10px] text-white transition-colors group-hover:bg-[#2722aa]">
                      Read
                      <ArrowUpRight aria-hidden="true" className="ml-1 inline" size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
