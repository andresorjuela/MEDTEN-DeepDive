<script setup>
import { ref } from 'vue'

const features = ref([
  {
    title: 'Modern Vue 3',
    description:
      'Built with the latest Vue 3 Composition API for optimal performance and developer experience.',
    icon: '⚡',
  },
  {
    title: 'Tailwind CSS',
    description:
      'Utility-first CSS framework for rapid UI development with beautiful, responsive designs.',
    icon: '🎨',
  },
  {
    title: 'Vite Build Tool',
    description: 'Lightning-fast development server and optimized production builds.',
    icon: '🚀',
  },
  {
    title: 'Medical Focus',
    description:
      'Specialized for medical technology and healthcare innovation deep dive exploration.',
    icon: '🏥',
  },
])

const currentTime = ref(new Date().toLocaleString())

// Update time every second
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span class="text-white font-bold text-lg">M</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">MEDTEN DeepDive</h1>
          </div>
          <div class="text-sm text-gray-500 font-mono">
            {{ currentTime }}
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mb-8 shadow-2xl animate-pulse"
        >
          <span class="text-3xl">🔬</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to
          <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MEDTEN 🚀
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Dive deep into medical technology innovations, healthcare solutions, and cutting-edge
          research. Your gateway to exploring the intersection of medicine and technology.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Exploring
          </button>
          <button
            class="border-2 border-indigo-300 text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 hover:bg-white/90"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ feature.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-16">
        <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">Project Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">Vue 3</div>
            <div class="text-gray-600">Framework Version</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-cyan-600 mb-2">Tailwind 4</div>
            <div class="text-gray-600">CSS Framework</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">Vite</div>
            <div class="text-gray-600">Build Tool</div>
          </div>
        </div>
      </div>

      <!-- Links Section -->
      <div class="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-6 text-center">Useful Resources</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="https://vuejs.org/"
            target="_blank"
            rel="noopener"
            class="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-200 block"
          >
            <div class="font-semibold mb-2">Vue.js Documentation</div>
            <div class="text-blue-100 text-sm">Official Vue.js guide and API reference</div>
          </a>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener"
            class="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-200 block"
          >
            <div class="font-semibold mb-2">Tailwind CSS</div>
            <div class="text-blue-100 text-sm">Utility-first CSS framework documentation</div>
          </a>
          <a
            href="https://vitejs.dev/"
            target="_blank"
            rel="noopener"
            class="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-200 block"
          >
            <div class="font-semibold mb-2">Vite</div>
            <div class="text-blue-100 text-sm">Next generation frontend tooling</div>
          </a>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500">
          <p>&copy; 2024 MEDTEN DeepDive. Built with Vue 3, Tailwind CSS, and ❤️</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
