import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ShieldCheck } from 'lucide-react'
import { CurrencyForm } from './components/CurrencyForm'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LoadingState } from './components/LoadingState'
import { ResultsGrid } from './components/ResultsGrid'
import { ErrorMessage, SuccessMessage } from './components/StatusMessages'
import { fetchCurrencyRate, getUserFacingApiError } from './services/currencyApi'
import type { CurrencyApiError, CurrencyResult, Theme } from './types'
import { CURRENCY_DEFINITIONS, validateBRLInput } from './utils/currency'

function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem('conversor-real-theme')
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getErrorKind(reason: unknown): CurrencyApiError['kind'] {
  return reason && typeof reason === 'object' && 'kind' in reason
    ? (reason as CurrencyApiError).kind
    : 'unexpected'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<CurrencyResult[] | null>(null)
  const [lastQueryAt, setLastQueryAt] = useState<Date | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('conversor-real-theme', theme)
  }, [theme])

  function handleToggleTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  function handleInputChange(value: string) {
    setInputValue(value)
    if (validationError) setValidationError(null)
    if (apiError) setApiError(null)
    if (successMessage) setSuccessMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)
    setApiError(null)
    setSuccessMessage(null)

    const validation = validateBRLInput(inputValue)
    if (validation.error) {
      setValidationError(validation.error)
      window.requestAnimationFrame(() => inputRef.current?.focus())
      return
    }

    const amountInReais = validation.value!
    setIsLoading(true)

    const settledRates = await Promise.allSettled(
      CURRENCY_DEFINITIONS.map((currency) => fetchCurrencyRate(currency.code)),
    )

    const nextResults = settledRates.map((settled, index): CurrencyResult => {
      const currency = CURRENCY_DEFINITIONS[index]
      if (settled.status === 'fulfilled') {
        return {
          currency,
          rate: settled.value.rate,
          convertedAmount: amountInReais / settled.value.rate,
          quoteDate: settled.value.date,
        }
      }

      return {
        currency,
        rate: null,
        convertedAmount: null,
        quoteDate: null,
        error: getUserFacingApiError(getErrorKind(settled.reason)),
      }
    })

    const successfulCount = nextResults.filter((result) => result.convertedAmount !== null).length
    setResults(nextResults)
    setLastQueryAt(new Date())
    setIsLoading(false)

    if (successfulCount === 0) {
      const firstFailure = settledRates.find((item) => item.status === 'rejected')
      setApiError(getUserFacingApiError(firstFailure ? getErrorKind(firstFailure.reason) : 'unavailable'))
      return
    }

    if (successfulCount < CURRENCY_DEFINITIONS.length) {
      setApiError('Algumas cotações não puderam ser consultadas. Tente novamente para atualizar.')
      setSuccessMessage(`${successfulCount} de ${CURRENCY_DEFINITIONS.length} cotações atualizadas.`)
      return
    }

    setSuccessMessage('Conversão concluída. Todas as 5 cotações foram atualizadas.')
  }

  function handleClear() {
    setInputValue('')
    setValidationError(null)
    setApiError(null)
    setSuccessMessage(null)
    setResults(null)
    setLastQueryAt(null)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="page-container">
        <Header theme={theme} onToggleTheme={handleToggleTheme} />

        <main>
          <section className="hero-intro" aria-labelledby="page-title">
            <div className="eyebrow"><span className="eyebrow-line" /> MERCADO EM UM OLHAR</div>
            <h2 id="page-title">Seu dinheiro, <em>sem mistério.</em></h2>
            <p>Uma forma simples e transparente de acompanhar o valor do real no mundo.</p>
          </section>

          <CurrencyForm
            value={inputValue}
            error={validationError}
            isLoading={isLoading}
            inputRef={inputRef}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          <div className="status-stack" aria-live="polite">
            <ErrorMessage message={apiError} />
            <SuccessMessage message={successMessage} />
          </div>

          {isLoading ? <LoadingState /> : <ResultsGrid results={results} lastQueryAt={lastQueryAt} />}

          <section className="trust-strip" aria-label="Informações sobre a consulta">
            <div className="trust-item"><ShieldCheck size={16} aria-hidden="true" /><span><strong>Consulta segura</strong> feita diretamente no navegador</span></div>
            <div className="trust-divider" aria-hidden="true" />
            <div className="trust-item"><ArrowDown size={16} aria-hidden="true" /><span><strong>Taxas de referência</strong> atualizadas pela API Frankfurter</span></div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
