import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import type { Lang } from "@/lib/i18n";

/**
 * Render a component inside a real PortfolioProvider so section/layout
 * components that call usePortfolio() get the live context (t, lang, theme,
 * terminal). Defaults to English; pass "pt" to exercise the other locale.
 */
export function renderWithPortfolio(ui: ReactElement, lang: Lang = "en"): RenderResult {
  return render(<PortfolioProvider initialLang={lang}>{ui}</PortfolioProvider>);
}
