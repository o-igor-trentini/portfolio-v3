export type Lang = "en" | "pt";

export interface Dict {
  nav: {
    about: string;
    workflow: string;
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
  workflow: { label: string; note: string; body: string };
  // `chipLess` is the compact chip word; `moreAria`/`lessAria` are the a11y
  // labels for the per-group show-more toggle (`{n}` = hidden item count).
  stack: { label: string; note: string; chipLess: string; moreAria: string; lessAria: string };
  projects: { label: string; note: string };
  certs: { label: string; note: string; verify: string };
  contact: { label: string; note: string; resume: string };
  footer: { built: string; terminalBtn: string };
  common: { more: string; less: string; stackMore: string; stackLess: string; wip: string };
  consent: { message: string; accept: string; decline: string };
  // `copy`/`copied` are the copy-to-clipboard button label and its post-copy
  // confirmation; both take a `{label}` token for the contact being copied.
  // The remaining keys localize the interactive chrome's `aria-label`s (theme
  // toggle, menu, language group and the terminal dialog) so screen readers on
  // `/pt/` are announced in Portuguese too.
  a11y: {
    skip: string;
    newTab: string;
    copy: string;
    copied: string;
    themeToLight: string;
    themeToDark: string;
    menu: string;
    language: string;
    terminal: string;
    terminalClose: string;
    terminalOutput: string;
    terminalInput: string;
    consent: string;
  };
}

export const i18n: Record<Lang, Dict> = {
  en: {
    nav: {
      about: "about",
      workflow: "workflow",
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
    workflow: {
      label: "workflow",
      note: "how I turn ambiguity into shipped software",
      body: "I treat AI as leverage on judgment, not a replacement for it. It moved my time toward the decisions that actually matter. My cycle is deliberate and spec-driven: I refine the problem into a clear spec before touching code, analyze trade-offs and edge cases, then implement in small, verifiable steps. And it doesn't stop at the code. I bring it into the whole delivery chain: clear pull requests, validation guides QA can actually follow, and technical documentation. That speeds up the team's work and raises its quality, not just my own. The result isn't just faster code; it's more time on architecture and less on boilerplate, with handoffs the whole team can trust.",
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
    contact: {
      label: "contact",
      note: "open to backend & platform engineering roles",
      resume: "download résumé",
    },
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
    a11y: {
      skip: "skip to content",
      newTab: "opens in a new tab",
      copy: "copy {label}",
      copied: "{label} copied",
      themeToLight: "switch to light theme",
      themeToDark: "switch to dark theme",
      menu: "menu",
      language: "language",
      terminal: "terminal",
      terminalClose: "close terminal",
      terminalOutput: "terminal output",
      terminalInput: "terminal input",
      consent: "cookie consent",
    },
  },
  pt: {
    nav: {
      about: "sobre",
      workflow: "workflow",
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
    workflow: {
      label: "workflow",
      note: "como transformo ambiguidade em software entregue",
      body: "Trato IA como alavanca de julgamento, não como substituto dele. Ela moveu meu tempo para as decisões que realmente importam. Meu ciclo é deliberado e guiado por especificação (spec-driven development): refino o problema numa spec clara antes de tocar no código, analiso trade-offs e casos de borda, e então implemento em passos pequenos e verificáveis. E não para no código. Levo a IA para toda a cadeia de entrega: pull requests claros, guias de validação que o QA consegue de fato seguir e documentação técnica. Isso dá agilidade e eleva a qualidade do trabalho do time, não só do meu. O resultado não é só código mais rápido: é mais tempo em arquitetura e menos em boilerplate, com handoffs em que o time inteiro pode confiar.",
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
    contact: {
      label: "contato",
      note: "aberto a vagas de backend & plataforma",
      resume: "baixar currículo",
    },
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
    a11y: {
      skip: "pular para o conteúdo",
      newTab: "abre em nova aba",
      copy: "copiar {label}",
      copied: "{label} copiado",
      themeToLight: "mudar para tema claro",
      themeToDark: "mudar para tema escuro",
      menu: "menu",
      language: "idioma",
      terminal: "terminal",
      terminalClose: "fechar terminal",
      terminalOutput: "saída do terminal",
      terminalInput: "entrada do terminal",
      consent: "consentimento de cookies",
    },
  },
};
