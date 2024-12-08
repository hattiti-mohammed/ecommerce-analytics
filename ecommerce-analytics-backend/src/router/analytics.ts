import { Router } from 'express';
import { getTotalSales,getTrendingProducts , getCategorySales } from '../controllers/analyticsController';

const router = Router();

// GET /analytics/total_sales - Récupérer le montant total des ventes pour une période
router.get('/total_sales', getTotalSales);

// GET /analytics/trending_products - Récupérer les produits les plus vendus
router.get('/trending_products', getTrendingProducts);

// GET /analytics/category_sales - Récupérer la répartition des ventes par catégorie
router.get('/category_sales', getCategorySales);

export default router;
