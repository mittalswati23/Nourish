import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function claudeDevProxy(): Plugin {
  let apiKey: string | undefined

  return {
    name: 'claude-dev-proxy',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      apiKey = env.ANTHROPIC_API_KEY

      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env or .env.local' }))
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks as Uint8Array[]).toString()) as {
              system?: string
              userMessage?: string
            }
            const { system, userMessage } = body
            if (!system || !userMessage) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Missing system or userMessage' }))
              return
            }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey!,
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
            }
            const text = data.content
              ?.filter((b): b is { type: 'text'; text: string } => b.type === 'text')
              .map((b) => b.text)
              .join('')

            res.writeHead(response.ok ? 200 : response.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(response.ok ? { text } : data))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), claudeDevProxy()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
