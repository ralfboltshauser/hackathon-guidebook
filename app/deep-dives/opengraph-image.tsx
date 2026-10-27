import { ImageResponse } from "next/og";
import { deepDiveLibrary } from "@/lib/deep-dives";
import {
  OgEyebrow,
  OgImageShell,
  OgMainContent,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-image";

export const alt = deepDiveLibrary.ogAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return new ImageResponse(
    (
      <OgImageShell
        action={<span style={{ color: "#2f9bff" }}>Coming soon</span>}
        footerLeft="Hackathon Guidebook"
        footerRight="hackathon-guidebook.com/deep-dives"
        showFooterRule
        gradientStop="38%"
      >
        <OgMainContent
          eyebrow={<OgEyebrow>{deepDiveLibrary.title}</OgEyebrow>}
          title="Coming soon"
          description={deepDiveLibrary.description}
        />
      </OgImageShell>
    ),
    size,
  );
}
