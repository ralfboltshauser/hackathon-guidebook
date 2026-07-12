import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { DeepDiveHeader } from "@/components/deep-dives/DeepDiveHeader";
import { deepDiveLibrary, deepDives, getDeepDivePhases } from "@/lib/deep-dives";
import { siteAuthors, siteTitle, siteUrl } from "@/lib/site";

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

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(16, 16, 16, 0.07) 1px, transparent 1px)",
  backgroundSize: "25% 100%",
};

export default function DeepDivesPage() {
  const phases = getDeepDivePhases();
  const featuredDive = deepDives[0];
  const leadDives = deepDives.slice(1, 3);
  const remainingDives = deepDives.slice(3);

  return (
    <main className="min-h-screen bg-[#f7f7f4] font-sans text-[#101010] [--accent-strong:#2722aa] [--accent:#3834dc] [--ink:#101010] [--muted:#6f6f6f] [--page:#ffffff] [--panel-strong:#e7e7e3] [--panel:#f4f4f2]">
      <DeepDiveHeader />

      <div
        className="mx-auto max-w-[1024px] border-x border-black/10 bg-white"
        style={gridBackground}
      >
        <section className="grid min-h-[360px] grid-cols-1 border-b border-black/15 sm:grid-cols-4">
          <div className="px-5 pb-4 pt-12 sm:px-6 sm:pt-16">
            <p className="text-[10px] font-medium tracking-[0.14em] text-[#3834dc]">
              #003
            </p>
          </div>

          <div className="px-5 pb-14 sm:col-span-3 sm:px-6 sm:pb-16 sm:pt-16">
            <h1 className="text-[clamp(3rem,7vw,4.9rem)] font-normal leading-[0.94] tracking-[-0.055em] text-[#3834dc]">
              {deepDiveLibrary.title}
            </h1>
            <p className="mt-7 max-w-xl text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.08] tracking-[-0.035em] text-black">
              {deepDiveLibrary.headline}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-6 text-black/55">
              {deepDiveLibrary.intro}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2 border-b border-black/15 bg-[#f7f7f4]/90 px-4 py-3 sm:px-6">
          <span className="inline-flex h-7 w-10 items-center justify-center rounded-full border border-black bg-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3834dc]" />
            <span className="sr-only">All categories</span>
          </span>
          {phases.slice(0, 3).map((phase) => (
            <span
              key={phase}
              className="inline-flex h-7 items-center rounded-full border border-black bg-white px-3 text-[10px]"
            >
              {phase}
            </span>
          ))}
          <span className="ml-auto inline-flex h-7 min-w-28 items-center gap-2 rounded-full border border-black bg-white px-3 text-[10px] text-black/45">
            <Search aria-hidden="true" size={11} strokeWidth={1.6} />
            Search
          </span>
        </div>

        <section aria-label="Featured deep dives" className="grid border-b border-black/15 md:grid-cols-2">
          <Link
            href={`/deep-dives/${featuredDive.slug}`}
            className="group flex min-h-[560px] flex-col border-b border-black/15 bg-white p-4 transition-colors hover:bg-[#fafaf7] sm:p-6 md:border-b-0 md:border-r"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#ecece8]">
              <Image
                src="/hackathon-proof/start-hack.jpg"
                alt="Hackathon team presenting their work"
                fill
                loading="eager"
                sizes="(min-width: 768px) 496px, 100vw"
                className="object-cover grayscale transition duration-500 group-hover:scale-[1.015] group-hover:grayscale-0"
              />
            </div>

            <div className="flex flex-1 flex-col pt-5">
              <div className="flex items-center justify-between gap-4 text-[10px] text-black/48">
                <span>{featuredDive.phase}</span>
                <span>{featuredDive.readTime}</span>
              </div>
              <h2 className="mt-4 max-w-md text-[clamp(1.75rem,3.5vw,2.6rem)] leading-[1.02] tracking-[-0.04em]">
                {featuredDive.title}
              </h2>
              <p className="mt-3 text-sm text-black/48">By {siteAuthors[0].name}</p>
              <p className="mt-4 max-w-md text-sm leading-6 text-black/60">
                {featuredDive.description}
              </p>
              <span className="mt-auto w-fit rounded-full bg-[#3834dc] px-3 py-1.5 text-[10px] text-white transition-colors group-hover:bg-[#2722aa]">
                Read deep dive
                <ArrowUpRight aria-hidden="true" className="ml-1 inline" size={11} />
              </span>
            </div>
          </Link>

          <div className="grid bg-white md:grid-rows-2">
            {leadDives.map((dive, index) => (
              <Link
                key={dive.slug}
                href={`/deep-dives/${dive.slug}`}
                className={`group flex min-h-[280px] flex-col p-6 transition-colors hover:bg-[#fafaf7] sm:p-8 ${
                  index === 0 ? "border-b border-black/15" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] text-black/48">
                  <span>{dive.phase} · {dive.artifact}</span>
                  <span>{dive.readTime}</span>
                </div>
                <h2 className="mt-7 max-w-md text-[clamp(1.65rem,3.3vw,2.45rem)] leading-[1.02] tracking-[-0.04em]">
                  {dive.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-black/58">
                  {dive.description}
                </p>
                <span className="mt-auto w-fit rounded-full bg-[#3834dc] px-3 py-1.5 text-[10px] text-white transition-colors group-hover:bg-[#2722aa]">
                  Open article
                  <ArrowUpRight aria-hidden="true" className="ml-1 inline" size={11} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="all-deep-dives-heading" className="bg-white">
          <div className="border-b border-black/15 px-5 py-5 sm:px-6">
            <h2 id="all-deep-dives-heading" className="text-[10px] text-black/48">
              All field notes · {deepDives.length} draft articles
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {remainingDives.map((dive, index) => (
              <Link
                key={dive.slug}
                href={`/deep-dives/${dive.slug}`}
                className={`group flex min-h-[310px] flex-col border-black/15 p-5 transition-colors hover:bg-[#fafaf7] sm:p-6 ${
                  index < remainingDives.length - 1 ? "border-b" : ""
                } ${
                  index < remainingDives.length - 2 ? "sm:border-b" : "sm:border-b-0"
                } ${
                  index < remainingDives.length - 3 ? "lg:border-b" : "lg:border-b-0"
                } ${
                  index % 2 === 0 ? "sm:border-r" : "sm:border-r-0"
                } ${
                  index % 3 !== 2 ? "lg:border-r" : "lg:border-r-0"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] text-black/45">
                  <span>{dive.phase}</span>
                  <span>{String(index + 4).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 text-2xl leading-[1.04] tracking-[-0.035em]">
                  {dive.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-black/56">
                  {dive.description}
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-8">
                  <span className="text-[10px] text-black/42">
                    {dive.artifact} · {dive.readTime}
                  </span>
                  <span className="rounded-full bg-[#3834dc] px-2.5 py-1 text-[10px] text-white transition-colors group-hover:bg-[#2722aa]">
                    Read
                    <ArrowUpRight aria-hidden="true" className="ml-1 inline" size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
