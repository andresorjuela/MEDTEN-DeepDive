<template>
  <component :is="iconComponent" :size="size" :color="color" :class="className" />
</template>

<script>
import {
  Users,
  FileText,
  TrendingDown,
  Flame,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Funnel,
  Activity,
  Settings,
  Search,
  Map,
  CheckCircle,
  X,
  Menu,
  LayoutDashboard,
  Package,
  Route,
  Mail,
  CreditCard,
  Shield,
  Thermometer,
  Snowflake,
  XCircle,
  Database,
} from 'lucide-vue-next'

export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 20,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconComponent() {
      const icons = {
        users: Users,
        fileText: FileText,
        trendingDown: TrendingDown,
        flame: Flame,
        refresh: RefreshCw,
        calendar: Calendar,
        barChart: BarChart3,
        barChart3: BarChart3,
        pieChart: PieChart,
        funnel: Funnel,
        activity: Activity,
        settings: Settings,
        search: Search,
        map: Map,
        check: CheckCircle,
        checkCircle: CheckCircle,
        close: X,
        x: X,
        menu: Menu,
        layoutDashboard: LayoutDashboard,
        package: Package,
        route: Route,
        mail: Mail,
        creditCard: CreditCard,
        shield: Shield,
        thermometer: Thermometer,
        snowflake: Snowflake,
        xCircle: XCircle,
        database: Database,
      }
      return icons[this.name] || Users
    },
  },
}
</script>
