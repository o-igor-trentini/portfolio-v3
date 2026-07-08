import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Workflow } from "./Workflow";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { i18n } from "@/lib/i18n";

describe("Workflow", () => {
  it("renders the workflow section with its label, note and body", () => {
    renderWithPortfolio(<Workflow />);
    expect(
      screen.getByRole("heading", { level: 2, name: i18n.en.workflow.label }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.en.workflow.note)).toBeInTheDocument();
    expect(screen.getByText(i18n.en.workflow.body)).toBeInTheDocument();
  });
});
