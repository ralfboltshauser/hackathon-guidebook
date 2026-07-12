import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { guide, wins } from "@/app/guide";
import { siteAuthors, siteDescription, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Hackathon Guidebook — Build What Wins",
  },
  description:
    "A field-tested guidebook and live checklist for teams serious about winning hackathons.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hackathon Guidebook — Build What Wins",
    description:
      "Six phases, 26 sections, and 64 actionable checks—from preparation to post-event leverage.",
    url: "/",
    siteName: siteTitle,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteTitle} preview image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Guidebook — Build What Wins",
    description:
      "Six phases, 26 sections, and 64 actionable checks—from preparation to post-event leverage.",
    images: ["/twitter-image"],
  },
};

const landingStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteTitle,
  url: siteUrl,
  description: siteDescription,
  author: siteAuthors.map((author) => ({
    "@type": "Person",
    name: author.name,
    url: author.url,
  })),
};

const phaseSummaries = guide.map(({ n, title, sub, timebox }) => ({
  n,
  title,
  sub,
  timebox,
}));

const winSummaries = wins.map(({ event, place }) => ({ event, place }));

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingStructuredData),
        }}
      />
      <LandingExperience phases={phaseSummaries} wins={winSummaries} />
    </>
  );
}
