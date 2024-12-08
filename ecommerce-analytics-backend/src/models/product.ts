import { Schema, model, Document } from 'mongoose';

interface IProduct extends Document {
  _id: string; 
  name: string; 
  category: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  _id: { type: String, required: true }, 
  name: { type: String, required: true }, 
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }
});

export default model<IProduct>('Product', productSchema);
