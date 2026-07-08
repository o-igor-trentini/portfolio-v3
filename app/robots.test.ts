import { describe, expect, it } from "vitest";
import robots from "./robots";
import { siteConfig } from "@/site.config";

describe("robots", () => {
  it("allows all agents and points at the sitemap and host", () => {
    const out = robots();
    expect(out.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(out.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(out.host).toBe(siteConfig.url);
  });
});
