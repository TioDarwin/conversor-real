import { BarChart3, RefreshCw } from 'lucide-react'
import type { CurrencyResult } from '../types'
import { formatQueryTime, formatQuoteDate } from '../utils/currency'
import { CurrencyCard } from './CurrencyCard'

interface ResultsGridProps {
  results: CurrencyResult[] | null
  lastQueryAt: Date | null
}

export function ResultsGrid({ results, lastQueryAt }: ResultsGridProps) {
  if (!results) {
    return (
      <section className="results-section" aria-labelledby="results-title">
        <div className="results-heading">
          <div>
            <div className="section-kicker"><span /> SUAS COTAÇÕES</div>
            <h2 id="results-title">Pronto para comparar</h2>
          </div>
        </div>
        <div className="empty-results">
          <div className="empty-results__icon"><BarChart3 size={25} /></div>
          <div>
            <strong>As cotações aparecem aqui</strong>
            <p>Digite um valor acima para ver o equivalente em cada moeda.</p>
          </div>
          <div className="empty-results__line" aria-hidden="true" />
        </div>
      </section>
    )
  }

  const quoteDates = [...new Set(results.map((result) => result.quoteDate).filter(Boolean))]
  return (
    <section className="results-section" aria-labelledby="results-title">
      <div className="results-heading">
        <div>
          <div className="section-kicker"><span /> SUAS COTAÇÕES</div>
          <h2 id="results-title">Valor convertido</h2>
        </div>
        {lastQueryAt && <span className="last-query"><RefreshCw size={13} /> Atualizado às {formatQueryTime(lastQueryAt)}</span>}
      </div>
      <div className="results-summary">
        <span>Taxas de referência de {quoteDates.map((date) => formatQuoteDate(date)).join(' · ')}</span>
        <span className="summary-separator" aria-hidden="true" />
        <span>1 moeda estrangeira em BRL</span>
      </div>
      <div className="results-grid">
        {results.map((result, index) => <CurrencyCard key={result.currency.code} result={result} index={index} />)}
      </div>
    </section>
  )
}
