import { i18n, type Lang } from "./i18n";
import {
  certs,
  contacts,
  experiences,
  expIndustry,
  expMode,
  expRole,
  formatExperience,
  langLevel,
  langName,
  languages,
  projectDesc,
  projects,
  stackGroups,
  stackHighlight,
  stackLabel,
  withYears,
} from "./content";
import { nowYM } from "./date";

// Compact stack line for neofetch, derived from the canonical stack (lib/content).
const neofetchStack = stackHighlight.join(" · ");

export interface Line {
  text: string;
  color: string;
  prompt?: string;
}

// The terminal window is always dark (its background never follows the theme),
// so these output colors are fixed literals rather than the theme-reactive CSS
// tokens — only the accent, which reads well on dark, uses a token.
export const COLOR = {
  accent: "var(--accent)",
  muted: "#a1a1aa",
  dim: "#71717a",
  fg: "#e4e4e7",
  soft: "#d4d4d8",
  red: "#f87171",
  faint: "#52525b",
} as const;

/** Only the defined palette values are accepted — guards against typos. */
export type Color = (typeof COLOR)[keyof typeof COLOR];

export const mk = (text: string, color: Color = COLOR.muted, prompt?: string): Line => ({
  text,
  color,
  prompt,
});

export function introLines(): Line[] {
  return [
    mk(`portfolio shell v1.0  ·  ${new Date().getFullYear()}`, COLOR.faint),
    mk("type 'help' to list available commands.", COLOR.muted),
    mk("", COLOR.muted),
  ];
}

export interface CommandCtx {
  args: string[];
  lang: Lang;
  theme: "light" | "dark";
  name: string;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
}

type Handler = (ctx: CommandCtx) => Line[];

function neofetchLines(ctx: CommandCtx): string[] {
  const role = i18n[ctx.lang].hero.role;
  return [
    "        _ _           visitor@portfolio",
    "    ___| (_)         --------------------",
    "   / __| | |         role     " + role,
    "  | (__| | |         stack    " + neofetchStack,
    "   \\___|_|_|         theme    " + ctx.theme,
    "                     lang     " + ctx.lang,
    "                     uptime   always shipping",
  ];
}

// Generated from the command registry (below) so it can never drift from the
// handlers: every entry with a `description` is listed, aliases and hidden
// easter eggs are not. Control commands (clear/exit) carry a description but no
// handler — they're intercepted by the terminal buffer, yet still belong here.
const help: Handler = () => [
  mk("available commands", COLOR.accent),
  ...registry
    .filter((c) => c.description)
    .map((c) => mk("  " + c.name.padEnd(12, " ") + c.description, COLOR.muted)),
];

const about: Handler = (ctx) => {
  const L = i18n[ctx.lang];
  return [
    mk(ctx.name, COLOR.accent),
    mk(L.hero.role, COLOR.muted),
    mk(""),
    mk(withYears(L.about.body), COLOR.soft),
  ];
};

const experience: Handler = (ctx) => {
  const now = nowYM();
  const out: Line[] = [mk("# work history", COLOR.accent)];
  experiences.forEach((e) => {
    const { period, duration, tags } = formatExperience(e, ctx.lang, now);
    out.push(
      mk("  ▸ " + e.company + "  —  " + expRole(e, ctx.lang), COLOR.fg),
      // `now` is always set here, so duration is never null.
      mk(`    ${period} · ${duration}`, COLOR.muted),
      mk(
        "    " +
          expMode(e, ctx.lang) +
          " · " +
          expIndustry(e, ctx.lang) +
          (tags.length ? "  [" + tags.join(", ") + "]" : ""),
        COLOR.dim,
      ),
    );
  });
  return out;
};

const skills: Handler = (ctx) => {
  const out: Line[] = [mk("# stack", COLOR.accent)];
  stackGroups.forEach((g) => {
    const lbl = stackLabel(g, ctx.lang).padEnd(11, " ");
    out.push(mk("  " + lbl + g.items.join("  ·  "), COLOR.muted));
  });
  return out;
};

const projectsCmd: Handler = (ctx) => {
  const out: Line[] = [mk("# selected work", COLOR.accent)];
  if (projects.length === 0) {
    out.push(mk("  " + i18n[ctx.lang].common.wip, COLOR.dim));
    return out;
  }
  projects.forEach((p) => {
    out.push(
      mk("  ▸ " + p.name, COLOR.fg),
      mk("    " + projectDesc(p, ctx.lang), COLOR.muted),
      mk("    [" + p.tags.join(", ") + "]", COLOR.dim),
    );
  });
  return out;
};

