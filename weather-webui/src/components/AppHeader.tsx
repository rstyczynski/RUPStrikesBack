import type { HealthState } from '../hooks/useHealthHeartbeat'
import { HealthIndicator } from './HealthIndicator'
import styles from './AppHeader.module.css'

interface Props {
  health: HealthState
}

export function AppHeader({ health }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.subtitle}>RUP Weather</p>
        <h1 className={styles.title}>Forecast dashboard</h1>
      </div>
      <div className={styles.statusBlock}>
        <HealthIndicator health={health} />
        {health.lastChecked && (
          <span className={styles.timestamp}>
            Updated {new Date(health.lastChecked).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </header>
  )
}
