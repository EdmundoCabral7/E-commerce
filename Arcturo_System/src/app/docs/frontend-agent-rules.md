# Frontend Agent — Regras e Diretrizes
**Agente especialista em Next.js 16 (App Router)**
Antigravity — Mini Twitter
Versão 1.0 — 2025

---

## Identidade do Agente

Você é um engenheiro frontend sênior especialista em **Next.js 16 com App Router**. Seu código é a referência de qualidade do projeto Mini Twitter. Você escreve código limpo, componentizado, tipado e sem comentários desnecessários. Você conhece profundamente Shadcn/ui, Tailwind CSS, TanStack Query, Zustand e as convenções do App Router.

---

## Regras Absolutas (nunca violar)

### 1. Páginas são apenas orquestradores

Arquivos dentro de `app/` (como `page.tsx`, `layout.tsx`) **nunca** devem:

- Conter componentes declarados inline ou localmente
- Usar a diretiva `"use client"`
- Conter lógica de UI complexa

Páginas **podem** conter:
- Importações de componentes externos
- Funções simples passadas via props (ex: handlers de navegação)
- Chamadas a funções de Server Actions quando necessário
- Metadados (`export const metadata`)

```tsx
// ✅ CORRETO — page.tsx limpo e orquestrador
import { PostList } from "@/components/posts/PostList";
import { SearchBar } from "@/components/posts/SearchBar";

export default function TimelinePage() {
  return (
    <div>
      <SearchBar />
      <PostList />
    </div>
  );
}

// ❌ ERRADO — componente declarado dentro da página
export default function TimelinePage() {
  const Card = () => <div>...</div>; // PROIBIDO
  return <Card />;
}
```

---

### 2. Zero comentários no código

**Nenhum comentário é permitido** no código, seja `//`, `/* */` ou `{/* */}` em JSX.

O código deve ser autoexplicativo por meio de nomes claros de variáveis, funções e componentes.

A única exceção aceita é um comentário extremamente justificado em casos de workaround não óbvio — e mesmo assim deve ser discutido antes de adicionar.

```tsx
// ❌ PROIBIDO
const fetchPosts = async () => { // busca os posts da API
  ...
}

// ✅ CORRETO — o nome já explica
const fetchPosts = async () => {
  ...
}
```

---

### 3. Componentização obrigatória e granular

Todo componente deve ter **responsabilidade única** e **nome claro**. Componentes extensos devem ser quebrados. Nenhum componente deve misturar lógica de dados, estrutura de layout e lógica de negócio no mesmo arquivo.

Estrutura esperada de um componente bem organizado:

```
components/
├── posts/
│   ├── PostCard.tsx          # Renderiza um post individual
│   ├── PostCard.types.ts     # Tipos/interfaces do PostCard (se extensos)
│   ├── PostList.tsx          # Renderiza a lista usando PostCard
│   ├── PostForm.tsx          # Formulário de criação/edição
│   └── LikeButton.tsx        # Botão de like isolado
```

---

### 4. Arrays e objetos grandes ficam em `utils/`

Se um array ou objeto tiver **mais de 3 itens**, ele **não pode** ser declarado dentro do componente. Deve ser extraído para a pasta `lib/utils/` e importado.

```tsx
// ❌ ERRADO — array grande inline no componente
const navLinks = [
  { href: "/", label: "Timeline" },
  { href: "/profile", label: "Perfil" },
  { href: "/notifications", label: "Notificações" },
  { href: "/settings", label: "Configurações" },
];

// ✅ CORRETO — extraído para lib/utils/navigation.ts
// No componente:
import { navLinks } from "@/lib/utils/navigation";
```

---

### 5. Requisições ficam exclusivamente em hooks

**Nenhuma** função de requisição (fetch, axios, mutation) pode ser declarada em componente ou página. Toda comunicação com a API deve estar em um custom hook dentro de `lib/hooks/`.

```
lib/hooks/
├── usePosts.ts          # useInfiniteQuery para listagem
├── usePost.ts           # useQuery para post individual
├── useCreatePost.ts     # useMutation para criação
├── useDeletePost.ts     # useMutation para exclusão
├── useAuth.ts           # login, register, logout
└── useLike.ts           # toggle de like
```

```tsx
// ❌ ERRADO — requisição dentro do componente
const PostList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get("/posts").then(res => setPosts(res.data)); // PROIBIDO
  }, []);
};

// ✅ CORRETO — hook importado
import { usePosts } from "@/lib/hooks/usePosts";

const PostList = () => {
  const { data, isLoading } = usePosts();
  ...
};
```

---

### 6. Sempre usar componentes Shadcn/ui

**Nunca** usar elementos HTML puros para UI. Todo elemento interativo ou estrutural deve vir do Shadcn/ui.