const languagesCmd: Handler = (ctx) => {
  const out: Line[] = [mk("# languages", COLOR.accent)];
  languages.forEach((l) => {
    const nm = langName(l, ctx.lang);
    const lv = langLevel(l, ctx.lang);
    out.push(mk("  " + nm.padEnd(12, " ") + lv, COLOR.muted));
  });
  return out;
};

const certsCmd: Handler = (ctx) => {
  const out: Line[] = [mk("# certifications", COLOR.accent)];
  if (certs.length === 0) {
    out.push(mk("  " + i18n[ctx.lang].common.wip, COLOR.dim));
    return out;
  }
  certs.forEach((c) =>
    out.push(mk("  ✓ " + c.name, COLOR.fg), mk("    " + c.issuer + " · " + c.year, COLOR.muted)),
  );
  return out;
};

const contact: Handler = () => {
  const out: Line[] = [mk("# reach me", COLOR.accent)];
  contacts.forEach((c) => out.push(mk("  " + c.label.padEnd(10, " ") + c.value, COLOR.muted)));
  return out;
};

const theme: Handler = (ctx) => {
  ctx.toggleTheme();
  const next = ctx.theme === "light" ? "dark" : "light";
  return [mk("theme → " + next, COLOR.muted)];
};

const lang: Handler = (ctx) => {
  const target = (ctx.args[0] || "").toLowerCase();
  if (target === "en" || target === "pt") {
    ctx.setLang(target);
    return [mk("language → " + target, COLOR.muted)];
  }
  const nx = ctx.lang === "en" ? "pt" : "en";
  ctx.setLang(nx);
  return [mk("language → " + nx, COLOR.muted)];
};

const neofetchCmd: Handler = (ctx) => neofetchLines(ctx).map((l) => mk(l, COLOR.accent));

const ls: Handler = () => [
  mk("about.md   skills.txt   projects/   certs.txt   contact.vcf   .secrets", COLOR.muted),
];

const cat: Handler = (ctx) => [
  mk(
    ctx.args[0] === ".secrets"
      ? "nice try ;)"
      : "cat: " + (ctx.args[0] || "") + ": permission denied",
    COLOR.dim,
  ),
];

const sudo: Handler = () => [
  mk("we trust you have received the usual lecture. permission denied — nice try.", COLOR.dim),
];

const echo: Handler = (ctx) => [mk(ctx.args.join(" "), COLOR.fg)];

const pwd: Handler = () => [mk("/home/visitor/portfolio", COLOR.muted)];

interface CommandSpec {
  name: string;
  /** Absent for control commands (clear/exit) handled by the terminal buffer. */
  handler?: Handler;
  /** Present → listed in `help`. Omitted for aliases and hidden easter eggs. */
  description?: string;
}

/**
 * Command registry — the single source for both dispatch and the `help` listing.
 * Entries with a `description` appear in `help` (in this order); aliases and the
 * hidden easter eggs (cat/sudo/echo/pwd) carry a handler but no description.
 * Control commands (clear/exit) carry a description but no handler — they act on
 * the terminal buffer / visibility and are intercepted before dispatch, yet are
 * still documented here so `help` stays complete.
 */
const registry: CommandSpec[] = [
  { name: "help", handler: help, description: "this list" },
  { name: "about", handler: about, description: "who I am" },
  { name: "whoami", handler: about, description: "print identity" },
  { name: "experience", handler: experience, description: "work history" },
  { name: "work", handler: experience },
  { name: "skills", handler: skills, description: "tech stack" },
  { name: "languages", handler: languagesCmd, description: "spoken languages" },
  { name: "idiomas", handler: languagesCmd },
  { name: "projects", handler: projectsCmd, description: "selected work" },
  { name: "certs", handler: certsCmd, description: "certifications" },
  { name: "certifications", handler: certsCmd },
  { name: "contact", handler: contact, description: "how to reach me" },
  { name: "theme", handler: theme, description: "toggle light / dark" },
  { name: "lang", handler: lang, description: "switch language (lang en|pt)" },
  { name: "neofetch", handler: neofetchCmd, description: "system info" },
  { name: "ls", handler: ls, description: "list files" },
  { name: "clear", description: "clear the screen" },
  { name: "exit", description: "close terminal" },
  { name: "cat", handler: cat },
  { name: "sudo", handler: sudo },
  { name: "echo", handler: echo },
  { name: "pwd", handler: pwd },
];

const commands: Record<string, Handler> = Object.fromEntries(
  registry.filter((c) => c.handler).map((c) => [c.name, c.handler as Handler]),
);

/** Runs an output-producing command, or a "not found" line for an unknown one. */
export function runTerminalCommand(cname: string, ctx: CommandCtx): Line[] {
  const handler = commands[cname];
  if (!handler) return [mk("command not found: " + cname + " — type 'help'", COLOR.red)];
  return handler(ctx);
}
