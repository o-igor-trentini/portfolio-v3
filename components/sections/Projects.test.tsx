import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Projects } from "./Projects";
import { renderWithPortfolio } from "@/test/renderWithPortfolio";
import { projects } from "@/lib/content";
import { PAGE } from "@/site.config";

describe("Projects", () => {
  it("renders project names as h3 headings, paginated to the first page", () => {
    renderWithPortfolio(<Projects />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(Math.min(PAGE, projects.length));
    expect(headings[0]).toHaveTextContent(projects[0].name);
  });

  it("reveals the rest of the projects on 'show more'", () => {
    renderWithPortfolio(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: /show more/i }));
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(projects.length);
  });

  it("renders linked projects as external anchors with a new-tab cue", () => {
    renderWithPortfolio(<Projects />);
    const linked = projects.find((p) => p.link);
    if (!linked) return;
    const heading = screen.getByRole("heading", { level: 3, name: linked.name });
    const anchor = heading.closest("a");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    expect(anchor?.querySelector(".sr-only")).not.toBeNull();
  });
});
