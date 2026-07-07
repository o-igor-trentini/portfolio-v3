import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Certs } from "./Certs";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { certs } from "@/lib/content";

describe("Certs", () => {
  it("renders the EmptyState while the certifications list is empty", () => {
    // Guards the current published state: certs is intentionally empty.
    expect(certs).toHaveLength(0);
    renderWithPortfolio(<Certs />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });
});
