import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "./TagList";

describe("TagList", () => {
  it("renders one span per item with the given class", () => {
    const { container } = render(<TagList items={["Go", "SQL"]} className="chip" />);

    const spans = container.querySelectorAll("span.chip");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("Go");
    expect(spans[1]).toHaveTextContent("SQL");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<TagList items={[]} className="chip" />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });
});
