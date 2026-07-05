import { describe, expect, it } from "vitest";
import {
  formatExperience,
  langLevel,
  langName,
  projectDesc,
  stackLabel,
  type Experience,
  type Language,
  type Project,
  type StackGroup,
} from "./content";

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
    const r = formatExperience({ ...base, tags_en: undefined, tags_pt: undefined }, "en", { y: 2026, m: 5 });
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
