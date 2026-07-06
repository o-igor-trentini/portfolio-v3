import { afterEach, describe, expect, it, vi } from "vitest";

// A measurement ID must be present for track() to do anything.
vi.mock("@/site.config", () => ({ siteConfig: { gaId: "G-TEST123" } }));
const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({ sendGAEvent: (...args: unknown[]) => sendGAEvent(...args) }));

import { track } from "./analytics";

afterEach(() => sendGAEvent.mockClear());

describe("track", () => {
  it("forwards an event with params to sendGAEvent", () => {
    track({ name: "terminal_open", params: { source: "hero" } });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "terminal_open", { source: "hero" });
  });

  it("sends an empty params object for events that have none", () => {
    track({ name: "konami_unlocked" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "konami_unlocked", {});
  });

  it("passes typed params through unchanged", () => {
    track({ name: "language_switch", params: { to: "pt" } });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "language_switch", { to: "pt" });
  });
});

describe("track without a measurement ID", () => {
  it("no-ops when siteConfig.gaId is unset", async () => {
    vi.resetModules();
    vi.doMock("@/site.config", () => ({ siteConfig: { gaId: undefined } }));
    const spy = vi.fn();
    vi.doMock("@next/third-parties/google", () => ({ sendGAEvent: spy }));
    const { track: trackNoGa } = await import("./analytics");

    trackNoGa({ name: "theme_toggle", params: { to: "dark" } });

    expect(spy).not.toHaveBeenCalled();
    vi.doUnmock("@/site.config");
    vi.doUnmock("@next/third-parties/google");
  });
});
