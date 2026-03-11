import type { UserPreferences, MealPlan } from '@/types/meal.types'
import { getRandomMockPlan } from './mock-plan'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const SYSTEM_PROMPT = `You are a professional nutritionist and meal planner.
Return ONLY valid JSON matching this exact schema — no preamble, no markdown fences.
Schema: { "days": DayPlan[], "shoppingList": ShoppingItem[] }
Rules: prioritize fridge items, respect all dietary restrictions.
Prep times: breakfast ≤15min, lunch ≤25min, dinner ≤45min.
Group shopping list by: Produce, Protein, Dairy, Pantry, Grains.
DayPlan: { "day": string, "breakfast": Meal, "lunch": Meal, "snack": Meal, "dinner": Meal }
Meal: { "name": string, "calories": number, "protein": number (grams), "sugar": number (grams), "prepTime": string, "usesFridgeItems": string[], "recipe": { "ingredients": string[], "steps": string[] } }
ShoppingItem: { "name": string, "amount": string, "category": string }`

export async function generateMealPlan(prefs: UserPreferences): Promise<MealPlan> {
  if (USE_MOCK) {
    // simulate network delay so loading state is visible
    await new Promise((r) => setTimeout(r, 1500))
    return getRandomMockPlan()
  }

  const userMessage = `Create a 5-day meal plan (Mon–Fri).
Diet: ${prefs.dietStyle.join(', ') || 'No restrictions'}
Avoid: ${prefs.allergies.join(', ') || 'nothing'}
In my fridge: ${prefs.fridgeItems.join(', ') || 'none'}
Servings: ${prefs.servings} · Max cook time: ${prefs.maxCookTime} min`

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      userMessage,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  const data = await response.json()
  const text = data.text
  if (!text) throw new Error('Invalid response: no content from Claude')

  try {
    const parsed = JSON.parse(text) as MealPlan
    if (!parsed.days || !Array.isArray(parsed.days) || !parsed.shoppingList) {
      throw new Error('Invalid response: missing days or shoppingList')
    }
    return { ...parsed, generatedAt: new Date().toISOString() }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    throw new Error(`Invalid response: could not parse JSON — ${msg}`)
  }
}
