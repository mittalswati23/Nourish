import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrefs } from '@/context/PrefsContext'
import { useGeneratePlan } from '@/hooks/useGeneratePlan'
import { DietChips } from './DietChips'
import { AllergyChips } from './AllergyChips'
import { FridgeGrid } from './FridgeGrid'

export function PreferencesPage() {
  const navigate = useNavigate()
  const { prefs, setPrefs } = usePrefs()
  const { data, isLoading, isError, error, refetch } = useGeneratePlan(prefs)
  const didGenerateRef = useRef(false)

  useEffect(() => {
    if (data && didGenerateRef.current) {
      navigate('/plan', { replace: true })
      didGenerateRef.current = false
    }
  }, [data, navigate])

  const handleGenerate = () => {
    didGenerateRef.current = true
    refetch()
  }

  const canGenerate = prefs.dietStyle.length > 0

  return (
    <div className="min-h-screen bg-paper text-ink bg-texture">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-2">
          Let's build your week
        </h1>
        <p className="text-muted text-sm mb-6">
          Two minutes now saves five decisions every day this week.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted mb-2">
              How you eat
            </label>
            <DietChips
              value={prefs.dietStyle}
              onChange={(dietStyle) => setPrefs((p) => ({ ...p, dietStyle }))}
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted mb-2">
              Skip these
            </label>
            <AllergyChips
              value={prefs.allergies}
              onChange={(allergies) => {
                const added = allergies.filter((a) => !prefs.allergies.includes(a))
                setPrefs((p) => {
                  let fridge = p.fridgeItems
                  for (const a of added) {
                    fridge = fridge.filter(
                      (f) => f.toLowerCase() !== a.toLowerCase()
                    )
                  }
                  return { ...p, allergies, fridgeItems: fridge }
                })
              }}
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted mb-2">
              Already in your kitchen
            </label>
            <FridgeGrid
              value={prefs.fridgeItems}
              onChange={(fridgeItems) => setPrefs((p) => ({ ...p, fridgeItems }))}
              skipList={prefs.allergies}
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted mb-2">
              Max cook time (minutes)
            </label>
            <select
              value={prefs.maxCookTime}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, maxCookTime: Number(e.target.value) }))
              }
              className="w-full max-w-[200px] px-4 py-2.5 rounded-lg border border-border bg-paper text-ink font-mono text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
        </div>

        {isError && (
          <div className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
            <p className="font-medium mb-1">Something went wrong</p>
            <p className="text-red-700">{error?.message ?? 'Failed to generate plan.'}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || isLoading}
          className="mt-8 w-full py-4 rounded-xl bg-accent text-white font-mono text-sm uppercase tracking-wider font-semibold hover:bg-accent2 dark:hover:bg-accent2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-card hover:shadow-card-hover active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Building your week…
            </>
          ) : (
            'Build my plan'
          )}
        </button>
      </div>
    </div>
  )
}
