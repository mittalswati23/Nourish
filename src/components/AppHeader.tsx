import { Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  const { theme } = useTheme()
  const isLightHeader = theme === 'light'

  return (
    <header className="flex-shrink-0 z-50 bg-header-bg border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Logo variant="bowl" size={44} showWordmark theme={isLightHeader ? 'light' : 'dark'} />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
