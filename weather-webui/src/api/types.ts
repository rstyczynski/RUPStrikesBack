export interface LocationResponse {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeatherResponse {
  temperature: number
  condition: string
  weather_code: number
  wind_speed: number
  wind_direction: number
  time: string
}

export interface ForecastDayResponse {
  date: string
  max_temp: number
  min_temp: number
  condition: string
  weather_code: number
  precipitation: number
}

export interface WeatherResponse {
  location: LocationResponse
  current: CurrentWeatherResponse
  forecast: ForecastDayResponse[]
}

export interface ErrorDetail {
  code: string
  message: string
  status: number
}

export interface ErrorResponse {
  error: ErrorDetail
}

export interface HealthResponse {
  status: string
  service: string
  version: string
  timestamp: string
}

export type SearchParams =
  | { kind: 'city'; city: string }
  | { kind: 'coordinates'; latitude: number; longitude: number }

export interface NormalizedError {
  message: string
  code: string
  status?: number
}
