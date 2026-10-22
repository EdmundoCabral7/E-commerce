import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import favoriteRoutes from './favorite.routes';
import adminRoutes from './org/admin.routes';
import globalAdminRoutes from './admin.routes';
import orgPublicRoutes from './org-public.routes';

import categoryRoutes from './category.routes';
import promotionRoutes from './promotion.routes';
import saleRoutes from './sale.routes';

const router = Router();

// Roteador central
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/org/:orgId/categories', categoryRoutes);
router.use('/org/:orgId/promotions', promotionRoutes);
router.use('/org/:orgId/sales', saleRoutes);
router.use('/org/:orgId', orgPublicRoutes);
router.use('/org/:orgId', adminRoutes);
router.use('/admin', globalAdminRoutes);

export default router;
