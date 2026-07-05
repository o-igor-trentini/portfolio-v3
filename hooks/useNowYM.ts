import { useEffect, useState } from "react";
import { nowYM, type YearMonth } from "@/lib/date";

/**
 * Client-only "now" as a YearMonth. Stays null on the server and first render so
 * the markup matches SSR, then fills in after mount — avoids a hydration mismatch
 * while keeping the current-role duration fresh.
 */
export function useNowYM(): YearMonth | null {
  const [now, setNow] = useState<YearMonth | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only "now", avoids SSR staleness
    setNow(nowYM());
  }, []);
  return now;
}
