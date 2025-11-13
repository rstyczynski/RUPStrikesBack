import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { SearchParams } from '../api/types'

export interface RecentSearchEntry {
  params: SearchParams
  timestamp: string
}

interface RecentSearchContextValue {
  entries: RecentSearchEntry[]
  addEntry: (params: SearchParams) => void
}

const RecentSearchContext = createContext<RecentSearchContextValue | undefined>(undefined)
const STORAGE_KEY = 'weather-webui:recent-searches'
const MAX_ENTRIES = 5

export function RecentSearchProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<RecentSearchEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }
      const parsed = JSON.parse(stored) as RecentSearchEntry[]
      return parsed
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch (error) {
      console.warn('Unable to persist recent searches', error)
    }
  }, [entries])

  const value = useMemo<RecentSearchContextValue>(() => ({
    entries,
    addEntry: (params: SearchParams) => {
      setEntries((prev) => {
        const next: RecentSearchEntry[] = [{ params, timestamp: new Date().toISOString() }, ...prev]
        return next.slice(0, MAX_ENTRIES)
      })
    },
  }), [entries])

  return <RecentSearchContext.Provider value={value}>{children}</RecentSearchContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRecentSearches() {
  const ctx = useContext(RecentSearchContext)
  if (!ctx) {
    throw new Error('useRecentSearches must be used within RecentSearchProvider')
  }
  return ctx
}
