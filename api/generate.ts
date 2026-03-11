import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  let body: { system?: string; userMessage?: string }
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { system, userMessage } = body
  if (!system || !userMessage) {
    return res.status(400).json({ error: 'Missing system or userMessage' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>
      error?: { message: string }
    }

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    const text = data.content
      ?.filter((b): b is { type: 'text'; text: string } => b.type === 'text')
      .map((b) => b.text)
      .join('')

    if (!text) {
      return res.status(500).json({ error: 'Invalid response: no content from Claude' })
    }

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ text })
  } catch (err) {
    console.error('Claude API error:', err)
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
    })
  }
}
