import { useCallback } from "react";
import type { Lang } from "@/lib/i18n";
import { locales } from "@/lib/locale";
import { trackLanguageSwitch } from "@/lib/analytics";

export interface UseLang {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

/**
 * Locale is derived from the URL: each locale is its own statically-exported
 * page, so `lang` is fixed for the page's lifetime (no localStorage, no
 * post-hydration flip — the static HTML must match what crawlers index).
 * `setLang` navigates to the other locale's URL, preserving the current section
 * via the hash. It's a full reload across route groups, which is expected.
 */
export function useLang(initial: Lang): UseLang {
  const setLang = useCallback(
    (next: Lang) => {
      if (next === initial || typeof window === "undefined") return;
      trackLanguageSwitch(next);
      window.location.assign(locales[next].path + window.location.hash);
    },
    [initial],
  );

  return { lang: initial, setLang };
}
