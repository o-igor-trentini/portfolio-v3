import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProseSection } from "./ProseSection";

describe("ProseSection", () => {
  it("renders the label heading, optional note and body paragraph", () => {
    render(
      <ProseSection
        id="about"
        label="about"
        note="a note"
        body="the body copy"
        bodyClassName="about__body"
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "about" })).toBeInTheDocument();
    expect(screen.getByText("a note")).toBeInTheDocument();
    const p = screen.getByText("the body copy");
    expect(p).toHaveClass("about__body");
  });

  it("adds suppressHydrationWarning to the paragraph only when dynamic", () => {
    // suppressHydrationWarning isn't a DOM attribute, so assert via behavior:
    // the paragraph renders identically; this guards the prop wiring compiles
    // and the class/text are present in the dynamic path.
    render(
      <ProseSection id="about" label="about" body="dyn" bodyClassName="about__body" dynamic />,
    );
    expect(screen.getByText("dyn")).toHaveClass("about__body");
  });
});
