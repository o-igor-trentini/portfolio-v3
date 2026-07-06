import { ImageResponse } from "next/og";
import { accentMap, siteConfig } from "@/site.config";

// Statically generated at build time (no request-time API), so it works under
// `output: export`. Terminal-style prompt glyph in the site accent on dark.
export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const accent = accentMap[siteConfig.accent].d;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0e",
          color: accent,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        {">_"}
      </div>
    ),
    { ...size },
  );
}
