import type { WeatherResponse } from '../api/types'
import { formatTemperature, formatTime } from '../lib/format'
import { mapWeatherCodeToIcon } from '../lib/weatherIcons'
import styles from './WeatherCards.module.css'

interface Props {
  weather: WeatherResponse
}

export function CurrentConditionsCard({ weather }: Props) {
  const icon = mapWeatherCodeToIcon(weather.current.weather_code)
  return (
    <section className={styles.currentCard} aria-label="Current conditions">
      <div className={styles.icon} dangerouslySetInnerHTML={{ __html: icon.svg }} aria-hidden />
      <div>
        <p className={styles.cardLabel}>Now in {weather.location.name || 'selected location'}</p>
        <p className={styles.temperature}>{formatTemperature(weather.current.temperature)}</p>
        <p className={styles.condition}>{icon.label}</p>
        <p className={styles.meta}>
          Feels at {formatTime(weather.current.time)} · Wind {weather.current.wind_speed.toFixed(1)} km/h ·
          Direction {weather.current.wind_direction}°
        </p>
      </div>
    </section>
  )
}
