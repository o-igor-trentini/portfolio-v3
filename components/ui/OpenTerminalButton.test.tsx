import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OpenTerminalButton } from "./OpenTerminalButton";
import { Terminal } from "@/components/layout/Terminal";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("OpenTerminalButton", () => {
  it("renders its label with a decorative glyph and opens the terminal on click", () => {
    renderWithPortfolio(
      <>
        <OpenTerminalButton source="hero" label="open terminal" variant="accent" />
        <Terminal />
      </>,
    );

    const button = screen.getByRole("button", { name: "open terminal" });
    // The >_ glyph is decorative, so the accessible name is just the label.
    expect(button).toHaveTextContent(">_");
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(button);
    expect(screen.getByRole("dialog", { name: i18n.en.a11y.terminal })).toBeInTheDocument();
  });
});
