import { ImageResponse } from "next/og";
import { getDeepDive } from "@/lib/deep-dives";
import {
  OgFallbackImage,
  OgImageShell,
  OgMainContent,
  OgMetaDivider,
  OgMetaRow,
  OgPill,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const deepDive = getDeepDive(slug);

  if (!deepDive) {
    return new ImageResponse(<OgFallbackImage />, size);
  }

  return new ImageResponse(
    (
      <OgImageShell
        action={<OgPill>Draft</OgPill>}
        footerLeft={`${deepDive.readTime} read`}
        footerRight={`hackathon-guidebook.com/deep-dives/${deepDive.slug}`}
      >
        <OgMainContent
          eyebrow={(
            <OgMetaRow>
              <span>{deepDive.phase}</span>
              <OgMetaDivider />
              <span>{deepDive.artifact}</span>
            </OgMetaRow>
          )}
          title={deepDive.socialTitle}
          description={deepDive.socialDescription}
          titleSize={deepDive.socialTitle.length > 22 ? 88 : 106}
          maxWidth={930}
        />
      </OgImageShell>
    ),
    size,
  );
}
