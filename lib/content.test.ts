import { describe, expect, it } from "vitest";
import {
  contacts,
  experiences,
  formatExperience,
  interpolateYears,
  langLevel,
  langName,
  languages,
  projectDesc,
  projects,
  stackGroups,
  stackLabel,
  withYears,
  type Experience,
  type Language,
  type Project,
  type StackGroup,
} from "./content";
import { i18n } from "./i18n";

const base: Experience = {
  company: "Acme",
  role_en: "Dev",
  role_pt: "Dev",
  mode_en: "remote",
  mode_pt: "remoto",
  industry_en: "tech",
  industry_pt: "tech",
  start: "2021-09",
  end: null,
  tags_en: ["unicorn"],
  tags_pt: ["unicórnio"],
};

describe("formatExperience", () => {
  it("formats an ongoing role in English", () => {
    const r = formatExperience(base, "en", { y: 2026, m: 5 });
    expect(r.present).toBe(true);
    expect(r.period).toBe("Sep 2021 — present");
    expect(r.duration).toBe("4 yrs 9 mos"); // Sep 2021 → May 2026 inclusive = 57 months
    expect(r.tags).toEqual(["unicorn"]);
  });

  it("formats an ongoing role in Portuguese", () => {
    const r = formatExperience(base, "pt", { y: 2026, m: 5 });
    expect(r.period).toBe("set 2021 — presente");
    expect(r.duration).toBe("4 anos 9 meses");
    expect(r.tags).toEqual(["unicórnio"]);
  });

  it("omits the duration for an ongoing role while `now` is unknown", () => {
    const r = formatExperience(base, "en", null);
    expect(r.present).toBe(true);
    expect(r.period).toBe("Sep 2021 — present");
    expect(r.duration).toBeNull();
  });

  it("formats a finished role with a fixed end (independent of `now`)", () => {
    const r = formatExperience({ ...base, end: "2026-05" }, "en", null);
    expect(r.present).toBe(false);
    expect(r.period).toBe("Sep 2021 — May 2026");
    expect(r.duration).toBe("4 yrs 9 mos");
  });

  it("defaults to an empty tag list when the experience has none", () => {
    const r = formatExperience({ ...base, tags_en: undefined, tags_pt: undefined }, "en", {
      y: 2026,
      m: 5,
    });
    expect(r.tags).toEqual([]);
  });
});

describe("localization helpers", () => {
  // Synthetic objects (not real content) keep these tests focused on the en/pt
  // field selection and resilient to copy edits.
  it("stackLabel picks the language-specific label", () => {
    const g: StackGroup = { label_en: "EN", label_pt: "PT", items: [] };
    expect(stackLabel(g, "en")).toBe("EN");
    expect(stackLabel(g, "pt")).toBe("PT");
  });

  it("projectDesc picks the language-specific description", () => {
    const p: Project = { name: "x", link: "#", tags: [], desc_en: "EN", desc_pt: "PT" };
    expect(projectDesc(p, "en")).toBe("EN");
    expect(projectDesc(p, "pt")).toBe("PT");
  });

  it("langName and langLevel pick the language-specific fields", () => {
    const l: Language = { name_en: "NE", name_pt: "NP", level_en: "LE", level_pt: "LP", score: 3 };
    expect(langName(l, "en")).toBe("NE");
    expect(langName(l, "pt")).toBe("NP");
    expect(langLevel(l, "en")).toBe("LE");
    expect(langLevel(l, "pt")).toBe("LP");
  });
});

// Guardrails over the real published content: a broken invariant here means the
// live portfolio would render a half-translated card, a wrong employment state,
// or an unsafe link — so these assert business/validation rules, not copy.
describe("content integrity", () => {
  it("every project is fully bilingual, tagged and free of placeholder links", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name.trim()).not.toBe("");
      expect(p.desc_en.trim()).not.toBe("");
      expect(p.desc_pt.trim()).not.toBe("");
      expect(p.tags.length).toBeGreaterThan(0);
      // "#" was the old placeholder; real projects either omit the link or set a real URL.
      expect(p.link ?? "").not.toBe("#");
      if (p.link) expect(p.link).toMatch(/^https?:\/\//);
    }
  });

  it("every stack group has both labels and at least one item", () => {
    expect(stackGroups.length).toBeGreaterThan(0);
    for (const g of stackGroups) {
      expect(g.label_en.trim()).not.toBe("");
      expect(g.label_pt.trim()).not.toBe("");
      expect(g.items.length).toBeGreaterThan(0);
    }
  });

  it("has exactly one ongoing role, listed first, with entries most-recent-first", () => {
    const ongoing = experiences.filter((e) => e.end === null);
    expect(ongoing).toHaveLength(1);
    expect(experiences[0].end).toBeNull();
    // "YYYY-MM" strings sort lexicographically, so descending start = most recent first.
    for (let i = 0; i < experiences.length - 1; i++) {
      expect(experiences[i].start >= experiences[i + 1].start).toBe(true);
    }
  });

  it("keeps every experience date in YYYY-MM form", () => {
    for (const e of experiences) {
      expect(e.start).toMatch(/^\d{4}-\d{2}$/);
      if (e.end !== null) expect(e.end).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("scores every language on a 1–5 scale", () => {
    expect(languages.length).toBeGreaterThan(0);
    for (const l of languages) {
      expect(l.score).toBeGreaterThanOrEqual(1);
      expect(l.score).toBeLessThanOrEqual(5);
    }
  });

  it("exposes only safe, absolute contact links", () => {
    expect(contacts.length).toBeGreaterThan(0);
    for (const c of contacts) {
      expect(c.label.trim()).not.toBe("");
      expect(c.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});

describe("years-of-experience interpolation", () => {
  it("replaces every {years} token", () => {
    expect(interpolateYears("{years} yrs · since {years}", 5)).toBe("5 yrs · since 5");
  });

  it("leaves copy without the token untouched", () => {
    expect(interpolateYears("no token here", 5)).toBe("no token here");
  });

  it("keeps the {years} token in the raw bio copy (never hard-codes the number)", () => {
    for (const lang of ["en", "pt"] as const) {
      expect(i18n[lang].hero.tagline).toContain("{years}");
      expect(i18n[lang].about.body).toContain("{years}");
    }
  });

  it("resolves the bio copy to a concrete number with no leftover token", () => {
    for (const lang of ["en", "pt"] as const) {
      for (const raw of [i18n[lang].hero.tagline, i18n[lang].about.body]) {
        const resolved = withYears(raw);
        expect(resolved).not.toContain("{years}");
        expect(resolved).toMatch(/\d+ (years|anos)/);
      }
    }
  });
});
