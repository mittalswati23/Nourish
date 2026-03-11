import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { usePrefs } from '@/context/PrefsContext'
import { useGeneratePlan } from '@/hooks/useGeneratePlan'
import type { MealPlan, Meal } from '@/types/meal.types'
import { MealCard } from './MealCard'
import { RecipeModal } from './RecipeModal'

const SLOTS = ['breakfast', 'lunch', 'snack', 'dinner'] as const

export function PlanPage() {
  const navigate = useNavigate()
  const { prefs } = usePrefs()
  const queryClient = useQueryClient()
  const { refetch, isFetching } = useGeneratePlan(prefs)

  const plan = queryClient.getQueryData<MealPlan>(['meal-plan', prefs])

  const [activeDay, setActiveDay] = useState(0)
  const [modalMeal, setModalMeal] = useState<{ meal: Meal; slot: string } | null>(null)

  if (!plan) return <Navigate to="/" replace />

  const day = plan.days[activeDay]
  const dailyCals = SLOTS.reduce(
    (sum, s) => sum + (day[s]?.calories ?? 0),
    0
  )
  const dailyProtein = SLOTS.reduce(
    (sum, s) => sum + (day[s]?.protein ?? 0),
    0
  )
  const dailySugar = SLOTS.reduce(
    (sum, s) => sum + (day[s]?.sugar ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper text-ink dark:text-dark-ink bg-texture">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="font-serif text-3xl font-semibold mb-2">Your Week</h1>
        <p className="text-muted dark:text-dark-muted text-sm mb-8">
          Click any meal to see the full recipe.
        </p>

        {/* Day tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {plan.days.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDay(i)}
              className={`
                px-4 py-2 font-mono text-xs tracking-wider border rounded-lg transition-all whitespace-nowrap
                ${activeDay === i
                  ? 'bg-accent dark:bg-dark-accent border-accent dark:border-dark-accent text-white font-semibold shadow-card'
                  : 'bg-paper dark:bg-dark-cream border-border dark:border-dark-border text-muted dark:text-dark-muted hover:border-accent dark:hover:border-dark-accent'}
              `}
            >
              {d.day}
            </button>
          ))}
        </div>

        {/* Daily totals */}
        <div className="font-mono text-xs text-accent dark:text-dark-accent mb-4">
          {day.day} — {dailyCals} kcal
          {dailyProtein > 0 && ` · ${dailyProtein}g protein`}
          {dailySugar > 0 && ` · ${dailySugar}g sugar`}
        </div>

        {/* Meal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {SLOTS.map((slot) => {
            const meal = day[slot]
            if (!meal) return null
            return (
              <MealCard
                key={slot}
                meal={meal}
                slot={slot}
                onClick={() => setModalMeal({ meal, slot })}
              />
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/shopping')}
            className="flex-1 py-3 rounded-xl bg-accent dark:bg-dark-accent text-white font-mono text-sm uppercase tracking-wider font-semibold hover:bg-accent2 transition-colors shadow-card"
          >
            View Shopping List →
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-paper dark:bg-dark-cream text-ink dark:text-dark-ink font-mono text-sm hover:border-accent dark:hover:border-dark-accent transition-colors disabled:opacity-50"
          >
            {isFetching ? 'Regenerating…' : 'Regenerate'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-paper dark:bg-dark-cream text-ink dark:text-dark-ink font-mono text-sm hover:border-accent dark:hover:border-dark-accent transition-colors"
          >
            ← Edit
          </button>
        </div>
      </div>

      {/* Recipe modal */}
      {modalMeal && (
        <RecipeModal
          meal={modalMeal.meal}
          slot={modalMeal.slot}
          onClose={() => setModalMeal(null)}
        />
      )}
    </div>
  )
}
