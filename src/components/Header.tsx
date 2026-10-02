import { ArrowRightLeft, Sparkles } from 'lucide-react'
import type { Theme } from '../types'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <ArrowRightLeft size={21} strokeWidth={2.5} />
        </div>
        <div>
          <div className="brand-name">Conversor <span>Real</span></div>
          <p className="brand-description">Consulte o valor do real em moedas estrangeiras</p>
        </div>
      </div>
      <div className="header-actions">
        <div className="live-pill" aria-label="Cotação online">
          <span className="live-dot" aria-hidden="true" />
          <span className="hidden sm:inline">Cotação online</span>
          <Sparkles size={14} aria-hidden="true" />
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
