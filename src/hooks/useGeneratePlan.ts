import { useQuery } from '@tanstack/react-query'
import { generateMealPlan } from '@/services/claude'
import type { UserPreferences } from '@/types/meal.types'

export function useGeneratePlan(prefs: UserPreferences) {
  return useQuery({
    queryKey: ['meal-plan', prefs],
    queryFn: () => generateMealPlan(prefs),
    enabled: false,
    staleTime: Infinity,
    retry: 1,
  })
}
