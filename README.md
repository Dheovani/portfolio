# Portfolio - Dheovani Xavier

Portfolio one-page desenvolvido com Astro e Tailwind CSS para apresentar atuação profissional, projetos pessoais, formação/certificações e canais de contato.

## Stack

- Astro 6
- Tailwind CSS 4
- TypeScript
- HTML/CSS/JavaScript sem framework client-side pesado

## Scripts

```sh
npm install
npm run dev
npm run build
npm run preview
```

O servidor de desenvolvimento roda, por padrão, em `http://localhost:4321`.

## Estrutura

```text
src/
  assets/
    certificates/   PDFs dos certificados e diplomas
    previews/       Imagens usadas como preview dos certificados
  components/       Seções e componentes da página
  layouts/          Layout HTML base
  lib/              Configurações e dados estruturados
  messages/         Traduções pt/en
  pages/            Página principal
  styles/           Tailwind e tokens globais de tema
public/
  CNAME
  favicon.ico
  favicon.png
  icon-light.png
  icon-dark.png
  picture.jpg
```

## Seções

- `hero-section.astro`: apresentação inicial.
- `about-section.astro`: resumo profissional e foto.
- `service-showcase-section.astro`: amostra de trabalho profissional com capturas de um site entregue.
- `projects-section.astro`: carrossel de repositórios públicos carregados da API do GitHub.
- `experience-section.astro`: timeline de formação e carrossel de certificados.
- `contact-section.astro`: Gmail, Outlook, LinkedIn e GitHub.

## Tradução

As mensagens ficam em:

- `src/messages/pt.json`
- `src/messages/en.json`

A linguagem inicial é escolhida a partir do navegador do usuário. A troca manual é salva em `localStorage`.

## Tema

O site possui modo claro e escuro. A preferência inicial usa `prefers-color-scheme`, e a escolha manual também é salva em `localStorage`.

Os ícones do header alternam entre:

- `public/icon-light.png`
- `public/icon-dark.png`

## Projetos do GitHub

A seção de projetos busca os repositórios públicos diretamente de:

```text
https://api.github.com/users/Dheovani/repos?sort=updated&per_page=100
```

O carregamento acontece no navegador a cada acesso. Repositórios arquivados e forks são filtrados.

## Certificados

Os PDFs ficam em `src/assets/certificates`, e os previews em `src/assets/previews`.

A lista usada pela seção de experiência é configurada em:

```text
src/lib/certificates.ts
```

## Build

Para validar o projeto:

```sh
npm run build
```

A saída de produção é gerada em `dist/`.

## GitHub Pages

O projeto está configurado para publicação em:

```text
https://dheovani-xavier.dev/
```

A configuração fica em `astro.config.mjs`:

```js
export default defineConfig({
	site: 'https://dheovani-xavier.dev',
});
```

O domínio customizado é preservado pelo arquivo:

```text
public/CNAME
```

O deploy automático é feito pelo workflow:

```text
.github/workflows/deploy.yml
```

Para publicar:

1. Faça push para a branch `master`.
2. No GitHub, acesse `Settings > Pages`.
3. Em `Build and deployment`, selecione `GitHub Actions`.
4. Aguarde o workflow `Deploy to GitHub Pages` finalizar.
