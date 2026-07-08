import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { PortfolioProvider, usePortfolio } from "./PortfolioProvider";
import { i18n } from "@/lib/i18n";
import { siteConfig } from "@/site.config";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PortfolioProvider initialLang="pt">{children}</PortfolioProvider>
);

describe("usePortfolio", () => {
  it("throws a helpful error when used outside the provider", () => {
    // Silence React's expected error-boundary console noise for this render.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Outside() {
      usePortfolio();
      return null;
    }
    expect(() => render(<Outside />)).toThrow(/within <PortfolioProvider>/);
    spy.mockRestore();
  });

  it("exposes name/handle, the locale dictionary and theme controls", () => {
    const { result } = renderHook(() => usePortfolio(), { wrapper });
    expect(result.current.name).toBe(siteConfig.name);
    expect(result.current.handle).toBe(siteConfig.handle);
    expect(result.current.lang).toBe("pt");
    expect(result.current.t).toBe(i18n.pt);
    expect(typeof result.current.toggleTheme).toBe("function");
    expect(typeof result.current.setLang).toBe("function");
  });
});
