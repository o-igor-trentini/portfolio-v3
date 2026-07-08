import { i18n, type Lang } from "./i18n";
import {
  formatDuration,
  formatMonthYear,
  monthsInclusive,
  nowYM,
  parseYM,
  yearsOfExperience,
  type YearMonth,
} from "./date";
import { CAREER_START } from "@/site.config";
import { format } from "./format";

export interface StackGroup {
  label_en: string;
  label_pt: string;
  items: string[];
}

export interface Project {
  name: string;
  // Optional: work projects live in private repos, so most have no public link.
  // When absent the card renders as plain text instead of an external anchor.
  link?: string;
  tags: string[];
  desc_en: string;
  desc_pt: string;
}

export interface Experience {
  company: string;
  role_en: string;
  role_pt: string;
  mode_en: string;
  mode_pt: string;
  industry_en: string;
  industry_pt: string;
  start: string; // "YYYY-MM"
  end: string | null; // "YYYY-MM" or null when current
  link?: string;
  tags_en?: string[];
  tags_pt?: string[];
}

export interface Cert {
  name: string;
  issuer: string;
  year: string;
  link: string;
}

/** Top of the language-proficiency scale — shared by the data and the score bar. */
export const SCORE_MAX = 5;

export interface Language {
  name_en: string;
  name_pt: string;
  level_en: string;
  level_pt: string;
  score: number; // out of SCORE_MAX
}

export interface Contact {
  label: string;
  value: string;
  href: string;
}

export const stackGroups: StackGroup[] = [
  { label_en: "languages", label_pt: "linguagens", items: ["Go", "TypeScript", "SQL"] },
  {
    label_en: "backend",
    label_pt: "backend",
    items: [
      "Gin",
      "GORM",
      "Google Wire",
      "REST APIs",
      "Microservices",
      "Clean Architecture",
      "DDD",
      "Concurrency",
    ],
  },
  { label_en: "data", label_pt: "dados", items: ["PostgreSQL", "RabbitMQ", "MS SQL Server"] },
  {
    label_en: "testing",
    label_pt: "testes",
    items: ["Testify", "Testcontainers", "Vitest", "React Testing Library"],
  },
  {
    label_en: "cloud & infra",
    label_pt: "cloud & infra",
    items: ["Docker", "AWS", "Google Cloud", "Keycloak", "Nginx", "Jenkins", "CI/CD", "Git"],
  },
  {
    label_en: "frontend",
    label_pt: "frontend",
    items: ["React", "TypeScript", "Ant Design", "Vite"],
  },
];

/**
 * Every stack technology, flattened and de-duplicated (TypeScript spans two
 * groups). The single source of truth for the tech list — the JSON-LD
 * `knowsAbout` (lib/seo.ts) and the terminal's neofetch highlight derive from
 * here so they can't drift from what the Stack section actually shows.
 */
export const stackItems: string[] = [...new Set(stackGroups.flatMap((g) => g.items))];

/**
 * A short highlight for compact surfaces (the terminal's neofetch box). Sourced
 * from the canonical stack — the `.filter` drops any name that no longer exists
 * in `stackItems`, so a rename in `stackGroups` can never leave stale text here.
 */
export const stackHighlight: string[] = ["Go", "Gin", "PostgreSQL", "AWS"].filter((s) =>
  stackItems.includes(s),
);

