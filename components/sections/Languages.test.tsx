import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Languages } from "./Languages";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { languages, langName, SCORE_MAX } from "@/lib/content";

describe("Languages", () => {
  it("renders a card per language with its localized name", () => {
    renderWithPortfolio(<Languages />);
    for (const l of languages) {
      expect(screen.getByText(langName(l, "en"))).toBeInTheDocument();
    }
  });

  it("draws a SCORE_MAX-segment bar per language, lit up to each score", () => {
    const { container } = renderWithPortfolio(<Languages />);
    expect(container.querySelectorAll(".seg")).toHaveLength(languages.length * SCORE_MAX);
    expect(container.querySelectorAll(".seg--on")).toHaveLength(
      languages.reduce((sum, l) => sum + l.score, 0),
    );
  });
});
