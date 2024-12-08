export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  totalSales: number;
}

export interface TrendingProduct {
  name: string;
  quantitySold: number;
  totalSales: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

export interface DateRange {
  value: string;
  label: string;
}

export const DATE_RANGES: DateRange[] = [
  { value: '7', label: '7 derniers jours' },
  { value: '30', label: '30 derniers jours' },
  { value: '365', label: '12 derniers mois' }
]; 