// Real work projects, anonymized: internal system/client/vendor names are
// intentionally omitted (private repos, so no `link`). Order is display order.
export const projects: Project[] = [
  {
    name: "document-validation",
    tags: ["Go", "Gin", "PostgreSQL", "React", "RabbitMQ"],
    desc_en:
      "Enterprise full-stack platform (Go + React monorepo, 5 integrated apps) validating people, companies and vehicles across dozens of internal and external integrations — OCR, computer-vision facial checks, real-time chat and async record sync over message queues. A large codebase serving thousands of companies at high, business-critical query volume.",
    desc_pt:
      "Plataforma full-stack enterprise (monorepo Go + React, 5 apps integradas) que valida pessoas, empresas e veículos por meio de dezenas de integrações internas e externas — OCR, validação facial por visão computacional, chat em tempo real e sync assíncrono de cadastros via mensageria. Base de código extensa, atendendo milhares de empresas em alto volume de consultas, crítico ao negócio.",
  },
  {
    name: "live-verification",
    tags: ["Go", "React", "WebRTC", "PostgreSQL", "AWS S3"],
    desc_en:
      "Full-stack video-call platform with real-time checklists for live participant verification: recording, automatic PDF reports, webhooks, multi-tenant white-label, OAuth2 and S3 storage. Used in production for higher-risk cases, stable with zero urgent fixes since launch.",
    desc_pt:
      "Plataforma full-stack de videochamadas com checklist em tempo real para verificação ao vivo de participantes: gravação, relatórios PDF automáticos, webhooks, multi-tenant white-label, OAuth2 e armazenamento em S3. Usado em produção para casos de risco elevado, estável e sem correções urgentes desde o lançamento.",
  },
  {
    name: "integration-gateway",
    tags: ["Go", "Gin", "PostgreSQL", "Docker", "Cache"],
    desc_en:
      "Go REST API acting as a smart broker for government and AI integrations to validate documents and personal data — intelligent caching, automatic fallback between providers and full audit trail. Handles high request volume, with caching that cut external-API cost by 70–80%.",
    desc_pt:
      "API REST em Go que atua como broker inteligente de integrações governamentais e de IA para validar documentos e dados pessoais — cache inteligente, fallback automático entre provedores e auditoria completa. Sustenta alto volume de requisições, com cache que reduziu o custo de APIs externas em 70–80%.",
  },
  {
    name: "risk-registry",
    tags: ["Go", "PostgreSQL", "React", "Webhooks", "RBAC"],
    desc_en:
      "Enterprise registry for records and restrictions (Go + React) with a central REST API for identifier-based checks (CPF, CNPJ and plates across 6 Mercosur countries), granular multi-tenant RBAC, bidirectional webhooks and clean/DDD architecture. Tens of thousands of checks, 24/7.",
    desc_pt:
      "Sistema enterprise de cadastro e consulta de registros e restrições (Go + React) com API REST central para verificações por identificadores (CPF, CNPJ e placas de 6 países do Mercosul), RBAC granular multi-tenant, webhooks bidirecionais e arquitetura limpa/DDD. Dezenas de milhares de verificações, 24/7.",
  },
  {
    name: "engineering-metrics",
    tags: ["Go", "React", "AWS Athena", "ECharts", "Jira"],
    desc_en:
      "Full-stack monorepo for software-delivery metrics, releases and knowledge base: Jira sync, historical analysis via AWS Athena, interactive dashboards, granular permissions and multi-product white-label.",
    desc_pt:
      "Monorepo full-stack para métricas de entrega de software, releases e base de conhecimento: sync com Jira, análise histórica via AWS Athena, dashboards interativos, permissões granulares e white-label multi-produto.",
  },
  {
    name: "go-sdk-monorepo",
    tags: ["Go", "OAuth2", "SDK", "OpenTelemetry"],
    desc_en:
      "Monorepo of independent Go libraries/SDKs for external-API integration — centralized auth, document processing, vehicle/person lookups, webhooks and reusable utilities. Adopted across other teams, with a strong focus on modularity and maintainability.",
    desc_pt:
      "Monorepo com bibliotecas/SDKs Go independentes para integração com APIs externas — auth centralizada, processamento de documentos, consulta de veículos/pessoas, webhooks e utilitários reutilizáveis. Adotado por outros times, com forte foco em modularidade e manutenibilidade.",
  },
];

// Most recent first.
export const experiences: Experience[] = [
  {
    company: "Frete.com",
    role_en: "Backend Developer",
    role_pt: "Desenvolvedor Backend",
    mode_en: "remote",
    mode_pt: "remoto",
    industry_en: "logistics tech",
    industry_pt: "logtech",
    start: "2026-05",
    end: null,
    tags_en: ["unicorn", "multinational"],
    tags_pt: ["unicórnio", "multinacional"],
  },
  {
    company: "Logae",
    role_en: "Backend Developer",
    role_pt: "Desenvolvedor Backend",
    mode_en: "hybrid",
    mode_pt: "híbrido",
    industry_en: "logistics & risk management",
    industry_pt: "logística & gestão de risco",
    start: "2021-09",
    end: "2026-05",
    tags_en: [
      "technical go-to · ~30 devs",
      "4 projects zero-to-prod",
      "thousands of companies · high-volume, business-critical",
    ],
    tags_pt: [
      "ponto de apoio técnico · ~30 devs",
      "4 projetos do zero à produção",
      "milhares de empresas · alto volume, crítico ao negócio",
    ],
  },
];

