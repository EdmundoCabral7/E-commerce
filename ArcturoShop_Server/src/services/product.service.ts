import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDTO } from '../schemas/product.schema';
import { AppError } from '../middlewares/errorHandler';
import { Prisma } from '@prisma/client';
import { deleteImage } from '../config/cloudinary';

const productRepository = new ProductRepository();

function buildSearchConditions(search: string): Prisma.ProductWhereInput[] {
  const words = search.trim().split(/\s+/).filter((w) => w.length > 0);
  const conditions: Prisma.ProductWhereInput[] = [];

  for (const word of words) {
    conditions.push({ name: { contains: word, mode: 'insensitive' } });
    conditions.push({ description: { contains: word, mode: 'insensitive' } });

    if (word.length > 4) {
      const stem = word.slice(0, Math.ceil(word.length * 0.8));
      conditions.push({ name: { startsWith: stem, mode: 'insensitive' } });
      conditions.push({ description: { startsWith: stem, mode: 'insensitive' } });
    }
  }

  if (words.length > 1) {
    conditions.push({ name: { contains: search, mode: 'insensitive' } });
    conditions.push({ description: { contains: search, mode: 'insensitive' } });
  }

  return conditions;
}

export class ProductService {
  /**
   * Cria um novo produto com suporte a múltiplas imagens.
   */
  async create(data: CreateProductDTO, files: Express.Multer.File[]) {
    const images = files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const product = await productRepository.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      organizationId: data.organizationId,
      images: images as Prisma.InputJsonValue,
      isActive: data.isActive,
      imageUrl: images.length > 0 ? images[0].url : null,
    });

    return product;
  }

  /**
   * Atualiza um produto. Se novas imagens forem enviadas, remove as antigas do Cloudinary.
   */
  async update(id: string, data: Partial<CreateProductDTO>, files?: Express.Multer.File[]) {
    const product = await this.getById(id);

    let imagesData = product.images as any[] || [];

    if (files && files.length > 0) {
      // Limpeza das imagens antigas no Cloudinary
      if (Array.isArray(imagesData)) {
        for (const img of imagesData) {
          if (img.public_id) await deleteImage(img.public_id);
        }
      }

      // Novas imagens processadas
      imagesData = files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    return productRepository.update(id, {
      ...data,
      images: imagesData as Prisma.InputJsonValue,
      imageUrl: imagesData.length > 0 ? imagesData[0].url : undefined,
    });
  }

  /**
   * Remove um produto e limpa suas imagens no Cloudinary.
   */
  async delete(id: string) {
    const product = await this.getById(id);
    const imagesData = product.images as any[] || [];

    // Limpeza no Cloudinary
    if (Array.isArray(imagesData)) {
      for (const img of imagesData) {
        if (img.public_id) await deleteImage(img.public_id);
      }
    }

    return productRepository.delete(id);
  }

  /**
   * Alterna o status ativo/inativo do produto.
   */
  async toggleStatus(id: string) {
    const product = await this.getById(id);
    return productRepository.update(id, {
      isActive: !product.isActive,
    });
  }

  /**
   * Lista produtos para a vitrine pública com filtros e paginação.
   */
  async findAllPublic(filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    organizationId?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 100;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      stock: { gt: 0 },
      ...(filters.organizationId && { organizationId: filters.organizationId }),
      ...(filters.category && { categoryId: filters.category }),
      ...(filters.search && {
        OR: buildSearchConditions(filters.search),
      }),
      ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      }),
    };

    const { items: textItems, total } = await productRepository.findAll({
      where,
      skip,
      take: limit
    });

    let items = textItems;

    if (filters.search && !filters.category && textItems.length > 0 && textItems.length < limit) {
      const categoryIds = [
        ...new Set(
          textItems
            .map((p) => (p as { categoryId?: string }).categoryId)
            .filter(Boolean) as string[]
        ),
      ];

      if (categoryIds.length > 0) {
        const { items: related } = await productRepository.findAll({
          where: {
            isActive: true,
            stock: { gt: 0 },
            categoryId: { in: categoryIds },
            id: { notIn: textItems.map((p) => p.id) },
            ...(filters.organizationId && { organizationId: filters.organizationId }),
          },
          skip: 0,
          take: limit - textItems.length,
        });
        items = [...textItems, ...related];
      }
    }

    return {
      items,
      meta: {
        total: items.length > total ? items.length : total,
        pages: Math.ceil((items.length > total ? items.length : total) / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Lista produtos para o painel administrativo global.
   */
  async findAllAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const { items, total } = await productRepository.findAll({
      skip,
      take: limit,
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    // Formata o retorno para incluir o totalSold de forma clara
    const formattedItems = items.map((item: any) => {
      const { _count, ...rest } = item;
      return {
        ...rest,
        totalSold: _count?.orderItems || 0,
      };
    });

    return {
      items: formattedItems,
      meta: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async getById(id: string) {
    // Usamos o include do repositório que já traz a categoria
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Produto não encontrado', 404);
    return product;
  }
}
