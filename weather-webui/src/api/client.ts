import type {
  ErrorResponse,
  HealthResponse,
  NormalizedError,
  SearchParams,
  WeatherResponse,
} from './types'

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = signal ? null : new AbortController()
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), 15000) : null
  const finalSignal = signal ?? controller?.signal

  try {
    const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: finalSignal,
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ErrorResponse | null
      throw normalizeApiError(payload?.error ?? null, response.status)
    }

    return (await response.json()) as T
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw normalizeApiError(null, 408, 'Request timed out')
    }
    throw normalizeApiError(null, undefined, (error as Error).message)
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }
  }
}

function normalizeApiError(detail: ErrorResponse['error'] | null, status?: number, fallback?: string): NormalizedError {
  if (detail) {
    return {
      code: detail.code,
      message: detail.message,
      status: detail.status ?? status,
    }
  }

  return {
    code: status ? `HTTP_${status}` : 'NETWORK_ERROR',
    message: fallback ?? 'Unexpected error occurred',
    status,
  }
}

export async function fetchWeather(params: SearchParams, signal?: AbortSignal): Promise<WeatherResponse> {
  if (params.kind === 'city') {
    const city = encodeURIComponent(params.city.trim())
    return request(`/api/v1/weather/city/${city}`, signal)
  }

  const search = new URLSearchParams({ lat: params.latitude.toString(), lon: params.longitude.toString() })
  return request(`/api/v1/weather/coordinates?${search.toString()}`, signal)
}

export function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return request('/api/v1/health', signal)
}
