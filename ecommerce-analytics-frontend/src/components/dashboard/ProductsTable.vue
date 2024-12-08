<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api, type ProductsParams, type ProductsResponse } from '@/services/api';
import type { Product } from '@/types';

const products = ref<Product[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(0);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const sortBy = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const searchQuery = ref('');

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params: ProductsParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      search: searchQuery.value
    };
    
    console.log('Fetching products with params:', params);
    const response = await api.getProducts(params);
    console.log('API Response:', response);

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }

    if (!response.products || !Array.isArray(response.products)) {
      throw new Error('Products data is missing or invalid');
    }

    if (!response.pagination || typeof response.pagination !== 'object') {
      throw new Error('Pagination data is missing or invalid');
    }

    products.value = response.products;
    totalPages.value = response.pagination.totalPages;
    totalItems.value = response.pagination.total;
    
    console.log('Updated state:', {
      products: products.value.length,
      totalPages: totalPages.value,
      totalItems: totalItems.value
    });
  } catch (err) {
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    error.value = 'Une erreur est survenue lors du chargement des produits.';
    products.value = [];
    totalPages.value = 0;
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
  fetchProducts();
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchProducts();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProducts();
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="products-table-card">
    <div class="table-header">
      <h3>Liste des Produits</h3>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Chargement...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th @click="handleSort('name')" class="sortable">
                Nom du Produit
                <span class="sort-icon" v-if="sortBy === 'name'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="handleSort('category')" class="sortable">
                Catégorie
                <span class="sort-icon" v-if="sortBy === 'category'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="handleSort('price')" class="sortable">
                Prix
                <span class="sort-icon" v-if="sortBy === 'price'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="handleSort('totalSales')" class="sortable">
                Ventes Totales
                <span class="sort-icon" v-if="sortBy === 'totalSales'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price) }}</td>
              <td>{{ product.totalSales }} unités</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 0" class="pagination">
        <div class="pagination-info">
          Affichage {{ (currentPage - 1) * itemsPerPage + 1 }} - 
          {{ Math.min(currentPage * itemsPerPage, totalItems) }} 
          sur {{ totalItems }} produits
        </div>
        <div class="pagination-controls">
          <button 
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
            class="pagination-button"
          >
            Précédent
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="handlePageChange(page)"
              :class="['page-number', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
          </span>
          <button 
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
            class="pagination-button"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-table-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.search-bar {
  flex: 0 0 300px;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.loading {
  color: #666;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 0;
}

.error-message {
  color: #dc3545;
  text-align: center;
  padding: 20px;
  background-color: #f8d7da;
  border-radius: 4px;
  margin: 20px 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #e9ecef;
}

.sort-icon {
  margin-left: 5px;
  color: #42b983;
}

tr:hover {
  background-color: #f8f9fa;
}

td {
  color: #666;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #f8f9fa;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;
}

.page-number.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.page-number:not(.active):hover {
  background-color: #f8f9fa;
}
</style> 