import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleTheme()
  }

  const isLightHeader = theme === 'light'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative z-20 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
        isLightHeader
          ? 'bg-ink/15 hover:bg-ink/20 border-2 border-ink/40 text-ink shadow-sm'
          : 'bg-white/15 hover:bg-white/25 border border-white/30 text-white/90 hover:text-white'
      }`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="opacity-80">{theme === 'light' ? '☀' : '☽'}</span>
      {theme === 'light' ? 'Light' : 'Dark'}
    </button>
  )
}
