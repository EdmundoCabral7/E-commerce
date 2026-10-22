# Roadmap de Implementação: SaaS Multitenant

---

## Fase 1: Camada de Dados (Prisma Schema)

Antes de qualquer alteração nas rotas, é necessário ajustar a fonte da verdade: o banco de dados.

### Task 1.1: Novos Models de Organização

**Model `Organization`**

Adicionar os campos: `id`, `name`, `slug` (para as rotas públicas `/loja/:slug`), `ownerId`, `logoUrl` e `createdAt`.

**Model `OrganizationMember`**

Tabela de junção entre `User` e `Organization`, incluindo o campo `role` com enum:

- `OWNER`
- `ADMIN`
- `STAFF`

**Model `Store`**

Configurações da vitrine (tema, banner, redes sociais, horário), com relacionamento 1:1 com a `Organization`.

### Task 1.2: Relacionamento de Produtos

Adicionar `organizationId` como Foreign Key obrigatória ao model `Product` já existente e executar as migrações no banco de dados.

---

## Fase 2: Infraestrutura e Segurança (Middlewares)

A base da multilocação (multitenancy) reside na validação rigorosa de quem pode acessar o quê.

### Task 2.1: Extensão de Request

Atualizar o `express.d.ts` para estender o `Request` do Express. Isso permitirá carregar os dados `req.user`, `req.orgId` e `req.memberRole` após a autenticação, mantendo os controllers limpos.

### Task 2.2: Middleware de Organização (`org.middleware.ts`)

Criar um middleware que valida se o usuário autenticado é membro da organização especificada no parâmetro `:orgId` da URL.

O objetivo é bloquear qualquer acesso cruzado entre organizações — por exemplo, um lojista da Loja A não pode acessar dados da Loja B.

### Task 2.3: Middleware de Permissões (`roles.middleware.ts`)

Implementar um factory pattern (`requireRole('owner', 'admin')`) que será encadeado nas rotas do painel administrativo para verificar se o usuário possui o nível de acesso necessário para a ação.

---

## Fase 3: Refatoração de Serviços (Services Layer)

A lógica de negócio deve ser segregada para suportar a separação entre vitrine pública e gestão administrativa.

### Task 3.1: Segmentação de Produtos

Dividir o `product.service.ts` existente em dois arquivos distintos:

- **`public/product.service.ts`** — focado na leitura pública da vitrine.
- **`org/admin-product.service.ts`** — focado no CRUD completo, incluindo a verificação obrigatória de dono da organização.

---

## Fase 4: Rotas e Camada de Apresentação (Controllers)

Consolidação da estrutura das rotas do painel administrativo, seguindo o padrão definido.

### Task 4.1: Implementação das Rotas Admin

Configurar as rotas sob o prefixo `/api/org/:orgId/...` com os seguintes endpoints:

| Método | Rota | Ação |
|--------|------|------|
| `POST` | `/products` | Criação de produto |
| `PUT` | `/products/:id` | Edição de produto |
| `DELETE` | `/products/:id` | Deleção de produto |
| `GET` | `/dashboard` | Métricas da loja |

### Task 4.2: Finalização do Dashboard

Implementar o endpoint de dashboard como última etapa, pois depende dos dados consolidados dos outros módulos (pedidos, produtos, promoções).

---

## Resumo da Estrutura Proposta

| Camada | Ação | Objetivo |
|--------|------|----------|
| Banco de Dados | Novos Models (`Organization`, `OrganizationMember`, `Store`) | Estruturar a hierarquia empresarial |
| Middlewares | `org` + `roles` | Garantir isolamento de dados e segurança |
| Serviços | Divisão `public/` e `admin/` | Separar lógica de vitrine e gestão |
| Rotas | `/api/org/:orgId/...` | Manter o contexto da organização nas requisições |
