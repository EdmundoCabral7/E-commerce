import "dotenv/config";
import { PrismaClient, OrgRole, Role } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpa na ordem correta para respeitar FK
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.productQuestion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.store.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Banco limpo.");

  // ─── Usuário lojista ───────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("senha123", 10);

  const owner = await prisma.user.create({
    data: {
      email: "lojista@arcturoshop.com",
      name: "Lojista ArcturoShop",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // ─── Organização ──────────────────────────────────────────────────────────
  const org = await prisma.organization.create({
    data: {
      name: "ArcturoShop",
      slug: "arcturoshop",
      ownerId: owner.id,
      members: {
        create: { userId: owner.id, role: OrgRole.OWNER },
      },
    },
  });

  // ─── Store ────────────────────────────────────────────────────────────────
  await prisma.store.create({
    data: {
      organizationId: org.id,
      theme: "dark",
    },
  });

  // ─── Categorias ───────────────────────────────────────────────────────────
  const categoriesData = [
    { name: "Moda Masculina",  slug: "moda-masculina",  description: "Roupas e acessórios masculinos" },
    { name: "Moda Feminina",   slug: "moda-feminina",   description: "Roupas e acessórios femininos" },
    { name: "Calçados",        slug: "calcados",        description: "Tênis, sapatênis e muito mais" },
    { name: "Acessórios",      slug: "acessorios",      description: "Bolsas, bonés e itens complementares" },
    { name: "Moda Fitness",    slug: "moda-fitness",    description: "Roupas para treino e exercícios" },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: { ...cat, organizationId: org.id },
      })
    )
  );

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // ─── Produtos ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: "Camisa Oversized Arcturo",
      description: "Camisa oversized de algodão premium, corte moderno e confortável para o dia a dia.",
      price: 149.90, stock: 87, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    },
    {
      name: "Calça Cargo Premium",
      description: "Calça cargo com múltiplos bolsos, tecido resistente e caimento perfeito.",
      price: 289.90, stock: 5, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    },
    {
      name: "Tênis Urban Low",
      description: "Tênis cano baixo com sola de borracha e palmilha anatômica para máximo conforto.",
      price: 399.90, stock: 32, categoryId: catMap["calcados"],
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    },
    {
      name: "Jaqueta Corta Vento",
      description: "Jaqueta corta-vento leve e impermeável, ideal para atividades ao ar livre.",
      price: 229.90, stock: 0, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
    },
    {
      name: "Boné Trucker Arcturo",
      description: "Boné trucker com tela traseira e aba reta, estilo streetwear.",
      price: 79.90, stock: 12, categoryId: catMap["acessorios"],
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    },
    {
      name: "Camiseta Básica Algodão",
      description: "Camiseta básica de algodão 100%, corte regular, disponível em várias cores.",
      price: 89.90, stock: 180, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
    },
    {
      name: "Bermuda Moletom Street",
      description: "Bermuda de moletom com elástico na cintura, estilo casual e confortável.",
      price: 169.90, stock: 22, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    },
    {
      name: "Tênis High Top Retro",
      description: "Tênis cano alto com design retrô, solado vulcanizado e cabedal em lona.",
      price: 459.90, stock: 15, categoryId: catMap["calcados"],
      imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    },
    {
      name: "Moletom Canguru Arcturo",
      description: "Moletom canguru com capuz, bolso frontal e tecido felpado por dentro.",
      price: 299.90, stock: 67, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    },
    {
      name: "Top Esportivo Lycra",
      description: "Top esportivo de lycra com suporte médio, ideal para yoga e pilates.",
      price: 99.90, stock: 88, categoryId: catMap["moda-fitness"],
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    },
    {
      name: "Legging Cintura Alta",
      description: "Legging de cintura alta com compressão leve e tecido de secagem rápida.",
      price: 139.90, stock: 34, categoryId: catMap["moda-fitness"],
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    },
    {
      name: "Sapatênis Casual",
      description: "Sapatênis com solado de borracha e cabedal em couro sintético.",
      price: 279.90, stock: 5, categoryId: catMap["calcados"],
      imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    },
    {
      name: "Polo Premium Algodão Pima",
      description: "Polo masculina de algodão Pima com botões de madrepérola e tecido extra-macio.",
      price: 189.90, stock: 99, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
    },
    {
      name: "Mochila Urbana Minimalista",
      description: "Mochila urbana com compartimento para notebook de 15\", alças acolchoadas.",
      price: 189.90, stock: 25, categoryId: catMap["acessorios"],
      imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80",
    },
    {
      name: "Jaqueta Jeans Slim Fit",
      description: "Jaqueta jeans slim fit com lavagem stone e botões metálicos.",
      price: 349.90, stock: 12, categoryId: catMap["moda-masculina"],
      imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
    },
    {
      name: "Short Tactel Esportivo",
      description: "Short de tactel com elástico e cordão, bolsos laterais e tecido leve.",
      price: 119.90, stock: 75, categoryId: catMap["moda-fitness"],
      imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80",
    },
    {
      name: "Camiseta Dry Fit",
      description: "Camiseta de dry fit com tecnologia de absorção de suor para treinos intensos.",
      price: 89.90, stock: 133, categoryId: catMap["moda-fitness"],
      imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    },
    {
      name: "Tênis Slip On",
      description: "Tênis slip-on sem cadarço, solado de EVA e elástico lateral para fácil calçada.",
      price: 259.90, stock: 8, categoryId: catMap["calcados"],
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
    },
    {
      name: "Blusa Cropped Feminina",
      description: "Blusa cropped de ribana com alças finas e acabamento franzido na barra.",
      price: 69.90, stock: 110, categoryId: catMap["moda-feminina"],
      imageUrl: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80",
    },
    {
      name: "Vestido Midi Floral",
      description: "Vestido midi com estampa floral, tecido viscose e decote V.",
      price: 199.90, stock: 45, categoryId: catMap["moda-feminina"],
      imageUrl: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
    },
  ];

  await Promise.all(
    products.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          imageUrl: p.imageUrl,
          images: [{ url: p.imageUrl }],
          categoryId: p.categoryId,
          organizationId: org.id,
        },
      })
    )
  );

  console.log(`✅ Criados: 1 lojista, 1 organização, ${categories.length} categorias, ${products.length} produtos.`);
  console.log("");
  console.log("📧 Login: lojista@arcturoshop.com");
  console.log("🔑 Senha: senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
