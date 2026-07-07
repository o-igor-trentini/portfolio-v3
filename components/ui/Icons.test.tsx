import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BurgerIcon, CloseIcon, MoonIcon, SunIcon } from "./Icons";

describe("Icons", () => {
  it("renders decorative SVGs hidden from the accessibility tree", () => {
    for (const Icon of [MoonIcon, SunIcon, BurgerIcon, CloseIcon]) {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });
});
