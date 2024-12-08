import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'ecommerce';

let client: MongoClient;

async function getMongoClient() {
  if (!client) {
    client = await MongoClient.connect(uri);
  }
  return client;
}

interface MongoProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface MongoSale {
  _id: string;
  productId: string;
  totalSold: number;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    console.log('Received query params:', req.query);
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'name';
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? -1 : 1;
    const search = (req.query.search as string) || '';

    console.log('Parsed params:', { page, limit, sortBy, sortOrder, search });

    const skip = (page - 1) * limit;
    const client = await getMongoClient();
    const db = client.db(dbName);

    
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Get total count for pagination
    const total = await db.collection('products').countDocuments(searchQuery);
    console.log('Total products found:', total);

    // Récupérer les produits avec pagination et tri
    const products = await db.collection<MongoProduct>('products')
      .find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log('Products found:', products.length);

    // Agréger les ventes pour chaque produit
    const productIds = products.map(p => p._id);
    const sales = await db.collection('sales')
      .aggregate<MongoSale>([
        {
          $match: {
            productId: { $in: productIds }
          }
        },
        {
          $group: {
            _id: '$productId',
            totalSold: { $sum: '$quantity' }
          }
        }
      ]).toArray();

    console.log('Sales aggregation:', sales);

    // Créer une map des ventes par ProductID
    const salesMap = new Map<string, number>();
    sales.forEach(sale => {
      salesMap.set(sale._id.toString(), sale.totalSold);
    });

    // Construire la liste des produits avec leurs ventes totales
    const productList = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      totalSales: salesMap.get(product._id.toString()) || 0
    }));

    const totalPages = Math.ceil(total / limit);
    console.log('Pagination:', { total, page, limit, totalPages });

    const response = {
      products: productList,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Erreur dans getProducts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
