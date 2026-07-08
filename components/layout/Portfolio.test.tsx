import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Portfolio } from "./Portfolio";
import { i18n } from "@/lib/i18n";

describe("Portfolio", () => {
  it("renders a skip link targeting the main landmark", () => {
    const { container } = render(<Portfolio initialLang="en" />);
    const skip = container.querySelector('a[href="#top"]');
    expect(skip).not.toBeNull();
    expect(skip).toHaveTextContent(i18n.en.a11y.skip);
  });

  it("marks <main> as the focusable #top landmark", () => {
    const { container } = render(<Portfolio initialLang="en" />);
    const main = container.querySelector("main#top");
    expect(main).not.toBeNull();
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("renders the content sections in the expected order", () => {
    const { container } = render(<Portfolio initialLang="en" />);
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual([
      "about",
      "workflow",
      "experience",
      "langs",
      "stack",
      "projects",
      "certs",
      "contact",
    ]);
  });
});
