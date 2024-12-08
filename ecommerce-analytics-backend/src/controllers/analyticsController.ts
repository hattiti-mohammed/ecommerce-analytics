import { Request, Response } from 'express';
import { subDays } from 'date-fns';
import Sale from '../models/sale';

// Fonction pour analyser la période et calculer les dates de début et de fin
const parseDateRange = (period: string): { start: Date; end: Date } => {
  const end = new Date();
  let start: Date;

  const periodNumber = parseInt(period, 10);

  switch (periodNumber) {
    case 7:
    case 30:
      start = subDays(end, periodNumber);
      break;
    case 365:
      start = new Date();
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start = subDays(end, 30);
  }

  console.log(`Période: ${period}, Start: ${start.toISOString()}, End: ${end.toISOString()}`);
  return { start, end };
};

/**
 * Contrôleur pour obtenir le montant total des ventes sur une période donnée.
 */
export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || '30';
    const { start, end } = parseDateRange(period);

    
    const salesInPeriod = await Sale.find({ saleDate: { $gte: start, $lte: end } });
    console.log(`Nombre de ventes trouvées dans la période: ${salesInPeriod.length}`);

    
    const totalSalesAggregation = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    console.log('Résultat de l\'agrégation totalSales:', totalSalesAggregation);

    
    res.json({ total_sales: totalSalesAggregation[0]?.total || 0 });
  } catch (error) {
    console.error('Erreur dans getTotalSales:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Contrôleur pour obtenir les produits tendance sur une période donnée.
 */
export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || '30';
    const { start, end } = parseDateRange(period);
    console.log(`Calcul des produits tendance pour la période du ${start.toISOString()} au ${end.toISOString()}`);

    
    const salesInPeriod = await Sale.find({ saleDate: { $gte: start, $lte: end } });
    console.log(`Nombre de ventes trouvées dans la période: ${salesInPeriod.length}`);

    
    const trendingAggregation = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$productId',
          quantitySold: { $sum: '$quantity' },
          totalSales: { $sum: '$totalAmount' },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          name: '$product.name',
          quantitySold: 1,
          totalSales: 1,
        },
      },
    ]);

    console.log('Résultat de l\'agrégation trending:', trendingAggregation);

    res.json(trendingAggregation);
  } catch (error) {
    console.error('Erreur dans getTrendingProducts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Contrôleur pour obtenir les ventes par catégorie sur une période donnée.
 */
export const getCategorySales = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || '30';
    const { start, end } = parseDateRange(period);
    console.log(`Calcul des ventes par catégorie pour la période du ${start.toISOString()} au ${end.toISOString()}`);

    
    const salesInPeriod = await Sale.find({ saleDate: { $gte: start, $lte: end } });
    console.log(`Nombre de ventes trouvées dans la période: ${salesInPeriod.length}`);

   
    const categorySalesAggregation = await Sale.aggregate([
      { $match: { saleDate: { $gte: start, $lte: end } } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          sales: { $sum: '$totalAmount' },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$sales' },
          categories: { $push: { category: '$_id', sales: '$sales' } },
        },
      },
      { $unwind: '$categories' },
      {
        $project: {
          _id: 0,
          category: '$categories.category',
          sales: '$categories.sales',
          percentage: {
            $multiply: [
              { $divide: ['$categories.sales', '$totalSales'] },
              100,
            ],
          },
        },
      },
    ]);

    console.log('Résultat de l\'agrégation categorySales:', categorySalesAggregation);

    res.json(categorySalesAggregation);
  } catch (error) {
    console.error('Erreur dans getCategorySales:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
