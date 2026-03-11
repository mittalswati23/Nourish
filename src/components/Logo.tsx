type LogoVariant = 'leaf-n' | 'bowl' | 'sun-plate' | 'sprout'

interface LogoProps {
  variant?: LogoVariant
  size?: number
  showWordmark?: boolean
  /** 'inline' = icon left of text (nav); 'stacked' = icon above text (landing) */
  layout?: 'inline' | 'stacked'
  /** 'light' = dark icon on light bg (default); 'dark' = light icon on dark bg */
  theme?: 'light' | 'dark'
  className?: string
}

// ── Inline SVG icons — no external file needed ──────────────────────────────

function BowlIcon({ size, theme }: { size: number; theme: 'light' | 'dark' }) {
  const stroke = theme === 'dark' ? '#B7E4C7' : '#1B4332'
  const fill = theme === 'dark' ? 'rgba(183,228,199,0.15)' : 'rgba(27,67,50,0.1)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      {/* Bowl rim */}
      <path
        d="M6 20C6 34 42 34 42 20"
        stroke={stroke}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Bowl base */}
      <path
        d="M12 34Q24 42 36 34"
        stroke={stroke}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Bowl interior */}
      <path d="M6 20C6 34 42 34 42 20Z" fill={fill} />
      {/* Steam wisps — emerge from bowl */}
      <path
        d="M18 20C16 12 18 6 18 2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 18C22 10 24 4 24 2"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M30 20C32 12 30 6 30 2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SproutIcon({ size, theme }: { size: number; theme: 'light' | 'dark' }) {
  const seedFill = theme === 'dark' ? '#B7E4C7' : '#2D6A4F'
  const leafFill = '#52B788'
  const highlight = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(82,183,136,0.45)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <ellipse cx="22" cy="31" rx="9" ry="11" fill={seedFill} />
      <ellipse cx="19" cy="28" rx="3" ry="5" fill={highlight} />
      <line
        x1="22" y1="20" x2="22" y2="4"
        stroke={seedFill}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M22 14C18 11 11 12 10 16C14 16.5 18.5 15 22 14Z" fill={leafFill} />
      <path d="M22 9C26 6 33 7 34 11C30 11.5 25.5 10.5 22 9Z" fill={leafFill} />
    </svg>
  )
}

function SunPlateIcon({ size, theme }: { size: number; theme: 'light' | 'dark' }) {
  const stroke = theme === 'dark' ? '#B7E4C7' : '#2D6A4F'
  const innerStroke = '#52B788'
  const dotFill = theme === 'dark' ? '#B7E4C7' : '#2D6A4F'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <circle cx="22" cy="22" r="19" stroke={stroke} strokeWidth="2" />
      <circle cx="22" cy="22" r="10" stroke={innerStroke} strokeWidth="1.5" />
      {/* 8 radial lines */}
      <line x1="22" y1="3" x2="22" y2="11" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="35.5" y1="8.5" x2="29.8" y2="14.2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="22" x2="33" y2="22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="35.5" y1="35.5" x2="29.8" y2="29.8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="41" x2="22" y2="33" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="8.5" y1="35.5" x2="14.2" y2="29.8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="22" x2="11" y2="22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="8.5" y1="8.5" x2="14.2" y2="14.2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="4" fill={dotFill} />
      <circle cx="22" cy="22" r="2" fill={innerStroke} />
    </svg>
  )
}

const ICON_MAP = {
  'leaf-n': BowlIcon,
  bowl: BowlIcon,
  'sun-plate': SunPlateIcon,
  sprout: SproutIcon,
} as const

// ── Main component ───────────────────────────────────────────────────────────

export function Logo({
  variant = 'bowl',
  size = 32,
  showWordmark = true,
  layout = 'inline',
  theme = 'light',
  className = '',
}: LogoProps) {
  const Icon = ICON_MAP[variant] ?? BowlIcon

  return (
    <div
      className={`flex items-center gap-2.5 ${layout === 'stacked' ? 'flex-col gap-1.5' : ''} ${className}`.trim()}
      role={showWordmark ? undefined : 'img'}
      aria-label={showWordmark ? undefined : 'Nourish'}
    >
      <Icon size={size} theme={theme} />

      {showWordmark && (
        <span
          className={`font-serif font-semibold tracking-tight leading-none ${
            layout === 'stacked' ? 'text-2xl' : 'text-lg sm:text-xl'
          } ${theme === 'dark' ? 'text-accent2' : 'text-accent'}`}
        >
          Nourish
        </span>
      )}
    </div>
  )
}
