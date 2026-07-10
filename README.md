# 🥿 SoleTrack
## Sistema Full Stack de Controle de Produção de Calçados

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
- Front-end

---

# 🚀 Funcionalidades

### 🔐 Autenticação e Controle de Acesso
- Login com autenticação JWT;
- Rotas protegidas no frontend e backend;
- Controle de permissões por perfil;
- Perfis: **ADMIN** e **OPERATOR**.

### 👥 Gerenciamento de Usuários
- Cadastro de operadores;
- Atualização de informações do usuário;
- Controle de perfis de acesso;
- Gerenciamento de usuários administrativos.

### 📦 Ordens de Produção
- Criação de ordens de produção;
- Atualização de quantidade produzida;
- Controle de status: Planejada, Em andamento, Concluída;
- Acompanhamento do progresso produtivo.

### 👟 Modelos de Calçados
- Cadastro de modelos;
- Organização por categorias;
- Controle de variantes;
- Gerenciamento de produtos.

### 📊 Dashboard
- Indicadores de produção;
- Quantidade de ordens;
- Status das produções;
- Visão geral operacional.

---

# 📸 Demonstração do Sistema

### 📊 Dashboard
<p align="center">
  <img src="./frontend/public/screenshots/dashboard.png" alt="Dashboard SoleTrack">
</p>

### 🏭 Ordens de Produção
<p align="center">
  <img src="./frontend/public/screenshots/producao.png" alt="Ordens de Produção SoleTrack">
</p>

### 👟 Modelos de Calçados
<p align="center">
  <img src="./frontend/public/screenshots/modelos.png" alt="Modelos de Calçados SoleTrack">
</p>

### 👤 Perfil do Usuário
<p align="center">
  <img src="./frontend/public/screenshots/perfil.png" alt="Perfil SoleTrack">
</p>

### 👥 Gerenciar Usuários
<p align="center">
  <img src="./frontend/public/screenshots/usuarios.png" alt="Gerenciamento de Usuários SoleTrack">
</p>

### 📝 Registrar Operador
<p align="center">
  <img src="./frontend/public/screenshots/registrar.png" alt="Registro de Operador SoleTrack">
</p>

---

# 🧠 Tecnologias Utilizadas

**Frontend**
- React.js
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT
- Swagger
- Helmet

**Banco de Dados**
- PostgreSQL

**Ferramentas**
- Git
- GitHub
- VS Code

---

# ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente (ou via Docker)

### 1. Clonar o repositório
```bash
git clone https://github.com/CarlosAnjos21/soletrack-fullstack-internship-challenge.git
cd soletrack-fullstack-internship-challenge
```

### 2. Configurar o backend
```bash
cd backend
npm install
```
Crie um arquivo `.env` na pasta `backend/` com sua string de conexão:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/shoetrack_production"
JWT_SECRET="sua_chave_secreta"
```
Rode as migrations e o seed (popula o banco com dados de exemplo, incluindo o usuário admin):
```bash
npm run migrate
npm run seed
npm run dev
```
O backend sobe em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api-docs`.

### 3. Configurar o frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
O frontend sobe em `http://localhost:5173`.

### 4. Acessar o sistema
Use as credenciais criadas pelo seed:
```
E-mail: admin@admin.com
Senha: admin123
```

---

# 🧪 Testes

Testes automatizados (Jest + React Testing Library) ainda não foram implementados — é o próximo passo do roadmap do projeto, junto com cobertura de testes de integração para as rotas do backend.

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
```

---

# 👤 Autor

**Carlos Otacílio Rodrigues dos Anjos**

Desenvolvedor Full Stack | JavaScript | React | Node.js | PostgreSQL | Estudante de Análise e Desenvolvimento de Sistemas

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/carlosanjos22)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CarlosAnjos21)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/mail/?view=cm&fs=1&to=carlosotacilio65@gmail.com)
