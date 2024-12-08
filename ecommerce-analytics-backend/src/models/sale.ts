import { Schema, model, Document } from 'mongoose';

interface ISale extends Document {
  saleId: string; 
  productId: string; 
  quantity: number;
  saleDate: Date;
  totalAmount: number;
}

const saleSchema = new Schema<ISale>({
  saleId: { type: String, required: true, unique: true }, 
  productId: { type: String, ref: 'Product', required: true }, 
  quantity: { type: Number, required: true, min: 1 },
  saleDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true, min: 0 }
});

export default model<ISale>('Sale', saleSchema);
