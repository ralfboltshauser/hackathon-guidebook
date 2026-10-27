import type { Metadata } from "next";
import { DeepDiveHeader } from "@/components/deep-dives/DeepDiveHeader";
import { deepDiveLibrary } from "@/lib/deep-dives";
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
  return (
    <main className="min-h-screen bg-page font-serif text-ink">
      <DeepDiveHeader />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
          Deep dives
        </p>
        <h1 className="mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)] font-light leading-[0.92]">
          Coming soon
        </h1>
      </section>
    </main>
  );
}
