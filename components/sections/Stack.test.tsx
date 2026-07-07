import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "./Stack";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { stackGroups, stackLabel } from "@/lib/content";

describe("Stack", () => {
  it("renders a group for each stack group with its localized label", () => {
    renderWithPortfolio(<Stack />);
    for (const g of stackGroups) {
      expect(screen.getByText(stackLabel(g, "en"))).toBeInTheDocument();
    }
  });
});
