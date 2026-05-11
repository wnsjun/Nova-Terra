import { useState } from 'react'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import MapPropertyPopup from './MapPropertyPopup'

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      { invert_lightness: true },
      { saturation: 10 },
      { lightness: 30 },
      { gamma: 0.5 },
      { hue: '#435158' },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ lightness: 40 }],
  },
]

interface MapProperty {
  id: string
  name: string
  address: string
  coverImageUrl: string
  buildingType: string
  occupancyRate: number
  totalMonthlyRent: number
  totalValuation: number
  pricePerToken: number
  latitude: number
  longitude: number
}

interface PropertyMapProps {
  properties?: MapProperty[]
  onPropertyClick?: (id: string) => void
}

export default function PropertyMap({ properties = [], onPropertyClick }: PropertyMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedProperty = properties.find(p => p.id === selectedId) ?? null

  return (
    <div className="w-full h-full overflow-hidden relative">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 37.53, lng: 127.0276 }}
          defaultZoom={13}
          styles={MAP_STYLES}
          disableDefaultUI
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
          onClick={() => setSelectedId(null)}
        >
          {properties.map(p => (
            <Marker
              key={p.id}
              position={{ lat: p.latitude, lng: p.longitude }}
              onClick={() => setSelectedId(prev => prev === p.id ? null : p.id)}
              icon={{
                url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${selectedId === p.id ? '%231ABCF7' : 'white'}"/><circle cx="14" cy="14" r="5" fill="${selectedId === p.id ? 'white' : '%23555'}"/></svg>`,
                scaledSize: { width: 28, height: 40 } as google.maps.Size,
              }}
            />
          ))}
        </Map>
      </APIProvider>

      {/* 팝업 — 지도 컨테이너 안에서 절대 위치로 렌더링 */}
      {selectedProperty && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <MapPropertyPopup
            property={selectedProperty}
            onClose={() => setSelectedId(null)}
            onClick={() => {
              setSelectedId(null)
              onPropertyClick?.(selectedProperty.id)
            }}
          />
        </div>
      )}
    </div>
  )
}
