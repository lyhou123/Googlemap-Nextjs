'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useGoogleMaps } from './google-maps-provider'

interface Coordinates {
  lat: number
  lng: number
}

interface PlaceResult {
  name: string
  address: string
  coordinates: Coordinates
  placeId: string
  rating?: number
  types?: string[]
}

interface GoogleMapProps {
  className?: string
  center?: Coordinates
  zoom?: number
  onLocationSelect?: (coordinates: Coordinates) => void
  onPlacesFound?: (places: PlaceResult[]) => void
  mapType?: string
  mapStyle?: string
  isDrawingMode?: boolean
  onDistanceMeasured?: (distance: number) => void
  isTrafficEnabled?: boolean
  isTransitEnabled?: boolean
  isBicyclingEnabled?: boolean
}

export function GoogleMap({ 
  className = "w-full h-96", 
  center = { lat: 40.7128, lng: -74.006 }, 
  zoom = 12,
  onLocationSelect,
  onPlacesFound,
  mapType = 'roadmap',
  mapStyle = 'default',
  isDrawingMode = false,
  onDistanceMeasured,
  isTrafficEnabled = false,
  isTransitEnabled = false,
  isBicyclingEnabled = false
}: GoogleMapProps) {
  const { isLoaded } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null)

  // Define map styles
  const getMapStyles = (style: string): google.maps.MapTypeStyle[] => {
    switch (style) {
      case 'dark':
        return [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ]
      case 'retro':
        return [
          { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c9b2a6' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#dcd2be' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ae9e90' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#93817c' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#a5b076' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#447530' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#fdfcf8' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#f8c967' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e9bc62' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{ color: '#e98d58' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#db8555' }]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#806b63' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8f7d77' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ebe3cd' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#b9d3c2' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#92998d' }]
          }
        ]
      case 'night':
        return [
          { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4b6878' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64779e' }]
          },
          {
            featureType: 'administrative.province',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4b6878' }]
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#334e87' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#023e58' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#283d6a' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6f9ba5' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1d2c4d' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#023e58' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#3C7680' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#304a7d' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#98a5be' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1d2c4d' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#2c6675' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#255763' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#b0d5ce' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#023e58' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#98a5be' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1d2c4d' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry.fill',
            stylers: [{ color: '#283d6a' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#3a4762' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e1626' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4e6d70' }]
          }
        ]
      case 'aubergine':
        return [
          { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4b6878' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64779e' }]
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#334e87' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#023e58' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#283d6a' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#304a7d' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#2c6675' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#255763' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e1626' }]
          }
        ]
      default:
        return [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          }
        ]
    }
  }

  // Search nearby places
  const searchNearbyPlaces = useCallback((coords: Coordinates) => {
    if (!map || !isLoaded) return

    const service = new google.maps.places.PlacesService(map)
    const request = {
      location: coords,
      radius: 1000,
      type: 'point_of_interest'
    }

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const places: PlaceResult[] = results.slice(0, 10).map(place => ({
          name: place.name || 'Unknown',
          address: place.vicinity || 'No address',
          coordinates: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          },
          placeId: place.place_id || '',
          rating: place.rating,
          types: place.types
        }))
        onPlacesFound?.(places)
      }
    })
  }, [map, isLoaded, onPlacesFound])

  // Handle location selection
  const handleLocationSelect = useCallback((coords: Coordinates) => {
    if (!map || !isLoaded) return

    // Remove existing marker and info window
    if (marker) {
      marker.setMap(null)
    }
    if (infoWindow) {
      infoWindow.close()
    }

    // Create custom marker with enhanced styling
    const newMarker = new google.maps.Marker({
      position: coords,
      map: map,
      title: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <circle cx="20" cy="20" r="4" fill="#1E40AF"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    })

    // Create info window with coordinates
    const newInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; font-family: system-ui;">
          <div style="font-weight: 600; color: #1E40AF; margin-bottom: 4px;">📍 Selected Location</div>
          <div style="font-size: 12px; color: #6B7280;">
            <div><strong>Lat:</strong> ${coords.lat.toFixed(6)}</div>
            <div><strong>Lng:</strong> ${coords.lng.toFixed(6)}</div>
          </div>
        </div>
      `
    })

    // Add click listener to marker to show info window
    newMarker.addListener('click', () => {
      newInfoWindow.open(map, newMarker)
    })

    setMarker(newMarker)
    setInfoWindow(newInfoWindow)
    onLocationSelect?.(coords)
    searchNearbyPlaces(coords)
  }, [map, marker, infoWindow, isLoaded, onLocationSelect, searchNearbyPlaces])

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: getMapStyles(mapStyle)
      })

      // Initialize Drawing Manager
      const drawingManagerInstance = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#1d4ed8',
        },
        polylineOptions: {
          strokeWeight: 3,
          strokeColor: '#1d4ed8',
        },
        circleOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#1d4ed8',
        },
      })

      drawingManagerInstance.setMap(mapInstance)
      setDrawingManager(drawingManagerInstance)

      // Add distance measurement for polylines
      drawingManagerInstance.addListener('polylinecomplete', (polyline: google.maps.Polyline) => {
        const path = polyline.getPath()
        let distance = 0
        
        for (let i = 0; i < path.getLength() - 1; i++) {
          const from = path.getAt(i)
          const to = path.getAt(i + 1)
          distance += google.maps.geometry.spherical.computeDistanceBetween(from, to)
        }
        
        onDistanceMeasured?.(distance)
      })

      // Map click handler
      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng && !isDrawingMode) {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          handleLocationSelect({ lat, lng })
        }
      })

      setMap(mapInstance)
    }
  }, [isLoaded, center, zoom, map, handleLocationSelect, isDrawingMode, onDistanceMeasured, mapStyle])

  // Handle layer toggles
  useEffect(() => {
    if (!map || !isLoaded) return

    // Traffic Layer
    const trafficLayer = new google.maps.TrafficLayer()
    if (isTrafficEnabled) {
      trafficLayer.setMap(map)
    } else {
      trafficLayer.setMap(null)
    }

    // Transit Layer
    const transitLayer = new google.maps.TransitLayer()
    if (isTransitEnabled) {
      transitLayer.setMap(map)
    } else {
      transitLayer.setMap(null)
    }

    // Bicycling Layer
    const bicyclingLayer = new google.maps.BicyclingLayer()
    if (isBicyclingEnabled) {
      bicyclingLayer.setMap(map)
    } else {
      bicyclingLayer.setMap(null)
    }

    // Cleanup function
    return () => {
      trafficLayer.setMap(null)
      transitLayer.setMap(null)
      bicyclingLayer.setMap(null)
    }
  }, [map, isLoaded, isTrafficEnabled, isTransitEnabled, isBicyclingEnabled])

  // Update map style
  useEffect(() => {
    if (map && isLoaded) {
      map.setOptions({ styles: getMapStyles(mapStyle) })
    }
  }, [map, mapStyle, isLoaded])

  // Update map type
  useEffect(() => {
    if (map && isLoaded) {
      const mapTypeId = google.maps.MapTypeId[mapType.toUpperCase() as keyof typeof google.maps.MapTypeId]
      if (mapTypeId) {
        map.setMapTypeId(mapTypeId)
      }
    }
  }, [map, mapType, isLoaded])

  // Update drawing mode
  useEffect(() => {
    if (drawingManager && isLoaded) {
      if (isDrawingMode) {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE)
      } else {
        drawingManager.setDrawingMode(null)
      }
    }
  }, [drawingManager, isDrawingMode, isLoaded])

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className={className} />
}
