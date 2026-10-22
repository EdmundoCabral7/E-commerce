import prisma from '../../config/prisma';

/**
 * Serviço de Dashboard Administrativo.
 * Consolida métricas de diferentes módulos filtradas pela organização.
 */
export class DashboardService {
    /**
     * Retorna um resumo estatístico da organização.
     */
    async getMetrics(orgId: string) {
        const [
            totalProducts,
            stockStats,
            totalReviews,
            pendingQuestions,
            totalSalesVolume
        ] = await Promise.all([
            // Total de produtos cadastrados
            prisma.product.count({ 
                where: { organizationId: orgId } 
            }),
            
            // Soma total de estoque
            prisma.product.aggregate({
                where: { organizationId: orgId },
                _sum: { stock: true }
            }),
            
            // Engajamento: Avaliações recebidas
            prisma.productReview.count({
                where: { product: { organizationId: orgId } }
            }),
            
            // Atenção: Perguntas sem resposta
            prisma.productQuestion.count({
                where: { 
                    product: { organizationId: orgId },
                    answer: null
                }
            }),

            // Vendas: Volume total de itens vendidos através desta organização
            prisma.orderItem.aggregate({
                where: { product: { organizationId: orgId } },
                _sum: { quantity: true }
            })
        ]);

        return {
            products: {
                total: totalProducts,
                totalStock: stockStats._sum.stock || 0
            },
            engagement: {
                totalReviews,
                pendingQuestions
            },
            sales: {
                totalItemsSold: totalSalesVolume._sum.quantity || 0
            },
            timestamp: new Date().toISOString()
        };
    }
}
