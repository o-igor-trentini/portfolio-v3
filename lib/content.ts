import { i18n, type Lang } from "./i18n";
import { formatDuration, formatMonthYear, monthsInclusive, parseYM, type YearMonth } from "./date";

export interface StackGroup {
  label_en: string;
  label_pt: string;
  items: string[];
}

export interface Project {
  name: string;
  link: string;
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

export interface Language {
  name_en: string;
  name_pt: string;
  level_en: string;
  level_pt: string;
  score: number; // out of 5
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
      "gRPC",
      "REST",
      "GraphQL",
      "Microservices",
      "Event-driven",
      "Message queues",
      "WebSockets",
      "Sagas",
      "CQRS",
      "Circuit breakers",
      "Rate limiting",
    ],
  },
  { label_en: "data", label_pt: "dados", items: ["PostgreSQL", "Redis"] },
  { label_en: "infra", label_pt: "infra", items: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
];

export const projects: Project[] = [
  {
    name: "core-api",
    link: "#",
    tags: ["Go", "gRPC", "PostgreSQL", "Redis"],
    desc_en:
      "High-throughput API gateway exposing gRPC + REST, handling auth, rate limiting and request fan-out.",
    desc_pt:
      "API gateway de alta vazão expondo gRPC + REST, com auth, rate limiting e fan-out de requisições.",
  },
  {
    name: "taskq",
    link: "#",
    tags: ["Go", "RabbitMQ", "Docker"],
    desc_en:
      "Distributed job queue with at-least-once delivery, retries with backoff and a small dashboard.",
    desc_pt:
      "Fila de jobs distribuída com entrega at-least-once, retries com backoff e um painel enxuto.",
  },
  {
    name: "obsd",
    link: "#",
    tags: ["Go", "Prometheus"],
    desc_en:
      "Lightweight observability agent collecting runtime metrics and exporting them to Prometheus.",
    desc_pt:
      "Agente leve de observabilidade que coleta métricas de runtime e exporta para o Prometheus.",
  },
  {
    name: "authsvc",
    link: "#",
    tags: ["Go", "JWT", "PostgreSQL"],
    desc_en:
      "Stateless authentication service with JWT issuance, refresh rotation and role-based access.",
    desc_pt:
      "Serviço de autenticação stateless com emissão de JWT, rotação de refresh e acesso por papéis.",
  },
  {
    name: "streamd",
    link: "#",
    tags: ["Go", "Kafka", "gRPC"],
    desc_en: "Stream processor consuming Kafka topics and fanning enriched events out over gRPC.",
    desc_pt:
      "Processador de streams que consome tópicos Kafka e distribui eventos enriquecidos via gRPC.",
  },
  {
    name: "ratelimit",
    link: "#",
    tags: ["Go", "Redis"],
    desc_en:
      "Distributed rate limiter with sliding-window counters backed by Redis, deployable as middleware.",
    desc_pt:
      "Rate limiter distribuído com contadores de janela deslizante em Redis, usável como middleware.",
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
    role_en: "Full Stack Developer",
    role_pt: "Desenvolvedor Full Stack",
    mode_en: "hybrid",
    mode_pt: "híbrido",
    industry_en: "logistics tech",
    industry_pt: "logtech",
    start: "2021-09",
    end: "2026-05",
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
    level_en: "Professional · C1",
    level_pt: "Profissional · C1",
    score: 4,
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
];

// ---- localization helpers -------------------------------------------------

export const expRole = (e: Experience, lang: Lang) => (lang === "pt" ? e.role_pt : e.role_en);
export const expMode = (e: Experience, lang: Lang) => (lang === "pt" ? e.mode_pt : e.mode_en);
export const expIndustry = (e: Experience, lang: Lang) =>
  lang === "pt" ? e.industry_pt : e.industry_en;
export const expTags = (e: Experience, lang: Lang) => (lang === "pt" ? e.tags_pt : e.tags_en) ?? [];

export const stackLabel = (g: StackGroup, lang: Lang) => (lang === "pt" ? g.label_pt : g.label_en);
export const projectDesc = (p: Project, lang: Lang) => (lang === "pt" ? p.desc_pt : p.desc_en);
export const langName = (l: Language, lang: Lang) => (lang === "pt" ? l.name_pt : l.name_en);
export const langLevel = (l: Language, lang: Lang) => (lang === "pt" ? l.level_pt : l.level_en);

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
