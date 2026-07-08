import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("renders id, prefixed label heading, note and children", () => {
    const { container } = render(
      <Section id="about" label="about" note="a note">
        <p>body</p>
      </Section>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "about");
    expect(section).toHaveClass("section");
    expect(section).not.toHaveClass("section--hero");

    // The label is an <h2> whose accessible name is the bare label (the `// `
    // prefix is aria-hidden), and it names the section via aria-labelledby.
    const heading = screen.getByRole("heading", { level: 2, name: "about" });
    expect(heading).toHaveClass("section__label");
    expect(heading).not.toHaveClass("section__label--solo");
    expect(heading).toHaveTextContent("// about");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);

    expect(screen.getByText("a note")).toHaveClass("section__note");
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("applies the solo label modifier when there is no note (About-style)", () => {
    // `solo` is derived from the absence of a note, not passed as a prop.
    const { container } = render(
      <Section id="about" label="about">
        <p>body</p>
      </Section>,
    );

    expect(container.querySelector(".section__note")).toBeNull();
    const heading = screen.getByRole("heading", { level: 2, name: "about" });
    expect(heading).toHaveClass("section__label", "section__label--solo");
  });

  it("renders the hero variant without id or label", () => {
    const { container } = render(
      <Section variant="hero">
        <h1>Name</h1>
      </Section>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("section", "section--hero");
    expect(section).not.toHaveAttribute("id");
    expect(section).not.toHaveAttribute("aria-labelledby");
    expect(container.querySelector(".section__label")).toBeNull();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
});
