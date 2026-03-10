import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { UserPreferences } from '@/types/meal.types'

const STORAGE_KEY = 'nourish-preferences'

const defaultPrefs: UserPreferences = {
  dietStyle: [],
  allergies: [],
  fridgeItems: [],
  servings: 2,
  cuisines: [],
  maxCookTime: 45,
}

function loadPrefs(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPrefs
    const parsed = JSON.parse(raw) as UserPreferences
    return { ...defaultPrefs, ...parsed }
  } catch {
    return defaultPrefs
  }
}

function savePrefs(prefs: UserPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

interface PrefsContextValue {
  prefs: UserPreferences
  setPrefs: (prefs: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void
}

const PrefsContext = createContext<PrefsContextValue | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<UserPreferences>(loadPrefs)

  const setPrefs = useCallback(
    (value: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => {
      setPrefsState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        savePrefs(next)
        return next
      })
    },
    []
  )

  return (
    <PrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </PrefsContext.Provider>
  )
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}
