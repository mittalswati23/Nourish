import type { Meal } from '@/types/meal.types'

const SLOT_COLORS: Record<string, string> = {
  breakfast: 'border-l-amber-400',
  lunch: 'border-l-accent2',
  snack: 'border-l-muted',
  dinner: 'border-l-accent',
}

const SLOT_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
}

interface MealCardProps {
  meal: Meal
  slot: string
  onClick: () => void
}

export function MealCard({ meal, slot, onClick }: MealCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border border-border dark:border-dark-border
        bg-paper dark:bg-dark-cream shadow-card dark:shadow-dark-card
        border-l-4 ${SLOT_COLORS[slot] ?? 'border-l-border'}
        hover:bg-cream dark:hover:bg-dark-warm hover:shadow-card-hover dark:hover:shadow-dark-card-hover
        hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer
      `}
    >
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted dark:text-dark-muted mb-1">
        {SLOT_LABELS[slot] ?? slot}
      </div>
      <div className="text-sm font-medium text-ink dark:text-dark-ink mb-1">{meal.name}</div>
      {meal.usesFridgeItems.length > 0 && (
        <div className="text-xs text-accent2 mb-2">
          Uses: {meal.usesFridgeItems.join(', ')} ✓
        </div>
      )}
      <div className="font-mono text-xs text-accent dark:text-dark-accent">
        {meal.calories} kcal
        {meal.protein != null && ` · ${meal.protein}g protein`}
        {meal.sugar != null && ` · ${meal.sugar}g sugar`}
        {' · '}{meal.prepTime}
      </div>
    </button>
  )
}
