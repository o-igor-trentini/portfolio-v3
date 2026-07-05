import { afterEach, describe, expect, it, vi } from "vitest";
import { runTerminalCommand, type CommandCtx } from "./terminal";

function ctx(over: Partial<CommandCtx> = {}): CommandCtx {
  return {
    args: [],
    lang: "en",
    theme: "dark",
    name: "Tester",
    setLang: vi.fn(),
    toggleTheme: vi.fn(),
    ...over,
  };
}

describe("runTerminalCommand", () => {
  afterEach(() => vi.useRealTimers());

  it("returns a not-found line for an unknown command", () => {
    const out = runTerminalCommand("bogus", ctx());
    expect(out).toHaveLength(1);
    expect(out[0].text).toContain("command not found: bogus");
  });

  it("help lists the available commands", () => {
    const out = runTerminalCommand("help", ctx());
    expect(out[0].text).toBe("available commands");
    expect(out.some((l) => l.text.includes("neofetch"))).toBe(true);
  });

  it("resolves aliases to the same handler (whoami → about)", () => {
    const a = runTerminalCommand("about", ctx({ name: "X" }));
    const b = runTerminalCommand("whoami", ctx({ name: "X" }));
    expect(b.map((l) => l.text)).toEqual(a.map((l) => l.text));
    expect(a[0].text).toBe("X");
  });

  it("skills localizes and pads the group label (pt)", () => {
    const out = runTerminalCommand("skills", ctx({ lang: "pt" }));
    expect(out[0].text).toBe("# stack");
    expect(out[1].text.startsWith("  linguagens ")).toBe(true); // "linguagens" padded to 11
  });

  it("echo joins its args", () => {
    expect(runTerminalCommand("echo", ctx({ args: ["hello", "world"] }))[0].text).toBe("hello world");
  });

  it("lang with a valid arg switches language via the callback", () => {
    const setLang = vi.fn();
    const out = runTerminalCommand("lang", ctx({ args: ["pt"], setLang }));
    expect(setLang).toHaveBeenCalledWith("pt");
    expect(out[0].text).toBe("language → pt");
  });

  it("theme toggles and reports the next theme", () => {
    const toggleTheme = vi.fn();
    const out = runTerminalCommand("theme", ctx({ theme: "light", toggleTheme }));
    expect(toggleTheme).toHaveBeenCalledOnce();
    expect(out[0].text).toBe("theme → dark");
  });

  it("neofetch includes role, theme and lang", () => {
    const text = runTerminalCommand("neofetch", ctx({ theme: "dark", lang: "en" }))[0].text;
    expect(text).toContain("theme    dark");
    expect(text).toContain("lang     en");
  });

  it("experience formats each role's period and duration via formatExperience", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
    const out = runTerminalCommand("experience", ctx({ lang: "en" }));
    expect(out[0].text).toBe("# work history");
    expect(out.some((l) => l.text.includes("Sep 2021 — May 2026 · 4 yrs 9 mos"))).toBe(true);
  });
});
