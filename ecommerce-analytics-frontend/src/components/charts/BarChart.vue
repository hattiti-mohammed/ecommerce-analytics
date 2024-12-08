<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps<{
  labels: string[];
  data: number[];
  title: string;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createChart = () => {
  if (!chartRef.value) return;

  if (chart) {
    chart.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: props.title
        }
      }
    }
  });
};

watch(() => [props.labels, props.data], () => {
  createChart();
}, { deep: true });

onMounted(() => {
  createChart();
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style> 