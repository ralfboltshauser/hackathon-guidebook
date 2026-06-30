import { ImageResponse } from "next/og";

export const alt = "Hackathon Guidebook";
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
              fontSize: 118,
              lineHeight: 1,
              letterSpacing: -4,
              fontWeight: 500,
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
