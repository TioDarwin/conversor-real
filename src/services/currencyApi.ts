import { CurrencyApiError, type CurrencyCode, type CurrencyRateResponse } from '../types'

const API_BASE_URL = 'https://api.frankfurter.dev/v2/rate'
const DEFAULT_TIMEOUT_MS = 8_000

function isValidRatePayload(payload: unknown): payload is CurrencyRateResponse {
  if (!payload || typeof payload !== 'object') return false
  const record = payload as Record<string, unknown>
  return (
    typeof record.rate === 'number' &&
    Number.isFinite(record.rate) &&
    record.rate > 0 &&
    typeof record.date === 'string' &&
    record.date.length > 0
  )
}

export async function fetchCurrencyRate(
  currency: CurrencyCode,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<CurrencyRateResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}/${currency}/BRL`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new CurrencyApiError(
        response.status >= 500 ? 'unavailable' : 'unexpected',
        `A API respondeu com status ${response.status}`,
      )
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new CurrencyApiError('unexpected', 'A resposta não pôde ser lida como JSON')
    }

    if (!isValidRatePayload(payload)) {
      throw new CurrencyApiError('unexpected', 'Formato de cotação inválido')
    }

    return payload
  } catch (error) {
    if (error instanceof CurrencyApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new CurrencyApiError('timeout', 'A consulta excedeu o tempo limite')
    }
    if (error instanceof TypeError) {
      throw new CurrencyApiError('network', 'Não foi possível acessar a API')
    }
    throw new CurrencyApiError('unexpected', 'Falha inesperada ao consultar a cotação')
  } finally {
    window.clearTimeout(timeout)
  }
}

export function getUserFacingApiError(kind: CurrencyApiError['kind']): string {
  switch (kind) {
    case 'network':
      return 'Não foi possível acessar a API. Verifique sua conexão com a internet.'
    case 'unavailable':
    case 'timeout':
      return 'A consulta está temporariamente indisponível. Tente novamente em instantes.'
    case 'unexpected':
    default:
      return 'A API retornou dados em um formato inesperado.'
  }
}
