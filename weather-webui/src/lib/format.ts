export function formatTemperature(value: number): string {
  return `${value.toFixed(1)}°C`
}

export function formatDate(value: string): string {
  const date = new Date(value)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(value: string): string {
  const date = new Date(value)
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
