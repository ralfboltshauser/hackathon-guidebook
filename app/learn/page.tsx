import type { Metadata } from "next";
import { Guidebook } from "@/app/Guidebook";
import { siteAuthors, siteDescription, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Guidebook",
  description: siteDescription,
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: `${siteTitle} | The Complete Playbook`,
    description: siteDescription,
    url: "/learn",
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
    title: `${siteTitle} | The Complete Playbook`,
    description: siteDescription,
    images: ["/twitter-image"],
  },
};

const guidebookStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteTitle,
  url: `${siteUrl}/learn`,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description: siteDescription,
  author: siteAuthors.map((author) => ({
    "@type": "Person",
    name: author.name,
    url: author.url,
  })),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
  },
};

export default function LearnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guidebookStructuredData),
        }}
      />
      <Guidebook />
    </>
  );
}
