# SoleTrack - Sistema de Controle de Produção de Calçados

SoleTrack é um sistema fullstack desenvolvido para gerenciar a produção de calçados.  
Permite controlar usuários, pedidos de produção, modelos de calçados e perfis com diferentes níveis de acesso (ADMIN ou OPERATOR).  

---

## 🚀 Funcionalidades

- Cadastro, login e logout de usuários  
- Atualização de perfil  
- Gestão de pedidos de produção  
- Gestão de modelos de calçados  
- Rotas privadas e públicas  
- Dashboard simplificado para visualização rápida de dados  

---

## 💻 Tecnologias

**Frontend:**  
React, TypeScript, CSS Modules, React Router, Axios  

**Backend:**  
Node.js, Express, TypeScript, Prisma ORM, JWT, Swagger  

---

## ⚙️ Requisitos

- Node.js (>=18)  
- npm (>=9)  
- Banco de dados configurado via Prisma (PostgreSQL, MySQL ou SQLite)  

---

## 🛠 Como Rodar

O sistema precisa de **dois terminais** abertos: um para backend e outro para frontend.

### 1️⃣ Backend
1. Acesse a pasta do backend:
```bash
cd backend
npm install
npm run dev

### Frontend
2. Acesse a pasta do frontend:
```bash
cd frontend
npm install
npm run dev

Servidor rodando em: http://localhost:3000
Swagger: http://localhost:3000/api-docs

Frontend rodando em: http://localhost:5173

Formato esperado da API

O frontend espera que a API retorne os dados de autenticação neste formato:

{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "ADMIN|OPERATOR"
  }
}

Contato

Desenvolvedor: Carlos Otacílio
Projeto: SoleTrack - Controle de Produção de Calçados
