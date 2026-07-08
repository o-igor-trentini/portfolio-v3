import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { TerminalProvider } from "@/components/providers/TerminalProvider";
import type { Lang } from "@/lib/i18n";

/**
 * Render a component inside the real providers so section/layout components that
 * call usePortfolio() / useTerminalControls() get live context (t, lang, theme,
 * terminal). Defaults to English; pass "pt" to exercise the other locale.
 */
export function renderWithPortfolio(ui: ReactElement, lang: Lang = "en"): RenderResult {
  return render(
    <PortfolioProvider initialLang={lang}>
      <TerminalProvider>{ui}</TerminalProvider>
    </PortfolioProvider>,
  );
}
