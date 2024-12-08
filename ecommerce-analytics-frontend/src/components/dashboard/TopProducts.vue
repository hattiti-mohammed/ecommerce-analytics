<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { api } from '@/services/api';
import type { TrendingProduct } from '@/types';
import BarChart from '@/components/charts/BarChart.vue';

const props = defineProps<{
  period: string;
}>();

const trendingProducts = ref<TrendingProduct[]>([]);
const loading = ref<boolean>(false);

const fetchTrendingProducts = async () => {
  loading.value = true;
  try {
    trendingProducts.value = await api.getTrendingProducts(props.period);
  } catch (error) {
    console.error('Error fetching trending products:', error);
  } finally {
    loading.value = false;
  }
};

const chartLabels = computed(() => trendingProducts.value.map(p => p.name));
const chartData = computed(() => trendingProducts.value.map(p => p.quantitySold));

watch(() => props.period, () => {
  fetchTrendingProducts();
});

onMounted(() => {
  fetchTrendingProducts();
});
</script>

<template>
  <div class="top-products-card">
    <h3>Produits les Plus Vendus</h3>
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    <div v-else>
      <BarChart
        :labels="chartLabels"
        :data="chartData"
        title="Quantités Vendues"
      />
      <div class="products-list">
        <div v-for="product in trendingProducts" :key="product.name" class="product-item">
          <span class="product-name">{{ product.name }}</span>
          <span class="product-quantity">{{ product.quantitySold }} unités</span>
          <span class="product-sales">
            {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.totalSales) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-products-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.loading {
  color: #666;
  font-style: italic;
}

.products-list {
  margin-top: 20px;
}

.product-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-name {
  font-weight: 500;
}

.product-quantity {
  text-align: center;
  color: #666;
}

.product-sales {
  text-align: right;
  color: #42b983;
  font-weight: 500;
}
</style> 