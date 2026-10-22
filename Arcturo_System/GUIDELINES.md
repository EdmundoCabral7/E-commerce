# Arcturoshop - Diretrizes de Desenvolvimento

Este documento contém as regras de ouro e padrões estéticos que devem ser seguidos em todo o desenvolvimento do projeto Arcturoshop.

## 🎨 Estética e Design (Mercado Livre Style)
- **Cores**: Fundo off-white (`#f5f5f5`), Azul Mercado Livre para ações (`#3483fa`), Branco puro para cards.
- **Profundidade**: Uso constante de `shadow-sm` ou `shadow-md` em cards e containers para criar camadas.
- **Continuidade**: Layouts fluídos sem divisórias pesadas. O Banner deve se integrar às seções seguintes (ex: CategoryBar sobreposta).
- **Cards**: Bordas arredondadas (`rounded-xl` ou `rounded-2xl`) e hover states sutis com leve elevação (`-translate-y`).

## 🛠 Arquitetura e Código
- **Orquestração**: O arquivo `page.tsx` deve atuar apenas como um orquestrador de componentes de alto nível.
- **Componentização**: Seguir estritamente o padrão Shadcn/UI adaptado.
- **Padrão de Tags**: Utilizar estritamente `div` para estrutura. Evitar tags semânticas brutas como `main`, `section`, `article`, `header` ou `h1-h6` (usar classes de texto para hierarquia).
- **Sem Comentários**: O código deve ser autoexplicativo. **NÃO incluir comentários** no arquivos de código (`.tsx`, `.ts`, `.css`).

## 🚀 Tecnologias e Sintaxe
- **Next.js**: Padrão App Router (versão 15+).
- **Tailwind CSS v4**: Utilizar as novas diretivas como `@utility` e `@custom-variant` no `globals.css`.
- **Icons**: Usar exclusivamente `lucide-react`.
- **State Management**: Zustand para stores globais (Carrinho, Usuário).
- **Data Fetching**: React Query para requisições assíncronas.

## 📝 Regras de Interface
- **Responsividade**: Mobile-first sempre.
- **Inputs e Buttons**: Manter tamanhos `xl` ou `lg` para uma sensação premium e facilitar o toque.
- **Navegação**: Carrosséis devem ter setas de navegação que "mordem" a borda do container (overlap), com hover de opacidade.
