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
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e7",
          color: "#241c12",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 150,
              lineHeight: 1,
              letterSpacing: -4,
              fontWeight: 500,
            }}
          >
            GoodBoys
          </div>
          <div
            style={{
              width: 180,
              height: 4,
              background: "#b4530a",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              fontSize: 34,
              letterSpacing: 7,
              textTransform: "uppercase",
              color: "#8a6d3b",
            }}
          >
            Hackathon Guidebook
          </div>
        </div>
      </div>
    ),
    size,
  );
}
