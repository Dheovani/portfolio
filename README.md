# Portfolio - Dheovani Xavier

Portfólio interativo em pixel art isométrica. O visitante controla um personagem em uma sala e interage com objetos para conhecer cada seção:

| Objeto | Seção |
| --- | --- |
| Cama | Sobre mim |
| Mesa com computador | Experiência profissional |
| Estante de livros | Formação acadêmica |
| Bancada de engenharia (braço robótico) | Projetos |
| Terminal de comunicação | Contato |

Idiomas: português (pt-BR), inglês e espanhol.

## Stack

- Vite + React 19 + TypeScript
- PixiJS 8 (renderização da sala)
- Zustand (estado compartilhado)
- i18next / react-i18next
- CSS Modules
- Motion (animação dos painéis)
- Vitest + ESLint

## Scripts

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build estático em dist/
npm run preview    # serve dist/ localmente
npm run typecheck
npm run lint
npm test
npm run sprites    # regenera os sprites em src/game/assets/generated
```

## Controles

- Clique/toque no chão: caminhar (A* em grade 12x12, desviando dos móveis).
- Clique/toque em um objeto: o personagem vai até ele e o painel abre na chegada.
- Setas ou WASD: andar; Enter/Espaço/E: usar o objeto ao lado.
- Tab: percorre os objetos interativos (rótulo aparece sobre o objeto); Enter abre.
- Esc: fecha o painel.
- Botão sol/lua (canto superior direito): alterna o quarto entre dia e noite. A escolha fica salva no navegador; na primeira visita segue o horário local (dia das 7h às 19h).

## Arquitetura

```text
src/
  content/        Conteúdo profissional (dados puros, localizados pt/en/es)
  i18n/           Configuração do i18next e textos da interface
  state/          Store Zustand (painel ativo, hover, ajuda)
  game/
    world/        Configuração da sala, posições dos móveis, projeção isométrica, ordem de profundidade
    nav/          Grade de navegação e A*
    actors/       Movimento do avatar (lógica pura) e sua visualização Pixi
    interaction/  Áreas de clique, objeto alvo, tiles de aproximação
    engine/       RoomEngine: aplicação Pixi, camadas, input e loop
    assets/       Carregamento de texturas e sprites gerados
  components/
    room/         Palco do canvas, rótulos, navegação por teclado, dica inicial
    panel/        Painel de seção e corpo de cada seção
    hud/          Nome, seletor de idioma e ajuda (cantos da tela)
scripts/sprites/  Gerador dos sprites (Node, sem dependências)
```

Decisões principais:

- **Pixel art real:** o canvas Pixi tem a resolução lógica da arte (408x294 px) e é ampliado via CSS com `image-rendering: pixelated`. Em telas grandes a escala é inteira (2x, 3x...). Em celulares em retrato a sala recebe zoom de até 1,5x e pode ser arrastada na horizontal.
- **Fronteira React/Pixi:** `RoomEngine` não conhece React. Ele recebe callbacks (`onHover`, `onInteract`, `onWalk`) e expõe comandos (`goToSection`, `nudge`, `interactHere`). O `RoomStage` conecta esses callbacks à store.
- **Fonte única de posições:** `src/game/world/furniture.json` é lido pelo jogo e pelo gerador de sprites. `layout.ts` define quais objetos são interativos e de quais tiles podem ser usados.
- **Profundidade:** ordenação topológica das caixas no chão (`world/depth.ts`), recalculada a cada frame para o avatar.
- **Acessibilidade:** botões invisíveis por objeto que aparecem como rótulos ao receber foco; painel é um `dialog` modal com foco preso e devolvido ao fechar; `prefers-reduced-motion` teletransporta o avatar e desliga animações ambientes.
- **Engine carregada sob demanda:** Pixi fica em um chunk separado, carregado após a interface.

## Atualizar o conteúdo

Edite os arquivos em `src/content/`. Cada texto tem as três línguas (`{ pt, en, es }`).

Valores ainda desconhecidos usam `PENDING` e aparecem nos painéis com a marcação tracejada "a preencher". Basta substituí-los pelo valor real.

## Sprites

Os sprites atuais são **provisórios e originais**, gerados por código em `scripts/sprites/` (paleta em `palette.mjs`, sala em `room.mjs`, móveis em `furniture.mjs`, avatar e braço robótico em `actors.mjs`). Para trocar por arte desenhada à mão, substitua os PNGs em `src/game/assets/generated/` mantendo as âncoras do `manifest.json`, ou ajuste o gerador e rode `npm run sprites -- --preview preview.png`.

## Publicação (GitHub Pages)

O build gera um site 100% estático em `dist/` (inclui `CNAME` com `dheovani-xavier.dev`).

O workflow `.github/workflows/deploy.yml` **publica automaticamente a cada push na branch `master`**. Ele roda `npm ci` e `npm run build` e envia `dist/`, compatível com este projeto sem alterações. Não faça push para `master` até que a nova versão deva substituir o site em produção.
