import { createContext, useContext, type Context } from "react";

/**
 * Create a nullable React context plus a hook that reads it and throws a helpful
 * error when called outside its provider — the boilerplate both providers here
 * otherwise repeat. Returns the raw `Context` (wire `<Ctx.Provider>` yourself)
 * and the guarded accessor. The error reads `${hookName} must be used within
 * <${providerName}>`, matching the messages the providers used before.
 */
export function createSafeContext<T>(
  hookName: string,
  providerName: string,
): [Context<T | null>, () => T] {
  const Ctx = createContext<T | null>(null);
  function useSafeContext(): T {
    const value = useContext(Ctx);
    if (value === null) throw new Error(`${hookName} must be used within <${providerName}>`);
    return value;
  }
  return [Ctx, useSafeContext];
}
