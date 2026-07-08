import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackGroupCard } from "./StackGroupCard";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { ITEM_CAP } from "@/site.config";
import type { StackGroup } from "@/lib/content";

// A synthetic group larger than ITEM_CAP so the collapse/expand path is exercised
// (the real groups are all <= ITEM_CAP, so the toggle never appears for them).
const items = Array.from({ length: ITEM_CAP + 3 }, (_, i) => `tech-${i + 1}`);
const group: StackGroup = { label_en: "backend", label_pt: "backend", items };

describe("StackGroupCard", () => {
  it("caps the list and reveals the rest via the +N toggle", () => {
    renderWithPortfolio(<StackGroupCard group={group} />);

    // Only the first ITEM_CAP chips are shown; the overflow is hidden.
    expect(screen.getByText("tech-1")).toBeInTheDocument();
    expect(screen.queryByText(`tech-${ITEM_CAP + 1}`)).toBeNull();

    // The toggle advertises how many are hidden (+3) and its aria-label.
    const toggle = screen.getByRole("button", { name: /show 3 more/i });
    expect(toggle).toHaveTextContent("+3");

    fireEvent.click(toggle);
    expect(screen.getByText(`tech-${ITEM_CAP + 3}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
  });

  it("shows no toggle when the group fits within the cap", () => {
    const small: StackGroup = { label_en: "data", label_pt: "dados", items: ["A", "B"] };
    renderWithPortfolio(<StackGroupCard group={small} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
