interface WeatherIcon {
  label: string
  svg: string
}

const ICONS: Record<string, WeatherIcon> = {
  clear: {
    label: 'Clear skies',
    svg: '<circle cx="32" cy="32" r="18" fill="var(--color-accent)" />',
  },
  cloudy: {
    label: 'Cloudy',
    svg: '<ellipse cx="34" cy="38" rx="20" ry="12" fill="var(--color-cloud)" />',
  },
  rain: {
    label: 'Rain',
    svg: '<ellipse cx="34" cy="32" rx="20" ry="12" fill="var(--color-cloud)" />\n      <path d="M20 44 l-4 8" stroke="var(--color-accent)" stroke-width="3" />\n      <path d="M32 44 l-4 8" stroke="var(--color-accent)" stroke-width="3" />\n      <path d="M44 44 l-4 8" stroke="var(--color-accent)" stroke-width="3" />',
  },
  storm: {
    label: 'Storm',
    svg: '<ellipse cx="34" cy="30" rx="22" ry="14" fill="var(--color-cloud-dark)" />\n      <path d="M28 38 l-6 12 h6 l-4 12" stroke="var(--color-accent)" stroke-width="4" fill="none" />',
  },
  snow: {
    label: 'Snow',
    svg: '<ellipse cx="34" cy="32" rx="20" ry="12" fill="var(--color-cloud)" />\n      <g stroke="var(--color-foreground-muted)" stroke-width="2">\n        <line x1="20" y1="44" x2="24" y2="48" />\n        <line x1="28" y1="44" x2="32" y2="48" />\n        <line x1="36" y1="44" x2="40" y2="48" />\n      </g>',
  },
}

export function mapWeatherCodeToIcon(code: number): WeatherIcon {
  if ([0, 1].includes(code)) {
    return ICONS.clear
  }
  if ([2, 3, 45, 48].includes(code)) {
    return ICONS.cloudy
  }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) {
    return ICONS.rain
  }
  if ([95, 96, 99].includes(code)) {
    return ICONS.storm
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return ICONS.snow
  }
  return ICONS.cloudy
}
