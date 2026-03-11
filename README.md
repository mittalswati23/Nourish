# Nourish

**Your week. Your food. Your way.**

AI-powered 5-day meal planner: set diet preferences and what’s in your fridge → get a plan with recipes and a shopping list.

## Features

- **Preferences** — Choose diet style (Mediterranean, Vegetarian, Vegan, etc.), ingredients to skip, and what's already in your kitchen
- **5-day meal plan** — AI-generated breakfast, lunch, snack, and dinner for Mon–Fri
- **Recipes** — Click any meal to view ingredients and steps
- **Shopping list** — Grouped by category, with checkboxes and export to clipboard
- **Light/dark theme** — Toggle in the header

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS, React Router, TanStack Query
- Anthropic Claude API (via Vercel serverless route)

## Setup

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
```

## Dev

- **Frontend only:** `npm run dev` — app at http://localhost:5173. The “Generate plan” API won’t work — use mock mode (see below) instead.
- **With API (recommended):** Install [Vercel CLI](https://vercel.com/docs/cli) and run `vercel dev`. This runs the app and the `/api/generate` serverless function locally. Set `ANTHROPIC_API_KEY` in `.env.local` (get a key at https://console.anthropic.com/).
- **Mock mode:** Add `VITE_USE_MOCK=true` to `.env.local` to use sample data without an API key.

## Build & deploy

```bash
npm run build
```

Deploy to Vercel; add `ANTHROPIC_API_KEY` in the project environment variables so `/api/generate` works.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | For API | Get at [console.anthropic.com](https://console.anthropic.com/) |
| `VITE_USE_MOCK` | No | Set to `true` to use mock data (no API key needed) |

## Project structure

```
src/
├── components/     # AppHeader, Logo, ThemeToggle
├── context/        # ThemeContext, PrefsContext
├── features/       # PreferencesPage, PlanPage, ShoppingPage
├── hooks/          # useGeneratePlan
├── services/       # ai.ts, mock-plan.ts
└── types/          # meal.types.ts
api/
└── generate.ts     # Vercel serverless (Claude API)
```

## Build plan

See [BUILD_PLAN.md](./BUILD_PLAN.md) for the 4-step implementation plan.

## License

MIT — see [LICENSE](./LICENSE).
