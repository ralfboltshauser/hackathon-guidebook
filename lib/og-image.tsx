import type { CSSProperties, ReactNode } from "react";
import { siteTitle } from "@/lib/site";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

const colors = {
  page: "#050608",
  ink: "#f4f0e8",
  accent: "#2f9bff",
};

const shellStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: colors.page,
  color: colors.ink,
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: 58,
  position: "relative",
};

const brandRowStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 26,
  letterSpacing: 5,
  textTransform: "uppercase",
  color: "rgba(244,240,232,0.68)",
};

const accentLabelStyle: CSSProperties = {
  color: colors.accent,
  fontSize: 28,
  letterSpacing: 4,
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  lineHeight: 0.92,
  letterSpacing: 0,
  fontFamily: "Georgia, Times New Roman, serif",
};

const descriptionStyle: CSSProperties = {
  maxWidth: 850,
  marginTop: 30,
  fontSize: 34,
  lineHeight: 1.3,
  color: "rgba(244,240,232,0.66)",
};

const footerStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 24,
  color: "rgba(244,240,232,0.54)",
};

export function OgImageShell({
  action,
  children,
  footerLeft,
  footerRight,
  showFooterRule = false,
  gradientStop = "34%",
}: {
  action: ReactNode;
  children: ReactNode;
  footerLeft: ReactNode;
  footerRight: ReactNode;
  showFooterRule?: boolean;
  gradientStop?: string;
}) {
  return (
    <div style={shellStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: `linear-gradient(135deg, rgba(47,155,255,0.22), rgba(47,155,255,0) ${gradientStop}, rgba(124,200,255,0.13) 100%)`,
        }}
      />
      {!showFooterRule && (
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
      )}
      <div style={brandRowStyle}>
        <span>{siteTitle}</span>
        {action}
      </div>

      {children}

      <div
        style={{
          ...footerStyle,
          ...(showFooterRule
            ? {
                borderTop: "1px solid rgba(244,240,232,0.22)",
                paddingTop: 24,
              }
            : {}),
        }}
      >
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>
  );
}

export function OgPill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        color: colors.accent,
        border: "1px solid rgba(47,155,255,0.55)",
        padding: "10px 16px",
      }}
    >
      {children}
    </span>
  );
}

export function OgMainContent({
  eyebrow,
  title,
  description,
  titleSize = 106,
  maxWidth = 950,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  titleSize?: number;
  maxWidth?: number;
}) {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      {eyebrow}
      <div
        style={{
          ...titleStyle,
          maxWidth,
          fontSize: titleSize,
        }}
      >
        {title}
      </div>
      <div style={descriptionStyle}>{description}</div>
    </div>
  );
}

export function OgEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...accentLabelStyle,
        marginBottom: 26,
      }}
    >
      {children}
    </div>
  );
}

export function OgMetaRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "center",
        ...accentLabelStyle,
        marginBottom: 26,
      }}
    >
      {children}
    </div>
  );
}

export function OgMetaDivider() {
  return <span style={{ color: "rgba(244,240,232,0.34)" }}>/</span>;
}

export function OgFallbackImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.page,
        color: colors.ink,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 86,
      }}
    >
      {siteTitle}
    </div>
  );
}
