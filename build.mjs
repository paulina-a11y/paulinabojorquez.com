// Builds the static site into dist/: one page per language from the content below.
// Run: node build.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const SITE = 'https://paulinabojorquez.com';
const EMAIL = 'apaubojorquez@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/paulinabojorquez';
const GITHUB = 'https://github.com/paulina-a11y';
const BOOKING = 'https://calendar.app.google/Bz1hPw199SUqB7g37';
const BOOKING_EMBED = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ18WGOyBQA_z-KNwksOwNZX4sGKR_nFupW4KYzRLCTkdTetZLsrjNsNoH7F3FA-XT7oQO7X44vt?gv=true';
// Pending decisions: set CV_URL to '/cv/<file>.pdf' once a CV without phone number is in static/cv/.
const CV_URL = null;
// The startup's name stays private until Paulina confirms it can be public; set it here when it can.
const STARTUP_NAME = null;

const posts = [
  { date: '2026-11-27', lang: 'EN', title: 'In order to go fast, first you need to go deep', href: 'https://www.linkedin.com/feed/update/urn:li:share:7532175392644837376' },
  { date: '2026-11-20', lang: 'EN', title: "I'm partnering with an entrepreneur (GTM for an AI product)", href: 'https://lnkd.in/p/gQSSEPNj' },
  { date: '2026-11-10', lang: 'EN', title: 'Why would you take a paid media manager course if you can just create a media manager agent?', href: 'https://www.linkedin.com/feed/update/urn:li:share:7526016555047014402' },
  { date: '2026-11-06', lang: 'ES', title: '¿Tu CRM es solo una costosa herramienta de pipeline?', href: 'https://lnkd.in/p/gKwMTYmm' },
  { date: '2026-11-05', lang: 'EN', title: 'You start tomorrow: how would you decide which features to prioritize?', href: 'https://www.linkedin.com/feed/update/urn:li:share:7524200297922166784' }
];

const startup = { en: STARTUP_NAME ?? 'AI startup for real estate agents', es: STARTUP_NAME ?? 'Startup de IA para agentes inmobiliarios' };

