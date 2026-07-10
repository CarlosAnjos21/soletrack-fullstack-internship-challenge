# 🥿 SoleTrack

# Sistema Full Stack de Controle de Produção de Calçados

<p align="center">
  <img src="./frontend/public/banner.jpeg" alt="SoleTrack Banner">
</p>

<p align="center">
  Sistema web desenvolvido para gerenciamento de produção industrial de calçados, permitindo controle de usuários, modelos, estoque e ordens de produção através de uma arquitetura Full Stack moderna.
</p>

---

# 📌 Sobre o Projeto

O **SoleTrack** é uma aplicação Full Stack desenvolvida para simular um ambiente real de controle industrial, oferecendo uma solução centralizada para acompanhamento de processos produtivos.

A plataforma permite gerenciar usuários, controlar permissões de acesso, cadastrar modelos de calçados e acompanhar ordens de produção com diferentes etapas e status.

O projeto foi construído aplicando conceitos de:

- Arquitetura cliente-servidor;
- APIs REST;
- Autenticação e autorização;
- Banco de dados relacional;
- ORM;
- Boas práticas de desenvolvimento.

---

# 🚀 Funcionalidades

## 🔐 Autenticação e Controle de Acesso

- Login com autenticação JWT;
- Rotas protegidas no frontend e backend;
- Controle de permissões por perfil;
- Perfis:
  - ADMIN;
  - OPERATOR.

---

## 👥 Gerenciamento de Usuários

- Cadastro de operadores;
- Atualização de informações do usuário;
- Controle de perfis de acesso;
- Gerenciamento de usuários administrativos.

---

## 📦 Ordens de Produção

- Criação de ordens de produção;
- Atualização de quantidade produzida;
- Controle de status:
  - Planejada;
  - Em andamento;
  - Concluída;
- Acompanhamento do progresso produtivo.

---

## 👟 Modelos de Calçados

- Cadastro de modelos;
- Organização por categorias;
- Controle de variantes;
- Gerenciamento de produtos.

---

## 📊 Dashboard

- Indicadores de produção;
- Quantidade de ordens;
- Status das produções;
- Visão geral operacional.

---

# 📸 Demonstração do Sistema

## 📊 Dashboard

<p align="center">
  <img src="./frontend/public/screenshots/dashboard.png" alt="Dashboard SoleTrack">
</p>

---

## 🏭 Ordens de Produção

<p align="center">
  <img src="./frontend/public/screenshots/Producao.png" alt="Ordens de Produção SoleTrack">
</p>

---

## 👟 Modelos de Calçados

<p align="center">
  <img src="./frontend/public/screenshots/modelos.png" alt="Modelos de Calçados SoleTrack">
</p>

---

## 👤 Perfil do Usuário

<p align="center">
  <img src="./frontend/public/screenshots/perfil.png" alt="Perfil SoleTrack">
</p>

---

## 👥 Gerenciar Usuários

<p align="center">
  <img src="./frontend/public/screenshots/usuarios.png" alt="Gerenciamento de Usuários SoleTrack">
</p>

---

## 📝 Registrar Operador

<p align="center">
  <img src="./frontend/public/screenshots/registrar.png" alt="Registro de Operador SoleTrack">
</p>

---

# 🧠 Tecnologias Utilizadas

## Frontend

- React.js
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT
- Swagger
- Helmet

## Banco de Dados

- PostgreSQL

## Ferramentas

- Git
- GitHub
- VS Code

---

# 📁 Estrutura do Projeto

```bash
soletrack-fullstack/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       ├── database/
│       ├── errors/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.ts
│       ├── seed.ts
│       └── swagger.ts
│
└── frontend/
    │
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── routes/
        ├── services/
        ├── styles/
        └── main.tsx