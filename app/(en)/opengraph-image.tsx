import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const alt = ogAlt("en");
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return renderOgImage("en");
}
