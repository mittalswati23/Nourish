import { useEffect } from 'react'
import type { Meal } from '@/types/meal.types'

interface RecipeModalProps {
  meal: Meal
  slot: string
  onClose: () => void
}

export function RecipeModal({ meal, slot, onClose }: RecipeModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-ink/70 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-paper dark:bg-dark-paper w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl p-8 relative animate-[modalIn_0.3s_ease] shadow-card-hover-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink text-xl"
        >
          ✕
        </button>

        <div className="font-mono text-[10px] uppercase tracking-widest text-accent dark:text-dark-accent mb-2">
          {slot}
        </div>
        <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-ink mb-4 leading-tight">
          {meal.name}
        </h2>

        <div className="flex gap-4 mb-6 p-4 bg-cream dark:bg-dark-cream border border-border dark:border-dark-border rounded-xl">
          <div className="flex-1 text-center">
            <div className="font-mono text-lg font-medium text-ink dark:text-dark-ink">{meal.prepTime}</div>
            <div className="text-[10px] text-muted dark:text-dark-muted">Prep Time</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-mono text-lg font-medium text-ink dark:text-dark-ink">{meal.calories}</div>
            <div className="text-[10px] text-muted dark:text-dark-muted">Calories</div>
          </div>
          {meal.protein != null && (
            <div className="flex-1 text-center">
              <div className="font-mono text-lg font-medium text-ink dark:text-dark-ink">{meal.protein}g</div>
              <div className="text-[10px] text-muted dark:text-dark-muted">Protein</div>
            </div>
          )}
          {meal.sugar != null && (
            <div className="flex-1 text-center">
              <div className="font-mono text-lg font-medium text-ink dark:text-dark-ink">{meal.sugar}g</div>
              <div className="text-[10px] text-muted dark:text-dark-muted">Sugar</div>
            </div>
          )}
        </div>

        <div className="font-mono text-[9px] font-semibold uppercase tracking-widest text-muted dark:text-dark-muted mb-3">
          Ingredients
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
          {meal.recipe.ingredients.map((ing, i) => (
            <div key={i} className="text-sm text-ink dark:text-dark-ink flex items-start gap-2">
              <span className="text-accent dark:text-dark-accent">·</span>
              {ing}
            </div>
          ))}
        </div>

        <div className="font-mono text-[9px] font-semibold uppercase tracking-widest text-muted dark:text-dark-muted mb-3">
          Method
        </div>
        <div className="space-y-3">
          {meal.recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="font-mono text-xs text-accent dark:text-dark-accent flex-shrink-0 pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-ink dark:text-dark-ink">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
