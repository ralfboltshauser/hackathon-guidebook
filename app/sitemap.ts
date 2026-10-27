import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const lastModified = new Date("2026-07-04T00:00:00.000Z");

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
    {
      url: `${siteUrl}/deep-dives`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
