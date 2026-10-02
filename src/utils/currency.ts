import type { CurrencyCode, CurrencyDefinition } from '../types'

export const CURRENCY_DEFINITIONS: CurrencyDefinition[] = [
  { code: 'USD', name: 'Dólar americano', country: 'Estados Unidos', flag: '🇺🇸', accent: 'blue', decimals: 2 },
  { code: 'EUR', name: 'Euro', country: 'Zona do euro', flag: '🇪🇺', accent: 'violet', decimals: 2 },
  { code: 'JPY', name: 'Iene japonês', country: 'Japão', flag: '🇯🇵', accent: 'rose', decimals: 0 },
  { code: 'GBP', name: 'Libra esterlina', country: 'Reino Unido', flag: '🇬🇧', accent: 'indigo', decimals: 2 },
  { code: 'CNY', name: 'Yuan chinês', country: 'China', flag: '🇨🇳', accent: 'amber', decimals: 2 },
]

export const EMPTY_VALUE_MESSAGE = 'Digite um valor em reais.'
export const INVALID_VALUE_MESSAGE = 'Digite um número válido. Exemplo: 150 ou 150,50.'
export const NON_POSITIVE_VALUE_MESSAGE = 'Digite um valor maior que zero.'

/** Accepts pt-BR decimal commas and common thousands separators without guessing over-validating. */
export function parseBRLInput(rawValue: string): number | null {
  const normalizedInput = rawValue.trim().replace(/\s/g, '')
  if (!normalizedInput) return null

  const hasComma = normalizedInput.includes(',')
  const hasDot = normalizedInput.includes('.')
  let normalized = normalizedInput

  if (hasComma && hasDot) {
    // In pt-BR, the last separator is generally the decimal separator.
    const lastComma = normalizedInput.lastIndexOf(',')
    const lastDot = normalizedInput.lastIndexOf('.')
    if (lastComma > lastDot) {
      normalized = normalizedInput.replace(/\./g, '').replace(',', '.')
    } else {
      normalized = normalizedInput.replace(/,/g, '')
    }
  } else if (hasComma) {
    normalized = normalizedInput.replace(/\./g, '').replace(',', '.')
  } else if ((normalizedInput.match(/\./g) ?? []).length > 1) {
    normalized = normalizedInput.replace(/\./g, '')
  }

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function validateBRLInput(rawValue: string): { value?: number; error?: string } {
  if (!rawValue.trim()) return { error: EMPTY_VALUE_MESSAGE }
  const value = parseBRLInput(rawValue)
  if (value === null) return { error: INVALID_VALUE_MESSAGE }
  if (value <= 0) return { error: NON_POSITIVE_VALUE_MESSAGE }
  return { value }
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatForeignCurrency(value: number, code: CurrencyCode): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: code,
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatRate(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value)
}

export function formatQuoteDate(date: string | null): string {
  if (!date) return 'Data não informada'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return 'Data não informada'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function formatQueryTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
