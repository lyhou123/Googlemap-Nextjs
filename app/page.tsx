'use client'

import { useState, useCallback } from 'react'
import { useGoogleMaps } from '@/components/google-maps-provider'
import { GoogleMap } from '@/components/google-map'
import { PlacesSearch } from '@/components/places-search'
import { MapControls } from '@/components/map-controls'
import { PlacesList } from '@/components/places-list'
import { SavedLocations } from '@/components/saved-locations'
import { CoordinatesDisplay } from '@/components/coordinates-display'
import { FloatingCoordinateDisplay } from '@/components/floating-coordinate-display'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin } from 'lucide-react'
import { toast } from 'sonner'

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

interface SavedLocation {
  id: string
  name: string
  coordinates: Coordinates
  timestamp: Date
  notes?: string
}

export default function GoogleMapsApp() {
  const { isLoaded, loadError } = useGoogleMaps()
  
  // Map state
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>({ lat: 40.7128, lng: -74.006 })
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null)
  const [mapType, setMapType] = useState('roadmap')
  const [mapStyle, setMapStyle] = useState('default')
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [distance, setDistance] = useState<number>()
  
  // Enhanced map layer states
  const [isTrafficEnabled, setIsTrafficEnabled] = useState(false)
  const [isTransitEnabled, setIsTransitEnabled] = useState(false)
  const [isBicyclingEnabled, setIsBicyclingEnabled] = useState(false)
  
  // Places state
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceResult[]>([])
  
  // Saved locations state
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])

  // Handle location selection from map or search
  const handleLocationSelect = useCallback((coordinates: Coordinates) => {
    setCurrentCoordinates(coordinates)
    setSelectedCoordinates(coordinates)
    toast.success('Location selected', {
      description: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    })
  }, [])

  // Handle place selection from search
  const handlePlaceSelect = useCallback((coordinates: Coordinates, address: string) => {
    setCurrentCoordinates(coordinates)
    toast.success('Place selected', {
      description: address
    })
  }, [])

  // Handle nearby places found
  const handlePlacesFound = useCallback((places: PlaceResult[]) => {
    setNearbyPlaces(places)
    if (places.length > 0) {
      toast.success(`Found ${places.length} nearby places`)
    }
  }, [])

  // Handle saving a place to saved locations
  const handleSavePlace = useCallback((place: PlaceResult) => {
    const savedLocation: SavedLocation = {
      id: `${Date.now()}-${Math.random()}`,
      name: place.name,
      coordinates: place.coordinates,
      timestamp: new Date(),
      notes: place.address
    }
    setSavedLocations(prev => [savedLocation, ...prev])
    toast.success('Place saved successfully!')
  }, [])

  // Handle saving a custom location
  const handleSaveLocation = useCallback((location: Omit<SavedLocation, 'id' | 'timestamp'>) => {
    const savedLocation: SavedLocation = {
      ...location,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    }
    setSavedLocations(prev => [savedLocation, ...prev])
  }, [])

  // Handle deleting a saved location
  const handleDeleteLocation = useCallback((id: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== id))
    toast.success('Location deleted')
  }, [])

  // Handle current location
  const handleGetCurrentLocation = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMessage = 'Geolocation not supported by this browser'
        toast.error(errorMessage)
        reject(new Error(errorMessage))
        return
      }

      toast.info('Getting your current location...')
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          handleLocationSelect(coordinates)
          toast.success('Current location found!', {
            description: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
          })
          resolve()
        },
        (error) => {
          let errorMessage = 'Unable to get current location'
          let suggestion = ''
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied'
              suggestion = 'Please allow location access and try again'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              suggestion = 'Try using WiFi or check your GPS settings'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              suggestion = 'Please try again or check your connection'
              break
            default:
              errorMessage = 'Unknown location error'
              suggestion = 'Please try again later'
          }
          
          toast.error(errorMessage, {
            description: suggestion,
            duration: 5000
          })
          console.error('Geolocation error:', error)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: false, // Change to false for better compatibility
          timeout: 15000, // Increase timeout
          maximumAge: 300000 // Accept cached position up to 5 minutes old
        }
      )
    })
  }, [handleLocationSelect])

  // Handle reset view
  const handleResetView = useCallback(() => {
    setCurrentCoordinates({ lat: 40.7128, lng: -74.006 })
    setNearbyPlaces([])
    setDistance(undefined)
    toast.success('View reset to default')
  }, [])

  // Handle export data
  const handleExportData = useCallback(() => {
    const data = {
      savedLocations,
      currentLocation: currentCoordinates,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `google-maps-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }, [savedLocations, currentCoordinates])

  // Handle zoom to coordinates
  const handleZoomTo = useCallback((coordinates: Coordinates, zoom = 15) => {
    setCurrentCoordinates(coordinates)
    // Note: zoom level would be used when implementing map zoom functionality
    toast.success(`Map centered on coordinates (zoom: ${zoom})`)
  }, [])

  // Handle map capture
  const handleCaptureMap = useCallback(() => {
    // This would typically use html2canvas or similar
    toast.success('Map capture feature - would take screenshot')
  }, [])

  // Handle share location
  const handleShareLocation = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?lat=${currentCoordinates.lat}&lng=${currentCoordinates.lng}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this location',
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Location URL copied to clipboard!')
    }
  }, [currentCoordinates])

  // Handle import data
  const handleImportData = useCallback(() => {
    // This would handle the imported data
    toast.success('Import data handler ready')
  }, [])

  // Handle quick search
  const handleQuickSearch = useCallback((query: string) => {
    if (!query.trim()) return
    
    // This would implement quick search functionality
    toast.success(`Quick search: ${query}`)
  }, [])

  // Handle map style change
  const handleMapStyleChange = useCallback((style: string) => {
    setMapStyle(style)
    toast.success(`Map style changed to ${style}`)
  }, [])

  // Handle go to coordinates from coordinates display
  const handleGoToCoordinates = useCallback((coordinates: Coordinates) => {
    setCurrentCoordinates(coordinates)
    setSelectedCoordinates(coordinates)
    toast.success('Navigated to coordinates', {
      description: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    })
  }, [])

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Google Maps</h1>
          <p className="text-gray-600">{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Coordinate Display */}
      <FloatingCoordinateDisplay 
        coordinates={selectedCoordinates}
        onClose={() => setSelectedCoordinates(null)}
      />
      
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Advanced Google Maps Explorer</h1>
          <p className="text-muted-foreground">
            Discover places, save locations, and measure distances with our powerful mapping tools
          </p>
          {selectedCoordinates && (
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Selected: <span className="font-mono font-medium">
                  {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <PlacesSearch
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for places, addresses, or landmarks..."
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <GoogleMap
                className="w-full h-[600px]"
                center={currentCoordinates}
                zoom={12}
                onLocationSelect={handleLocationSelect}
                onPlacesFound={handlePlacesFound}
                mapType={mapType}
                mapStyle={mapStyle}
                isDrawingMode={isDrawingMode}
                onDistanceMeasured={setDistance}
                isTrafficEnabled={isTrafficEnabled}
                isTransitEnabled={isTransitEnabled}
                isBicyclingEnabled={isBicyclingEnabled}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Map Controls */}
            <MapControls
              mapType={mapType}
              onMapTypeChange={setMapType}
              isDrawingMode={isDrawingMode}
              onDrawingModeChange={setIsDrawingMode}
              onGetCurrentLocation={handleGetCurrentLocation}
              onResetView={handleResetView}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onQuickSearch={handleQuickSearch}
              onMapStyleChange={handleMapStyleChange}
              onZoomTo={handleZoomTo}
              onCaptureMap={handleCaptureMap}
              onShareLocation={handleShareLocation}
              distance={distance}
              isTrafficEnabled={isTrafficEnabled}
              onTrafficToggle={setIsTrafficEnabled}
              isTransitEnabled={isTransitEnabled}
              onTransitToggle={setIsTransitEnabled}
              isBicyclingEnabled={isBicyclingEnabled}
              onBicyclingToggle={setIsBicyclingEnabled}
            />

            {/* Tabs for Places, Saved Locations, and Coordinates */}
            <Tabs defaultValue="coordinates" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="places">Places</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="coordinates">Coords</TabsTrigger>
              </TabsList>
              
              <TabsContent value="places" className="mt-4">
                <PlacesList
                  places={nearbyPlaces}
                  onPlaceSelect={handleLocationSelect}
                  onSavePlace={handleSavePlace}
                />
              </TabsContent>
              
              <TabsContent value="saved" className="mt-4">
                <SavedLocations
                  savedLocations={savedLocations}
                  onLocationSelect={handleLocationSelect}
                  onSaveLocation={handleSaveLocation}
                  onDeleteLocation={handleDeleteLocation}
                  currentCoordinates={currentCoordinates}
                />
              </TabsContent>
              
              <TabsContent value="coordinates" className="mt-4">
                <CoordinatesDisplay
                  coordinates={selectedCoordinates}
                  onGoToCoordinates={handleGoToCoordinates}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        {isLoaded && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Current location: {currentCoordinates.lat.toFixed(6)}, {currentCoordinates.lng.toFixed(6)}
            {selectedCoordinates && (
              <span className="text-blue-600 font-medium">
                {' • Selected: '}{selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
              </span>
            )}
            {savedLocations.length > 0 && ` • ${savedLocations.length} saved location${savedLocations.length === 1 ? '' : 's'}`}
            {nearbyPlaces.length > 0 && ` • ${nearbyPlaces.length} nearby place${nearbyPlaces.length === 1 ? '' : 's'}`}
          </div>
        )}
      </div>
    </div>
  )
}
