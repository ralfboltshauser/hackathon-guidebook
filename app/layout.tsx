import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Space_Grotesk,
  Archivo_Black,
  DM_Serif_Display,
} from "next/font/google";
import { AgentationDev } from "./AgentationDev";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hackathons.ralfboltshauser.com"),
  title: {
    default: "GoodBoys Hackathon GuideBook",
    template: "%s | GoodBoys Hackathon GuideBook",
  },
  description:
    "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
  applicationName: "GoodBoys Hackathon GuideBook",
  authors: [{ name: "Ralf Boltshauser", url: "https://ralfboltshauser.com" }],
  creator: "Ralf Boltshauser",
  publisher: "Ralf Boltshauser",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GoodBoys Hackathon GuideBook",
    description:
      "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
    url: "/",
    siteName: "GoodBoys Hackathon GuideBook",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GoodBoys Hackathon GuideBook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodBoys Hackathon GuideBook",
    description:
      "A field-tested playbook and checklist for running hackathons with a win-oriented team.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${archivoBlack.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AgentationDev />
      </body>
    </html>
  );
}
