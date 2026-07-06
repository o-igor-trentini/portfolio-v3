import { afterEach, describe, expect, it } from "vitest";
import { applyConsent, getConsent, storeConsent } from "./consent";

afterEach(() => {
  localStorage.clear();
  delete window.dataLayer;
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
  it("pushes a consent update to the dataLayer", () => {
    applyConsent("granted");
    expect(window.dataLayer).toEqual([
      [
        "consent",
        "update",
        {
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        },
      ],
    ]);
  });

  it("preserves existing dataLayer entries", () => {
    window.dataLayer = [["consent", "default", {}]];
    applyConsent("denied");
    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer[1]).toEqual([
      "consent",
      "update",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
  });
});
