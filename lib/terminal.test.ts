import { afterEach, describe, expect, it, vi } from "vitest";
import { completeCommand, runTerminalCommand, type CommandCtx } from "./terminal";
import { resumeHref } from "./content";
import { i18n } from "./i18n";
import { siteConfig } from "@/site.config";

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

  it("help lists the available commands (generated from the registry)", () => {
    const out = runTerminalCommand("help", ctx());
    expect(out[0].text).toBe("available commands");
    expect(out.some((l) => l.text.includes("neofetch"))).toBe(true);
    // Control commands (handled by the buffer) are still documented.
    expect(out.some((l) => l.text.includes("clear"))).toBe(true);
    expect(out.some((l) => l.text.includes("exit"))).toBe(true);
    // Aliases and hidden easter eggs are NOT listed.
    expect(out.some((l) => l.text.includes("idiomas"))).toBe(false);
    expect(out.some((l) => l.text.includes("sudo"))).toBe(false);
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
    expect(runTerminalCommand("echo", ctx({ args: ["hello", "world"] }))[0].text).toBe(
      "hello world",
    );
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

  it("neofetch renders one line per row, including role, theme and lang", () => {
    const out = runTerminalCommand("neofetch", ctx({ theme: "dark", lang: "en" }));
    // Now a Line per visual row (not one \n-joined blob), like every other command.
    expect(out.length).toBeGreaterThan(1);
    expect(out.every((l) => !l.text.includes("\n"))).toBe(true);
    const text = out.map((l) => l.text).join("\n");
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

  it("resume prints the configured URL for the locale (or WIP when unset)", () => {
    const href = resumeHref("en");
    const out = runTerminalCommand("resume", ctx({ lang: "en" }));
    if (href) {
      expect(out[0].text).toBe("→ " + siteConfig.url + href);
    } else {
      expect(out[0].text).toContain(i18n.en.common.wip);
    }
  });

  it("aliases cv to the same handler as resume", () => {
    const a = runTerminalCommand("resume", ctx({ lang: "pt" }));
    const b = runTerminalCommand("cv", ctx({ lang: "pt" }));
    expect(b.map((l) => l.text)).toEqual(a.map((l) => l.text));
  });
});

describe("completeCommand", () => {
  it("completes a unique prefix to its full command name", () => {
    expect(completeCommand("neo").completed).toBe("neofetch");
  });

  it("returns candidates without completing when the prefix is ambiguous", () => {
    const r = completeCommand("c");
    expect(r.completed).toBeUndefined();
    expect(r.candidates).toEqual(expect.arrayContaining(["contact", "certs"]));
  });

  it("never completes to aliases or hidden easter eggs", () => {
    expect(completeCommand("sudo").candidates).toEqual([]); // hidden
    expect(completeCommand("idioma").candidates).toEqual([]); // alias of languages
    expect(completeCommand("cv").candidates).toEqual([]); // alias of resume
  });

  it("yields nothing for an empty prefix", () => {
    expect(completeCommand("   ").candidates).toEqual([]);
  });
});
