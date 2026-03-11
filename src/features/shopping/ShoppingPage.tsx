import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { usePrefs } from '@/context/PrefsContext'
import type { MealPlan, ShoppingItem } from '@/types/meal.types'

const CATEGORY_ORDER = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Grains'] as const
const STORAGE_KEY = 'nourish-shopping-checked'

function groupByCategory(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
  const map = new Map<string, ShoppingItem[]>()
  for (const item of items) {
    const cat = item.category || 'Pantry'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(item)
  }
  return map
}

function itemKey(item: ShoppingItem): string {
  return `${item.name}::${item.amount}::${item.category}`
}

function loadChecked(plan: MealPlan): Set<string> {
  try {
    const key = `${STORAGE_KEY}-${plan.generatedAt}`
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function saveChecked(plan: MealPlan, checked: Set<string>) {
  const key = `${STORAGE_KEY}-${plan.generatedAt}`
  localStorage.setItem(key, JSON.stringify([...checked]))
}

export function ShoppingPage() {
  const navigate = useNavigate()
  const { prefs } = usePrefs()
  const queryClient = useQueryClient()
  const plan = queryClient.getQueryData<MealPlan>(['meal-plan', prefs])
  const [checked, setChecked] = useState<Set<string>>(() =>
    plan ? loadChecked(plan) : new Set()
  )

  useEffect(() => {
    if (plan) setChecked(loadChecked(plan))
  }, [plan])

  const toggle = useCallback(
    (key: string) => {
      if (!plan) return
      setChecked((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        saveChecked(plan, next)
        return next
      })
    },
    [plan]
  )

  const uncheckAll = useCallback(() => {
    if (!plan) return
    setChecked(new Set())
    saveChecked(plan, new Set())
  }, [plan])

  const exportList = useCallback(() => {
    if (!plan) return
    const lines: string[] = []
    const grouped = groupByCategory(plan.shoppingList)
    const ordered = CATEGORY_ORDER.filter((c) => grouped.has(c))
    const other = [...grouped.keys()].filter(
      (c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number])
    )
    for (const cat of [...ordered, ...other]) {
      lines.push(`\n${cat}`)
      lines.push('─'.repeat(cat.length))
      for (const item of grouped.get(cat)!) {
        const key = itemKey(item)
        const done = checked.has(key)
        lines.push(`${done ? '✓ ' : ''}${item.name} — ${item.amount}`)
      }
    }
    const text = `Nourish Shopping List${lines.join('\n')}\n`
    navigator.clipboard.writeText(text).then(
      () => alert('Copied to clipboard!'),
      () => alert('Could not copy to clipboard.')
    )
  }, [plan, checked])

  if (!plan) return <Navigate to="/" replace />

  const allKeys = plan.shoppingList.map((i) => itemKey(i))
  const checkedCount = allKeys.filter((k) => checked.has(k)).length
  const total = allKeys.length
  const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  const grouped = groupByCategory(plan.shoppingList)
  const orderedCategories = CATEGORY_ORDER.filter((c) => grouped.has(c))
  const otherCategories = [...grouped.keys()].filter(
    (c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number])
  )

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-paper text-ink dark:text-dark-ink bg-texture">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="font-serif text-3xl font-semibold mb-2">
          Shopping List
        </h1>
        <p className="text-muted dark:text-dark-muted text-sm mb-4">
          Everything you need for this week’s meals.
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-muted dark:text-dark-muted">
              {checkedCount} of {total} items
            </span>
            <span className="font-mono text-sm font-medium text-accent dark:text-dark-accent">
              {percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-cream dark:bg-dark-cream overflow-hidden">
            <div
              className="h-full bg-accent dark:bg-dark-accent transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={uncheckAll}
            className="px-4 py-2 rounded-lg border border-border dark:border-dark-border bg-paper dark:bg-dark-cream text-ink dark:text-dark-ink font-mono text-xs uppercase tracking-wider hover:border-accent dark:hover:border-dark-accent transition-colors"
          >
            Uncheck All
          </button>
          <button
            type="button"
            onClick={exportList}
            className="px-4 py-2 rounded-lg border border-border dark:border-dark-border bg-paper dark:bg-dark-cream text-ink dark:text-dark-ink font-mono text-xs uppercase tracking-wider hover:border-accent dark:hover:border-dark-accent transition-colors"
          >
            Export
          </button>
        </div>

        <div className="space-y-6">
          {orderedCategories.map((category) => (
            <section key={category}>
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted dark:text-dark-muted mb-3">
                {category}
              </h2>
              <ul className="space-y-2">
                {grouped.get(category)!.map((item) => {
                  const key = itemKey(item)
                  const isChecked = checked.has(key)
                  return (
                    <li
                      key={key}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(key)}
                      onKeyDown={(e) =>
                        (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(key))
                      }
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-card dark:shadow-dark-card
                        ${isChecked
                          ? 'bg-warm dark:bg-dark-warm border-border dark:border-dark-border opacity-60'
                          : 'bg-cream dark:bg-dark-cream border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent hover:shadow-card-hover dark:hover:shadow-dark-card-hover'}
                      `}
                    >
                      <span
                        className={`
                          w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center
                          ${isChecked ? 'bg-accent dark:bg-dark-accent border-accent dark:border-dark-accent text-white' : 'border-accent dark:border-dark-accent'}
                        `}
                      >
                        {isChecked && '✓'}
                      </span>
                      <span
                        className={`flex-1 font-medium ${isChecked ? 'line-through text-muted dark:text-dark-muted' : 'text-ink dark:text-dark-ink'}`}
                      >
                        {item.name}
                      </span>
                      <span className="font-mono text-sm text-accent dark:text-dark-accent">
                        {item.amount}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
          {otherCategories.map((category) => (
            <section key={category}>
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted dark:text-dark-muted mb-3">
                {category}
              </h2>
              <ul className="space-y-2">
                {grouped.get(category)!.map((item) => {
                  const key = itemKey(item)
                  const isChecked = checked.has(key)
                  return (
                    <li
                      key={key}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(key)}
                      onKeyDown={(e) =>
                        (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(key))
                      }
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-card dark:shadow-dark-card
                        ${isChecked
                          ? 'bg-warm dark:bg-dark-warm border-border dark:border-dark-border opacity-60'
                          : 'bg-cream dark:bg-dark-cream border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent hover:shadow-card-hover dark:hover:shadow-dark-card-hover'}
                      `}
                    >
                      <span
                        className={`
                          w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center
                          ${isChecked ? 'bg-accent dark:bg-dark-accent border-accent dark:border-dark-accent text-white' : 'border-accent dark:border-dark-accent'}
                        `}
                      >
                        {isChecked && '✓'}
                      </span>
                      <span
                        className={`flex-1 font-medium ${isChecked ? 'line-through text-muted dark:text-dark-muted' : 'text-ink dark:text-dark-ink'}`}
                      >
                        {item.name}
                      </span>
                      <span className="font-mono text-sm text-accent dark:text-dark-accent">
                        {item.amount}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/plan')}
            className="flex-1 py-3 rounded-xl bg-accent dark:bg-dark-accent text-white font-mono text-sm uppercase tracking-wider font-semibold hover:bg-accent2 transition-colors shadow-card"
          >
            ← Back to Plan
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-paper dark:bg-dark-cream text-ink dark:text-dark-ink font-mono text-sm hover:border-accent dark:hover:border-dark-accent transition-colors"
          >
            Edit Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
