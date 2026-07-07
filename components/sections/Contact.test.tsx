import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Contact } from "./Contact";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { contacts } from "@/lib/content";
import { i18n } from "@/lib/i18n";

describe("Contact", () => {
  it("renders every contact as a safe external link carrying the new-tab cue", () => {
    renderWithPortfolio(<Contact />);
    for (const c of contacts) {
      const label = screen.getByText(c.label);
      const anchor = label.closest("a");
      expect(anchor).toHaveAttribute("href", c.href);
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
      expect(anchor).toHaveTextContent(i18n.en.a11y.newTab);
    }
  });
});