const T = {
  en: {
    htmlLang: 'en', other: 'es',
    title: 'Paulina Bojórquez — Product, GTM & Business Operations',
    description: 'Paulina Bojórquez: 14 years in B2B connecting business, customers and technical delivery. Product, GTM and business operations, hands-on with applied AI. Remote from Ensenada, Mexico.',
    contact: 'Get in touch', book: 'Book a call', download: 'Download CV',
    nav: { about: 'About me', impact: 'Impact', experience: 'Experience', building: 'Building', writing: 'Writing', skills: 'Skills', book: 'Book a call', cv: 'cv.pdf' },
    files: { about: 'about-me.txt', impact: 'impact/', experience: 'experience/', building: 'building/', writing: 'writing/', skills: 'skills-and-education.txt', book: 'book-a-call.ics', cv: 'cv.pdf' },
    hint: 'Click an icon to open it.', close: 'Close window', replay: 'Replay photo loading', loading: 'loading paulina.jpg…',
    hi: "Hi, I'm Paulina.",
    headline: 'Product, GTM & Business Operations · B2B SaaS · Applied AI',
    bio1: '14 years in B2B connecting business, customers and technical delivery. Consultant at Accenture, NEORIS and Deloitte, then an operator at a B2B fintech startup.',
    bio2: 'I find and diagnose problems across products and revenue systems and turn them into strategy and execution. When priorities are unclear, I start with what has a baseline and a measurable outcome.',
    open: 'Open to remote roles in product, GTM and operations', where: 'Remote · Ensenada, MX (PT)',
    impactTitle: 'Selected impact',
    impact: [
      ['2.8x', 'Pipeline in two months', 'Fixed CRM attribution and pipeline data first, then ran 30+ ICP/message experiments with scale-or-pivot criteria. Qualified pipeline: MXN 600K → 1.7M in potential MRR.', 'Moffin'],
      ['~100%', 'Proposals out the day of the demo', 'Built a modular pricing model and, with Claude Code and the sales team, prototyped a quoting tool and an AI proposal agent. Down from up to two weeks.', 'Moffin'],
      ['20+', 'Person team on a LATAM rollout', "Client-facing lead of Abbott's Salesforce field-sales rollout across Latin America, coordinating Asia, LATAM and the U.S.; ran a train-the-trainer program.", 'Deloitte'],
      ['2x', 'MRR at the largest accounts', '~50 accounts including 3 enterprise; the two largest doubled their MRR and one implementation became core platform features.', 'Moffin'],
      ['3x', 'Application volume per analyst', 'Automation and AI tooling.', 'Moffin'],
      ['0 → 30+', 'Clients for a new business line', 'Go-to-market and nationwide operations from zero; doubled sales.', 'Alto Golfo Seafoods']
    ],
    expIntro: 'Consulting → operator → founder.',
    experience: [
      ['2026 – now', 'Co-founder', startup.en, 'An agentic platform for independent real estate agents in Mexico.'],
      ['2025 – 2026', 'Sr Business Analyst → Implementation Lead → Growth Lead', 'Moffin', 'B2B fintech. Three roles in 18 months; led teams of up to 8.'],
      ['2022 – 2025', 'Independent Consultant & Operator', 'Ensenada', "Alto Golfo Seafoods, GTM advisory, taught Retail Marketing at CETYS, Master's in Social Business."],
      ['2019 – 2021', 'Senior Consultant', 'Deloitte', 'Product Owner proxy on SAP Commerce and Salesforce programs for AT&T, Telcel and Abbott.'],
      ['2018 – 2019', 'Innovation Consultant', 'NEORIS', "An e-commerce product from inception to launch inside CEMEX's innovation hub."],
      ['2015 – 2018', 'Enterprise Technology Analyst', 'Accenture', 'Business–engineering liaison; agile delivery for a major e-commerce launch.']
    ],
    buildingTitle: "What I'm building", buildingIntro: 'Projects, described as what they are.',
    building: [
      ['building', startup.en, 'AI for prospecting, client profiling, property management, scheduling and follow-ups. Soft launch planned for early 2027.'],
      ['prototype', 'Quoting tool + AI proposal agent', 'Built with Claude Code alongside the sales team.'],
      ['in use', 'AI agents with human review', 'Voice agents for outbound qualification, LLM analysis of call data, paid-media analysis agents.'],
      ['live', 'paulinabojorquez.com', 'This site, on GitHub + Netlify.']
    ],
    writingIntro: 'Notes on product, GTM and applied AI. Full posts on LinkedIn for now.',
    skillsTitle: 'Skills & education',
    skills: [
      ['Product', 'Discovery and user interviews, PRDs, user stories, prototyping (Claude Design, Figma), prioritization, roadmapping, experiment design, pricing and packaging, unit economics'],
      ['Delivery', 'Sprint and release planning, UAT, release notes, change management, multi-country rollouts; Scrum, SAFe; Jira, Linear, Monday'],
      ['Go-to-market', 'ICPs and segmentation, positioning, launches, lead scoring, CRM architecture (Salesforce, Monday), paid media (Meta, Google, OpenAI Ads), SEO and GEO, outbound (Instantly), enrichment (Clay), Stripe, Aircall'],
      ['Analytics', 'PostHog, GA4, Hotjar, Search Console, Metabase, SQL'],
      ['Technical & AI', 'APIs and integrations, GitHub, CI/CD with GitHub and Netlify, Google Cloud, Python; LLM workflows, multi-step and voice agents, human-in-the-loop review, Claude Code, Claude Agent SDK + MCP, Activepieces'],
      ['Languages', 'Spanish (native), English (fluent)']
    ],
    education: [
      ['2022 – 2024', "Master's in Social Business", 'Universidad Autónoma de Baja California (scholarship)'],
      ['2009 – 2013', 'B.A. Marketing & Business Administration', 'CETYS Universidad'],
      ['2021', 'Business Innovation Program', 'CEDIM'],
      ['2020', 'Creative Leadership Journey', 'School of Change'],
      ['2016', 'CBAP™ preparation program (BABOK® Guide v2.0)', 'Accenture']
    ],
    bookIntro: 'Pick a slot that works for you.', openBooking: 'Open booking page ↗', calTitle: 'Booking calendar',
    cvSoon: 'A downloadable CV is on its way. In the meantime, LinkedIn has the full history.',
    wip: 'This site is a work in progress, shipped in public.'
  },
  es: {
    htmlLang: 'es', other: 'en',
    title: 'Paulina Bojórquez — Producto, GTM y operaciones de negocio',
    description: 'Paulina Bojórquez: 14 años en B2B conectando negocio, clientes y entrega técnica. Producto, GTM y operaciones, con IA aplicada. Remoto desde Ensenada, México.',
    contact: 'Escríbeme', book: 'Agenda conmigo', download: 'Descargar CV',
    nav: { about: 'Sobre mí', impact: 'Impacto', experience: 'Experiencia', building: 'En curso', writing: 'Escritos', skills: 'Skills', book: 'Agenda', cv: 'cv.pdf' },
    files: { about: 'sobre-mi.txt', impact: 'impacto/', experience: 'experiencia/', building: 'en-curso/', writing: 'escritos/', skills: 'skills-y-educacion.txt', book: 'agenda.ics', cv: 'cv.pdf' },
    hint: 'Haz clic en un ícono para abrirlo.', close: 'Cerrar ventana', replay: 'Repetir la carga de la foto', loading: 'cargando paulina.jpg…',
    hi: 'Hola, soy Paulina.',
    headline: 'Producto, GTM y operaciones · B2B SaaS · IA aplicada',
    bio1: '14 años en B2B conectando negocio, clientes y entrega técnica. Consultora en Accenture, NEORIS y Deloitte, y después operadora en una startup fintech B2B.',
    bio2: 'Encuentro y diagnostico problemas en productos y sistemas de ingresos, y los convierto en estrategia y ejecución. Cuando las prioridades no son claras, empiezo por lo que tiene línea base y un resultado medible.',
    open: 'Abierta a roles remotos de producto, GTM y operaciones', where: 'Remoto · Ensenada, MX (PT)',
    impactTitle: 'Impacto seleccionado',
    impact: [
      ['2.8x', 'Pipeline en dos meses', 'Primero arreglé la atribución y los datos del CRM; luego 30+ experimentos de ICP y mensaje con criterios de escalar o pivotear. Pipeline calificado: MXN 600K → 1.7M en MRR potencial.', 'Moffin'],
      ['~100%', 'Propuestas el mismo día del demo', 'Modelo de precios modular, y con Claude Code y el equipo de ventas, un cotizador y un agente de propuestas. Antes tardaban hasta dos semanas.', 'Moffin'],
      ['20+', 'Personas en un rollout LATAM', 'Líder frente al cliente del rollout de Salesforce para la fuerza de ventas de Abbott en Latinoamérica, con equipo en Asia, LATAM y EE. UU.; programa train-the-trainer.', 'Deloitte'],
      ['2x', 'MRR en las cuentas más grandes', 'Cartera de ~50 cuentas, 3 enterprise; las dos más grandes duplicaron su MRR y una implementación se volvió funcionalidad core.', 'Moffin'],
      ['3x', 'Volumen por analista', 'Automatización y herramientas de IA para procesar el triple de solicitudes.', 'Moffin'],
      ['0 → 30+', 'Clientes en una línea nueva', 'Go-to-market y operación nacional desde cero; ventas duplicadas.', 'Alto Golfo Seafoods']
    ],
    expIntro: 'Consultoría → operación → fundadora.',
    experience: [
      ['2026 – hoy', 'Cofundadora', startup.es, 'Plataforma agéntica para agentes inmobiliarios independientes en México.'],
      ['2025 – 2026', 'Sr Business Analyst → Implementation Lead → Growth Lead', 'Moffin', 'Fintech B2B. Tres roles en 18 meses; equipos de hasta 8 personas.'],
      ['2022 – 2025', 'Consultora y operadora independiente', 'Ensenada', 'Alto Golfo Seafoods, asesoría de GTM, profesora de Retail Marketing en CETYS, maestría en Negocios Sociales.'],
      ['2019 – 2021', 'Senior Consultant', 'Deloitte', 'Product Owner proxy en programas de SAP Commerce y Salesforce para AT&T, Telcel y Abbott.'],
      ['2018 – 2019', 'Innovation Consultant', 'NEORIS', 'Un producto de e-commerce de la idea al lanzamiento en el hub de innovación de CEMEX.'],
      ['2015 – 2018', 'Enterprise Technology Analyst', 'Accenture', 'Enlace entre negocio e ingeniería; entrega ágil de un lanzamiento grande de e-commerce.']
    ],
    buildingTitle: 'Lo que estoy construyendo', buildingIntro: 'Proyectos, contados como lo que son.',
    building: [
      ['en curso', startup.es, 'IA para prospección, perfilamiento de clientes, gestión de propiedades, citas y seguimiento. Soft launch a inicios de 2027.'],
      ['prototipo', 'Cotizador + agente de propuestas', 'Hechos con Claude Code junto al equipo de ventas.'],
      ['en uso', 'Agentes de IA con revisión humana', 'Agentes de voz para calificación outbound, análisis de llamadas con LLM, agentes de análisis de pauta.'],
      ['en vivo', 'paulinabojorquez.com', 'Este sitio, en GitHub + Netlify.']
    ],
    writingIntro: 'Notas de producto, GTM e IA aplicada. Por ahora, los posts completos viven en LinkedIn.',
    skillsTitle: 'Skills y educación',
    skills: [
      ['Producto', 'Discovery y entrevistas con usuarios, PRDs, historias de usuario, prototipos (Claude Design, Figma), priorización, roadmap, diseño de experimentos, pricing y empaquetado, unit economics'],
      ['Entrega', 'Planeación de sprints y releases, UAT, release notes, gestión del cambio, rollouts multipaís; Scrum, SAFe; Jira, Linear, Monday'],
      ['Go-to-market', 'ICPs y segmentación, posicionamiento, lanzamientos, lead scoring, arquitectura de CRM (Salesforce, Monday), pauta (Meta, Google, OpenAI Ads), SEO y GEO, outbound (Instantly), enriquecimiento (Clay), Stripe, Aircall'],
      ['Analítica', 'PostHog, GA4, Hotjar, Search Console, Metabase, SQL'],
      ['Técnico e IA', 'APIs e integraciones, GitHub, CI/CD con GitHub y Netlify, Google Cloud, Python; flujos con LLM, agentes multipaso y de voz, revisión humana, Claude Code, Claude Agent SDK + MCP, Activepieces'],
      ['Idiomas', 'Español (nativo), inglés (fluido)']
    ],
    education: [
      ['2022 – 2024', 'Maestría en Negocios Sociales', 'Universidad Autónoma de Baja California (beca)'],
      ['2009 – 2013', 'Lic. en Mercadotecnia y Administración de Empresas', 'CETYS Universidad'],
      ['2021', 'Business Innovation Program', 'CEDIM'],
      ['2020', 'Creative Leadership Journey', 'School of Change'],
      ['2016', 'Programa de preparación CBAP™ (BABOK® Guide v2.0)', 'Accenture']
    ],
    bookIntro: 'Escoge el horario que te acomode.', openBooking: 'Abrir agenda ↗', calTitle: 'Agenda de citas',
    cvSoon: 'El CV descargable viene en camino. Mientras, en LinkedIn está la historia completa.',
    wip: 'Este sitio está en construcción, y se construye en público.'
  }
};

