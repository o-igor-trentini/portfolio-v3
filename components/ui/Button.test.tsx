import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("applies the base reset and defaults type to button", () => {
    render(<Button>go</Button>);
    const btn = screen.getByRole("button", { name: "go" });
    expect(btn).toHaveClass("btn");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("maps the variant to its class", () => {
    render(<Button variant="accent">go</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn", "btn-accent");
  });

  it("composes extra className and forwards onClick and aria props", () => {
    const onClick = vi.fn();
    render(
      <Button className="chip-btn" aria-label="expand" onClick={onClick}>
        +
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "expand" });
    expect(btn).toHaveClass("btn", "chip-btn");

    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("lets an explicit type override the default", () => {
    render(<Button type="submit">send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
