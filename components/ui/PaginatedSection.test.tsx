import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaginatedSection } from "./PaginatedSection";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";

const props = {
  id: "demo",
  label: "demo",
  note: "a note",
  listClassName: "list",
  moreLabel: "show more",
  lessLabel: "show less",
  trackSection: "demo",
  getKey: (i: string) => i,
  renderItem: (i: string) => <span>{i}</span>,
};

describe("PaginatedSection", () => {
  it("renders the EmptyState fallback when there are no items", () => {
    renderWithPortfolio(<PaginatedSection {...props} items={[]} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("a")).toBeNull();
  });

  it("renders each item and no reveal control when everything fits on the first page", () => {
    renderWithPortfolio(<PaginatedSection {...props} items={["a", "b", "c"]} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("c")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("button", { name: /show more/i })).toBeNull();
  });
});