// No certifications yet — the Certs section renders an <EmptyState/> fallback
// while this list is empty. Add entries with the shape below to populate it:
//   { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2024", link: "https://…" }
export const certs: Cert[] = [];

export const languages: Language[] = [
  { name_en: "Portuguese", name_pt: "Português", level_en: "Native", level_pt: "Nativo", score: 5 },
  {
    name_en: "English",
    name_pt: "Inglês",
    level_en: "Fluent technical reading · intermediate conversation",
    level_pt: "Leitura técnica fluente · conversação intermediária",
    score: 3,
  },
];

export const contacts: Contact[] = [
  {
    label: "github",
    value: "github.com/o-igor-trentini",
    href: "https://github.com/o-igor-trentini",
  },
  {
    label: "linkedin",
    value: "linkedin.com/in/igor-trentini",
    href: "https://www.linkedin.com/in/igor-trentini",
  },
  {
    label: "email",
    value: "igortrentini.2004@gmail.com",
    href: "mailto:igortrentini.2004@gmail.com",
  },
];

// ---- localization helpers -------------------------------------------------

/**
 * Choose the value for the active locale. The single place the `_en`/`_pt`
 * branch lives — every bilingual accessor below delegates the decision here.
 */
const byLang = <V>(en: V, pt: V, lang: Lang): V => (lang === "pt" ? pt : en);

export const expRole = (e: Experience, lang: Lang) => byLang(e.role_en, e.role_pt, lang);
export const expMode = (e: Experience, lang: Lang) => byLang(e.mode_en, e.mode_pt, lang);
export const expIndustry = (e: Experience, lang: Lang) =>
  byLang(e.industry_en, e.industry_pt, lang);
// Tags are optional per experience, so this one keeps its empty-list default.
export const expTags = (e: Experience, lang: Lang) => byLang(e.tags_en, e.tags_pt, lang) ?? [];

export const stackLabel = (g: StackGroup, lang: Lang) => byLang(g.label_en, g.label_pt, lang);
export const projectDesc = (p: Project, lang: Lang) => byLang(p.desc_en, p.desc_pt, lang);
export const langName = (l: Language, lang: Lang) => byLang(l.name_en, l.name_pt, lang);
export const langLevel = (l: Language, lang: Lang) => byLang(l.level_en, l.level_pt, lang);

// Freshest content date as "YYYY-MM-DD", derived from the most recent experience
// start (entries are most-recent-first). Feeds the sitemap <lastmod> and the
// JSON-LD `dateModified`, so a new role automatically freshens both.
export const lastUpdated = `${experiences[0].start}-01`;

// ---- years of experience --------------------------------------------------

// Computed once at module load (build time for the static export) and rounded
// to the nearest year. Bio copy carries a `{years}` token instead of a fixed
// number, so it never silently goes stale — see `withYears`.
export const yearsExperience = yearsOfExperience(CAREER_START, nowYM());

/** Replace the `{years}` token in a string with a given years-of-experience value. */
export const interpolateYears = (text: string, years: number) => format(text, { years });

/** Resolve `{years}` in bio copy using the build-time `yearsExperience`. */
export const withYears = (text: string) => interpolateYears(text, yearsExperience);

// ---- experience formatting -------------------------------------------------

export interface FormattedExperience {
  present: boolean;
  period: string;
  duration: string | null;
  tags: string[];
}

/**
 * Localized period/duration/tags for one experience. `now` is the client-only
 * current month (null before it's known): for the ongoing role, that means the
 * period still reads "present" but the duration is omitted until `now` arrives.
 */
export function formatExperience(
  e: Experience,
  lang: Lang,
  now: YearMonth | null,
): FormattedExperience {
  const present = e.end === null;
  const endYM = present ? now : parseYM(e.end as string);
  const endLabel = present ? i18n[lang].experience.present : formatMonthYear(e.end as string, lang);
  const period = `${formatMonthYear(e.start, lang)} — ${endLabel}`;
  const duration = endYM ? formatDuration(monthsInclusive(e.start, endYM), lang) : null;
  return { present, period, duration, tags: expTags(e, lang) };
}
