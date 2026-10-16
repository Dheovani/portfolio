import architecturePdf from '../assets/certificates/Pós-graduação Lato Sensu em Arquitetura de Software.pdf?url';
import dataPdf from '../assets/certificates/Pós-graduação Lato Sensu em Inteligência Artificial e Análise de Dados.pdf?url';
import bachelorPdf from '../assets/certificates/Diploma Bacharel em Engenharia de Software.pdf?url';
import ambassadorPdf from '../assets/certificates/Microsoft Learn Student Ambassador Certificate.pdf?url';
import { PENDING, type EducationEntry } from './types';

// Source: the previous portfolio's education timeline and certificates.
// Institutions and dates were not listed there and remain PENDING.
export const education: EducationEntry[] = [
  {
    kind: 'postgraduate',
    title: {
      pt: 'Pós-graduação em Arquitetura de Software',
      en: 'Graduate certificate in Software Architecture',
      es: 'Posgrado en Arquitectura de Software',
    },
    institution: PENDING,
    period: PENDING,
    description: {
      pt: 'Especialização voltada a decisões arquiteturais, organização de sistemas, escalabilidade e evolução de produtos de software no longo prazo.',
      en: 'A specialization focused on architectural decisions, system organization, scalability, and the long-term evolution of software products.',
      es: 'Especialización centrada en decisiones arquitectónicas, organización de sistemas, escalabilidad y evolución de productos de software a largo plazo.',
    },
    certificate: architecturePdf,
  },
  {
    kind: 'postgraduate',
    title: {
      pt: 'Pós-graduação em Inteligência Artificial e Análise de Dados',
      en: 'Graduate certificate in Artificial Intelligence and Data Analysis',
      es: 'Posgrado en Inteligencia Artificial y Análisis de Datos',
    },
    institution: PENDING,
    period: PENDING,
    description: {
      pt: 'Aprofundamento em inteligência artificial e análise de dados para ampliar decisões técnicas com automação e raciocínio analítico.',
      en: 'Further study in artificial intelligence and data analysis to broaden technical decisions with automation and analytical reasoning.',
      es: 'Profundización en inteligencia artificial y análisis de datos para ampliar las decisiones técnicas con automatización y razonamiento analítico.',
    },
    certificate: dataPdf,
  },
  {
    kind: 'degree',
    title: {
      pt: 'Bacharelado em Engenharia de Software',
      en: "Bachelor's degree in Software Engineering",
      es: 'Grado en Ingeniería de Software',
    },
    institution: PENDING,
    period: PENDING,
    description: {
      pt: 'Formação central em engenharia de software, cobrindo desenvolvimento, requisitos, arquitetura, qualidade e manutenção de sistemas.',
      en: 'Core education in software engineering, covering development, requirements, architecture, quality, and software maintenance.',
      es: 'Formación central en ingeniería de software: desarrollo, requisitos, arquitectura, calidad y mantenimiento de sistemas.',
    },
    certificate: bachelorPdf,
  },
  {
    kind: 'certification',
    title: {
      pt: 'Microsoft Learn Student Ambassador',
      en: 'Microsoft Learn Student Ambassador',
      es: 'Microsoft Learn Student Ambassador',
    },
    institution: 'Microsoft',
    period: PENDING,
    description: {
      pt: 'Participação no programa Microsoft Learn Student Ambassador, fortalecendo comunicação, comunidade e aprendizagem contínua.',
      en: 'Participation in the Microsoft Learn Student Ambassador program, strengthening communication, community, and continuous learning.',
      es: 'Participación en el programa Microsoft Learn Student Ambassador, fortaleciendo la comunicación, la comunidad y el aprendizaje continuo.',
    },
    certificate: ambassadorPdf,
  },
];
