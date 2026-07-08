import { describe, expect, it } from "vitest";
import manifest from "./manifest";
import { canvas, siteConfig } from "@/site.config";

describe("manifest", () => {
  const out = manifest();

  it("names the app from siteConfig", () => {
    expect(out.name).toBe(`${siteConfig.name} · Portfolio`);
    expect(out.short_name).toBe(siteConfig.name);
    expect(out.start_url).toBe("/");
  });

  it("derives its colors from the shared canvas tokens", () => {
    expect(out.background_color).toBe(canvas.dark);
    expect(out.theme_color).toBe(siteConfig.defaultTheme === "light" ? canvas.light : canvas.dark);
  });

  it("references the extensionless generated icon routes", () => {
    const srcs = out.icons?.map((i) => i.src);
    expect(srcs).toContain("/icon");
    expect(srcs).toContain("/apple-icon");
  });
});
