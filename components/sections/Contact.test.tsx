import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Contact } from "./Contact";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { contacts } from "@/lib/content";
import { i18n } from "@/lib/i18n";
import { format } from "@/lib/format";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Contact", () => {
  it("renders http contacts as safe external links carrying the new-tab cue", () => {
    renderWithPortfolio(<Contact />);
    for (const c of contacts.filter((c) => c.href.startsWith("http"))) {
      const label = screen.getByText(c.label);
      const anchor = label.closest("a");
      expect(anchor).toHaveAttribute("href", c.href);
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
      expect(anchor).toHaveTextContent(i18n.en.a11y.newTab);
    }
  });

  it("renders mailto contacts as plain in-place links (no new-tab affordances)", () => {
    renderWithPortfolio(<Contact />);
    for (const c of contacts.filter((c) => c.href.startsWith("mailto:"))) {
      const anchor = screen.getByText(c.label).closest("a");
      expect(anchor).toHaveAttribute("href", c.href);
      expect(anchor).not.toHaveAttribute("target");
      expect(anchor).not.toHaveTextContent(i18n.en.a11y.newTab);
    }
  });

  it("copies the full URL for web profiles and the bare address for email, then confirms", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    renderWithPortfolio(<Contact />);

    for (const c of contacts) {
      const expected = c.href.startsWith("http") ? c.href : c.value;
      fireEvent.click(
        screen.getByRole("button", { name: format(i18n.en.a11y.copy, { label: c.label }) }),
      );
      expect(writeText).toHaveBeenCalledWith(expected);
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: format(i18n.en.a11y.copied, { label: c.label }) }),
        ).toBeInTheDocument(),
      );
    }
  });
});
