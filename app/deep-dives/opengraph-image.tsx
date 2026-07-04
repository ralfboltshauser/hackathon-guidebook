import { ImageResponse } from "next/og";
import { deepDiveLibrary, deepDives } from "@/lib/deep-dives";
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
        action={<span style={{ color: "#2f9bff" }}>{deepDives.length} drafts</span>}
        footerLeft="MD and MDX draft library"
        footerRight="hackathon-guidebook.com/deep-dives"
        showFooterRule
        gradientStop="38%"
      >
        <OgMainContent
          eyebrow={<OgEyebrow>{deepDiveLibrary.title}</OgEyebrow>}
          title="Blocks for the parts that decide the weekend."
          description={deepDiveLibrary.socialDescription}
        />
      </OgImageShell>
    ),
    size,
  );
}
