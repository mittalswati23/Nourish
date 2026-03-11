import { useState } from 'react'

const COMMON_INGREDIENTS: { emoji: string; name: string }[] = [
  { emoji: '🥛', name: 'Milk' },
  { emoji: '🍅', name: 'Tomatoes' },
  { emoji: '🧀', name: 'Cheese' },
  { emoji: '🥬', name: 'Spinach' },
  { emoji: '🧅', name: 'Onions' },
  { emoji: '🥒', name: 'Cucumber' },
  { emoji: '🫑', name: 'Bell pepper' },
  { emoji: '🍠', name: 'Sweet potato' },
  { emoji: '🥜', name: 'Nuts' },
  { emoji: '🧈', name: 'Paneer' },
  { emoji: '🌾', name: 'Wheat Flour' },
  { emoji: '🥚', name: 'Eggs' },
  { emoji: '🫐', name: 'Blueberries' },
  { emoji: '🥕', name: 'Carrots' },
  { emoji: '🍋', name: 'Lemons' },
  { emoji: '🥑', name: 'Avocado' },
]

interface FridgeGridProps {
  value: string[]
  onChange: (items: string[]) => void
  /** Items in "Skip these" — cannot also be in kitchen */
  skipList?: string[]
}

const inSkipList = (name: string, skipList: string[] | undefined) =>
  skipList?.some((s) => s.toLowerCase() === name.toLowerCase()) ?? false

export function FridgeGrid({ value, onChange, skipList }: FridgeGridProps) {
  const [customInput, setCustomInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const toggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((s) => s !== name))
    } else {
      if (inSkipList(name, skipList)) return
      onChange([...value, name])
    }
  }

  const toTitleCase = (s: string) =>
    s
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  const addCustom = () => {
    setFeedback(null)
    const trimmed = customInput.trim()
    if (!trimmed) return
    const capitalized = toTitleCase(trimmed)
    const alreadyExists = value.some(
      (v) => v.toLowerCase() === capitalized.toLowerCase()
    )
    if (alreadyExists) {
      setFeedback(`${capitalized} is already in your kitchen`)
      return
    }
    if (inSkipList(capitalized, skipList)) {
      setFeedback(`${capitalized} is in Skip these — can't add to kitchen`)
      return
    }
    onChange([...value, capitalized])
    setCustomInput('')
  }

  const allItems = [...COMMON_INGREDIENTS]
  const customOnly = value.filter(
    (v) => !COMMON_INGREDIENTS.some((c) => c.name === v)
  )

  const cardBase = `
    flex flex-col items-center justify-center p-3 rounded-lg text-center
    transition-all duration-200 ease-out
  `
  const cardDefault = `
    bg-paper border border-border
    shadow-card hover:shadow-card-hover
    hover:border-accent/60 hover:-translate-y-0.5 active:translate-y-0
  `
  const cardSelected = `
    bg-cream border-2 border-accent
    shadow-card-hover ring-2 ring-accent/20
  `
  const cardSkipped = `
    opacity-50 cursor-not-allowed bg-paper
    border border-border shadow-none
  `

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {allItems.map(({ emoji, name }) => {
          const selected = value.includes(name)
          const skipped = inSkipList(name, skipList)
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              disabled={skipped}
              title={skipped ? 'In Skip these' : undefined}
              className={`${cardBase} ${
                skipped ? cardSkipped : selected ? cardSelected : cardDefault
              }`}
            >
              <span className="text-2xl mb-2">{emoji}</span>
              <span className="text-xs font-medium text-muted">{name}</span>
            </button>
          )
        })}
        {customOnly.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => toggle(name)}
            className={`${cardBase} ${cardSelected}`}
          >
            <span className="text-xl mb-2">✨</span>
            <span className="text-xs font-medium text-muted truncate w-full px-1">{name}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => {
            setCustomInput(e.target.value)
            setFeedback(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add ingredient..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-paper text-ink text-sm font-mono placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-shadow shadow-card"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-5 py-2.5 rounded-xl border border-border bg-paper text-ink text-sm font-mono hover:border-accent hover:shadow-card-hover transition-all"
        >
          Add
        </button>
        </div>
        {feedback && (
          <p className="text-sm text-muted">{feedback}</p>
        )}
      </div>
    </div>
  )
}
