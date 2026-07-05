import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RevealControls } from "./RevealControls";

const noop = () => {};

describe("RevealControls", () => {
  it("renders nothing when there is nothing to reveal or collapse", () => {
    const { container } = render(
      <RevealControls
        hasMore={false}
        canCollapse={false}
        remaining={0}
        moreLabel="more"
        lessLabel="less"
        onMore={noop}
        onCollapse={noop}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the more button with the remaining count and fires onMore", () => {
    const onMore = vi.fn();
    render(
      <RevealControls
        hasMore
        canCollapse={false}
        remaining={3}
        moreLabel="more"
        lessLabel="less"
        onMore={onMore}
        onCollapse={noop}
      />,
    );

    const btn = screen.getByRole("button", { name: /more/ });
    expect(btn).toHaveTextContent("more (+3)");
    expect(btn).toHaveClass("btn", "btn-ghost");

    fireEvent.click(btn);
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("shows the less button and fires onCollapse", () => {
    const onCollapse = vi.fn();
    render(
      <RevealControls
        hasMore={false}
        canCollapse
        remaining={0}
        moreLabel="more"
        lessLabel="less"
        onMore={noop}
        onCollapse={onCollapse}
      />,
    );

    const btn = screen.getByRole("button", { name: "less" });
    expect(btn).toHaveClass("btn", "btn-link");

    fireEvent.click(btn);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it("renders both controls when both are available", () => {
    render(
      <RevealControls
        hasMore
        canCollapse
        remaining={1}
        moreLabel="more"
        lessLabel="less"
        onMore={noop}
        onCollapse={noop}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
