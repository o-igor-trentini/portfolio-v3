import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "./About";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("About", () => {
  it("renders the about section with the years token resolved", () => {
    renderWithPortfolio(<About />);
    expect(
      screen.getByRole("heading", { level: 2, name: i18n.en.about.label }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\{years\}/)).toBeNull();
    expect(screen.getByText(/\d+ years/)).toBeInTheDocument();
  });
});
