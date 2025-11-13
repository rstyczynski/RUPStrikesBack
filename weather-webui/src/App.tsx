import { useState } from 'react'
import { CitySearchForm } from './components/CitySearchForm'
import { CoordinatesForm } from './components/CoordinatesForm'
import { AppHeader } from './components/AppHeader'
import { StatusBanner } from './components/StatusBanner'
import { CurrentConditionsCard } from './components/CurrentConditionsCard'
import { ForecastGrid } from './components/ForecastGrid'
import { RecentSearches } from './components/RecentSearches'
import { MapView } from './components/MapView'
import { useWeatherSearch } from './hooks/useWeatherSearch'
import { useHealthHeartbeat } from './hooks/useHealthHeartbeat'
import styles from './App.module.css'

export function App() {
  const [activeTab, setActiveTab] = useState<'city' | 'coordinates'>('city')
  const { search, status, isPending, data, error } = useWeatherSearch()
  const health = useHealthHeartbeat()

  const statusMessage = (() => {
    if (status === 'pending') return 'Fetching forecast…'
    if (status === 'error') return error?.message ?? 'Unable to fetch forecast'
    if (status === 'success') return 'Forecast updated'
    return undefined
  })()

  return (
    <div className={styles.app}>
      <AppHeader health={health} />
      <StatusBanner
        status={status === 'error' ? 'error' : status === 'pending' ? 'loading' : status === 'success' ? 'success' : 'idle'}
        message={statusMessage}
      />
      <section className={styles.formsSection}>
        <div className="sectionTitleBar">
          <div className={styles.tabs} role="tablist" aria-label="Search type">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'city'}
              data-active={activeTab === 'city'}
              onClick={() => setActiveTab('city')}
            >
              City search
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'coordinates'}
              data-active={activeTab === 'coordinates'}
              onClick={() => setActiveTab('coordinates')}
            >
              Coordinates search
            </button>
          </div>
        </div>
        <div className={styles.formsGrid}>
          {activeTab === 'city' ? (
            <CitySearchForm
              loading={isPending}
              onSubmit={(city) => search({ kind: 'city', city })}
            />
          ) : (
            <CoordinatesForm
              loading={isPending}
              onSubmit={(lat, lon) => search({ kind: 'coordinates', latitude: lat, longitude: lon })}
            />
          )}
        </div>
      </section>

      {data ? (
        <>
          <section className={styles.mapSection}>
            <MapView
              latitude={data.location.latitude}
              longitude={data.location.longitude}
              cityName={data.location.name}
            />
          </section>
          <section className={styles.resultsSection}>
            <CurrentConditionsCard weather={data} />
            <ForecastGrid weather={data} />
          </section>
        </>
      ) : (
        <section className={styles.placeholder}>
          <p>Run a search to see the forecast for any city or coordinate pair.</p>
        </section>
      )}

      <RecentSearches />
    </div>
  )
}
