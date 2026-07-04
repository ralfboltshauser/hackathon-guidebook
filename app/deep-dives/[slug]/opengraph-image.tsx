import { ImageResponse } from "next/og";
import { getDeepDive } from "@/lib/deep-dives";
import { siteTitle } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const deepDive = getDeepDive(slug);

  if (!deepDive) {
    return new ImageResponse(<FallbackImage />, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050608",
          color: "#f4f0e8",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: 58,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, rgba(47,155,255,0.22), rgba(47,155,255,0) 34%, rgba(124,200,255,0.13) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 58,
            right: 58,
            bottom: 58,
            height: 1,
            display: "flex",
            background: "rgba(244,240,232,0.22)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(244,240,232,0.68)",
          }}
        >
          <span>{siteTitle}</span>
          <span
            style={{
              color: "#2f9bff",
              border: "1px solid rgba(47,155,255,0.55)",
              padding: "10px 16px",
            }}
          >
            Draft
          </span>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              color: "#2f9bff",
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 26,
            }}
          >
            <span>{deepDive.phase}</span>
            <span style={{ color: "rgba(244,240,232,0.34)" }}>/</span>
            <span>{deepDive.artifact}</span>
          </div>
          <div
            style={{
              maxWidth: 930,
              fontSize: deepDive.socialTitle.length > 22 ? 88 : 106,
              lineHeight: 0.92,
              letterSpacing: 0,
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            {deepDive.socialTitle}
          </div>
          <div
            style={{
              maxWidth: 850,
              marginTop: 30,
              fontSize: 34,
              lineHeight: 1.3,
              color: "rgba(244,240,232,0.66)",
            }}
          >
            {deepDive.socialDescription}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(244,240,232,0.54)",
          }}
        >
          <span>{deepDive.readTime} read</span>
          <span>hackathon-guidebook.com/deep-dives/{deepDive.slug}</span>
        </div>
      </div>
    ),
    size,
  );
}

function FallbackImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050608",
        color: "#f4f0e8",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 86,
      }}
    >
      {siteTitle}
    </div>
  );
}
