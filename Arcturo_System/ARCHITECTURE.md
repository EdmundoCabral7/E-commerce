# Manifesto de Arquitetura do Arcturoshop

Este documento descreve detalhadamente a estrutura de pastas, arquivos e as decisões de engenharia que sustentam o Arcturoshop.

## 1. Fundamentos Técnicos
Para garantir um código durável, de alta performance e visualmente premium, adotamos três regras inegociáveis:
- **`Div-Only Architecture`**: Toda a estrutura é construída sobre `div` e spans controlados por Tailwind. Isso garante controle total sobre o layout sem as limitações de margens/paddings nativos de tags como `ul`, `li` ou `header`.
- **`Zero Comments`**: O código é escrito para ser autoexplicativo através de nomes de componentes, variáveis e funções semânticas.
- **`Next.js 16 (App Router)`**: Utilização de rotas baseadas em diretórios e componentes de servidor por padrão.

---

## 2. Mapa de Diretórios e Arquivos

### `src/app` (Camada de Rotas e Páginas)
Onde reside a estrutura de navegação da aplicação:
- `layout.tsx`: Define o esqueleto global (Header, Footer e Providers).
- `page.tsx`: A página inicial da vitrine.
- `/login` & `/register`: Páginas de autenticação modularizadas em pastas próprias.
- `/product/[id]`: Rota dinâmica para a Página de Detalhes do Produto (PDP).

### `src/components/ui` (Camada Atômica)
Componentes de base, puramente visuais e reutilizáveis:
- `button.tsx`: O botão padrão, suportando variantes `rounded-full` e tamanhos `xl`.
- `input.tsx`: Campos de entrada com foco suave e design minimalista.
- `progress.tsx`: Criado recentemente para exibir as barras de avaliação dos clientes.
- `card.tsx`: Contêiner padrão para login, registro e seções de produto.

### `src/components/commerce-ui` (Camada de Lógica de Comércio)
Componentes especializados em comportamentos de e-commerce:
- `product-variants-01.tsx`: O Orquestrador. É a peça central da página de compra, unindo as variantes, preços e ações.
- `image-viewer-basic.tsx`: Gerencia a visualização de fotos, galeria vertical e o sistema de zoom.
- `price-format-sale.tsx`: Lógica visual para preços riscados e descontos.
- `quantity-input-basic.tsx`: Componente de controle de estoque e quantidade.

### `src/components/products` (Camada de Módulos de Produto)
Módulos de alto nível que compõem a Prova Social e Vitrine:
- `ProductCard.tsx`: A unidade fundamental da vitrine com lógica de navegação programática.
- `ProductReviews.tsx`: Dashboard de notas e feedback.
- `ProductQuestions.tsx`: Seção de FAQ e interatividade de dúvidas.
- `ReviewForm.tsx`: O novo formulário de avaliação com upload de imagens.

### `src/lib` (Camada de Lógica e Dados)
O cérebro da aplicação:
- `/types/product.ts`: Definição de interface para garantir que nenhum dado de produto falte em nenhuma página.
- `mock-data.ts`: O "Banco de Dados" simulado, onde centralizamos todas as informações de produtos, fotos e variações.
- `utils.ts`: Utilitários de manipulação de classes CSS (clx/cn).

---

## 3. Por que fizemos assim?

### Por que folders como `commerce-ui`?
Separamos a UI comum (botões/cartões) da UI de comércio (visualizadores de produto) para que possamos escalar o projeto. Se amanhã decidirmos ter 3 tipos de visualizadores de imagem diferentes, eles estarão organizados em um lugar só.

### Por que o `mock-data.ts` é tão grande?
Diferente de placeholders genéricos, usamos dados reais (cores, descrições reais, imagens de alta qualidade) para que o design não "quebre" quando for substituído por uma API real. O design é feito sobre dados reais.

---

> [!IMPORTANT]
> Esta arquitetura foi projetada para ser **State-of-the-Art** em Next.js, com foco em SEO, Performance e uma estética que "wowa" o usuário final desde o primeiro clique na vitrine até o review final após a compra.
