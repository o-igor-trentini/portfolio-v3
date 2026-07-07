import { afterEach, describe, expect, it, vi } from "vitest";
import { applyConsent, getConsent, storeConsent } from "./consent";

afterEach(() => {
  localStorage.clear();
  delete window.gtag;
});

describe("getConsent", () => {
  it("returns null when nothing is stored", () => {
    expect(getConsent()).toBeNull();
  });

  it("returns the stored value when valid", () => {
    localStorage.setItem("pf_consent", "granted");
    expect(getConsent()).toBe("granted");
  });

  it("ignores an invalid stored value", () => {
    localStorage.setItem("pf_consent", "maybe");
    expect(getConsent()).toBeNull();
  });
});

describe("storeConsent", () => {
  it("persists the decision under pf_consent", () => {
    storeConsent("denied");
    expect(localStorage.getItem("pf_consent")).toBe("denied");
  });
});

describe("applyConsent", () => {
  it("calls gtag with a consent update in the arguments form gtag.js requires", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    applyConsent("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("propagates a denied update", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    applyConsent("denied");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("no-ops when gtag is not present (no GA on the page)", () => {
    expect(() => applyConsent("granted")).not.toThrow();
  });
});