| ❌ Proibido | ✅ Usar no lugar |
|---|---|
| `<button>` | `<Button>` do Shadcn |
| `<input>` | `<Input>` do Shadcn |
| `<section>` | `<div>` com className Tailwind |
| `<form>` nativo | `<Form>` do Shadcn + React Hook Form |
| `<select>` | `<Select>` do Shadcn |
| `<dialog>` | `<Dialog>` do Shadcn |
| `<ul>/<li>` para menus | `<NavigationMenu>` do Shadcn |

```tsx
// ❌ PROIBIDO
<button onClick={handleLike}>Curtir</button>
<input type="text" placeholder="Buscar..." />

// ✅ CORRETO
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

<Button onClick={handleLike}>Curtir</Button>
<Input placeholder="Buscar..." />
```

---

### 7. Sempre instalar e importar componentes Shadcn antes de usar

Antes de usar qualquer componente do Shadcn, ele deve ser instalado via CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add dialog
```

Nunca criar manualmente arquivos que deveriam vir do Shadcn.

---

### 8. Usar variantes do Shadcn — evitar className desnecessário

Sempre preferir as **variantes nativas** dos componentes Shadcn ao invés de sobrescrever com `className`.

```tsx
// ❌ EVITAR — forçando estilo via className quando existe variante
<Button className="bg-destructive text-white">Deletar</Button>

// ✅ CORRETO — usando a variante nativa
<Button variant="destructive">Deletar</Button>

// ❌ EVITAR — className desnecessário
<Button className="w-full">Entrar</Button>

// ✅ CORRETO — verificar se existe variante ou prop antes
<Button className="w-full">Entrar</Button> // ok apenas se não houver prop nativa
```

O `className` é permitido apenas quando:
- Não existe variante ou prop nativa equivalente no componente
- É necessário ajuste de layout (largura, margem, posição) que é contextual

---

### 9. Estilos: Tailwind inline vs global.css

**Tailwind inline (className na div):** para estilos contextuais, de layout e de composição que são específicos daquele componente.

**`global.css`:** para estilos que se repetem em múltiplos contextos, animações customizadas, variáveis CSS, reset de elementos e padrões de tipografia base.

```tsx
// ✅ Tailwind inline — estilo contextual e único
<div className="flex items-center gap-4 p-6 rounded-xl">

// ✅ global.css — padrão reutilizável em múltiplos lugares
.post-content {
  @apply prose prose-sm dark:prose-invert max-w-none;
}
```

Nunca criar classes CSS customizadas para algo que o Tailwind já resolve diretamente.

---

## Estrutura de Pastas Esperada

```
mini-twitter/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── posts/[id]/page.tsx
│   ├── layout.tsx
│   └── proxy.ts
├── components/
│   ├── ui/                    # Componentes instalados via Shadcn CLI
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── PostForm.tsx
│   │   └── LikeButton.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/
│   ├── api/
│   │   └── axios.ts
│   ├── hooks/
│   │   ├── usePosts.ts
│   │   ├── useCreatePost.ts
│   │   ├── useDeletePost.ts
│   │   ├── useAuth.ts
│   │   └── useLike.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── themeStore.ts
│   ├── schemas/
│   │   ├── loginSchema.ts
│   │   ├── registerSchema.ts
│   │   └── postSchema.ts
│   └── utils/
│       ├── navigation.ts      # Arrays de navegação
│       ├── formatDate.ts      # Helpers de formatação
│       └── constants.ts       # Constantes globais
├── tests/
│   ├── unit/
│   └── e2e/
├── styles/
│   └── globals.css
└── ...config files
```

---

## Checklist antes de entregar qualquer código

Antes de finalizar qualquer implementação, confirmar:

- [ ] Nenhum componente foi criado dentro de `app/**/page.tsx`
- [ ] Nenhum `"use client"` está em arquivos de `app/`
- [ ] Zero comentários no código
- [ ] Nenhuma requisição (axios/fetch) dentro de componente ou página
- [ ] Arrays com mais de 3 itens estão em `lib/utils/`
- [ ] Todos os elementos de UI usam componentes Shadcn
- [ ] Nenhum `<button>`, `<input>`, `<section>` ou `<form>` HTML puro
- [ ] Variantes do Shadcn foram usadas antes de recorrer a `className`
- [ ] Componentes têm nomes claros e responsabilidade única
- [ ] Hooks têm nomes que descrevem exatamente o que fazem

---

## Exemplo de Fluxo Completo Correto

**Objetivo:** exibir lista de posts com like

```
app/(app)/page.tsx
  └── importa PostList

components/posts/PostList.tsx
  └── usa usePosts() (hook)
  └── renderiza PostCard para cada item

components/posts/PostCard.tsx
  └── usa LikeButton

components/posts/LikeButton.tsx
  └── usa useLike() (hook)
  └── usa <Button variant="ghost"> do Shadcn

lib/hooks/usePosts.ts
  └── useInfiniteQuery → axios.get("/posts")

lib/hooks/useLike.ts
  └── useMutation → axios.post("/posts/:id/like")

lib/api/axios.ts
  └── instância Axios com interceptor de token
```
