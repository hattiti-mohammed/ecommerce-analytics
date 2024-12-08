import axios, { AxiosError } from 'axios';
import type { Product, TrendingProduct, CategorySales } from '@/types';

const API_BASE_URL = 'http://localhost:5000';

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

function validateProductsResponse(data: any): data is ProductsResponse {
  return (
    data &&
    Array.isArray(data.products) &&
    typeof data.pagination === 'object' &&
    typeof data.pagination.total === 'number' &&
    typeof data.pagination.page === 'number' &&
    typeof data.pagination.limit === 'number' &&
    typeof data.pagination.totalPages === 'number'
  );
}

export const api = {
  async getTotalSales(period: string): Promise<number> {
    const response = await axios.get(`${API_BASE_URL}/analytics/total_sales`, {
      params: { period }
    });
    return response.data.total_sales;
  },

  async getTrendingProducts(period: string): Promise<TrendingProduct[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/trending_products`, {
      params: { period }
    });
    return response.data;
  },

  async getCategorySales(period: string): Promise<CategorySales[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/category_sales`, {
      params: { period }
    });
    return response.data;
  },

  async getProducts(params: ProductsParams = {}): Promise<ProductsResponse> {
    try {
      console.log('API getProducts called with params:', params);
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || 'name',
          sortOrder: params.sortOrder || 'asc',
          search: params.search || ''
        }
      });

      console.log('Raw API response:', response.data);

      if (!validateProductsResponse(response.data)) {
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', {
          message: error.message,
          response: (error as AxiosError)?.response?.data,
          status: (error as AxiosError)?.response?.status
        });
      }
      throw error;
    }
  }
}; 