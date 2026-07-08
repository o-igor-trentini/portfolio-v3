import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MaybeExternalLink } from "./MaybeExternalLink";

describe("MaybeExternalLink", () => {
  it("renders an external anchor with safe target/rel for http(s) hrefs", () => {
    const { container } = render(
      <MaybeExternalLink href="https://example.com" className="x" newTabLabel="new tab">
        child
      </MaybeExternalLink>,
    );
    const a = container.querySelector("a");
    expect(a).toHaveAttribute("href", "https://example.com");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(a).toHaveClass("x");
    expect(container.querySelector(".sr-only")).toHaveTextContent("new tab");
  });

  it("renders a plain in-place anchor (no target/rel) for a mailto href", () => {
    const { container } = render(
      <MaybeExternalLink href="mailto:me@example.com" className="x">
        child
      </MaybeExternalLink>,
    );
    const a = container.querySelector("a");
    expect(a).toHaveAttribute("href", "mailto:me@example.com");
    expect(a).not.toHaveAttribute("target");
    expect(a).not.toHaveAttribute("rel");
  });

  it("renders the fallback element (no anchor) when there is no href", () => {
    const { container } = render(
      <MaybeExternalLink fallbackAs="article" className="x">
        child
      </MaybeExternalLink>,
    );
    expect(container.querySelector("a")).toBeNull();
    const article = container.querySelector("article");
    expect(article).toHaveClass("x");
    expect(article).toHaveTextContent("child");
  });

  it("fires onClick for both anchor branches but not for the fallback", () => {
    const onClick = vi.fn();
    const { container: ext } = render(
      <MaybeExternalLink href="https://example.com" onClick={onClick}>
        child
      </MaybeExternalLink>,
    );
    fireEvent.click(ext.querySelector("a")!);

    const { container: mail } = render(
      <MaybeExternalLink href="mailto:me@example.com" onClick={onClick}>
        child
      </MaybeExternalLink>,
    );
    fireEvent.click(mail.querySelector("a")!);
    expect(onClick).toHaveBeenCalledTimes(2);

    // The fallback element is non-interactive and carries no click handler.
    const { container: fb } = render(
      <MaybeExternalLink fallbackAs="article" onClick={onClick}>
        child
      </MaybeExternalLink>,
    );
    fireEvent.click(fb.querySelector("article")!);
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
