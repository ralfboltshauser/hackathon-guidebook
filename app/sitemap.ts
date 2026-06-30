import type { MetadataRoute } from "next";

const siteUrl = "https://www.hackathon-guidebook.com";
const lastModified = new Date("2026-06-30T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
