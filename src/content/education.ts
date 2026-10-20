import type { EducationEntry } from './types';

/** Name as printed on the documents; shown on the certificate cards. */
export const CERTIFICATE_HOLDER = 'Dheovani Xavier da Cruz';

// Source: the original certificates and diplomas (kept off the site: they contain ID numbers
// and the birth date). Only safe fields are published, as CertificateSummary. Most recent first.
export const education: EducationEntry[] = [
  {
    kind: 'postgraduate',
    title: {
      pt: 'Pós-graduação em Robótica e Inteligência Artificial',
      en: 'Graduate certificate in Robotics and Artificial Intelligence',
      es: 'Posgrado en Robótica e Inteligencia Artificial',
    },
    institution: 'Faculdade Líbano',
    period: { start: '2026-04-20', end: '2026-10-20' },
    description: {
      pt: 'Especialização em robótica e inteligência artificial: fundamentos da robótica, robôs manipuladores, unidades funcionais e sistemas robóticos, aprendizado de máquina e linguagens de programação para IA.',
      en: 'Specialization in robotics and artificial intelligence: robotics fundamentals, robot manipulators, functional units and robotic systems, machine learning, and programming languages for AI.',
      es: 'Especialización en robótica e inteligencia artificial: fundamentos de robótica, robots manipuladores, unidades funcionales y sistemas robóticos, aprendizaje automático y lenguajes de programación para IA.',
    },
    certificate: {
      document: 'certificate',
      issuer: 'Faculdade Líbano',
      place: 'Araxá/MG',
      issued: '2026-10-20',
      hours: 720,
      accent: '#8c2a5c',
    },
  },
  {
    kind: 'postgraduate',
    title: {
      pt: 'Pós-graduação em Arquitetura de Software',
      en: 'Graduate certificate in Software Architecture',
      es: 'Posgrado en Arquitectura de Software',
    },
    institution: 'Faculdade dos Vales (FACUVALE)',
    period: { start: '2025-11-03', end: '2026-03-03' },
    description: {
      pt: 'Especialização voltada a decisões arquiteturais, organização de sistemas, escalabilidade e evolução de produtos de software no longo prazo.',
      en: 'A specialization focused on architectural decisions, system organization, scalability, and the long-term evolution of software products.',
      es: 'Especialización centrada en decisiones arquitectónicas, organización de sistemas, escalabilidad y evolución de productos de software a largo plazo.',
    },
    certificate: {
      document: 'certificate',
      issuer: 'Faculdade dos Vales — FACUVALE',
      place: 'Janaúba/MG',
      issued: '2026-03-03',
      hours: 720,
      accent: '#2f5fa8',
    },
  },
  {
    kind: 'postgraduate',
    title: {
      pt: 'Pós-graduação em Inteligência Artificial e Análise de Dados',
      en: 'Graduate certificate in Artificial Intelligence and Data Analysis',
      es: 'Posgrado en Inteligencia Artificial y Análisis de Datos',
    },
    institution: 'Faculdade dos Vales (FACUVALE)',
    period: { start: '2025-11-03', end: '2026-03-03' },
    description: {
      pt: 'Aprofundamento em inteligência artificial e análise de dados para ampliar decisões técnicas com automação e raciocínio analítico.',
      en: 'Further study in artificial intelligence and data analysis to broaden technical decisions with automation and analytical reasoning.',
      es: 'Profundización en inteligencia artificial y análisis de datos para ampliar las decisiones técnicas con automatización y razonamiento analítico.',
    },
    certificate: {
      document: 'certificate',
      issuer: 'Faculdade dos Vales — FACUVALE',
      place: 'Janaúba/MG',
      issued: '2026-03-03',
      hours: 700,
      accent: '#2f5fa8',
    },
  },
  {
    kind: 'degree',
    title: {
      pt: 'Bacharelado em Engenharia de Software',
      en: "Bachelor's degree in Software Engineering",
      es: 'Grado en Ingeniería de Software',
    },
    institution: 'Universidade da Região de Joinville (Univille)',
    period: { end: '2024-08-06' },
    description: {
      pt: 'Formação central em engenharia de software, cobrindo desenvolvimento, requisitos, arquitetura, qualidade e manutenção de sistemas.',
      en: 'Core education in software engineering, covering development, requirements, architecture, quality, and software maintenance.',
      es: 'Formación central en ingeniería de software: desarrollo, requisitos, arquitectura, calidad y mantenimiento de sistemas.',
    },
    certificate: {
      document: 'diploma',
      issuer: 'Universidade da Região de Joinville — Univille',
      place: 'Joinville/SC',
      issued: '2024-09-20',
      accent: '#3f7d4e',
    },
  },
  {
    kind: 'certification',
    title: {
      pt: 'Microsoft Learn Student Ambassador',
      en: 'Microsoft Learn Student Ambassador',
      es: 'Microsoft Learn Student Ambassador',
    },
    institution: 'Microsoft',
    period: { end: '2023' },
    description: {
      pt: 'Participação no programa Microsoft Learn Student Ambassador (nível Beta), fortalecendo comunicação, comunidade e aprendizagem contínua.',
      en: 'Participation in the Microsoft Learn Student Ambassador program (Beta level), strengthening communication, community, and continuous learning.',
      es: 'Participación en el programa Microsoft Learn Student Ambassador (nivel Beta), fortaleciendo la comunicación, la comunidad y el aprendizaje continuo.',
    },
    certificate: {
      document: 'certificate',
      issuer: 'Microsoft Learn Student Ambassadors',
      issued: '2023',
      accent: '#2b6cb0',
    },
  },
];
