import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteAuthors, siteDescription, siteTitle, siteUrl } from "@/lib/site";
import { AgentationOverlay } from "./AgentationOverlay";
import { PostHogProvider } from "./PostHogProvider";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteTitle} | How to Win Hackathons`,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    "hackathon guide",
    "hackathon checklist",
    "how to win hackathons",
    "hackathon playbook",
    "hackathon pitch",
    "hackathon demo",
    "startup hackathon",
  ],
  authors: siteAuthors,
  creator: "Ralf Boltshauser",
  publisher: "Ralf Boltshauser",
  category: "Education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteTitle} | How to Win Hackathons`,
    description: siteDescription,
    url: "/",
    siteName: siteTitle,
    type: "website",
    locale: "en_US",
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
    title: `${siteTitle} | How to Win Hackathons`,
    description: siteDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
        {process.env.NODE_ENV === "development" && <AgentationOverlay />}
        <Analytics />
      </body>
    </html>
  );
}
