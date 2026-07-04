import { ImageResponse } from "next/og";
import { deepDives } from "@/lib/deep-dives";
import { siteTitle } from "@/lib/site";

export const alt = "Hackathon Guidebook deep dives library";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
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
              "linear-gradient(135deg, rgba(47,155,255,0.2), rgba(47,155,255,0) 38%, rgba(124,200,255,0.12) 100%)",
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
          <span style={{ color: "#2f9bff" }}>{deepDives.length} drafts</span>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#2f9bff",
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 26,
            }}
          >
            Deep dives
          </div>
          <div
            style={{
              maxWidth: 950,
              fontSize: 106,
              lineHeight: 0.92,
              letterSpacing: 0,
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            Blocks for the parts that decide the weekend.
          </div>
          <div
            style={{
              maxWidth: 840,
              marginTop: 30,
              fontSize: 34,
              lineHeight: 1.3,
              color: "rgba(244,240,232,0.66)",
            }}
          >
            Pitching, demo reliability, challenge selection, videos, roles, and follow-up.
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(244,240,232,0.22)",
            paddingTop: 24,
            fontSize: 24,
            color: "rgba(244,240,232,0.54)",
          }}
        >
          <span>MD and MDX draft library</span>
          <span>hackathon-guidebook.com/deep-dives</span>
        </div>
      </div>
    ),
    size,
  );
}
