import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("Header", () => {
  it("renders the section nav links", () => {
    renderWithPortfolio(<Header />);
    expect(screen.getByRole("link", { name: i18n.en.nav.about })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: i18n.en.nav.contact })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("marks the active locale on the language toggle", () => {
    renderWithPortfolio(<Header />, "en");
    expect(screen.getByRole("link", { name: "en" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "pt" })).not.toHaveAttribute("aria-current");
  });

  it("exposes a labelled theme toggle button", () => {
    renderWithPortfolio(<Header />);
    expect(
      screen.getByRole("button", { name: /switch to (light|dark) theme/i }),
    ).toBeInTheDocument();
  });
});
