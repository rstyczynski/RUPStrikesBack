import { useRecentSearches } from '../context/RecentSearchContext'
import styles from './RecentSearches.module.css'

export function RecentSearches() {
  const { entries } = useRecentSearches()

  if (entries.length === 0) {
    return null
  }

  return (
    <section aria-label="Recent searches" className={styles.container}>
      <h2 className="sectionTitle">Recent searches</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.timestamp}>
            <span>
              {entry.params.kind === 'city'
                ? `City · ${entry.params.city}`
                : `Coordinates · ${entry.params.latitude.toFixed(2)}, ${entry.params.longitude.toFixed(2)}`}
            </span>
            <time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleTimeString()}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}
