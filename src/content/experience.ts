import type { ExperienceEntry } from './types';

// Source: LinkedIn experience section. Add one entry per position, most recent first.
export const experience: ExperienceEntry[] = [
  {
    role: {
      pt: 'Engenheiro de Software',
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
    },
    company: 'SoftExpert - Software for Excellence',
    period: {
      pt: 'mai 2022 – atual',
      en: 'May 2022 – Present',
      es: 'may 2022 – actualidad',
    },
    location: {
      pt: 'Joinville, Santa Catarina, Brasil',
      en: 'Joinville, Santa Catarina, Brazil',
      es: 'Joinville, Santa Catarina, Brasil',
    },
    achievements: {
      pt: [
        'Reconstruí em Java o backend de um sistema de gatilhos orientado a eventos, originalmente em PHP, que passou a falhar sob cargas pesadas de processamento de documentos e consultas longas ao banco de dados. Entreguei a reescrita de forma independente em uma sprint, melhorando estabilidade, performance e escalabilidade, além de ampliar a observabilidade pela integração com os serviços Java existentes da plataforma.',
        'Liderei uma pequena força-tarefa que refatorou por completo um sistema legado de traduções, substituindo uma implementação monolítica em PHP por uma arquitetura de microsserviços. Reconstruímos o backend com o framework PHP interno da SoftExpert e o frontend em React.js, concluindo a migração em pouco mais de duas sprints. A nova arquitetura melhorou a manutenibilidade e a performance, reduziu a exposição desnecessária de dados no cliente e eliminou diversos bugs legados.',
        'Participei de um hackathon interno voltado a entregar novas funcionalidades em um ciclo de desenvolvimento de uma semana. Trabalhei em um projeto de gamificação que aplicou conceitos de game design à experiência de trabalho e foi posteriormente incorporado ao produto.',
      ],
      en: [
        'Rebuilt the backend of an event-driven trigger system from PHP to Java after the original implementation began failing under heavy document-processing workloads and long-running database queries. Delivered the rewrite independently within one sprint, improving stability, performance, and scalability, while also enabling better observability through integration with existing Java-based platform services.',
        "Led a small task force that fully refactored a legacy translation system, replacing a monolithic PHP implementation with a microservices-based architecture. Rebuilt the backend using SoftExpert's internal PHP framework and the frontend in React.js, completing the migration in just over two sprints. The new architecture improved maintainability and performance, reduced unnecessary client-side data exposure, and eliminated several legacy bugs.",
        'Participated in an internal hackathon focused on delivering new product features within a one-week development cycle. Worked on a gamification project that applied game-design concepts to the workplace experience and was later incorporated into the product.',
      ],
      es: [
        'Reconstruí en Java el backend de un sistema de disparadores orientado a eventos, originalmente en PHP, que empezó a fallar bajo cargas intensas de procesamiento de documentos y consultas prolongadas a la base de datos. Entregué la reescritura de forma independiente en un sprint, mejorando la estabilidad, el rendimiento y la escalabilidad, y permitiendo una mejor observabilidad mediante la integración con los servicios Java existentes de la plataforma.',
        'Lideré un pequeño equipo de trabajo que refactorizó por completo un sistema heredado de traducciones, reemplazando una implementación monolítica en PHP por una arquitectura de microservicios. Reconstruimos el backend con el framework PHP interno de SoftExpert y el frontend en React.js, completando la migración en poco más de dos sprints. La nueva arquitectura mejoró la mantenibilidad y el rendimiento, redujo la exposición innecesaria de datos en el cliente y eliminó varios errores heredados.',
        'Participé en un hackathon interno enfocado en entregar nuevas funcionalidades del producto en un ciclo de desarrollo de una semana. Trabajé en un proyecto de gamificación que aplicó conceptos de diseño de juegos a la experiencia laboral y que luego se incorporó al producto.',
      ],
    },
    // LinkedIn lists "Software Architecture, PHP and +14 skills"; only the ones visible or named above are listed.
    technologies: ['Software Architecture', 'PHP', 'Java', 'React.js', 'Microservices'],
  },
];
