import { fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConsentBanner } from "./ConsentBanner";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

// The banner only appears when GA is configured, so force a measurement id.
vi.mock("@/site.config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/site.config")>();
  return { ...actual, siteConfig: { ...actual.siteConfig, gaId: "G-TEST" } };
});

describe("ConsentBanner", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("shows a consent dialog when no decision has been stored", () => {
    renderWithPortfolio(<ConsentBanner />);
    expect(screen.getByRole("dialog", { name: /consent/i })).toBeInTheDocument();
    expect(screen.getByText(i18n.en.consent.message)).toBeInTheDocument();
  });

  it("stores 'granted' and dismisses on accept", () => {
    renderWithPortfolio(<ConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: i18n.en.consent.accept }));
    expect(localStorage.getItem("pf_consent")).toBe("granted");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stores 'denied' and dismisses on decline", () => {
    renderWithPortfolio(<ConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: i18n.en.consent.decline }));
    expect(localStorage.getItem("pf_consent")).toBe("denied");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
