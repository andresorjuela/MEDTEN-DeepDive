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
              backgroundColor: ['#16a34a', '#84cc16', '#0ea5e9', '#64748b'],
            },
          ],
        },
        options: { responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom' } } },
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
