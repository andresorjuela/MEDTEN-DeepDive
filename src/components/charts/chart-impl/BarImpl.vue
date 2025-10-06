<script>
import { onMounted, ref, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js/auto'
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default {
  name: 'BarImpl',
  props: { labels: Array, datasets: Array },
  setup(props) {
    const canvasRef = ref(null)
    let chart
    const render = () => {
      if (!canvasRef.value) return
      if (chart) chart.destroy()
      chart = new Chart(canvasRef.value, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: (props.datasets || []).map((d) => ({
            label: d.label,
            data: d.data,
            backgroundColor: d.color,
            borderRadius: 6,
            // Let Chart.js size bars responsively; cap their size for small screens
            barThickness: 'flex',
            maxBarThickness: 18,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#e7ebea' }, ticks: { display: false } },
          },
        },
      })
    }
    onMounted(render)
    watch(() => [props.labels, props.datasets], render, { deep: true })
    return { canvasRef }
  },
}
</script>

<template>
  <div class="h-[220px]">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped></style>
