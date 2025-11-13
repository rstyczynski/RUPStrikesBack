import { useMutation } from '@tanstack/react-query'
import { fetchWeather } from '../api/client'
import type { NormalizedError, SearchParams, WeatherResponse } from '../api/types'
import { useRecentSearches } from '../context/RecentSearchContext'

export function useWeatherSearch() {
  const { addEntry } = useRecentSearches()

  const mutation = useMutation<WeatherResponse, NormalizedError, SearchParams>({
    mutationFn: async (params) => {
      const result = await fetchWeather(params)
      return result
    },
    onSuccess: (_, variables) => {
      addEntry(variables)
    },
  })

  return {
    search: mutation.mutate,
    reset: mutation.reset,
    status: mutation.status,
    isPending: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
  }
}
