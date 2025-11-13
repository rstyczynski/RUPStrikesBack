import { useEffect, useState } from 'react'
import { fetchHealth } from '../api/client'
import type { HealthResponse } from '../api/types'

export type HealthState = {
  status: 'healthy' | 'degraded' | 'unknown'
  lastChecked: string | null
  details?: HealthResponse
}

export function useHealthHeartbeat(intervalMs = 60000) {
  const [health, setHealth] = useState<HealthState>({ status: 'unknown', lastChecked: null })

  useEffect(() => {
    let canceled = false
    const controller = new AbortController()

    async function poll() {
      try {
        const response = await fetchHealth(controller.signal)
        if (canceled) return
        setHealth({ status: 'healthy', lastChecked: new Date().toISOString(), details: response })
      } catch (error) {
        console.warn('Health check failed', error)
        if (canceled) return
        setHealth({ status: 'degraded', lastChecked: new Date().toISOString() })
      }
    }

    poll()
    const id = window.setInterval(poll, intervalMs)

    return () => {
      canceled = true
      controller.abort()
      window.clearInterval(id)
    }
  }, [intervalMs])

  return health
}
