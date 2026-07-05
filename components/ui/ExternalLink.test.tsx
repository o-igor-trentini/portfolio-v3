import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("always applies the safe target/rel and forwards href, className and children", () => {
    const { container } = render(
      <ExternalLink href="https://example.com" className="x">
        <span>child</span>
      </ExternalLink>,
    );

    const a = container.querySelector("a");
    expect(a).toHaveAttribute("href", "https://example.com");
    expect(a).toHaveAttribute("target", "_blank");
    // noreferrer is a security guarantee — this test guards it against regressions.
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(a).toHaveClass("x");
    expect(a).toHaveTextContent("child");
  });
});
