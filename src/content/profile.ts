import { PENDING, type Profile } from './types';

// Source: the previous Astro portfolio (about/hero sections). Spanish translated from it.
export const profile: Profile = {
  name: 'Dheovani Xavier',
  role: {
    pt: 'Engenheiro de software sênior',
    en: 'Senior software engineer',
    es: 'Ingeniero de software sénior',
  },
  headline: {
    pt: 'Sistemas robustos, escaláveis e bem estruturados.',
    en: 'Robust, scalable, well-structured systems.',
    es: 'Sistemas robustos, escalables y bien estructurados.',
  },
  summary: {
    pt: [
      'Sou engenheiro de software sênior, especializado na construção de sistemas robustos, otimizados e preparados para evoluir. Meu trabalho combina visão técnica, entendimento de negócio e critério para tomar decisões que reduzem complexidade sem sacrificar capacidade de crescimento.',
      'Atuo na definição de arquiteturas, revisão de bases existentes, desenho de integrações, melhoria de performance e organização de código para equipes que precisam entregar com previsibilidade.',
    ],
    en: [
      'I am a senior software engineer specialized in building robust, optimized systems prepared to evolve. My work combines technical vision, business understanding, and judgment to make decisions that reduce complexity without sacrificing room for growth.',
      'I work on architecture definition, existing codebase reviews, integration design, performance improvements, and code organization for teams that need predictable delivery.',
    ],
    es: [
      'Soy ingeniero de software sénior, especializado en construir sistemas robustos, optimizados y preparados para evolucionar. Mi trabajo combina visión técnica, comprensión del negocio y criterio para tomar decisiones que reducen la complejidad sin sacrificar la capacidad de crecimiento.',
      'Trabajo en la definición de arquitecturas, revisión de bases de código existentes, diseño de integraciones, mejora de rendimiento y organización del código para equipos que necesitan entregar con previsibilidad.',
    ],
  },
  highlights: [
    {
      title: { pt: 'Arquitetura', en: 'Architecture', es: 'Arquitectura' },
      text: {
        pt: 'Estruturas técnicas claras, escaláveis e alinhadas aos objetivos do produto.',
        en: 'Clear, scalable technical structures aligned with product goals.',
        es: 'Estructuras técnicas claras, escalables y alineadas con los objetivos del producto.',
      },
    },
    {
      title: { pt: 'Performance', en: 'Performance', es: 'Rendimiento' },
      text: {
        pt: 'Otimização de sistemas, fluxos, consultas e pontos críticos de processamento.',
        en: 'Optimization of systems, flows, queries, and critical processing points.',
        es: 'Optimización de sistemas, flujos, consultas y puntos críticos de procesamiento.',
      },
    },
    {
      title: { pt: 'Evolução', en: 'Evolution', es: 'Evolución' },
      text: {
        pt: 'Modernização gradual, redução de dívida técnica e bases mais fáceis de manter.',
        en: 'Gradual modernization, technical debt reduction, and easier-to-maintain foundations.',
        es: 'Modernización gradual, reducción de deuda técnica y bases más fáciles de mantener.',
      },
    },
  ],
  // Derived from the public repositories and academic background; adjust freely.
  interests: {
    pt: ['Robótica e simulação', 'Sistemas desktop e C++', 'Comunicação em tempo real', 'Inteligência artificial e dados'],
    en: ['Robotics and simulation', 'Desktop systems and C++', 'Real-time communication', 'Artificial intelligence and data'],
    es: ['Robótica y simulación', 'Sistemas de escritorio y C++', 'Comunicación en tiempo real', 'Inteligencia artificial y datos'],
  },
  location: PENDING,
};
