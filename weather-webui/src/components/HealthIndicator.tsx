import type { HealthState } from '../hooks/useHealthHeartbeat'
import styles from './HealthIndicator.module.css'

interface Props {
  health: HealthState
}

export function HealthIndicator({ health }: Props) {
  const label = health.status === 'healthy' ? 'Healthy' : health.status === 'degraded' ? 'Degraded' : 'Unknown'
  return (
    <span className={`${styles.pill} ${styles[health.status]}`}>
      <span className={styles.dot} />
      {label}
    </span>
  )
}
