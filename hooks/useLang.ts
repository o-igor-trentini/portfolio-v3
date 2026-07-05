import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

export interface UseLang {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export function useLang(): UseLang {
  const [lang, setLangState] = useState<Lang>("en");

  // Resolve stored / preferred language after mount (client-only reconciliation).
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pf_lang");
      if (stored === "en" || stored === "pt") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration reconciliation
        setLangState(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    if (typeof navigator !== "undefined" && (navigator.language || "").toLowerCase().startsWith("pt")) {
      setLangState("pt");
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem("pf_lang", next);
    } catch {
      /* ignore */
    }
    setLangState(next);
  }, []);

  return { lang, setLang };
}
