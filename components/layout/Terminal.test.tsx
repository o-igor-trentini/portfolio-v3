import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";
import { Terminal } from "./Terminal";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

// Footer carries an "open terminal" button wired to the same TerminalProvider,
// so rendering both lets us drive the open/close flow end to end.
const renderTerminal = () =>
  renderWithPortfolio(
    <>
      <Footer />
      <Terminal />
    </>,
  );
const open = () =>
  fireEvent.click(
    screen.getByRole("button", { name: new RegExp(i18n.en.footer.terminalBtn, "i") }),
  );

describe("Terminal", () => {
  it("renders nothing until opened", () => {
    renderTerminal();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens as a labelled modal dialog with a live output region", () => {
    renderTerminal();
    open();

    const dialog = screen.getByRole("dialog", { name: "Terminal" });
    expect(dialog).toHaveAttribute("aria-modal", "true");

    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
    // The intro is seeded on open.
    expect(log).toHaveTextContent(/type 'help'/i);
  });

  it("closes when the overlay backdrop is clicked", () => {
    const { container } = renderTerminal();
    open();
    fireEvent.click(container.querySelector(".term-overlay") as Element);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays open when the window itself is clicked (stopPropagation)", () => {
    renderTerminal();
    open();
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes via the close button", () => {
    renderTerminal();
    open();
    fireEvent.click(screen.getByRole("button", { name: /close terminal/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