const ICONS = {
  about: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><radialGradient id="ia1" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#FFE9D2"/><stop offset="1" stop-color="#E0A07A"/></radialGradient><radialGradient id="ia2" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="#7FE0CF"/><stop offset="1" stop-color="#1F6F6B"/></radialGradient><linearGradient id="ia3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A65A2E"/><stop offset="1" stop-color="#5A2A14"/></linearGradient></defs><ellipse cx="26" cy="48" rx="17" ry="2.8" fill="#000" opacity="0.18"/><path d="M14 21c0-8 5-13 12-13s12 5 12 13c0 6 2 9 3 13-3 1-6 0-7-3l-1-7H20l-1 7c-1 3-4 4-7 3 1-4 2-7 2-13z" fill="url(#ia3)" stroke="#2A2522" stroke-width="0.9" stroke-linejoin="round"/><path d="M11 46c0-9 6-15 15-15s15 6 15 15z" fill="url(#ia2)" stroke="#2A2522" stroke-width="1" stroke-linejoin="round"/><path d="M16 38c2-3 5-4.5 8-5" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.6"/><circle cx="26" cy="21" r="9" fill="url(#ia1)" stroke="#2A2522" stroke-width="0.9"/><path d="M17 19c1-6 5-9 9-9s8 3 9 9c-3-3-6-4.5-9-4.5S20 16 17 19z" fill="url(#ia3)" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><ellipse cx="22.5" cy="17" rx="2.6" ry="1.6" fill="#FFF" opacity="0.55"/></svg>`,
  impact: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ib1" x1="0" x2="1"><stop offset="0" stop-color="#7FD8C6"/><stop offset="1" stop-color="#2F9483"/></linearGradient><linearGradient id="ib2" x1="0" x2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset="1" stop-color="#D9A21E"/></linearGradient><linearGradient id="ib3" x1="0" x2="1"><stop offset="0" stop-color="#FF8E73"/><stop offset="1" stop-color="#C23A22"/></linearGradient></defs><ellipse cx="27" cy="46.5" rx="20" ry="3" fill="#000" opacity="0.18"/><path d="M6 44h38" stroke="#2A2522" stroke-width="1.2"/><rect x="10" y="28" width="8" height="16" fill="url(#ib1)" stroke="#2A2522" stroke-width="0.8"/><path d="M10 28l4-3h8l-4 3z" fill="#B8F0E4" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><path d="M18 28l4-3v16l-4 3z" fill="#1F6A5E" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><rect x="21" y="20" width="8" height="24" fill="url(#ib2)" stroke="#2A2522" stroke-width="0.8"/><path d="M21 20l4-3h8l-4 3z" fill="#FFF1C2" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><path d="M29 20l4-3v24l-4 3z" fill="#A87A10" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><rect x="32" y="11" width="8" height="33" fill="url(#ib3)" stroke="#2A2522" stroke-width="0.8"/><path d="M32 11l4-3h8l-4 3z" fill="#FFC4B5" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><path d="M40 11l4-3v33l-4 3z" fill="#8E2614" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/></svg>`,
  experience: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ic1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A52"/><stop offset="1" stop-color="#7A4620"/></linearGradient><linearGradient id="ic2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A8"/><stop offset="1" stop-color="#C99A1C"/></linearGradient></defs><ellipse cx="26" cy="47" rx="21" ry="3" fill="#000" opacity="0.18"/><path d="M19 16v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" fill="none" stroke="#2A2522" stroke-width="3"/><path d="M19 16v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" fill="none" stroke="#8A5530" stroke-width="1.6"/><rect x="5" y="16" width="42" height="28" rx="4" fill="url(#ic1)" stroke="#2A2522"/><path d="M7 19h38" stroke="#E7B788" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/><path d="M5 28h42" stroke="#5A3214" stroke-width="1.2"/><rect x="22" y="25" width="8" height="7" rx="1" fill="url(#ic2)" stroke="#2A2522" stroke-width="0.8"/></svg>`,
  building: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="id1" x1="0" x2="1"><stop offset="0" stop-color="#E9F6FF"/><stop offset="1" stop-color="#A9C9DE"/></linearGradient><linearGradient id="id2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BEA6B"/><stop offset="1" stop-color="#2E8F2A"/></linearGradient></defs><ellipse cx="26" cy="47.5" rx="17" ry="2.6" fill="#000" opacity="0.18"/><path d="M21 9v12L9 41a3.5 3.5 0 0 0 3 5h28a3.5 3.5 0 0 0 3-5L31 21V9z" fill="url(#id1)" stroke="#2A2522" stroke-linejoin="round"/><path d="M15.5 31h21L43 41a3.5 3.5 0 0 1-3 5H12a3.5 3.5 0 0 1-3-5z" fill="url(#id2)" stroke="#2A2522" stroke-width="0.8" stroke-linejoin="round"/><rect x="19" y="5" width="14" height="5" rx="1.5" fill="#B07A45" stroke="#2A2522" stroke-width="0.8"/><path d="M24 13v8l-6 11" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.85"/><circle cx="27" cy="38" r="2.2" fill="#D9FFC2"/><circle cx="33" cy="35" r="1.4" fill="#D9FFC2"/><circle cx="22" cy="41" r="1.2" fill="#D9FFC2"/></svg>`,
  writing: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ie1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE38C"/><stop offset="1" stop-color="#E0A52A"/></linearGradient></defs><ellipse cx="26" cy="47" rx="22" ry="3" fill="#000" opacity="0.18"/><path d="M4 12h15l4 4h25v28H4z" fill="#C98F1E" stroke="#2A2522" stroke-linejoin="round"/><rect x="10" y="9" width="28" height="22" fill="#FFF" stroke="#2A2522" stroke-width="0.8" transform="rotate(-4 24 20)"/><path d="M14 15h18M14 19h20M14 23h14" stroke="#7A8794" stroke-width="1.2" stroke-linecap="round" transform="rotate(-4 24 20)"/><path d="M3 22h46l-3 22H6z" fill="url(#ie1)" stroke="#2A2522" stroke-linejoin="round"/><path d="M5 24.5h42" stroke="#FFF6CF" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  skills: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ij1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A5C"/><stop offset="1" stop-color="#B32E1E"/></linearGradient><linearGradient id="ij2" x1="0" x2="1"><stop offset="0" stop-color="#F4F4F4"/><stop offset="1" stop-color="#8A8A8A"/></linearGradient></defs><ellipse cx="26" cy="47.5" rx="21" ry="2.8" fill="#000" opacity="0.18"/><path d="M19 18v-5h14v5" fill="none" stroke="#2A2522" stroke-width="3"/><path d="M19 18v-5h14v5" fill="none" stroke="url(#ij2)" stroke-width="1.6"/><rect x="5" y="18" width="42" height="26" rx="3" fill="url(#ij1)" stroke="#2A2522"/><path d="M7 21h38" stroke="#FFB4A3" stroke-width="1.2" stroke-linecap="round"/><path d="M5 29h42" stroke="#7E1D11" stroke-width="1.2"/><rect x="21" y="26" width="10" height="6" rx="1" fill="url(#ij2)" stroke="#2A2522" stroke-width="0.8"/></svg>`,
  book: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="if1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="1" stop-color="#D9D6CF"/></linearGradient><linearGradient id="if2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A5C"/><stop offset="1" stop-color="#B32E1E"/></linearGradient><linearGradient id="if3" x1="0" x2="1"><stop offset="0" stop-color="#F4F4F4"/><stop offset="1" stop-color="#8A8A8A"/></linearGradient></defs><ellipse cx="26" cy="47.5" rx="20" ry="2.8" fill="#000" opacity="0.18"/><rect x="7" y="10" width="38" height="35" rx="3" fill="url(#if1)" stroke="#2A2522"/><path d="M7 13a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v7H7z" fill="url(#if2)" stroke="#2A2522"/><rect x="15" y="6" width="4" height="9" rx="2" fill="url(#if3)" stroke="#2A2522" stroke-width="0.8"/><rect x="33" y="6" width="4" height="9" rx="2" fill="url(#if3)" stroke="#2A2522" stroke-width="0.8"/><text x="26" y="39" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="17" fill="#2A2522">27</text></svg>`,
  cv: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ig1" x1="0" x2="1"><stop offset="0" stop-color="#FFF"/><stop offset="1" stop-color="#DCDAD4"/></linearGradient><linearGradient id="ig2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6B57"/><stop offset="1" stop-color="#B8241A"/></linearGradient></defs><ellipse cx="27" cy="48" rx="16" ry="2.6" fill="#000" opacity="0.18"/><path d="M12 4h20l10 10v32H12z" fill="url(#ig1)" stroke="#2A2522" stroke-linejoin="round"/><path d="M32 4v10h10z" fill="#BDBAB2" stroke="#2A2522" stroke-linejoin="round"/><path d="M17 18h12M17 22h18M17 26h16" stroke="#8A949E" stroke-width="1.2" stroke-linecap="round"/><rect x="8" y="31" width="30" height="11" rx="2" fill="url(#ig2)" stroke="#2A2522" stroke-width="0.8"/><text x="23" y="39.5" text-anchor="middle" font-family="monospace" font-weight="600" font-size="8" fill="#FFF">PDF</text></svg>`,
  linkedin: `<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ih1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA3E6"/><stop offset="1" stop-color="#0A4F94"/></linearGradient></defs><ellipse cx="26" cy="48" rx="18" ry="2.6" fill="#000" opacity="0.18"/><rect x="7" y="6" width="38" height="38" rx="8" fill="url(#ih1)" stroke="#2A2522"/><path d="M11 16c0-5 4-7 8-7h14c4 0 8 2 8 7-6 3-24 3-30 0z" fill="#FFF" opacity="0.35"/><text x="26" y="37" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="22" fill="#FFF">in</text></svg>`
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CLOSE = `<span class="bevel"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" stroke-width="1.8"/></svg></span>`;

function win(id, t, body) {
  return `<section class="window" id="${id}" aria-labelledby="${id}-t">
  <div class="titlebar"><h2 id="${id}-t" tabindex="-1">${esc(t.files[id])}</h2><button class="close" type="button" aria-label="${esc(t.close)}">${CLOSE}</button></div>
  <div class="body">${body}</div>
</section>`;
}

function page(lang) {
  const t = T[lang];
  const other = T[t.other];
  const url = `${SITE}/${lang}/`;
  const cvButton = CV_URL ? `<a class="btn" href="${CV_URL}" download>${esc(t.download)}</a>` : '';
  const iconOrder = ['about', 'impact', 'experience', 'building', 'writing', 'skills', 'book', 'cv'];
  const person = {
    '@context': 'https://schema.org', '@type': 'Person', name: 'Paulina Bojórquez', url: SITE,
    image: `${SITE}/img/paulina.jpg`, jobTitle: 'Product, GTM & Business Operations',
    address: { '@type': 'PostalAddress', addressLocality: 'Ensenada', addressRegion: 'Baja California', addressCountry: 'MX' },
    alumniOf: ['CETYS Universidad', 'Universidad Autónoma de Baja California'],
    knowsLanguage: ['es', 'en'], sameAs: [LINKEDIN, GITHUB]
  };

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="es" href="${SITE}/es/">
<link rel="alternate" hreflang="x-default" href="${SITE}/en/">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/og.png">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_MX'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify(person)}</script>
</head>
<body>
<header class="top">
  <a class="brand" href="/${lang}/">paulinabojorquez.com</a>
  <div class="actions">
    <nav class="lang" aria-label="Language">
      <a href="/en/" hreflang="en" lang="en" aria-current="${lang === 'en'}">EN</a>
      <a href="/es/" hreflang="es" lang="es" aria-current="${lang === 'es'}">ES</a>
    </nav>
    <a class="pill" href="mailto:${EMAIL}">${esc(t.contact)}</a>
  </div>
</header>
<main>
  <nav class="icons" aria-label="Desktop">
${iconOrder.map((id) => `    <a class="icon" href="#${id}" data-open="${id}">${ICONS[id]}<span>${esc(t.nav[id])}</span></a>`).join('\n')}
    <a class="icon" href="${LINKEDIN}" target="_blank" rel="noopener">${ICONS.linkedin}<span>LinkedIn ↗</span></a>
  </nav>
  <div class="stage">
    <p class="hint" hidden>${esc(t.hint)}</p>
${win('about', t, `<div class="about">
    <figure class="photo">
      <button id="replay" type="button" aria-label="${esc(t.replay)}"><img id="photo" class="bevel" src="/img/paulina.jpg" alt="Paulina Bojórquez" width="168" height="168"></button>
      <div class="progress" aria-hidden="true"><div></div></div>
      <figcaption id="photo-caption" data-loading="${esc(t.loading)}">paulina.jpg</figcaption>
    </figure>
    <div class="intro">
      <h1>${esc(t.hi)}</h1>
      <p class="headline">${esc(t.headline)}</p>
      <p>${esc(t.bio1)}</p>
      <p class="soft">${esc(t.bio2)}</p>
      <span class="open">${esc(t.open)}</span>
      <span class="where">${esc(t.where)}</span>
      <div class="buttons">
        <a class="btn primary" href="mailto:${EMAIL}">${esc(t.contact)}</a>
        <a class="btn" href="#book" data-open="book">${esc(t.book)}</a>
        ${cvButton}
      </div>
    </div>
  </div>`)}
${win('impact', t, `<h3 class="title">${esc(t.impactTitle)}</h3>
  <div class="cards">${t.impact.map(([m, h, p, w]) => `<article class="card"><span class="metric">${esc(m)}</span><h4>${esc(h)}</h4><p>${esc(p)}</p><span class="where">${esc(w)}</span></article>`).join('')}</div>`)}
${win('experience', t, `<h3 class="title">${esc(t.nav.experience)}</h3><p class="lede">${esc(t.expIntro)}</p>
  <ol class="rows">${t.experience.map(([y, r, o, d]) => `<li><span class="when">${esc(y)}</span><span class="what"><strong>${esc(r)} <span class="org">· ${esc(o)}</span></strong><span class="desc">${esc(d)}</span></span></li>`).join('')}</ol>`)}
${win('building', t, `<h3 class="title">${esc(t.buildingTitle)}</h3><p class="lede">${esc(t.buildingIntro)}</p>
  <ul class="rows">${t.building.map(([s, n, d]) => `<li><span class="when">${esc(s)}</span><span class="what"><strong>${esc(n)}</strong><span class="desc">${esc(d)}</span></span></li>`).join('')}</ul>`)}
${win('writing', t, `<h3 class="title">${esc(t.nav.writing)}</h3><p class="lede">${esc(t.writingIntro)}</p>
  <ul class="rows">${posts.map((p) => `<li><span class="when">${p.date}</span><a class="what" href="${p.href}" target="_blank" rel="noopener" lang="${p.lang.toLowerCase()}">${esc(p.title)}</a><span class="tag">${p.lang}</span></li>`).join('')}</ul>`)}
${win('skills', t, `<h3 class="title">${esc(t.skillsTitle)}</h3>
  <dl class="skills">${t.skills.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <ul class="rows" style="margin-top:24px">${t.education.map(([y, n, o]) => `<li><span class="when">${esc(y)}</span><span class="what"><strong>${esc(n)}</strong><span class="desc">${esc(o)}</span></span></li>`).join('')}</ul>`)}
${win('book', t, `<h3 class="title">${esc(t.book)}</h3><p class="lede">${esc(t.bookIntro)}</p>
  <iframe class="calendar" data-src="${BOOKING_EMBED}" title="${esc(t.calTitle)}"></iframe>
  <p class="wip"><a href="${BOOKING}" target="_blank" rel="noopener">${esc(t.openBooking)}</a></p>`)}
${win('cv', t, `<h3 class="title">cv.pdf</h3>
  ${CV_URL ? `<a class="btn primary" href="${CV_URL}" download>${esc(t.download)}</a>` : `<p class="lede">${esc(t.cvSoon)}</p><a class="btn" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a>`}`)}
  </div>
</main>
<footer>
  <span>${esc(t.wip)}</span>
  <nav aria-label="Contact"><a href="mailto:${EMAIL}">email</a><a href="${LINKEDIN}" target="_blank" rel="noopener">linkedin</a><a href="${GITHUB}" target="_blank" rel="noopener">github</a><a href="/${t.other}/" hreflang="${t.other}">${t.other === 'es' ? 'Español' : 'English'}</a></nav>
</footer>
<script src="/app.js"></script>
</body>
</html>
`;
}

rmSync('dist', { recursive: true, force: true });
cpSync('static', 'dist', { recursive: true });
for (const lang of ['en', 'es']) {
  mkdirSync(`dist/${lang}`, { recursive: true });
  writeFileSync(`dist/${lang}/index.html`, page(lang));
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['en', 'es'].map((l) => `  <url><loc>${SITE}/${l}/</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/><xhtml:link rel="alternate" hreflang="es" href="${SITE}/es/"/></url>`).join('\n')}
</urlset>
`);
console.log('built dist/ (en, es)');
