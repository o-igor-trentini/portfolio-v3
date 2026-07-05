import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders a div with the card surface and its children", () => {
    render(<Card>content</Card>);
    const card = screen.getByText("content");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveClass("card");
  });

  it("composes an extra className", () => {
    render(<Card className="langcard">x</Card>);
    expect(screen.getByText("x")).toHaveClass("card", "langcard");
  });
});
