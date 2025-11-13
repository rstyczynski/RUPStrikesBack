import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './FormCard.module.css'

interface Props {
  onSubmit: (lat: number, lon: number) => void
  loading: boolean
}

export function CoordinatesForm({ onSubmit, loading }: Props) {
  const [lat, setLat] = useState('52.52')
  const [lon, setLon] = useState('13.41')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const latitude = Number(lat)
    const longitude = Number(lon)
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Latitude and longitude must be numbers')
      return
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setError('Coordinates out of range')
      return
    }
    setError(null)
    onSubmit(latitude, longitude)
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit} aria-busy={loading}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lat-input">
            Latitude
          </label>
          <input
            id="lat-input"
            className={styles.input}
            type="number"
            step="0.01"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            placeholder="52.52"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lon-input">
            Longitude
          </label>
          <input
            id="lon-input"
            className={styles.input}
            type="number"
            step="0.01"
            value={lon}
            onChange={(event) => setLon(event.target.value)}
            placeholder="13.41"
          />
          <p className={error ? styles.errorText : styles.helper}>{error ?? 'Ranges: lat -90→90, lon -180→180'}</p>
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Searching…' : 'Search coordinates'}
          </button>
        </div>
      </form>
    </div>
  )
}
