import { Guidebook } from "./Guidebook";

const guidebookStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hackathon Guidebook",
  url: "https://www.hackathon-guidebook.com",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "A field-tested guidebook and live checklist for winning hackathons: preparation, challenge strategy, discovery, building, demo reliability, and pitching.",
  author: [
    {
      "@type": "Person",
      name: "Ralf Boltshauser",
      url: "https://www.linkedin.com/in/ralfboltshauser/",
    },
    {
      "@type": "Person",
      name: "Konrad te Heesen",
      url: "https://www.linkedin.com/in/konrad-te-heesen-bb2876280/",
    },
  ],
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
