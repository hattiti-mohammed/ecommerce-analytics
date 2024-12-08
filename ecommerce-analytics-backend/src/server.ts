import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { getProducts } from './controllers/productController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = 'ecommerce';

app.use(cors());
app.use(express.json());

// Configuration Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let client: MongoClient;

async function connectToDb() {
  try {
    client = await MongoClient.connect(uri);
    console.log('Connexion à MongoDB réussie');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

function getDateRange(periodStr: string | undefined): { start: Date; end: Date } {
  const period = Number(periodStr || '30');
  const end = new Date('2023-12-31'); 
  const start = new Date(end);
  start.setDate(end.getDate() - period);
  return { start, end };
}

// Analytics endpoints
app.get('/analytics/total_sales', async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.period as string);

    console.log(`Période: ${req.query.period}, Start: ${start.toISOString()}, End: ${end.toISOString()}`);

    const sales = await client.db(dbName).collection('sales')
      .find({ saleDate: { $gte: start, $lte: end } })
      .toArray();

    console.log(`Nombre de ventes trouvées dans la période: ${sales.length}`);

    const totalSales = await client.db(dbName).collection('sales')
      .aggregate([
        { $match: { saleDate: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).toArray();

    console.log('Résultat de l\'agrégation totalSales:', totalSales);

    res.json({ total_sales: totalSales[0]?.total || 0 });
  } catch (error) {
    console.error('Erreur dans getTotalSales:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/analytics/trending_products', async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.period as string);

    console.log(`Calcul des produits tendance pour la période du ${start.toISOString()} au ${end.toISOString()}`);

    const sales = await client.db(dbName).collection('sales')
      .find({ saleDate: { $gte: start, $lte: end } })
      .toArray();

    console.log(`Nombre de ventes trouvées dans la période: ${sales.length}`);

    const trendingProducts = await client.db(dbName).collection('sales')
      .aggregate([
        { $match: { saleDate: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: '$productId',
            quantitySold: { $sum: '$quantity' },
            totalSales: { $sum: '$totalAmount' }
          }
        },
        { $sort: { quantitySold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: 0,
            name: '$product.name',
            quantitySold: 1,
            totalSales: 1
          }
        }
      ]).toArray();

    console.log('Résultat de l\'agrégation trending:', trendingProducts);

    res.json(trendingProducts);
  } catch (error) {
    console.error('Erreur dans getTrendingProducts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/analytics/category_sales', async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.period as string);

    console.log(`Calcul des ventes par catégorie pour la période du ${start.toISOString()} au ${end.toISOString()}`);

    const sales = await client.db(dbName).collection('sales')
      .find({ saleDate: { $gte: start, $lte: end } })
      .toArray();

    console.log(`Nombre de ventes trouvées dans la période: ${sales.length}`);

    const categorySales = await client.db(dbName).collection('sales')
      .aggregate([
        { $match: { saleDate: { $gte: start, $lte: end } } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            sales: { $sum: '$totalAmount' }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$sales' },
            categories: { $push: { category: '$_id', sales: '$sales' } }
          }
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
                100
              ]
            }
          }
        }
      ]).toArray();

    console.log('Résultat de l\'agrégation categorySales:', categorySales);

    res.json(categorySales);
  } catch (error) {
    console.error('Erreur dans getCategorySales:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.get('/products', getProducts);


connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
  });
});
