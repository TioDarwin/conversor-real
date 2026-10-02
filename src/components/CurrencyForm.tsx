import type { FormEvent, RefObject } from 'react'
import { ArrowUpRight, Eraser, LoaderCircle } from 'lucide-react'

interface CurrencyFormProps {
  value: string
  error?: string | null
  isLoading: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClear: () => void
}

export function CurrencyForm({
  value,
  error,
  isLoading,
  inputRef,
  onChange,
  onSubmit,
  onClear,
}: CurrencyFormProps) {
  return (
    <section className="converter-panel" aria-labelledby="converter-title">
      <div className="section-kicker">
  <span /> CONVERTER VALOR
</div>

      <div className="form-heading-row">
        <div>
          <h1 id="converter-title">Converta seus reais</h1>
<p>Veja o valor aproximado em cinco moedas de referência.</p>
        </div>
        <div className="form-orbit" aria-hidden="true"><ArrowUpRight size={20} /></div>
      </div>

      <form className="converter-form" onSubmit={onSubmit} noValidate>
        <div className="amount-field-wrap">
          <label className="field-label" htmlFor="brl-amount">Valor em reais</label>
          <div className={`amount-field ${error ? 'amount-field--error' : ''}`}>
            <span className="amount-prefix" aria-hidden="true">R$</span>
            <input
              ref={inputRef}
              id="brl-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="150,00"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'amount-error amount-help' : 'amount-help'}
              disabled={isLoading}
            />
            <span className="amount-currency" aria-hidden="true">BRL</span>
          </div>
          <div className="field-meta">
            {error ? <span id="amount-error" className="field-error" role="alert">{error}</span> : <span id="amount-help">Use ponto ou vírgula para os centavos.</span>}
            {value && !isLoading && <button type="button" className="clear-button" onClick={onClear}><Eraser size={13} /> Limpar</button>}
          </div>
        </div>
        <button className="convert-button" type="submit" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="spin" size={19} aria-hidden="true" /> : <ArrowUpRight size={19} aria-hidden="true" />}
         <span>{isLoading ? 'Consultando…' : 'Consultar cotações'}</span>

        </button>
      </form>
      <p className="form-footnote">
  <span className="secure-dot" aria-hidden="true" />
  Consulta pública de referência, sem cadastro.
</p>

    </section>
  )
}
