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
  resumeHref,
  stackGroups,
  stackHighlight,
  stackLabel,
  withYears,
} from "./content";
import { nowYM } from "./date";
import type { ConsentValue } from "./consent";
import { siteConfig } from "@/site.config";

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

/**
 * A list command's output: an accent `# header` followed by its rows. When the
 * rows are empty and `emptyLang` is given, the header is followed by the shared
 * "working on it…" line instead — the single place that empty-state lives.
 */
function listSection(header: string, rows: Line[], emptyLang?: Lang): Line[] {
  if (rows.length === 0 && emptyLang !== undefined) {
    return [mk(header, COLOR.accent), mk("  " + i18n[emptyLang].common.wip, COLOR.dim)];
  }
  return [mk(header, COLOR.accent), ...rows];
}

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
  /** Current analytics-consent decision, or null when the visitor hasn't chosen. */
  consent: ConsentValue | null;
  /** Persist + apply a new consent decision (side effects live in the buffer). */
  setConsent: (value: ConsentValue) => void;
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
  return listSection(
    "# work history",
    experiences.flatMap((e) => {
      const { period, duration, tags } = formatExperience(e, ctx.lang, now);
      return [
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
      ];
    }),
  );
};

const skills: Handler = (ctx) =>
  listSection(
    "# stack",
    stackGroups.map((g) =>
      mk("  " + stackLabel(g, ctx.lang).padEnd(11) + g.items.join("  ·  "), COLOR.muted),
    ),
  );

const projectsCmd: Handler = (ctx) =>
  listSection(
    "# selected work",
    projects.flatMap((p) => [
      mk("  ▸ " + p.name, COLOR.fg),
      mk("    " + projectDesc(p, ctx.lang), COLOR.muted),
      mk("    [" + p.tags.join(", ") + "]", COLOR.dim),
    ]),
    ctx.lang,
  );

const languagesCmd: Handler = (ctx) =>
  listSection(
    "# languages",
    languages.map((l) =>
      mk("  " + langName(l, ctx.lang).padEnd(12) + langLevel(l, ctx.lang), COLOR.muted),
    ),
  );

const certsCmd: Handler = (ctx) =>
  listSection(
    "# certifications",
    certs.flatMap((c) => [
      mk("  ✓ " + c.name, COLOR.fg),
      mk("    " + c.issuer + " · " + c.year, COLOR.muted),
    ]),
    ctx.lang,
  );

const contact: Handler = () =>
  listSection(
    "# reach me",
    contacts.map((c) => mk("  " + c.label.padEnd(10) + c.value, COLOR.muted)),
  );

const resumeCmd: Handler = (ctx) => {
  const href = resumeHref(ctx.lang);
  if (!href) return [mk("  " + i18n[ctx.lang].common.wip, COLOR.dim)];
  return [mk("→ " + siteConfig.url + href, COLOR.accent)];
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

// The "files" `ls` advertises map to the real section handlers, so `cat` reads
// them like a tiny filesystem instead of always denying. `.secrets` stays the
// easter egg and anything else is denied.
const CAT_FILES: Record<string, Handler> = {
  "about.md": about,
  "skills.txt": skills,
  "certs.txt": certsCmd,
  "contact.vcf": contact,
};

const cat: Handler = (ctx) => {
  const file = ctx.args[0] || "";
  if (file === ".secrets") return [mk("nice try ;)", COLOR.dim)];
  if (file === "projects/") return [mk("cat: projects/: Is a directory", COLOR.dim)];
  const reader = CAT_FILES[file];
  if (reader) return reader(ctx);
  return [mk("cat: " + file + ": permission denied", COLOR.dim)];
};

const consentCmd: Handler = (ctx) => {
  const arg = (ctx.args[0] || "").toLowerCase();
  if (arg === "grant" || arg === "accept" || arg === "granted") {
    ctx.setConsent("granted");
    return [mk("analytics consent → granted", COLOR.muted)];
  }
  if (arg === "deny" || arg === "revoke" || arg === "denied") {
    ctx.setConsent("denied");
    return [mk("analytics consent → denied", COLOR.muted)];
  }
  return [
    mk("analytics consent: " + (ctx.consent ?? "not set"), COLOR.muted),
    mk("  use 'consent grant' or 'consent deny' to change it", COLOR.dim),
  ];
};

const keysCmd: Handler = () => [
  mk("keyboard", COLOR.accent),
  mk("  `      open / focus the terminal", COLOR.muted),
  mk("  Esc    close the terminal", COLOR.muted),
  mk("  Tab    complete a command", COLOR.muted),
  mk("  ↑ ↓    walk command history", COLOR.muted),
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
  { name: "resume", handler: resumeCmd, description: "download my résumé" },
  { name: "cv", handler: resumeCmd },
  { name: "theme", handler: theme, description: "toggle light / dark" },
  { name: "lang", handler: lang, description: "switch language (lang en|pt)" },
  { name: "neofetch", handler: neofetchCmd, description: "system info" },
  { name: "ls", handler: ls, description: "list files" },
  { name: "keys", handler: keysCmd, description: "keyboard shortcuts" },
  { name: "consent", handler: consentCmd, description: "analytics consent (grant|deny)" },
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

/** Public command names (those listed in `help`) — the pool for Tab-completion. */
export const completableCommands: string[] = registry
  .filter((c) => c.description)
  .map((c) => c.name);

/**
 * Completable argument sets for the commands that take a fixed vocabulary, so
 * Tab completes past the command name too (e.g. `lang p` → `lang pt`). `cat`
 * derives its files from the same map the reader uses, plus the `.secrets` gag.
 */
const ARG_COMPLETIONS: Record<string, string[]> = {
  lang: ["en", "pt"],
  consent: ["grant", "deny"],
  cat: [...Object.keys(CAT_FILES), ".secrets"],
};

/** From a list of candidates for a prefix, the sole match to complete to (if any). */
function pick(candidates: string[]): { completed?: string; candidates: string[] } {
  return candidates.length === 1 ? { completed: candidates[0], candidates } : { candidates };
}

/**
 * Tab-completion for the current input line. Before the first space it completes
 * the command name (bash-style: sole match completes, ambiguity lists). After a
 * space it completes the last argument against that command's known vocabulary,
 * returning the full `command arg` line to replace the input with. An empty or
 * unknown target yields no `completed`.
 */
export function completeCommand(input: string): { completed?: string; candidates: string[] } {
  const line = input.replace(/^\s+/, "");
  if (!line) return { candidates: [] };

  const parts = line.split(/\s+/);
  if (parts.length === 1) {
    const p = parts[0].toLowerCase();
    return pick(completableCommands.filter((n) => n.startsWith(p)));
  }

  const cmd = parts[0].toLowerCase();
  const pool = ARG_COMPLETIONS[cmd];
  if (!pool) return { candidates: [] };
  const argPrefix = parts[parts.length - 1].toLowerCase();
  const matches = pool.filter((a) => a.toLowerCase().startsWith(argPrefix));
  const { completed, candidates } = pick(matches);
  // Rebuild the whole line so the buffer can replace the input verbatim.
  return { completed: completed ? `${cmd} ${completed}` : undefined, candidates };
}

/** Runs an output-producing command, or a "not found" line for an unknown one. */
export function runTerminalCommand(cname: string, ctx: CommandCtx): Line[] {
  const handler = commands[cname];
  if (!handler) return [mk("command not found: " + cname + " — type 'help'", COLOR.red)];
  return handler(ctx);
}
