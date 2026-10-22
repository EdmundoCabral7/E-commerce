import { Prisma, Product } from "@prisma/client";
import prisma from "../config/prisma";

export class ProductRepository {
    async findById(id: string, orgId?: string): Promise<Product | null> {
        return prisma.product.findFirst({
            where: {
                id,
                ...(orgId ? { organizationId: orgId } : {})
            },
        });
    }

    async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
        return prisma.product.create({
            data,
        });
    }

    async update(id: string, data: Prisma.ProductUpdateInput, orgId?: string): Promise<Product> {
        // Se houver orgId, validamos a propriedade antes de atualizar
        if (orgId) {
            const product = await this.findById(id, orgId);
            if (!product) throw new Error('Produto não encontrado ou acesso negado.');
        }

        return prisma.product.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, orgId?: string): Promise<Product> {
        // Se houver orgId, validamos a propriedade antes de deletar
        if (orgId) {
            const product = await this.findById(id, orgId);
            if (!product) throw new Error('Produto não encontrado ou acesso negado.');
        }

        return prisma.product.delete({
            where: { id },
        });
    }

    /**
     * Lista produtos com filtros, paginação e inclusões dinâmicas.
     * Retorna os itens e o total para paginação.
     */
    async findAll(params: {
        where?: Prisma.ProductWhereInput;
        skip?: number;
        take?: number;
        include?: Prisma.ProductInclude;
    }) {
        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where: params.where,
                skip: params.skip,
                take: params.take,
                include: {
                    category: true,
                    ...params.include
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: params.where })
        ]);

        return { items, total };
    }
}




