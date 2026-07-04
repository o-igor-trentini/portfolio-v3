import type { Lang } from "./i18n";

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
    desc_en: "High-throughput API gateway exposing gRPC + REST, handling auth, rate limiting and request fan-out.",
    desc_pt: "API gateway de alta vazão expondo gRPC + REST, com auth, rate limiting e fan-out de requisições.",
  },
  {
    name: "taskq",
    link: "#",
    tags: ["Go", "RabbitMQ", "Docker"],
    desc_en: "Distributed job queue with at-least-once delivery, retries with backoff and a small dashboard.",
    desc_pt: "Fila de jobs distribuída com entrega at-least-once, retries com backoff e um painel enxuto.",
  },
  {
    name: "obsd",
    link: "#",
    tags: ["Go", "Prometheus"],
    desc_en: "Lightweight observability agent collecting runtime metrics and exporting them to Prometheus.",
    desc_pt: "Agente leve de observabilidade que coleta métricas de runtime e exporta para o Prometheus.",
  },
  {
    name: "authsvc",
    link: "#",
    tags: ["Go", "JWT", "PostgreSQL"],
    desc_en: "Stateless authentication service with JWT issuance, refresh rotation and role-based access.",
    desc_pt: "Serviço de autenticação stateless com emissão de JWT, rotação de refresh e acesso por papéis.",
  },
  {
    name: "streamd",
    link: "#",
    tags: ["Go", "Kafka", "gRPC"],
    desc_en: "Stream processor consuming Kafka topics and fanning enriched events out over gRPC.",
    desc_pt: "Processador de streams que consome tópicos Kafka e distribui eventos enriquecidos via gRPC.",
  },
  {
    name: "ratelimit",
    link: "#",
    tags: ["Go", "Redis"],
    desc_en: "Distributed rate limiter with sliding-window counters backed by Redis, deployable as middleware.",
    desc_pt: "Rate limiter distribuído com contadores de janela deslizante em Redis, usável como middleware.",
  },
];

export const certs: Cert[] = [
  { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2024", link: "#" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF · Linux Foundation", year: "2023", link: "#" },
  { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", year: "2022", link: "#" },
  { name: "Docker Certified Associate", issuer: "Docker", year: "2022", link: "#" },
  { name: "MongoDB Associate Developer", issuer: "MongoDB", year: "2021", link: "#" },
];

export const languages: Language[] = [
  { name_en: "Portuguese", name_pt: "Português", level_en: "Native", level_pt: "Nativo", score: 5 },
  { name_en: "English", name_pt: "Inglês", level_en: "Professional · C1", level_pt: "Profissional · C1", score: 4 },
];

export const contacts: Contact[] = [
  { label: "email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { label: "github", value: "github.com/your-handle", href: "https://github.com/your-handle" },
  { label: "linkedin", value: "linkedin.com/in/your-handle", href: "https://linkedin.com/in/your-handle" },
];

// ---- localization helpers -------------------------------------------------

export const stackLabel = (g: StackGroup, lang: Lang) => (lang === "pt" ? g.label_pt : g.label_en);
export const projectDesc = (p: Project, lang: Lang) => (lang === "pt" ? p.desc_pt : p.desc_en);
export const langName = (l: Language, lang: Lang) => (lang === "pt" ? l.name_pt : l.name_en);
export const langLevel = (l: Language, lang: Lang) => (lang === "pt" ? l.level_pt : l.level_en);
