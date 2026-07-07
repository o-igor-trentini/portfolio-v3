import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("Footer", () => {
  it("renders the built-with note and the terminal trigger", () => {
    renderWithPortfolio(<Footer />);
    expect(screen.getByText(i18n.en.footer.built)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: new RegExp(i18n.en.footer.terminalBtn, "i") }),
    ).toBeInTheDocument();
  });
});
