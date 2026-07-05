"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePortfolio } from "./PortfolioProvider";
import { i18n } from "@/lib/i18n";
import {
  certs,
  contacts,
  experiences,
  expIndustry,
  expMode,
  expRole,
  expTags,
  langLevel,
  langName,
  languages,
  projectDesc,
  projects,
  stackGroups,
  stackLabel,
} from "@/lib/content";
import { formatDuration, formatMonthYear, monthsInclusive, parseYM } from "@/lib/date";
import { PROMPT } from "@/site.config";

interface Line {
  text: string;
  color: string;
  prompt?: string;
}

const COLOR = {
  accent: "var(--accent)",
  muted: "#a1a1aa",
  dim: "#71717a",
  fg: "#e4e4e7",
  soft: "#d4d4d8",
  red: "#f87171",
  faint: "#52525b",
};

const mk = (text: string, color: string = COLOR.muted, prompt?: string): Line => ({ text, color, prompt });

function introLines(): Line[] {
  return [
    mk(`portfolio shell v1.0  ·  ${new Date().getFullYear()}`, COLOR.faint),
    mk("type 'help' to list available commands.", COLOR.muted),
    mk("", COLOR.muted),
  ];
}

export function Terminal() {
  const { termOpen, closeTerm, bonusNonce, lang, theme, setLang, toggleTheme, name } = usePortfolio();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [cmds, setCmds] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the intro the first time the terminal opens (and keep the buffer after).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to open transition
    if (termOpen) setLines((prev) => (prev.length ? prev : introLines()));
  }, [termOpen]);

  // Konami bonus line — driven by an external nonce from the provider.
  useEffect(() => {
    if (bonusNonce === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to nonce change
    setLines((prev) => {
      const base = prev.length ? prev : introLines();
      return [...base, mk("★ konami unlocked — you found the cheat code.", COLOR.accent)];
    });
  }, [bonusNonce]);

  // Autoscroll to the newest output.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Focus the input shortly after opening.
  useEffect(() => {
    if (!termOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [termOpen]);

  function neofetch(): string {
    const role = i18n[lang].hero.role;
    return [
      "        _ _           visitor@portfolio",
      "    ___| (_)         --------------------",
      "   / __| | |         role     " + role,
      "  | (__| | |         stack    Go · gRPC · Postgres · k8s",
      "   \\___|_|_|         theme    " + theme,
      "                     lang     " + lang,
      "                     uptime   always shipping",
    ].join("\n");
  }

  function recall(dir: number) {
    if (!cmds.length) return;
    let idx = histIdx + dir;
    idx = Math.max(0, Math.min(cmds.length, idx));
    setHistIdx(idx);
    setInput(idx >= cmds.length ? "" : cmds[idx]);
  }

  function runCommand(raw: string) {
    const line = String(raw);
    const cmd = line.trim();
    const echo = mk(line, COLOR.fg, PROMPT);
    const nextCmds = cmd ? [...cmds, cmd] : cmds;

    setInput("");
    setCmds(nextCmds);
    setHistIdx(nextCmds.length);

    if (!cmd) {
      setLines((prev) => [...prev, echo]);
      return;
    }

    const parts = cmd.split(/\s+/);
    const cname = parts[0].toLowerCase();
    const args = parts.slice(1);
    const L = i18n[lang];
    const acc = COLOR.accent;
    const mut = COLOR.muted;
    const dim = COLOR.dim;
    const out: Line[] = [echo];

    switch (cname) {
      case "help":
        out.push(
          mk("available commands", acc),
          mk("  help        this list", mut),
          mk("  about       who I am", mut),
          mk("  whoami      print identity", mut),
          mk("  experience  work history", mut),
          mk("  skills      tech stack", mut),
          mk("  languages   spoken languages", mut),
          mk("  projects    selected work", mut),
          mk("  certs       certifications", mut),
          mk("  contact     how to reach me", mut),
          mk("  theme       toggle light / dark", mut),
          mk("  lang        switch language (lang en|pt)", mut),
          mk("  neofetch    system info", mut),
          mk("  ls          list files", mut),
          mk("  clear       clear the screen", mut),
          mk("  exit        close terminal", mut),
        );
        break;
      case "about":
      case "whoami":
        out.push(
          mk(name, acc),
          mk(L.hero.role, mut),
          mk(""),
          mk(L.about.body, COLOR.soft),
        );
        break;
      case "experience":
      case "work": {
        out.push(mk("# work history", acc));
        const d = new Date();
        const nowYM = { y: d.getFullYear(), m: d.getMonth() + 1 };
        experiences.forEach((e) => {
          const present = e.end === null;
          const endYM = present ? nowYM : parseYM(e.end as string);
          const period = `${formatMonthYear(e.start, lang)} — ${
            present ? L.experience.present : formatMonthYear(e.end as string, lang)
          }`;
          const duration = formatDuration(monthsInclusive(e.start, endYM), lang);
          const tags = expTags(e, lang);
          out.push(
            mk("  ▸ " + e.company + "  —  " + expRole(e, lang), COLOR.fg),
            mk("    " + period + " · " + duration, mut),
            mk(
              "    " + expMode(e, lang) + " · " + expIndustry(e, lang) + (tags.length ? "  [" + tags.join(", ") + "]" : ""),
              dim,
            ),
          );
        });
        break;
      }
      case "skills":
        out.push(mk("# stack", acc));
        stackGroups.forEach((g) => {
          const lbl = stackLabel(g, lang).padEnd(11, " ");
          out.push(mk("  " + lbl + g.items.join("  ·  "), mut));
        });
        break;
      case "projects":
        out.push(mk("# selected work", acc));
        if (projects.length === 0) {
          out.push(mk("  " + L.common.wip, dim));
          break;
        }
        projects.forEach((p) => {
          out.push(
            mk("  ▸ " + p.name, COLOR.fg),
            mk("    " + projectDesc(p, lang), mut),
            mk("    [" + p.tags.join(", ") + "]", dim),
          );
        });
        break;
      case "languages":
      case "idiomas":
        out.push(mk("# languages", acc));
        languages.forEach((l) => {
          const nm = langName(l, lang);
          const lv = langLevel(l, lang);
          out.push(mk("  " + nm.padEnd(12, " ") + lv, mut));
        });
        break;
      case "certs":
      case "certifications":
        out.push(mk("# certifications", acc));
        if (certs.length === 0) {
          out.push(mk("  " + L.common.wip, dim));
          break;
        }
        certs.forEach((c) =>
          out.push(mk("  ✓ " + c.name, COLOR.fg), mk("    " + c.issuer + " · " + c.year, mut)),
        );
        break;
      case "contact":
        out.push(mk("# reach me", acc));
        contacts.forEach((c) => out.push(mk("  " + c.label.padEnd(10, " ") + c.value, mut)));
        break;
      case "theme": {
        toggleTheme();
        const next = theme === "light" ? "dark" : "light";
        out.push(mk("theme → " + next, mut));
        break;
      }
      case "lang": {
        const target = (args[0] || "").toLowerCase();
        if (target === "en" || target === "pt") {
          setLang(target);
          out.push(mk("language → " + target, mut));
        } else {
          const nx = lang === "en" ? "pt" : "en";
          setLang(nx);
          out.push(mk("language → " + nx, mut));
        }
        break;
      }
      case "neofetch":
        out.push(mk(neofetch(), COLOR.accent));
        break;
      case "ls":
        out.push(mk("about.md   skills.txt   projects/   certs.txt   contact.vcf   .secrets", mut));
        break;
      case "cat":
        out.push(
          mk(
            args[0] === ".secrets" ? "nice try ;)" : "cat: " + (args[0] || "") + ": permission denied",
            dim,
          ),
        );
        break;
      case "sudo":
        out.push(mk("we trust you have received the usual lecture. permission denied — nice try.", dim));
        break;
      case "echo":
        out.push(mk(args.join(" "), COLOR.fg));
        break;
      case "pwd":
        out.push(mk("/home/visitor/portfolio", mut));
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        setLines((prev) => [...prev, echo]);
        setTimeout(() => closeTerm(), 120);
        return;
      default:
        out.push(mk("command not found: " + cname + " — type 'help'", COLOR.red));
    }

    out.push(mk(""));
    setLines((prev) => [...prev, ...out]);
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recall(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recall(1);
    }
  }

  if (!termOpen) return null;

  return (
    <div className="term-overlay" onClick={closeTerm}>
      <div className="term-window" role="dialog" aria-modal="true" aria-label="Terminal" onClick={(e) => e.stopPropagation()}>
        <div className="term-titlebar">
          <span className="term-dot" style={{ background: "#ff5f57" }} />
          <span className="term-dot" style={{ background: "#febc2e" }} />
          <span className="term-dot" style={{ background: "#28c840" }} />
          <span className="term-title">visitor@portfolio: ~/zsh</span>
          <button type="button" className="term-close" aria-label="Close terminal" onClick={closeTerm}>
            ✕
          </button>
        </div>
        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((l, i) => (
            <div key={i} className="term-line">
              {l.prompt && <span className="term-prompt">{l.prompt} </span>}
              <span style={{ color: l.color }}>{l.text}</span>
            </div>
          ))}
          <div className="term-inputrow">
            <span className="term-inputrow__prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="term-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
