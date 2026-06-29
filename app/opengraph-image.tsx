import { ImageResponse } from "next/og";

export const alt = "GoodBoys Hackathon GuideBook";
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
          background: "#f6f1e7",
          color: "#241c12",
          padding: "64px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "sans-serif",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8a6d3b",
          }}
        >
          <span>GoodBoys</span>
          <span>Hackathon GuideBook</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 0.92,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Win the hack before you build.
          </div>
          <div
            style={{
              width: 160,
              height: 6,
              background: "#b4530a",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              maxWidth: 820,
              fontFamily: "sans-serif",
              fontSize: 32,
              lineHeight: 1.35,
              color: "rgba(36, 28, 18, 0.72)",
            }}
          >
            A field-tested playbook and checklist for running hackathons with a
            win-oriented team.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(36, 28, 18, 0.14)",
            paddingTop: 28,
            fontFamily: "sans-serif",
            fontSize: 24,
            color: "#b4530a",
          }}
        >
          <span>Learn mode</span>
          <span>Hack checklist</span>
          <span>Proof-backed</span>
        </div>
      </div>
    ),
    size,
  );
}
