-- CreateEnum PromotionType (idempotente via DO)
DO $$ BEGIN
  CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FIXED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- DropIndex categories_name_key se existir
DROP INDEX IF EXISTS "categories_name_key";

-- AlterTable categories
ALTER TABLE "categories"
  ADD COLUMN IF NOT EXISTS "description" TEXT,
  ADD COLUMN IF NOT EXISTS "imagePublicId" TEXT,
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "slug" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "organizationId" TEXT NOT NULL DEFAULT '';

-- AlterTable order_items
ALTER TABLE "order_items"
  ADD COLUMN IF NOT EXISTS "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable orders
ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "buyerEmail" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "buyerName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "organizationId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "promotionId" TEXT;

DO $$ BEGIN
  ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- CreateTable promotions
CREATE TABLE IF NOT EXISTS "promotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PromotionType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minOrderValue" DECIMAL(65,30) DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable _ProductPromotions
CREATE TABLE IF NOT EXISTS "_ProductPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX IF NOT EXISTS "_ProductPromotions_B_index" ON "_ProductPromotions"("B");

DO $$ BEGIN
  CREATE UNIQUE INDEX "categories_organizationId_slug_key" ON "categories"("organizationId", "slug");
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE UNIQUE INDEX "categories_organizationId_name_key" ON "categories"("organizationId", "name");
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "categories" ADD CONSTRAINT "categories_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "orders" ADD CONSTRAINT "orders_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "_ProductPromotions" ADD CONSTRAINT "_ProductPromotions_A_fkey"
    FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "_ProductPromotions" ADD CONSTRAINT "_ProductPromotions_B_fkey"
    FOREIGN KEY ("B") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
