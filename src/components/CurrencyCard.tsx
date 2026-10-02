import { AlertCircle, ArrowDownLeft, Check, Clock3 } from 'lucide-react'
import type { CurrencyResult } from '../types'
import { formatForeignCurrency, formatQuoteDate, formatRate } from '../utils/currency'

interface CurrencyCardProps {
  result: CurrencyResult
  index: number
}

export function CurrencyCard({ result, index }: CurrencyCardProps) {
  const { currency } = result
  const hasError = Boolean(result.error) || result.convertedAmount === null || result.rate === null
  return (
    <article className={`currency-card currency-card--${currency.accent} ${hasError ? 'currency-card--unavailable' : ''}`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className="currency-card__topline">
        <div className="currency-identity">
          <span className="currency-flag" role="img" aria-label={`Bandeira de ${currency.country}`}>{currency.flag}</span>
          <div>
            <h3>{currency.name}</h3>
            <span className="currency-code">{currency.code}</span>
          </div>
        </div>
        {hasError ? <AlertCircle className="currency-status-icon currency-status-icon--error" size={17} aria-label="Cotação indisponível" /> : <span className="currency-status-icon" aria-label="Cotação disponível"><Check size={15} /></span>}
      </div>

      {hasError ? (
        <div className="unavailable-state">
          <AlertCircle size={24} aria-hidden="true" />
          <strong>Cotação indisponível</strong>
          <span>Tente consultar novamente.</span>
        </div>
      ) : (
        <>
          <div className="currency-value-label">Você recebe aproximadamente</div>
          <div className="currency-value">{formatForeignCurrency(result.convertedAmount!, currency.code)}</div>
          <div className="currency-rate">
            <span><ArrowDownLeft size={13} aria-hidden="true" /> 1 {currency.code} = {formatRate(result.rate!)} BRL</span>
          </div>
        </>
      )}

      <div className="currency-card__footer">
        <span><Clock3 size={12} aria-hidden="true" /> Referência de {formatQuoteDate(result.quoteDate)}</span>
      </div>
    </article>
  )
}
