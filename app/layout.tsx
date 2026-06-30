import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgentationDev } from "./AgentationDev";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hackathons.ralfboltshauser.com"),
  title: {
    default: "Hackathon Guidebook",
    template: "%s | Hackathon Guidebook",
  },
  description:
    "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
  applicationName: "Hackathon Guidebook",
  authors: [{ name: "Ralf Boltshauser", url: "https://ralfboltshauser.com" }],
  creator: "Ralf Boltshauser",
  publisher: "Ralf Boltshauser",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hackathon Guidebook",
    description:
      "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
    url: "/",
    siteName: "Hackathon Guidebook",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hackathon Guidebook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon Guidebook",
    description:
      "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
    images: ["/twitter-image"],
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
        {children}
        <Analytics />
        <AgentationDev />
      </body>
    </html>
  );
}
