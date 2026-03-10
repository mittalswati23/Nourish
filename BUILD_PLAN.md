# Nourish — 4-step build plan

Build the full app following these steps. Keep this file in sync as you progress (e.g. check off items or update status).

---

## Step 1 — Scaffold + API

**Goal:** Project runs locally; calling the API returns a valid meal plan JSON.

- [x] Create Vite + React 18 + TypeScript project (`npm create vite@latest nourish -- --template react-ts`).
- [x] Install: `react-router-dom`, `@tanstack/react-query`, `tailwindcss`, and add Tailwind config + design tokens (ink, paper, cream, accent, accent2, muted, border).
- [x] Add `src/types/meal.types.ts`: `UserPreferences`, `Meal`, `Recipe`, `DayPlan`, `MealPlan`, `ShoppingItem`.
- [x] Add `src/context/PrefsContext.tsx`: preferences state from localStorage; expose `prefs` / `setPrefs`; wrap app in `PrefsProvider`.
- [x] In `main.tsx`, wrap app in `QueryClientProvider` with `retry: 1`, `staleTime: Infinity`.
- [x] Add `src/services/claude.ts`: `generateMealPlan(prefs)` → POST `/api/claude`, parse JSON, return `MealPlan`.
- [x] Add Vercel API route `api/claude.ts`: read `ANTHROPIC_API_KEY`, forward request to Anthropic Messages API.
- [x] Add `src/hooks/useGeneratePlan.ts`: `useQuery` with `queryKey: ['meal-plan', prefs]`, `queryFn: generateMealPlan`, `enabled: false`, `staleTime: Infinity`, `retry: 1`.
- [x] Set up React Router (e.g. `/`, `/plan`, `/shopping`) and basic `App.tsx` layout.

**Done when:** You can trigger the API (e.g. from a temp button or console) and see a valid `MealPlan` in the response. Run `vercel dev` and set `ANTHROPIC_API_KEY` to test the API locally.

---

## Step 2 — Preferences screen

**Goal:** User can set diet, allergies, fridge items and generate a plan; on success, navigate to `/plan`.

- [ ] Build `PreferencesPage`: reads/writes prefs from `PrefsContext`.
- [ ] **DietChips:** multi-select pills (Mediterranean, Vegetarian, Vegan, Keto, Paleo, High-Protein, Gluten-Free, No restrictions). Selected = filled brand color; unselected = outline.
- [ ] **AllergyChips:** same pattern (Shellfish, Gluten, Dairy, Nuts, Eggs, Soy, Pork).
- [ ] **FridgeGrid:** 4-column grid of ingredient tiles (emoji + name); toggle selected state (warm border). Include ~16 common ingredients; optional custom add.
- [ ] **Generate button:** disabled until at least one diet style selected. On click: save prefs to localStorage, call `refetch()` from `useGeneratePlan`. Show loading ("Building your week…") and error state with retry.
- [ ] On success (`data` from `useGeneratePlan`), navigate to `/plan` (e.g. `useEffect` watching `data`).

**Done when:** Selecting options and clicking Generate leads to the plan screen with data.

---

## Step 3 — Plan + recipes

**Goal:** 5-day plan with day tabs; each meal opens a recipe modal; user can go to shopping list.

- [ ] **PlanPage:** get plan via `useQueryClient().getQueryData(['meal-plan', prefs])`. If empty, redirect to `/`.
- [ ] **Day tabs:** Mon–Fri; show active day; optional daily calorie total in tab.
- [ ] **MealCard:** one per slot (breakfast, lunch, snack, dinner). Show name, prep time, calories, fridge items used. Left border: gold=breakfast, green=lunch, grey=snack, accent=dinner. Click → open RecipeModal.
- [ ] **RecipeModal:** overlay with backdrop blur; ingredients (2-col grid), steps (numbered list). Close on backdrop click or X.
- [ ] **Regenerate:** button that calls `refetch()` from `useGeneratePlan`.
- [ ] **CTA:** "View Shopping List →" navigates to `/shopping`.

**Done when:** Full flow from preferences → plan → open recipe → go to shopping works.

---

## Step 4 — Shopping list + polish + deploy

**Goal:** Shopping list with checkboxes and progress; export; then polish and deploy.

- [ ] **ShoppingPage:** read plan from cache; if empty, redirect to `/`.
- [ ] **Checked state:** `useState<Set<string>>` init from `localStorage.getItem('nourish-shopping-checked')`; write back in `toggleItem`. No `checked` on `ShoppingItem` type — key by item name.
- [ ] **useShoppingProgress(plan, checked):** returns `checkedCount`, `total`, `percentage`, `allDone`.
- [ ] **Progress bar:** visual for checked/total; animate on change.
- [ ] **CategorySection:** group by Produce, Protein, Dairy, Pantry, Grains; section header in monospace. Checked items: strikethrough + reduced opacity.
- [ ] **ShoppingItem:** row with custom checkbox; toggle on row click.
- [ ] **Actions:** "Uncheck All" (clear Set + localStorage), "Export" (copy formatted list to clipboard), "← Back to Plan" → `/plan`.
- [ ] **Polish:** Loading skeleton while generating; empty state when no plan; error state with retry.
- [ ] **Deploy:** Vercel. Add `ANTHROPIC_API_KEY` in project env. Ensure `api/claude` is deployed as serverless function.

**Done when:** App is live; users can set preferences → generate plan → view recipes → use shopping list and export.

---

## Reference

- Product and stack: [.cursor/rules/nourish-meal-planner.mdc](.cursor/rules/nourish-meal-planner.mdc)
- Tagline: **"Your week. Your food. Your way."**
