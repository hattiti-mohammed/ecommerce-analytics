<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { api } from '@/services/api';
import type { CategorySales } from '@/types';
import PieChart from '@/components/charts/PieChart.vue';

const props = defineProps<{
  period: string;
}>();

const categorySales = ref<CategorySales[]>([]);
const loading = ref<boolean>(false);

const fetchCategorySales = async () => {
  loading.value = true;
  try {
    categorySales.value = await api.getCategorySales(props.period);
  } catch (error) {
    console.error('Error fetching category sales:', error);
  } finally {
    loading.value = false;
  }
};

const chartLabels = computed(() => categorySales.value.map(c => c.category));
const chartData = computed(() => categorySales.value.map(c => c.sales));

watch(() => props.period, () => {
  fetchCategorySales();
});

onMounted(() => {
  fetchCategorySales();
});
</script>

<template>
  <div class="category-distribution-card">
    <h3>Répartition des Ventes par Catégorie</h3>
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    <div v-else>
      <PieChart
        :labels="chartLabels"
        :data="chartData"
        title="Ventes par Catégorie"
      />
      <div class="categories-list">
        <div v-for="category in categorySales" :key="category.category" class="category-item">
          <span class="category-name">{{ category.category }}</span>
          <span class="category-sales">
            {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(category.sales) }}
          </span>
          <span class="category-percentage">
            {{ category.percentage.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-distribution-card {
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

.categories-list {
  margin-top: 20px;
}

.category-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  font-weight: 500;
}

.category-sales {
  text-align: center;
  color: #42b983;
}

.category-percentage {
  text-align: right;
  color: #666;
  font-weight: 500;
}
</style> 