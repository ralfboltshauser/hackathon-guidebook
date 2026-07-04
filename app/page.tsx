import { Guidebook } from "./Guidebook";
import { siteAuthors, siteDescription, siteUrl } from "@/lib/site";

const guidebookStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hackathon Guidebook",
  url: siteUrl,
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

export default function Home() {
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
