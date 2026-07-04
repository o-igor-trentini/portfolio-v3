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
  stack: { label: string; note: string };
  projects: { label: string; note: string };
  certs: { label: string; note: string; verify: string };
  contact: { label: string; note: string };
  footer: { built: string; terminalBtn: string };
  common: { more: string; less: string; stackMore: string; stackLess: string; wip: string };
}

export const i18n: Record<Lang, Dict> = {
  en: {
    nav: { about: "about", experience: "experience", langs: "languages", stack: "stack", projects: "projects", certs: "certs", contact: "contact" },
    experience: { label: "experience", note: "where I've worked", present: "present" },
    langs: { label: "languages", note: "spoken & written proficiency" },
    hero: {
      cmd: "whoami",
      role: "Backend Developer · Go",
      tagline:
        "I build backend systems that stay up. Reliable, high-throughput services with clean, well-tested code.",
      cta: "open terminal",
      hint1: "or press",
      hint2: "anywhere",
    },
    about: {
      label: "about",
      body:
        "I'm a backend developer specialized in Go, building reliable, high-throughput services. I started out full-stack, so I'm comfortable across the whole stack — but my focus is APIs, distributed systems, and code that's clean, observable, and well tested.",
    },
    stack: { label: "stack", note: "core focus on Go and distributed backend systems" },
    projects: { label: "projects", note: "a few things I've built" },
    certs: { label: "certifications", note: "credentials & continued learning", verify: "view credential" },
    contact: { label: "contact", note: "open to backend & platform engineering roles" },
    footer: { built: "built with care · no frameworks were harmed", terminalBtn: "terminal" },
    common: { more: "show more", less: "show less", stackMore: "show all", stackLess: "show less", wip: "working on it…" },
  },
  pt: {
    nav: { about: "sobre", experience: "experiência", langs: "idiomas", stack: "stack", projects: "projetos", certs: "certs", contact: "contato" },
    experience: { label: "experiência", note: "onde já trabalhei", present: "presente" },
    langs: { label: "idiomas", note: "proficiência falada e escrita" },
    hero: {
      cmd: "whoami",
      role: "Desenvolvedor Backend · Go",
      tagline:
        "Construo sistemas backend que não caem. Serviços confiáveis e de alta vazão, com código limpo e bem testado.",
      cta: "abrir terminal",
      hint1: "ou pressione",
      hint2: "em qualquer lugar",
    },
    about: {
      label: "sobre",
      body:
        "Sou desenvolvedor backend especializado em Go, construindo serviços confiáveis e de alta vazão. Comecei como full-stack, então transito bem por toda a stack — mas meu foco são APIs, sistemas distribuídos e código limpo, observável e bem testado.",
    },
    stack: { label: "stack", note: "foco principal em Go e sistemas backend distribuídos" },
    projects: { label: "projetos", note: "algumas coisas que construí" },
    certs: { label: "certificações", note: "credenciais & aprendizado contínuo", verify: "ver credencial" },
    contact: { label: "contato", note: "aberto a vagas de backend & plataforma" },
    footer: { built: "feito com cuidado · nenhum framework foi ferido", terminalBtn: "terminal" },
    common: { more: "mostrar mais", less: "mostrar menos", stackMore: "mostrar tudo", stackLess: "mostrar menos", wip: "trabalhando nisso…" },
  },
};

/** Resolve the initial language deterministically (SSR-safe). */
export function defaultLang(): Lang {
  return "en";
}
