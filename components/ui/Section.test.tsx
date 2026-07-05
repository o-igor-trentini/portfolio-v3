import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("renders id, prefixed label, note and children", () => {
    const { container } = render(
      <Section id="about" label="about" note="a note">
        <p>body</p>
      </Section>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "about");
    expect(section).toHaveClass("section");
    expect(section).not.toHaveClass("section--hero");

    const label = screen.getByText("// about");
    expect(label).toHaveClass("section__label");
    expect(label).not.toHaveClass("section__label--solo");

    expect(screen.getByText("a note")).toHaveClass("section__note");
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("uses the solo label modifier and omits the note (About-style)", () => {
    const { container } = render(
      <Section id="about" label="about" solo>
        <p>body</p>
      </Section>,
    );

    expect(container.querySelector(".section__note")).toBeNull();
    expect(screen.getByText("// about")).toHaveClass("section__label", "section__label--solo");
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
    expect(container.querySelector(".section__label")).toBeNull();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
});
