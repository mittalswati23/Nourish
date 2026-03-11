const DIET_OPTIONS = [
  'Mediterranean',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Paleo',
  'High-Protein',
  'Gluten-Free',
  'No restrictions',
] as const

interface DietChipsProps {
  value: string[]
  onChange: (selected: string[]) => void
}

export function DietChips({ value, onChange }: DietChipsProps) {
  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((s) => s !== option)
      : [...value, option]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {DIET_OPTIONS.map((option) => {
        const selected = value.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`
              min-w-[7rem] px-4 py-2.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${selected
                ? 'bg-accent dark:bg-dark-accent border-accent dark:border-dark-accent text-white font-semibold shadow-card ring-2 ring-accent/25 dark:ring-dark-accent/25'
                : 'bg-paper border-border text-ink hover:border-accent hover:shadow-card'}
            `}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
