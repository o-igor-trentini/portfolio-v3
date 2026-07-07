import { ImageResponse } from "next/og";
import { accentMap, canvas, siteConfig } from "@/site.config";

// Statically generated at build time; compatible with `output: export`.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const accent = accentMap[siteConfig.accent].d;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: canvas.dark,
        color: accent,
        fontSize: 104,
        fontWeight: 700,
        letterSpacing: -6,
      }}
    >
      {">_"}
    </div>,
    { ...size },
  );
}
