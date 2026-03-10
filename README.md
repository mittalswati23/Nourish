# Nourish

**Your week. Your food. Your way.**

AI-powered 5-day meal planner: set diet preferences and what’s in your fridge → get a plan with recipes and a shopping list.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS, React Router, TanStack Query
- Claude API (via Vercel serverless route)

## Setup

```bash
npm install
```

## Dev

- **Frontend only:** `npm run dev` — app at http://localhost:5173. The “Generate plan” API won’t work until the API is available (see below).
- **With API (recommended):** Install [Vercel CLI](https://vercel.com/docs/cli) and run `vercel dev`. This runs the app and the `/api/claude` serverless function locally. Set `ANTHROPIC_API_KEY` in `.env.local` or in the Vercel project env.

## Build & deploy

```bash
npm run build
```

Deploy to Vercel; add `ANTHROPIC_API_KEY` in the project environment variables so `/api/claude` works.

## Build plan

See [BUILD_PLAN.md](./BUILD_PLAN.md) for the 4-step implementation plan.
