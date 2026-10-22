# FullStack SaaS Boilerplate Setup Scripts

Este repositório contém dois scripts utilitários em Bash desenvolvidos para acelerar a criação de projetos SaaS. Eles configuram de forma automática a estrutura base, instalam as dependências necessárias e geram os arquivos essenciais tanto para o Front-end quanto para o Back-end da sua aplicação.

## 🚀 O que está incluso?

### 1. `setup_frontend.sh` (Next.js SaaS Boilerplate)
Script para inicializar um projeto front-end moderno, focado em produtividade e UI de alta qualidade.
- **Framework:** Next.js 15 (App Router)
- **Estilização & UI:** Tailwind CSS, shadcn/ui
- **Autenticação:** NextAuth.js (com provedores customizáveis e Google)
- **Banco de Dados & ORM:** PostgreSQL + Prisma
- **Pagamentos:** Integração com Stripe
- **Estado & Fetching:** Zustand, TanStack Query (React Query), Axios
- **Formulários:** React Hook Form + Zod

### 2. `setup-nest.sh` (NestJS SaaS Boilerplate)
Script para inicializar um back-end robusto, escalável e tipado.
- **Framework:** NestJS
- **Banco de Dados & ORM:** PostgreSQL + Prisma
- **Autenticação:** JWT (Access e Refresh Tokens) com Passport e bcrypt
- **Pagamentos:** Stripe (com Webhooks e Checkout Session)
- **Documentação:** Swagger (OpenAPI)
- **Validação:** class-validator, class-transformer

---

## ⚙️ Pré-requisitos

Antes de executar os scripts, certifique-se de ter os seguintes requisitos instalados na sua máquina:
- **Node.js** (versão 18 ou superior)
- **Git**
- Um gerenciador de pacotes: **npm**, **yarn** ou **pnpm** (os scripts detectam automaticamente qual você usa).

---

## 🛠️ Como Usar

### Passo 1: Download
Faça o clone ou o download direto dos scripts para a sua máquina, em uma pasta de sua preferência.

### Passo 2: Dar permissão de execução
Por padrão, scripts Bash precisam de permissão para serem executados. Abra seu terminal, navegue até a pasta onde os scripts estão salvos e rode:
```bash
chmod +x setup_frontend.sh
chmod +x setup-nest.sh
```

### Passo 3: Executar o Setup
Escolha qual projeto deseja criar (ou crie ambos em pastas separadas) executando o script correspondente:

Para o **Front-end**:
```bash
./setup_frontend.sh
```

Para o **Back-end**:
```bash
./setup-nest.sh
```

### Passo 4: Siga as instruções na tela
O script irá solicitar o **Nome do Projeto**. Após informar, ele criará a pasta, fará o download das dependências (pode levar alguns minutos) e criará toda a estrutura de pastas e arquivos boilerplate (ex: `schema.prisma`, arquivos de configuração do Stripe, Auth, etc).

---

## 📂 Pós-Instalação

Após a execução bem-sucedida dos scripts:
1. Navegue para a pasta do projeto criado (`cd nome-do-projeto`).
2. Configure suas variáveis de ambiente no arquivo `.env` (credenciais do DB, chaves do Stripe, JWT secrets).
3. Execute as migrações do banco de dados (`npx prisma migrate dev`).
4. Rode o ambiente de desenvolvimento (ex: `npm run dev` ou `npm run start:dev`).

---

## ⚠️ Observações
* Os scripts usam o `npx` por baixo dos panos (para `create-next-app` ou `nest new`).
* As tecnologias e bibliotecas instaladas são voltadas para deploys rápidos em plataformas como **Vercel** e **Render**.
* Caso use Windows, é recomendado rodar esses scripts através do **WSL**, **Git Bash** ou um emulador de terminal compatível com shell script.
