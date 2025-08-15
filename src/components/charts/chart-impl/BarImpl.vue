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
  props: { labels: Array, data: Array },
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
          datasets: [
            {
              label: 'Count',
              data: props.data,
              backgroundColor: ['#16a34a', '#84cc16', '#a3e635', '#f97316'],
            },
          ],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      })
    }
    onMounted(render)
    watch(() => [props.labels, props.data], render, { deep: true })
    return { canvasRef }
  },
}
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-48"></canvas>
</template>

<style scoped></style>
