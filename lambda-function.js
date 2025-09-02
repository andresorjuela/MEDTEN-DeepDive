export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event))

  const ALLOWED_ORIGINS = ['http://medten-deepdive.s3-website-us-east-1.amazonaws.com']
  const reqOrigin = event?.headers?.origin || event?.headers?.Origin || ''
  const allowOrigin = ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : ALLOWED_ORIGINS[0]

  const baseHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return { statusCode: 200, headers: baseHeaders, body: '' }
  }

  const HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com'
  const PID = process.env.POSTHOG_PROJECT_ID
  const KEY = process.env.POSTHOG_PERSONAL_API_KEY

  if (!KEY || !PID) {
    console.error('Missing PostHog configuration - KEY or PID')
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Missing PostHog configuration' }),
    }
  }

  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: baseHeaders,
        body: JSON.stringify({ status: 'PostHog proxy is running' }),
      }
    }

    if (event.httpMethod === 'POST') {
      let body
      try {
        body = JSON.parse(event.body || '{}')
      } catch (e) {
        console.error('Failed to parse request body:', e)
        return {
          statusCode: 400,
          headers: baseHeaders,
          body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        }
      }

      const query = body?.query
      if (!query) {
        console.error('Missing query in request body')
        return {
          statusCode: 400,
          headers: baseHeaders,
          body: JSON.stringify({ error: 'Missing query' }),
        }
      }

      console.log('Making request to PostHog with query:', query)
      const resp = await fetch(`${HOST}/api/projects/${PID}/query/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
      })

      const data = await resp.json()
      console.log('PostHog response status:', resp.status)

      return {
        statusCode: resp.ok ? 200 : 500,
        headers: baseHeaders,
        body: JSON.stringify(data),
      }
    }

    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  } catch (error) {
    console.error('Lambda error:', error)
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({
        error: String(error?.message || error),
        details: error?.stack,
      }),
    }
  }
}
