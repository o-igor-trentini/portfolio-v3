import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("EmptyState", () => {
  it("shows the shared wip message in a status region by default", () => {
    renderWithPortfolio(<EmptyState />);
    expect(screen.getByRole("status")).toHaveTextContent(i18n.en.common.wip);
  });

  it("prefers a custom message when provided", () => {
    renderWithPortfolio(<EmptyState message="nothing here yet" />);
    expect(screen.getByRole("status")).toHaveTextContent("nothing here yet");
  });
});
