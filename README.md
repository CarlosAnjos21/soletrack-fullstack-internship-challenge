# 🥿 SoleTrack

> Sistema Fullstack de Controle de Produção de Calçados

SoleTrack é uma aplicação **fullstack** para gerenciar a produção de calçados em ambiente industrial. Oferece controle de usuários, pedidos de produção e modelos de calçados, com autenticação JWT e controle de acesso baseado em perfis.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Como Rodar](#-como-rodar)
- [Documentação da API](#-documentação-da-api)
- [Perfis de Acesso](#-perfis-de-acesso)

---

## 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários com JWT
- ✅ Controle de acesso por perfil (**ADMIN** e **OPERATOR**)
- ✅ Atualização de perfil de usuário
- ✅ Gestão completa de pedidos de produção
- ✅ Gestão de modelos de calçados
- ✅ Dashboard com visualização de dados
- ✅ Rotas públicas e privadas
- ✅ Documentação interativa da API com Swagger

---

## 💻 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React, TypeScript, Vite, React Router, Axios, CSS Modules |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, JWT, Swagger |
| **Banco de Dados** | PostgreSQL |

---

## 📂 Estrutura do Projeto

```
soletrack-fullstack/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       ├── database/
│       ├── errors/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.ts
│       ├── createAdmin.ts
│       └── swagger.ts
│
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── routes/
        ├── services/
        ├── styles/
        ├── types/
        ├── App.tsx
        └── main.tsx
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- [PostgreSQL](https://www.postgresql.org/) >= 14

---

## 🔧 Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/soletrack-fullstack.git
cd soletrack-fullstack
```

### 2. Configure o banco de dados

Acesse o PostgreSQL e crie o banco:

```sql
CREATE DATABASE shoetrack_production;
```

### 3. Configure as variáveis de ambiente

Na pasta `backend`, copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cd backend
cp .env.example .env
```

**.env.example:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shoetrack_production"
JWT_SECRET="your_jwt_secret_here"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

---

## ▶️ Como Rodar

O projeto requer **dois terminais** rodando simultaneamente.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run migrate   # Cria as tabelas via Prisma
npm run dev
```

Servidor disponível em: `http://localhost:3000`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

### Scripts disponíveis (backend)

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila o projeto TypeScript |
| `npm run migrate` | Executa as migrations do Prisma |

---

## 📖 Documentação da API

A documentação interativa (Swagger) está disponível após iniciar o backend:

```
http://localhost:3000/api-docs
```

### Formato da resposta de autenticação

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "ADMIN | OPERATOR"
  }
}
```

---

## 🔐 Perfis de Acesso

| Perfil | Permissões |
|--------|------------|
| **ADMIN** | Acesso completo: usuários, pedidos e modelos |
| **OPERATOR** | Acesso restrito às operações de produção |

---

## 👨‍💻 Autor

Desenvolvido por **Carlos Otacílio Rodrigues Dos Anjos** como desafio técnico fullstack, demonstrando integração entre frontend, backend, autenticação segura e banco de dados relacional.