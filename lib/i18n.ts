export type Lang = "en" | "pt";

export interface Dict {
  nav: {
    about: string;
    experience: string;
    langs: string;
    stack: string;
    projects: string;
    certs: string;
    contact: string;
  };
  /** Per-locale <title> and meta description (see lib/seo.ts). */
  seo: { title: string; description: string };
  experience: { label: string; note: string; present: string };
  langs: { label: string; note: string };
  hero: {
    cmd: string;
    role: string;
    tagline: string;
    cta: string;
    hint1: string;
    hint2: string;
  };
  about: { label: string; body: string };
  // `chipLess` is the compact chip word; `moreAria`/`lessAria` are the a11y
  // labels for the per-group show-more toggle (`{n}` = hidden item count).
  stack: { label: string; note: string; chipLess: string; moreAria: string; lessAria: string };
  projects: { label: string; note: string };
  certs: { label: string; note: string; verify: string };
  contact: { label: string; note: string };
  footer: { built: string; terminalBtn: string };
  common: { more: string; less: string; stackMore: string; stackLess: string; wip: string };
  consent: { message: string; accept: string; decline: string };
  a11y: { skip: string };
}

export const i18n: Record<Lang, Dict> = {
  en: {
    nav: {
      about: "about",
      experience: "experience",
      langs: "languages",
      stack: "stack",
      projects: "projects",
      certs: "certs",
      contact: "contact",
    },
    seo: {
      title: "Igor Trentini — Backend Developer (Go)",
      description:
        "Igor Trentini — Backend Developer specialized in Go. Reliable, high-throughput services, APIs and distributed systems with clean, observable, well-tested code.",
    },
    experience: { label: "experience", note: "where I've worked", present: "present" },
    langs: { label: "languages", note: "spoken & written proficiency" },
    hero: {
      cmd: "whoami",
      role: "Backend Developer · Go",
      tagline:
        "{years} years building mission-critical backend systems in Go for logistics & risk management. Reliable, high-throughput and well-tested.",
      cta: "open terminal",
      hint1: "or press",
      hint2: "anywhere",
    },
    about: {
      label: "about",
      body: "I'm a Go backend developer with {years} years building reliable, high-throughput systems. I care about clean architecture, well-tested code and services that stay observable and up under load. I've led projects from zero to production and spent 2+ years as the sole developer on mission-critical systems, so I'm comfortable owning a service end to end. I started full-stack with React and TypeScript and still move across the whole stack, but my focus is APIs, distributed systems and backend built to last.",
    },
    stack: {
      label: "stack",
      note: "core focus on Go and distributed backend systems",
      chipLess: "less",
      moreAria: "show {n} more",
      lessAria: "show less",
    },
    projects: { label: "projects", note: "a few things I've built" },
    certs: {
      label: "certifications",
      note: "credentials & continued learning",
      verify: "view credential",
    },
    contact: { label: "contact", note: "open to backend & platform engineering roles" },
    footer: { built: "built with care · no frameworks were harmed", terminalBtn: "terminal" },
    common: {
      more: "show more",
      less: "show less",
      stackMore: "show all",
      stackLess: "show less",
      wip: "working on it…",
    },
    consent: {
      message:
        "This site uses Google Analytics to understand traffic. No cookies are set until you accept.",
      accept: "accept",
      decline: "decline",
    },
    a11y: { skip: "skip to content" },
  },
  pt: {
    nav: {
      about: "sobre",
      experience: "experiência",
      langs: "idiomas",
      stack: "stack",
      projects: "projetos",
      certs: "certs",
      contact: "contato",
    },
    seo: {
      title: "Igor Trentini — Desenvolvedor Backend (Go)",
      description:
        "Igor Trentini — Desenvolvedor Backend especializado em Go. Serviços confiáveis e de alta vazão, APIs e sistemas distribuídos com código limpo, observável e bem testado.",
    },
    experience: { label: "experiência", note: "onde já trabalhei", present: "presente" },
    langs: { label: "idiomas", note: "proficiência falada e escrita" },
    hero: {
      cmd: "whoami",
      role: "Desenvolvedor Backend · Go",
      tagline:
        "{years} anos construindo sistemas backend de missão crítica em Go para logística e gestão de risco. Confiáveis, de alta vazão e bem testados.",
      cta: "abrir terminal",
      hint1: "ou pressione",
      hint2: "em qualquer lugar",
    },
    about: {
      label: "sobre",
      body: "Sou desenvolvedor backend Go com {years} anos construindo sistemas confiáveis e de alta vazão. Me importo com arquitetura limpa, código bem testado e serviços observáveis que se mantêm de pé sob carga. Já conduzi projetos do zero à produção e atuei 2+ anos como único desenvolvedor em sistemas de missão crítica, então me sinto à vontade sendo dono de um serviço de ponta a ponta. Comecei full-stack com React e TypeScript e ainda transito por toda a stack, mas meu foco são APIs, sistemas distribuídos e backend feito para durar.",
    },
    stack: {
      label: "stack",
      note: "foco principal em Go e sistemas backend distribuídos",
      chipLess: "menos",
      moreAria: "mostrar mais {n}",
      lessAria: "mostrar menos",
    },
    projects: { label: "projetos", note: "algumas coisas que construí" },
    certs: {
      label: "certificações",
      note: "credenciais & aprendizado contínuo",
      verify: "ver credencial",
    },
    contact: { label: "contato", note: "aberto a vagas de backend & plataforma" },
    footer: { built: "feito com cuidado · nenhum framework foi ferido", terminalBtn: "terminal" },
    common: {
      more: "mostrar mais",
      less: "mostrar menos",
      stackMore: "mostrar tudo",
      stackLess: "mostrar menos",
      wip: "trabalhando nisso…",
    },
    consent: {
      message:
        "Este site usa Google Analytics para entender o tráfego. Nenhum cookie é criado até você aceitar.",
      accept: "aceitar",
      decline: "recusar",
    },
    a11y: { skip: "pular para o conteúdo" },
  },
};

/** Resolve the initial language deterministically (SSR-safe). */
export function defaultLang(): Lang {
  return "en";
}
