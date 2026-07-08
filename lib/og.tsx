import { ImageResponse } from "next/og";
import { accentMap, canvas, siteConfig, PROMPT } from "@/site.config";
import { i18n, type Lang } from "@/lib/i18n";

// Shared 1200×630 Open Graph / Twitter card, rendered at build time (no
// request-time API), so it is statically emitted under `output: export`.
// Terminal aesthetic: dark canvas, window chrome, Go-accent name. No custom
// font is loaded (keeps the build self-contained); the default sans is fine
// against the box + accent styling.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BG = canvas.dark;
const FG = "#e4e4e7";
const MUTED = "#a1a1aa";
const BORDER = "#26262b";

export function ogAlt(lang: Lang): string {
  // seo.title already leads with the name, so don't prefix it again.
  return i18n[lang].seo.title;
}

export function renderOgImage(lang: Lang): ImageResponse {
  const accent = accentMap[siteConfig.accent].d;
  const t = i18n[lang];
  const host = siteConfig.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: BG,
        padding: 72,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* window title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 26px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#151518",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 13,
              height: 13,
              borderRadius: 999,
              background: "#3f3f46",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 13,
              height: 13,
              borderRadius: 999,
              background: "#3f3f46",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 13,
              height: 13,
              borderRadius: 999,
              background: accent,
            }}
          />
          <div style={{ display: "flex", marginLeft: 12, color: MUTED, fontSize: 26 }}>
            {`${PROMPT} whoami`}
          </div>
        </div>

        {/* body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "56px 60px" }}>
          <div
            style={{
              display: "flex",
              color: accent,
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", color: FG, fontSize: 40 }}>{`> ${t.hero.role}`}</div>
          <div style={{ display: "flex", color: MUTED, fontSize: 30, marginTop: 26 }}>
            {`~ ${host}`}
          </div>
        </div>
      </div>
    </div>,
    { ...ogSize },
  );
}
