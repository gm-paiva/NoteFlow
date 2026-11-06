<p align="center">
  <img src="./public/assets/img/logo-transparent.png" alt="Logo do NoteFlow" width="140">
</p>

<h1 align="center">NoteFlow</h1>

<p align="center">
  Aplicação web de anotações com notas coloridas, busca em tempo real e tema claro/escuro.
</p>

<p align="center">
  <a href="https://github.com/gm-paiva/NoteFlow/actions/workflows/ci.yml"><img src="https://github.com/gm-paiva/NoteFlow/actions/workflows/ci.yml/badge.svg" alt="Status do CI"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white" alt="Node.js 22 ou superior">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/licen%C3%A7a-MIT-blue" alt="Licença MIT"></a>
</p>

---

## Sumário

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Como executar](#como-executar)
  - [Com Node.js](#com-nodejs)
  - [Com Docker](#com-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Decisões técnicas](#decisões-técnicas)
- [Testes e qualidade de código](#testes-e-qualidade-de-código)
- [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
- [Contribuindo](#contribuindo)
- [Equipe](#equipe)
- [Licença](#licença)

## Sobre

O NoteFlow é um aplicativo de anotações inspirado no Google Keep, desenvolvido em grupo durante o curso de Informática da DiscoverON.

O front-end é escrito em HTML, CSS e JavaScript puro e é servido por um servidor Node.js (Express). No estado atual, o projeto funciona como um protótipo de front-end: as notas são salvas no `localStorage` do navegador e não há autenticação real (veja [Limitações conhecidas](#limitações-conhecidas-e-próximos-passos)).

## Funcionalidades

- Criação rápida de notas com título, texto e cor
- Edição de notas em janela modal
- Fixar, arquivar e excluir notas
- Filtros por todas, fixadas e arquivadas
- Busca em tempo real por título e conteúdo
- Tema claro/escuro, com a preferência salva no navegador
- Layout responsivo, com menu lateral recolhível no mobile
- Telas de login e cadastro (validação de formulário apenas no front-end)

## Tecnologias

| Camada        | Tecnologia                                                                  |
| ------------- | --------------------------------------------------------------------------- |
| Front-end     | HTML5, CSS3 e JavaScript (ES Modules), sem frameworks                       |
| Servidor      | Node.js 22+ com [Express](https://expressjs.com/) 5                         |
| Segurança     | [Helmet](https://helmetjs.github.io/) (cabeçalhos HTTP e Content-Security-Policy) |
| Configuração  | Variáveis de ambiente com [dotenv](https://github.com/motdotla/dotenv)      |
| Qualidade     | ESLint, `node:test` e GitHub Actions                                        |
| Infraestrutura | Docker (build multi-stage) e Docker Compose                                |

## Requisitos

- [Node.js](https://nodejs.org/) 22 ou superior. A versão recomendada (24, LTS) está no arquivo `.nvmrc`.
- npm (instalado junto com o Node.js)
- [Docker](https://docs.docker.com/get-docker/) com Docker Compose (opcional, apenas para rodar em container)

## Como executar

### Com Node.js

```bash
# 1. Clone o repositório
git clone https://github.com/gm-paiva/NoteFlow.git
cd NoteFlow

# 2. Crie o arquivo de variáveis de ambiente
cp .env.example .env          # no PowerShell: Copy-Item .env.example .env

# 3. Instale as dependências
npm install

# 4. Inicie em modo de desenvolvimento (reinicia ao salvar arquivos do servidor)
npm run dev
```

Acesse <http://localhost:3000>. Para executar sem o modo de observação (como em produção), use `npm start`.

> As páginas precisam ser acessadas pelo servidor. Abrir os arquivos `.html` diretamente no navegador (`file://`) não funciona, pois o projeto usa ES Modules e caminhos absolutos para os arquivos estáticos.

### Com Docker

```bash
# Constrói a imagem e sobe o container em segundo plano
docker compose up --build -d

# Acompanhar os logs
docker compose logs -f

# Parar e remover o container
docker compose down
```

A aplicação fica disponível em <http://localhost:3000>. Para usar outra porta no seu computador, defina `PORT` no arquivo `.env` (o Compose o lê automaticamente) e suba novamente.

Também é possível usar apenas o Docker, sem o Compose:

```bash
docker build -t noteflow .
docker run -d --name noteflow -p 3000:3000 noteflow
```

Sobre a imagem:

- Build em dois estágios: a imagem final contém apenas as dependências de produção.
- O processo roda com o usuário `node`, sem privilégios de root.
- O container expõe `/health` e tem `HEALTHCHECK` configurado. O estado aparece em `docker ps`.

## Variáveis de ambiente

As variáveis são lidas do arquivo `.env` (que não é versionado) ou do ambiente. Use o [`.env.example`](./.env.example) como modelo.

| Variável   | Padrão        | Descrição                                                                                   |
| ---------- | ------------- | ------------------------------------------------------------------------------------------- |
| `NODE_ENV` | `development` | Ambiente de execução (`development` ou `production`). Em produção, ativa cache de estáticos. |
| `PORT`     | `3000`        | Porta em que o servidor escuta. No Docker Compose, define a porta publicada no host.        |
| `HOST`     | `127.0.0.1`   | Endereço de escuta. No Docker é fixado em `0.0.0.0`.                                        |

Variáveis já definidas no ambiente têm prioridade sobre as do `.env`.

## Scripts disponíveis

| Comando         | Descrição                                           |
| --------------- | --------------------------------------------------- |
| `npm start`     | Inicia o servidor                                   |
| `npm run dev`   | Inicia o servidor reiniciando a cada alteração      |
| `npm test`      | Executa os testes automatizados                     |
| `npm run lint`  | Executa o ESLint em todo o projeto                  |

## Estrutura do projeto

```
NoteFlow/
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline: lint, testes e build da imagem Docker
├── public/                   # Tudo o que é servido ao navegador
│   ├── assets/
│   │   ├── css/              # base.css (tokens e tema) + um arquivo por página
│   │   ├── img/              # Logotipos
│   │   └── js/               # theme.js (compartilhado) + um módulo por página
│   ├── 404.html
│   ├── login.html
│   ├── notes.html
│   └── register.html
├── server/
│   ├── app.js                # Criação do app Express (middlewares e rotas)
│   ├── config.js             # Leitura e validação das variáveis de ambiente
│   └── index.js              # Ponto de entrada: sobe o servidor e trata o encerramento
├── tests/                    # Testes automatizados (node:test)
├── .dockerignore
├── .editorconfig
├── .env.example              # Modelo de variáveis de ambiente
├── .gitattributes
├── .gitignore
├── .nvmrc
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## Rotas

| Rota        | Descrição                                               |
| ----------- | ------------------------------------------------------- |
| `/`         | Redireciona para `/login`                               |
| `/login`    | Tela de login                                           |
| `/register` | Tela de cadastro                                        |
| `/notes`    | Aplicação de notas                                      |
| `/health`   | Verificação de saúde (`{"status":"ok"}`), usada no Docker |

## Decisões técnicas

- **Content-Security-Policy restritiva.** Scripts e estilos só são carregados do próprio domínio (mais o Google Fonts). Por isso o front-end não usa `onclick` nem `style=""` inline: os eventos são registrados com `addEventListener` nos módulos JavaScript.
- **ES Modules** no front-end e no servidor (`"type": "module"`), sem etapa de build.
- **URLs limpas** (`/login` em vez de `/login.html`), via `express.static` com `extensions: ['html']`.
- **Configuração por ambiente** centralizada em `server/config.js`, seguindo o princípio de que configuração não fica no código.
- **Encerramento gracioso** do servidor ao receber `SIGTERM`/`SIGINT`, para que `docker stop` finalize o processo sem forçar.
- **Cache**: arquivos estáticos com cache de 1 hora em produção; HTML sempre revalidado.

## Testes e qualidade de código

```bash
npm test        # rotas, cabeçalhos de segurança e integridade dos arquivos estáticos
npm run lint    # análise estática com ESLint
```

Os testes verificam, entre outros pontos, que as rotas respondem corretamente, que a CSP está ativa, que nenhuma página HTML usa handlers ou estilos inline e que todos os arquivos referenciados em `/assets` existem. O mesmo conjunto roda no GitHub Actions a cada push e pull request, junto com o build da imagem Docker.

## Limitações conhecidas e próximos passos

- **Não há autenticação real.** Login e cadastro apenas validam se os campos foram preenchidos e redirecionam para `/notes`. Nenhum dado de usuário é enviado ou armazenado. O botão "Entrar com Google" e o link "Esqueceu a senha?" são apenas visuais.
- **As notas ficam no `localStorage`.** Cada navegador tem o seu próprio conjunto de notas, sem sincronização entre dispositivos.
- **Próximos passos sugeridos:**
  - API REST para notas e usuários, com banco de dados (a conexão e os segredos entram no `.env`)
  - Autenticação real, com senhas armazenadas com hash
  - Testes automatizados do front-end
  - Melhorias de acessibilidade, como navegação por teclado nos cartões e no menu lateral

## Contribuindo

1. Crie uma branch a partir da `main`: `git switch -c feat/nome-da-mudanca`
2. Faça commits pequenos, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
3. Antes de abrir o Pull Request, rode `npm run lint` e `npm test`
4. Abra o Pull Request para a `main` descrevendo o que mudou e por quê

## Equipe

- [Guilherme Matos Paiva](https://github.com/gm-paiva)
- Sthelly
- João Carlos

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE).
