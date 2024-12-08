import express from 'express';
import cors from 'cors';
import analyticsRoutes from './router/analytics';
import productRoutes from './router/products';
import { errorHandler } from './middleware/errorHandler';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/analytics', analyticsRoutes);
app.use('/products', productRoutes);

// Documentation Swagger
try {
  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf-8'));
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  console.log('Swagger UI initialized successfully');
} catch (error) {
  console.error('Error initializing Swagger UI:', error);
}

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Gestion des erreurs globales
app.use(errorHandler);

export default app;
