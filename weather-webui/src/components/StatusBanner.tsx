import styles from './StatusBanner.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  status: Status
  message?: string
}

export function StatusBanner({ status, message }: Props) {
  if (status === 'idle' || !message) {
    return null
  }

  return (
    <div className={`${styles.banner} ${styles[status]}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}
