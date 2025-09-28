import { createRouter, createWebHistory } from 'vue-router'
import { initPostHog, events } from '../analytics/posthog'

// Lazy-loaded route components
const LoginPage = () => import('../pages/auth/LoginPage.vue')
const ResetPasswordPage = () => import('../pages/auth/ResetPasswordPage.vue')
const DashboardPage = () => import('../pages/dashboard/DashboardPage.vue')
const LeadsPage = () => import('../pages/leads/LeadsPage.vue')
const LeadDetailPage = () => import('../pages/leads/LeadDetailPage.vue')
const SessionPage = () => import('../pages/leads/SessionPage.vue')
const SeoInsightsPage = () => import('../pages/insights/SeoInsightsPage.vue')
const ProductInsightsPage = () => import('../pages/insights/ProductInsightsPage.vue')
const SearchInsightsPage = () => import('../pages/insights/SearchInsightsPage.vue')
const SearchTermDetailPage = () => import('../pages/insights/SearchTermDetailPage.vue')
const PathsInsightsPage = () => import('../pages/insights/PathsInsightsPage.vue')
const SettingsPage = () => import('../pages/settings/SettingsPage.vue')
const AppShell = () => import('../components/layout/AppShell.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordPage,
      meta: { public: true },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: AppShell,
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardPage },
        { path: 'leads', name: 'leads', component: LeadsPage },
        { path: 'leads/:id', name: 'lead-detail', component: LeadDetailPage, props: true },
        { path: 'sessions/:id', name: 'session', component: SessionPage, props: true },
        { path: 'insights/seo', name: 'seo-insights', component: SeoInsightsPage },
        { path: 'insights/search', name: 'search-insights', component: SearchInsightsPage },
        {
          path: 'insights/search/:term',
          name: 'search-term',
          component: SearchTermDetailPage,
          props: true,
        },
        { path: 'insights/paths', name: 'paths-insights', component: PathsInsightsPage },
        { path: 'insights/products', name: 'product-insights', component: ProductInsightsPage },
        { path: 'settings', name: 'settings', component: SettingsPage },
      ],
    },
  ],
})

// Simple auth guard using localStorage token
router.beforeEach((to) => {
  if (to.meta.public) return true
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')
  if (!hasToken) {
    if (to.path !== '/auth/login') {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

// Init analytics and manual page tracking
initPostHog()
router.afterEach((to) => {
  events.page_view(to.fullPath)
})

export default router
