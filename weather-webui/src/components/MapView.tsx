import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './MapView.module.css'

// Fix Leaflet default icon issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export interface MapViewProps {
  latitude: number
  longitude: number
  cityName?: string
}

export function MapView({ latitude, longitude, cityName }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerInstance = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, {
        center: [latitude, longitude],
        zoom: 10,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current)
    }

    // Update map center and marker when coordinates change
    mapInstance.current.setView([latitude, longitude], 10)

    // Remove existing marker if present
    if (markerInstance.current) {
      markerInstance.current.remove()
    }

    // Add new marker
    markerInstance.current = L.marker([latitude, longitude])
      .addTo(mapInstance.current)
      .bindPopup(cityName || 'Location')
      .openPopup()

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [latitude, longitude, cityName])

  return <div ref={mapContainer} className={styles.mapContainer} />
}
