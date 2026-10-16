import type { Project } from './types';

// Source: public repositories at github.com/Dheovani (descriptions and topics, October 2026).
// The old site loaded them live from the GitHub API; they are now curated here.
export const GITHUB_PROFILE = 'https://github.com/Dheovani';

export const projects: Project[] = [
  {
    name: 'Robot Studio',
    featured: true,
    status: 'active',
    repository: 'https://github.com/Dheovani/robot-studio',
    technologies: ['C#', '.NET', 'Robotics', '3D simulation'],
    description: {
      pt: 'Plataforma didática de robótica em C# e .NET para aprender planejamento de movimento, scripts, execução de comandos e simulação 3D de robôs.',
      en: 'Didactic robotics platform built with C# and .NET for learning motion planning, scripting, command execution, and 3D robot simulation.',
      es: 'Plataforma didáctica de robótica en C# y .NET para aprender planificación de movimiento, scripting, ejecución de comandos y simulación 3D de robots.',
    },
  },
  {
    name: 'Convia',
    featured: true,
    status: 'active',
    repository: 'https://github.com/Dheovani/convia',
    technologies: ['Go', 'WebRTC', 'LiveKit', 'P2P'],
    description: {
      pt: 'Aplicação desktop peer-to-peer de comunicação por voz, vídeo e compartilhamento de tela, com integrações reutilizáveis via APIs e SDKs.',
      en: 'Peer-to-peer desktop communication app for voice, video, and screen sharing, with reusable integrations through APIs and SDKs.',
      es: 'Aplicación de escritorio peer-to-peer para voz, video y pantalla compartida, con integraciones reutilizables mediante APIs y SDKs.',
    },
  },
  {
    name: 'worm',
    featured: true,
    status: 'active',
    repository: 'https://github.com/Dheovani/worm',
    technologies: ['C++20', 'ORM', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'],
    description: {
      pt: 'ORM em C++20 inspirado no Doctrine, com reflexão tipada, composição de consultas SQL e suporte inicial a MySQL, MSSQL, PostgreSQL e SQLite.',
      en: 'C++20 ORM inspired by Doctrine, featuring typed reflection, SQL query composition, and initial support for MySQL, MSSQL, PostgreSQL, and SQLite.',
      es: 'ORM en C++20 inspirado en Doctrine, con reflexión tipada, composición de consultas SQL y soporte inicial para MySQL, MSSQL, PostgreSQL y SQLite.',
    },
  },
  {
    name: 'Uburu',
    status: 'active',
    repository: 'https://github.com/Dheovani/uburu',
    technologies: ['C++23', 'Qt', 'Search'],
    description: {
      pt: 'Busca desktop rápida para arquivos e repositórios, com indexação ciente do Git, filtros avançados e arquitetura C++/Qt focada em performance.',
      en: 'Fast desktop search for files and code repositories, with Git-aware indexing, advanced filtering, and a performance-first C++/Qt architecture.',
      es: 'Búsqueda de escritorio rápida para archivos y repositorios, con indexación consciente de Git, filtros avanzados y arquitectura C++/Qt orientada al rendimiento.',
    },
  },
  {
    name: 'Omnifile',
    status: 'active',
    repository: 'https://github.com/Dheovani/omnifile',
    technologies: ['TypeScript', 'VS Code', 'WebAssembly', 'PDF.js'],
    description: {
      pt: 'Visualizador local-first de documentos e mídia para o VS Code, com pré-visualizações por formato, navegação e edição.',
      en: 'Local-first document and media viewer for VS Code, with format-aware previews, navigation, and editing.',
      es: 'Visor local-first de documentos y multimedia para VS Code, con vistas previas según el formato, navegación y edición.',
    },
  },
  {
    name: 'Workspace Town',
    status: 'active',
    repository: 'https://github.com/Dheovani/workspace-town',
    technologies: ['TypeScript', 'Next.js', 'React', 'Bun'],
    description: {
      pt: 'Espaço de trabalho virtual colaborativo com salas 2D, avatares, presença em tempo real e chamadas para equipes de software.',
      en: 'Collaborative virtual workspace with 2D rooms, avatars, real-time presence, and live calls for software teams.',
      es: 'Espacio de trabajo virtual colaborativo con salas 2D, avatares, presencia en tiempo real y llamadas para equipos de software.',
    },
  },
  {
    name: 'Comrad Bot',
    status: 'maintenance',
    repository: 'https://github.com/Dheovani/comrad-bot',
    technologies: ['Python', 'discord.py', 'FFmpeg', 'Generative AI'],
    description: {
      pt: 'Bot para Discord com música, sons personalizados, IA generativa, texto para fala e sessões de jogos com amigos.',
      en: 'Discord bot with music, custom sounds, generative AI, text-to-speech, and gaming sessions with friends.',
      es: 'Bot de Discord con música, sonidos personalizados, IA generativa, texto a voz y sesiones de juego con amigos.',
    },
  },
];
