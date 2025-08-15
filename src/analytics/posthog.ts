import posthog, { type PostHogConfig } from 'posthog-js'

type EventPayload = Record<string, unknown>

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Medten DeepDive'
const KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
const MOCK = String(import.meta.env.VITE_MOCK_MODE || '').toLowerCase() === 'true'

let initialized = false

export function initPostHog() {
  if (initialized || MOCK || !KEY) return
  const config: Partial<PostHogConfig> = {
    api_host: HOST,
    capture_pageview: false, // we'll handle manually via router
    autocapture: false, // privacy-safe: no auto DOM capture
    disable_session_recording: true,
    property_blacklist: ['$device_id'],
  }
  posthog.init(KEY, config)
  initialized = true
}

export function capture(name: string, payload: EventPayload = {}) {
  if (MOCK || !KEY) return
  posthog.capture(name, { app: APP_NAME, ...payload })
}

export function identify(distinctId: string, props?: EventPayload) {
  if (MOCK || !KEY) return
  posthog.identify(distinctId, props)
}

export function shutdown() {
  if (!initialized) return
  posthog.shutdown()
  initialized = false
}

// Typed helpers
export const events = {
  page_view(route: string, extra?: EventPayload) {
    capture('page_view', { route, ...extra })
  },
  kpi_clicked(name: string) {
    capture('kpi_clicked', { name })
  },
  export_sent(kind: 'hot' | 'lost', count: number) {
    capture('export_sent', { kind, count })
  },
}
