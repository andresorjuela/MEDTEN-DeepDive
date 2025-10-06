<script>
import Icon from '../ui/Icon.vue'

export default {
  name: 'AppSidebar',
  components: {
    Icon,
  },
  data() {
    return {
      isMobileMenuOpen: false,
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    handleNavigation(navigate) {
      navigate()
      this.closeMobileMenu()
    },
  },
}
</script>

<template>
  <!-- Mobile Menu Button -->
  <button
    @click="toggleMobileMenu"
    class="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-forest-900 text-white rounded-lg shadow-lg touch-manipulation hover:bg-forest-800 transition-colors"
  >
    <Icon name="menu" :size="20" color="white" />
  </button>

  <!-- Mobile Overlay -->
  <div
    v-if="isMobileMenuOpen"
    @click="closeMobileMenu"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'bg-forest-900 text-white min-h-screen transition-transform duration-300 ease-in-out',
      // Desktop: always visible, takes space
      'lg:relative lg:flex lg:w-[240px] lg:flex-col lg:translate-x-0',
      // Mobile: overlay, no space when hidden
      'lg:hidden fixed top-0 left-0 w-[280px] sm:w-[300px] z-50',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="h-16 px-4 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white text-forest-900 grid place-items-center font-bold text-sm sm:text-base"
        >
          M
        </div>
        <div class="font-semibold text-sm sm:text-base">Medten DeepDive</div>
      </div>
      <!-- Close button for mobile -->
      <button
        @click="closeMobileMenu"
        class="lg:hidden p-1.5 text-white/60 hover:text-white touch-manipulation"
      >
        <Icon name="x" :size="20" color="currentColor" />
      </button>
    </div>
    <div class="px-4 pt-4 pb-2 text-[10px] sm:text-xs tracking-[0.15em] text-white/60">MENU</div>
    <nav class="px-2 space-y-1 text-xs sm:text-sm">
      <RouterLink to="/dashboard" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:py-2 rounded-lg transition touch-manipulation',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="layoutDashboard" :size="18" color="rgba(255,255,255,0.8)" />
          <span>Overview</span>
        </a>
      </RouterLink>

      <RouterLink to="/insights/seo" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="barChart3" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Statistics</span>
        </a>
      </RouterLink>

      <RouterLink to="/leads" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="users" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Leads</span>
        </a>
      </RouterLink>

      <RouterLink to="/insights/products" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="package" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Product</span>
        </a>
      </RouterLink>

      <router-link
        to="/insights/search"
        @click="closeMobileMenu"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition text-white/80 hover:bg-white/10"
        active-class="bg-white/10 text-white"
      >
        <Icon name="search" :size="20" color="rgba(255,255,255,0.8)" />
        <span>Search</span>
      </router-link>

      <router-link
        to="/insights/paths"
        @click="closeMobileMenu"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition text-white/80 hover:bg-white/10"
        active-class="bg-white/10 text-white"
      >
        <Icon name="route" :size="20" color="rgba(255,255,255,0.8)" />
        <span>Paths</span>
      </router-link>

      <RouterLink to="/leads" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition justify-between',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <span class="flex items-center gap-3">
            <Icon name="mail" :size="20" color="rgba(255,255,255,0.8)" />
            <span>Messages</span>
          </span>
          <span class="px-2 py-0.5 rounded-full text-forest-900 bg-lime-400 text-xs font-semibold"
            >13</span
          >
        </a>
      </RouterLink>

      <RouterLink to="/settings" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="navigate"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="creditCard" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Transactions</span>
        </a>
      </RouterLink>
    </nav>

    <div class="mt-6 mx-4 border-t border-white/10"></div>
    <div class="px-4 pt-4 pb-2 text-xs tracking-[0.15em] text-white/60">RULES</div>
    <nav class="px-2 space-y-1 text-sm">
      <RouterLink to="/rules" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="checkCircle" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Lead Rules</span>
        </a>
      </RouterLink>
    </nav>

    <div class="mt-6 mx-4 border-t border-white/10"></div>
    <div class="px-4 pt-4 pb-2 text-xs tracking-[0.15em] text-white/60">GENERAL</div>
    <nav class="px-2 space-y-1 text-sm pb-6">
      <RouterLink to="/settings" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="settings" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Settings</span>
        </a>
      </RouterLink>
      <RouterLink to="/settings" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <Icon name="shield" :size="20" color="rgba(255,255,255,0.8)" />
          <span>Security</span>
        </a>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped></style>
