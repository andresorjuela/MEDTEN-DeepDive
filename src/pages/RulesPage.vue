<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div class="py-4 sm:py-6">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-forest-900 text-white grid place-items-center text-xs sm:text-sm font-bold"
            >
              M
            </div>
            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Lead Rules & KPI Definitions
            </h1>
          </div>
          <p class="text-sm sm:text-base text-gray-600">
            Understanding how leads are scored and KPIs are calculated
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <!-- Lead Scoring Rules -->
        <div class="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Lead Scoring Rules</h2>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div class="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  🔥
                </div>
                <h3 class="font-semibold text-red-800 text-sm sm:text-base">Hot Leads</h3>
              </div>
              <p class="text-red-700 text-xs sm:text-sm">
                Users who reached inquiry form or logged in successfully
              </p>
              <div class="mt-2 text-xs text-red-600">
                <strong>Events:</strong> <code class="text-xs">reached_inquiry_form</code>,
                <code class="text-xs">LOGIN_SUCCESS</code>
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  🌡️
                </div>
                <h3 class="font-semibold text-orange-800 text-sm sm:text-base">Warm Leads</h3>
              </div>
              <p class="text-orange-700 text-xs sm:text-sm">
                Users who opened PDFs or viewed multiple products
              </p>
              <div class="mt-2 text-xs text-orange-600">
                <strong>Events:</strong> <code class="text-xs">pdf_opened</code>,
                <code class="text-xs">product_viewed</code> (multiple)
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  ❄️
                </div>
                <h3 class="font-semibold text-blue-800 text-sm sm:text-base">Cold Leads</h3>
              </div>
              <p class="text-blue-700 text-xs sm:text-sm">
                Users who viewed products but didn't engage further
              </p>
              <div class="mt-2 text-xs text-blue-600">
                <strong>Events:</strong> <code class="text-xs">product_viewed</code> (single),
                <code class="text-xs">page_view</code>
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  💀
                </div>
                <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Lost Leads</h3>
              </div>
              <p class="text-gray-700 text-xs sm:text-sm">
                Users who exited forms or left without action
              </p>
              <div class="mt-2 text-xs text-gray-600">
                <strong>Events:</strong> <code class="text-xs">form_exit</code>,
                <code class="text-xs">page_view</code> (no engagement)
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Calculations -->
        <div class="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 text-green-600 grid place-items-center"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900">KPI Calculations</h2>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div class="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="font-semibold text-blue-800 mb-2 text-sm sm:text-base">👥 Total Visits</h3>
              <p class="text-blue-700 text-xs sm:text-sm mb-2">Count of all page view events</p>
              <div class="text-xs text-blue-600 bg-blue-100 p-2 rounded font-mono overflow-x-auto">
                SELECT count() FROM events WHERE event IN
                ('LANDING_PAGE_VIEW','$pageview','page_view','Pageview')
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 class="font-semibold text-green-800 mb-2 text-sm sm:text-base">
                📝 Inquiries Submitted
              </h3>
              <p class="text-green-700 text-xs sm:text-sm mb-2">
                Distinct users who viewed pages (potential inquiries)
              </p>
              <div
                class="text-xs text-green-600 bg-green-100 p-2 rounded font-mono overflow-x-auto"
              >
                SELECT count(DISTINCT distinct_id) FROM events WHERE event IN
                ('LANDING_PAGE_VIEW','$pageview','page_view','Pageview','product_viewed','product_page_viewed')
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="font-semibold text-red-800 mb-2 text-sm sm:text-base">📉 Drop Off Rate</h3>
              <p class="text-red-700 text-xs sm:text-sm mb-2">
                Percentage of users who didn't convert to login
              </p>
              <div class="text-xs text-red-600 bg-red-100 p-2 rounded font-mono overflow-x-auto">
                (Total Users - Converters) / Total Users × 100
              </div>
            </div>

            <div class="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 class="font-semibold text-orange-800 mb-2 text-sm sm:text-base">🔥 Hot Leads</h3>
              <p class="text-orange-700 text-xs sm:text-sm mb-2">
                Users with product views or login success
              </p>
              <div
                class="text-xs text-orange-600 bg-orange-100 p-2 rounded font-mono overflow-x-auto"
              >
                SELECT count(DISTINCT distinct_id) FROM events WHERE event IN
                ('product_viewed','LOGIN_SUCCESS','product_page_viewed')
              </div>
            </div>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:col-span-2">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 text-purple-600 grid place-items-center"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Data Sources & Events</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 class="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Tracked Events</h3>
              <div class="space-y-2">
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">page_view</code>
                  <span class="text-gray-600">Page visits</span>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">product_viewed</code>
                  <span class="text-gray-600">Product page views</span>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">pdf_opened</code>
                  <span class="text-gray-600">PDF downloads</span>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">reached_inquiry_form</code>
                  <span class="text-gray-600">Form interactions</span>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">LOGIN_SUCCESS</code>
                  <span class="text-gray-600">Successful logins</span>
                </div>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">form_exit</code>
                  <span class="text-gray-600">Form abandonment</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Data Collection</h3>
              <div class="space-y-2 text-xs sm:text-sm text-gray-600">
                <div>• Real-time data from PostHog</div>
                <div>• User behavior tracking</div>
                <div>• Event-based analytics</div>
                <div>• Distinct user identification</div>
                <div>• Time-based filtering</div>
                <div>• Conversion funnel analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesPage',
  meta: {
    title: 'Lead Rules & KPI Definitions',
  },
}
</script>

<style scoped>
code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
