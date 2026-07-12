import type { MetadataRoute } from "next";
import { deepDives } from "@/lib/deep-dives";
import { siteUrl } from "@/lib/site";

const lastModified = new Date("2026-07-12T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/learn`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
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
    ...deepDives.map((deepDive) => ({
      url: `${siteUrl}/deep-dives/${deepDive.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
