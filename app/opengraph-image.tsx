import { ImageResponse } from "next/og";

export const alt = "Hackathon Guidebook — Build What Wins";
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
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "#0b0b0a",
          color: "#f8f6f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            padding: "42px 48px 38px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(248,246,240,.35)",
              paddingTop: 12,
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontWeight: 800 }}>HG / 00</span>
            <span style={{ opacity: 0.55 }}>Field operating system</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 70,
              fontSize: 100,
              lineHeight: 0.78,
              letterSpacing: -7,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            <span>Code is the</span>
            <span style={{ marginLeft: 112 }}>easy part.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: "auto",
              borderTop: "1px solid rgba(248,246,240,.35)",
              paddingTop: 14,
              fontSize: 16,
            }}
          >
            <span style={{ maxWidth: 460, opacity: 0.68 }}>
              A field-tested guidebook and live checklist for teams serious
              about winning hackathons.
            </span>
            <span style={{ fontWeight: 800, letterSpacing: 2 }}>
              BUILD WHAT WINS →
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 112,
            right: -92,
            width: 470,
            height: 470,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "#ff4a16",
            color: "#0b0b0a",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 330,
              fontSize: 64,
              lineHeight: 1,
              letterSpacing: -5,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            <span>Winning</span>
            <span>is a</span>
            <span>system.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
