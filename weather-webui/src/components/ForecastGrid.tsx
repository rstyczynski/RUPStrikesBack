import type { WeatherResponse } from '../api/types'
import { formatDate, formatTemperature } from '../lib/format'
import { mapWeatherCodeToIcon } from '../lib/weatherIcons'
import styles from './WeatherCards.module.css'

interface Props {
  weather: WeatherResponse
}

export function ForecastGrid({ weather }: Props) {
  return (
    <section aria-label="3 day forecast">
      <h2 className="sectionTitle">Next 3 days</h2>
      <div className={styles.forecastGrid}>
        {weather.forecast.map((day) => {
          const icon = mapWeatherCodeToIcon(day.weather_code)
          const precipitation = Math.min(day.precipitation, 100)
          return (
            <article key={day.date} className={styles.forecastCard}>
              <p className="cardSubtitle">{formatDate(day.date)}</p>
              <div className={styles.icon} dangerouslySetInnerHTML={{ __html: icon.svg }} aria-hidden />
              <p>{icon.label}</p>
              <div className={styles.forecastTemps}>
                <span>{formatTemperature(day.max_temp)}</span>
                <span className="muted">{formatTemperature(day.min_temp)}</span>
              </div>
              <div>
                <p className="muted">Precipitation {precipitation.toFixed(1)}%</p>
                <div className={styles.precipBar}>
                  <div className={styles.precipFill} style={{ width: `${precipitation}%` }} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
