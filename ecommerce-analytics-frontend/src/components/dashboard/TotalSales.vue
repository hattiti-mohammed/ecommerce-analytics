<template>
  <div class="total-sales-card">
    <h3>Ventes Totales</h3>
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    <div v-else class="amount">
      {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalSales) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { api } from '@/services/api';

const props = defineProps<{
  period: string;
}>();

const totalSales = ref<number>(0);
const loading = ref<boolean>(false);

const fetchTotalSales = async () => {
  loading.value = true;
  try {
    totalSales.value = await api.getTotalSales(props.period);
  } catch (error) {
    console.error('Error fetching total sales:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => props.period, () => {
  fetchTotalSales();
});

onMounted(() => {
  fetchTotalSales();
});
</script>

<style scoped>
.total-sales-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  color: #42b983;
}

.loading {
  color: #666;
  font-style: italic;
}
</style> 