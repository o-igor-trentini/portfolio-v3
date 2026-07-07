import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { siteConfig } from "@/site.config";
import { i18n } from "@/lib/i18n";

describe("Hero", () => {
  it("renders the single page h1 with the name and the terminal CTA", () => {
    renderWithPortfolio(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(siteConfig.name);
    expect(
      screen.getByRole("button", { name: new RegExp(i18n.en.hero.cta, "i") }),
    ).toBeInTheDocument();
  });

  it("resolves the {years} token in the tagline to a concrete number", () => {
    renderWithPortfolio(<Hero />);
    expect(screen.queryByText(/\{years\}/)).toBeNull();
    expect(screen.getByText(/\d+ years/)).toBeInTheDocument();
  });
});
