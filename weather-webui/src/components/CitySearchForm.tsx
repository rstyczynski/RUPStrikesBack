import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './FormCard.module.css'

interface Props {
  onSubmit: (city: string) => void
  loading: boolean
}

export function CitySearchForm({ onSubmit, loading }: Props) {
  const [city, setCity] = useState('Berlin')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!city.trim()) {
      setError('Provide a city name')
      return
    }
    setError(null)
    onSubmit(city.trim())
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit} aria-busy={loading}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="city-input">
            City name
          </label>
          <input
            id="city-input"
            className={styles.input}
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Berlin"
          />
          <p className={error ? styles.errorText : styles.helper}>{error ?? 'Use any major city worldwide.'}</p>
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Searching…' : 'Search city'}
          </button>
        </div>
      </form>
    </div>
  )
}
