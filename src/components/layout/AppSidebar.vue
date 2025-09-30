<script>
export default {
  name: 'AppSidebar',
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
    class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-forest-900 text-white rounded-lg shadow-lg"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <!-- Mobile Overlay -->
  <div
    v-if="isMobileMenuOpen"
    @click="closeMobileMenu"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'bg-forest-900 text-white min-h-screen sticky top-0 transition-transform duration-300',
      'lg:flex lg:w-[240px] lg:flex-col lg:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      'fixed lg:relative w-[240px] z-50 lg:z-auto',
    ]"
  >
    <div class="h-16 px-4 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-white text-forest-900 grid place-items-center font-bold">
          M
        </div>
        <div class="font-semibold">Medten DeepDive</div>
      </div>
      <!-- Close button for mobile -->
      <button @click="closeMobileMenu" class="lg:hidden p-1 text-white/60 hover:text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="px-4 pt-4 pb-2 text-xs tracking-[0.15em] text-white/60">MENU</div>
    <nav class="px-2 space-y-1 text-sm">
      <RouterLink to="/dashboard" v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click.prevent="handleNavigation(navigate)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg transition',
            isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10',
          ]"
        >
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M4 18V6m8 12V6m8 12V6" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 12a5 5 0 110-10 5 5 0 010 10zM4 22a8 8 0 1116 0" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7" />
          </svg>
          <span>Product</span>
        </a>
      </RouterLink>

      <router-link
        to="/insights/search"
        @click="closeMobileMenu"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition text-white/80 hover:bg-white/10"
        active-class="bg-white/10 text-white"
      >
        <svg
          class="w-5 h-5 text-white/80"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
        </svg>
        <span>Search</span>
      </router-link>

      <router-link
        to="/insights/paths"
        @click="closeMobileMenu"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition text-white/80 hover:bg-white/10"
        active-class="bg-white/10 text-white"
      >
        <svg
          class="w-5 h-5 text-white/80"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M3 5h18M3 12h12M3 19h6" />
        </svg>
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
            <svg
              class="w-5 h-5 text-white/80"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M21 8v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18-3H3m3 0V3m12 2V3" />
            </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M5 12a7 7 0 1114 0 7 7 0 11-14 0z" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 6v12m6-6H6" />
          </svg>
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
          <svg
            class="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L6 20l2-7L2 9h7z" />
          </svg>
          <span>Security</span>
        </a>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped></style>
