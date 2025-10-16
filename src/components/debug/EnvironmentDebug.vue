<template>
  <div class="card p-3 sm:p-4 bg-yellow-50 border border-yellow-200">
    <h3 class="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">🔍 Environment Debug</h3>
    <div class="text-xs sm:text-sm space-y-1">
      <div><strong>VITE_MOCK_MODE:</strong> {{ mockMode }}</div>
      <div><strong>VITE_API_BASE_URL:</strong> {{ apiBaseUrl }}</div>
      <div><strong>PROD Mode:</strong> {{ isProd }}</div>
      <div><strong>Using Live Data:</strong> {{ usingLiveData ? '✅ Yes' : '❌ No' }}</div>
      <div><strong>API Calls Made:</strong> {{ apiCallCount }}</div>
    </div>
    <button
      @click="testApiCall"
      class="mt-2 btn-primary px-2.5 py-1 text-xs sm:text-sm"
      :disabled="testing"
    >
      {{ testing ? 'Testing...' : 'Test API Call' }}
    </button>
    <div v-if="testResult" class="mt-2 p-2 bg-slate-100 rounded text-[10px] sm:text-xs">
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<script>
import api from '../../services/api'

export default {
  name: 'EnvironmentDebug',
  data() {
    return {
      mockMode: import.meta.env.VITE_MOCK_MODE,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      isProd: import.meta.env.PROD,
      usingLiveData: String(import.meta.env.VITE_MOCK_MODE || '').toLowerCase() === 'false',
      apiCallCount: 0,
      testing: false,
      testResult: null,
    }
  },
  methods: {
    async testApiCall() {
      this.testing = true
      this.testResult = null

      try {
        console.log('🧪 Testing API call to:', api.defaults.baseURL)
        const response = await api.post('', {
          query: 'SELECT 1 as test',
        })
        this.testResult = {
          success: true,
          data: response.data,
          status: response.status,
        }
        this.apiCallCount++
      } catch (error) {
        this.testResult = {
          success: false,
          error: error.message,
          details: error.response?.data,
        }
      } finally {
        this.testing = false
      }
    },
  },
}
</script>
