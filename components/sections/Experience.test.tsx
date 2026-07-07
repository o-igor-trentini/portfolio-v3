import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Experience } from "./Experience";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { experiences } from "@/lib/content";

describe("Experience", () => {
  it("renders each company as an h3 (heading-navigable)", () => {
    renderWithPortfolio(<Experience />);
    for (const e of experiences) {
      expect(screen.getByRole("heading", { level: 3, name: e.company })).toBeInTheDocument();
    }
  });

  it("lists the ongoing role first with a 'present' period", () => {
    renderWithPortfolio(<Experience />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent(experiences[0].company);
    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });
});
