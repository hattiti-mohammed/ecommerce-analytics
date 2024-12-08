import { Router } from 'express';
import { getProducts } from '../controllers/productController';

const router = Router();

// GET /products - Récupérer tous les produits avec leurs ventes totales
router.get('/', getProducts);

export default router;
