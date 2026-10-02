export type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'CNY'

export type Theme = 'light' | 'dark'

export interface CurrencyDefinition {
  code: CurrencyCode
  name: string
  country: string
  flag: string
  accent: string
  decimals: number
}

export interface CurrencyRateResponse {
  amount: number
  base: string
  date: string
  quote: string
  rate: number
}

export interface CurrencyResult {
  currency: CurrencyDefinition
  rate: number | null
  convertedAmount: number | null
  quoteDate: string | null
  error?: string
}

export type ApiErrorKind = 'timeout' | 'network' | 'unavailable' | 'unexpected'

export class CurrencyApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    message: string,
  ) {
    super(message)
    this.name = 'CurrencyApiError'
  }
}
