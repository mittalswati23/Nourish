import type { UserPreferences } from '@/types/meal.types'
import type { MealPlan } from '@/types/meal.types'

export async function generateMealPlan(prefs: UserPreferences): Promise<MealPlan> {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are a professional nutritionist and meal planner.
Respond ONLY with valid JSON — no preamble, no markdown fences.
Schema: { "days": DayPlan[], "shoppingList": ShoppingItem[] }
Rules: prioritize fridge items · respect all restrictions
Prep times: breakfast ≤15min · lunch ≤25min · dinner ≤45min
Group shopping list by: Produce, Protein, Dairy, Pantry, Grains
DayPlan: { "day": string, "breakfast": Meal, "lunch": Meal, "snack": Meal, "dinner": Meal }
Meal: { "name": string, "calories": number, "prepTime": string, "usesFridgeItems": string[], "recipe": { "ingredients": string[], "steps": string[] } }
ShoppingItem: { "name": string, "amount": string, "category": string }`,
      messages: [
        {
          role: 'user',
          content: `Diet: ${prefs.dietStyle.join(', ') || 'No restrictions'}
Avoid: ${prefs.allergies.join(', ') || 'nothing'}
In my fridge: ${prefs.fridgeItems.join(', ') || 'none'}
Servings: ${prefs.servings} · Max cook time: ${prefs.maxCookTime} min`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  const data = await response.json()
  const textBlock = data.content?.find?.((b: { type?: string }) => b.type === 'text')
  const text = textBlock?.text
  if (!text) throw new Error('Invalid response: no content')

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
