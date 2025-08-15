// Vercel-style serverless function. Rename/move accordingly for Netlify or CF Workers.
export default async function handler(req, res) {
  try {
    const method = req.method || 'POST'
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    if (method !== 'POST') {
      res.status(405).json({ error: 'Use POST' })
      return
    }
    const { query } = body
    if (!query) {
      res.status(400).json({ error: 'Missing query' })
      return
    }
    const host = process.env.POSTHOG_HOST || 'https://app.posthog.com'
    const pid = process.env.POSTHOG_PROJECT_ID
    const key = process.env.POSTHOG_PERSONAL_API_KEY
    if (!key || !pid) {
      res
        .status(500)
        .json({
          error: 'Server not configured: set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID',
        })
      return
    }
    const r = await fetch(`${host}/api/projects/${pid}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    })
    const data = await r.json()
    res.setHeader('Cache-Control', 's-maxage=60')
    res.status(r.ok ? 200 : 500).json(data)
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) })
  }
}
