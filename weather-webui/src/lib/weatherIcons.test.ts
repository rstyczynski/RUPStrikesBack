import { describe, expect, it } from 'vitest'
import { mapWeatherCodeToIcon } from './weatherIcons'

describe('mapWeatherCodeToIcon', () => {
  it('returns clear icon for code 0', () => {
    const icon = mapWeatherCodeToIcon(0)
    expect(icon.label).toContain('Clear')
  })

  it('returns rain icon for precipitation codes', () => {
    const icon = mapWeatherCodeToIcon(61)
    expect(icon.label).toBe('Rain')
  })

  it('returns storm icon for thunderstorm codes', () => {
    const icon = mapWeatherCodeToIcon(96)
    expect(icon.label).toBe('Storm')
  })

  it('falls back to cloudy for unknown codes', () => {
    const icon = mapWeatherCodeToIcon(12345)
    expect(icon.label).toBe('Cloudy')
  })
})
