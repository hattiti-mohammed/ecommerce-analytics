<script setup lang="ts">
import { ref } from 'vue';
import { DATE_RANGES } from '@/types';
import TotalSales from '@/components/dashboard/TotalSales.vue';
import TopProducts from '@/components/dashboard/TopProducts.vue';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution.vue';
import ProductsTable from '@/components/dashboard/ProductsTable.vue';

const selectedPeriod = ref<string>('30');
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Tableau de Bord</h1>
      <div class="period-selector">
        <label for="period">Période :</label>
        <select id="period" v-model="selectedPeriod">
          <option v-for="range in DATE_RANGES" :key="range.value" :value="range.value">
            {{ range.label }}
          </option>
        </select>
      </div>
    </header>

    <div class="dashboard-grid">
      <div class="total-sales-section">
        <TotalSales :period="selectedPeriod" />
      </div>

      <div class="top-products-section">
        <TopProducts :period="selectedPeriod" />
      </div>

      <div class="category-distribution-section">
        <CategoryDistribution :period="selectedPeriod" />
      </div>

      <div class="products-table-section">
        <ProductsTable />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.period-selector label {
  color: #666;
}

.period-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.total-sales-section {
  grid-column: 1 / -1;
}

.top-products-section,
.category-distribution-section {
  min-height: 400px;
}

.products-table-section {
  grid-column: 1 / -1;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .top-products-section,
  .category-distribution-section {
    grid-column: 1 / -1;
  }
}
</style> 