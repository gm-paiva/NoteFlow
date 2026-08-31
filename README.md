<p align="center">
  <img src="./public/assets/img/NoteFlow-logo-transparent.png" alt="Logo NoteFlow" width="160">
</p>

<h1 align="center">NoteFlow</h1>

<p align="center">
  Organize suas ideias. Acesse de qualquer lugar.
</p>

---

## 📋 Sobre o projeto

**NoteFlow** é uma aplicação web de anotações, inspirada em ferramentas como o Google Keep, desenvolvida como projeto em grupo durante o curso de **Informática da DiscoverON**.

O sistema permite criar, editar, fixar, arquivar e excluir notas, com busca em tempo real e suporte a tema claro/escuro — tudo isso com uma interface simples e responsiva.

## ✨ Funcionalidades

- 🔐 Telas de **login** e **cadastro** de usuário
- 📝 Criação rápida de notas (título, corpo e cor)
- 📌 Fixar notas importantes
- 🗄️ Arquivar notas
- 🗑️ Excluir notas
- 🎨 Seleção de cores para cada nota
- 🔍 Busca de notas em tempo real
- 🌗 Alternância entre tema claro e escuro (com preferência salva)
- 💾 Persistência dos dados no navegador (`localStorage`)
- 📱 Layout responsivo

## 🚀 Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript** (Vanilla JS, sem frameworks ou bibliotecas)

## 📁 Estrutura do projeto

```
Projeto NoteFlow/
└── public/
    ├── assets/
    │   ├── css/
    │   │   ├── main.css
    │   │   ├── homepage.css
    │   │   ├── tela-login.css
    │   │   └── tela-cadastro.css
    │   ├── js/
    │   │   ├── theme.js
    │   │   ├── homepage.js
    │   │   ├── tela-login.js
    │   │   └── tela-cadastro.js
    │   └── img/
    │       ├── NoteFlow-logo-circle.png
    │       ├── NoteFlow-logo-square.jpg
    │       └── NoteFlow-logo-transparent.png
    └── pages/
        ├── homepage.html
        ├── tela-login.html
        └── tela-cadastro.html
```

## 🔧 Como executar o projeto

Como o projeto é feito apenas com HTML, CSS e JavaScript puro, não é necessário instalar dependências.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/noteflow.git
   ```
2. Entre na pasta do projeto:
   ```bash
   cd "Projeto NoteFlow"
   ```
3. Abra o arquivo `public/pages/tela-login.html` diretamente no navegador, ou utilize uma extensão como o **Live Server** (VS Code) para melhor experiência.

> ⚠️ As telas de login e cadastro são apenas validações de formulário no front-end (não há back-end/autenticação real). Ao preencher os campos e enviar, você é redirecionado para a tela principal de notas.

## 👥 Integrantes do grupo

- [Guilherme](https://github.com/gm-paiva)
- Sthelly
- João Carlos

