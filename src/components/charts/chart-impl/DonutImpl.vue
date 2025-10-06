<script>
import { onMounted, ref, watch } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto'
Chart.register(ArcElement, Tooltip, Legend)

export default {
  name: 'DonutImpl',
  props: { labels: Array, data: Array },
  setup(props) {
    const canvasRef = ref(null)
    let chart
    const render = () => {
      if (!canvasRef.value) return
      if (chart) chart.destroy()
      chart = new Chart(canvasRef.value, {
        type: 'doughnut',
        data: {
          labels: props.labels,
          datasets: [
            {
              data: props.data,
              backgroundColor: ['#a3e635', '#15803d', '#f59e0b', '#e5e7eb'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // Slightly larger cutout on mobile for better readability
          cutout: '72%',
          plugins: { legend: { display: false } },
        },
      })
    }
    onMounted(render)
    watch(() => [props.labels, props.data], render, { deep: true })
    return { canvasRef }
  },
}
</script>

<template>
  <div class="h-[260px]">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped></style>
