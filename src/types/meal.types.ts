export interface UserPreferences {
  dietStyle: string[]
  allergies: string[]
  fridgeItems: string[]
  servings: number
  cuisines: string[]
  maxCookTime: number
}

export interface Recipe {
  ingredients: string[]
  steps: string[]
}

export interface Meal {
  name: string
  calories: number
  prepTime: string
  usesFridgeItems: string[]
  recipe: Recipe
}

export interface DayPlan {
  day: string
  breakfast: Meal
  lunch: Meal
  snack: Meal
  dinner: Meal
}

export interface ShoppingItem {
  name: string
  amount: string
  category: string
}

export interface MealPlan {
  days: DayPlan[]
  shoppingList: ShoppingItem[]
  generatedAt: string
}
