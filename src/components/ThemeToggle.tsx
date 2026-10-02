import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../types'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Claro' : 'Escuro'}</span>
    </button>
  )
}
