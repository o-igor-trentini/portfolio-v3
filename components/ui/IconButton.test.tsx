import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("applies the iconbtn base, forwards the label, children and onClick", () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="menu" onClick={onClick}>
        <svg />
      </IconButton>,
    );
    const btn = screen.getByRole("button", { name: "menu" });
    expect(btn).toHaveClass("iconbtn");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.querySelector("svg")).not.toBeNull();

    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("composes an extra className", () => {
    render(
      <IconButton aria-label="menu" className="nav-burger">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "menu" })).toHaveClass("iconbtn", "nav-burger");
  });
});
