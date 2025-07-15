'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { 
  Map, 
  Satellite, 
  Navigation, 
  Ruler, 
  RotateCcw, 
  Download,
  Layers,
  Zap,
  Upload,
  Share2,
  Settings,
  Camera,
  Route,
  Search,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'

interface MapControlsProps {
  mapType: string
  onMapTypeChange: (type: string) => void
  isDrawingMode: boolean
  onDrawingModeChange: (enabled: boolean) => void
  onGetCurrentLocation: () => Promise<void>
  onResetView: () => void
  onExportData: () => void
  distance?: number
  onImportData?: () => void
  onQuickSearch?: (query: string) => void
  onMapStyleChange?: (style: string) => void
  onShareLocation?: () => void
  onCaptureMap?: () => void
  onZoomTo?: (coords: { lat: number; lng: number }, zoom?: number) => void
  isTrafficEnabled?: boolean
  onTrafficToggle?: (enabled: boolean) => void
  isTransitEnabled?: boolean
  onTransitToggle?: (enabled: boolean) => void
  isBicyclingEnabled?: boolean
  onBicyclingToggle?: (enabled: boolean) => void
}

export function MapControls({
  mapType,
  onMapTypeChange,
  isDrawingMode,
  onDrawingModeChange,
  onGetCurrentLocation,
  onResetView,
  onExportData,
  distance,
  onImportData,
  onQuickSearch,
  onMapStyleChange,
  onShareLocation,
  onCaptureMap,
  onZoomTo,
  isTrafficEnabled = false,
  onTrafficToggle,
  isTransitEnabled = false,
  onTransitToggle,
  isBicyclingEnabled = false,
  onBicyclingToggle
}: MapControlsProps) {
  const [quickSearchCoords, setQuickSearchCoords] = useState('')
  const [mapStyle, setMapStyle] = useState('default')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Sync internal state with external map style
  useEffect(() => {
    if (mapType) {
      setMapStyle('default') // Reset to default when map type changes
    }
  }, [mapType])

  const mapTypes = [
    { value: 'roadmap', label: 'Roadmap', icon: Map },
    { value: 'satellite', label: 'Satellite', icon: Satellite },
    { value: 'hybrid', label: 'Hybrid', icon: Satellite },
    { value: 'terrain', label: 'Terrain', icon: Map }
  ]

  const mapStyles = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'retro', label: 'Retro' },
    { value: 'night', label: 'Night' },
    { value: 'aubergine', label: 'Aubergine' }
  ]

  const handleMapStyleChange = (style: string) => {
    setMapStyle(style)
    if (onMapStyleChange) {
      onMapStyleChange(style)
    }
  }

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      await onGetCurrentLocation()
    } catch {
      // If GPS fails, offer IP-based location as fallback
      toast.info('GPS unavailable. Trying IP-based location...')
      try {
        await getLocationFromIP()
      } catch {
        toast.error('Could not determine location', {
          description: 'Please search for your location manually'
        })
      }
    } finally {
      setTimeout(() => setIsGettingLocation(false), 1000)
    }
  }

  const getLocationFromIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      if (data.latitude && data.longitude) {
        const coordinates = {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        }
        
        // Call the parent's location select handler directly
        if (onZoomTo) {
          onZoomTo(coordinates, 12)
          toast.success('Approximate location found!', {
            description: `${data.city}, ${data.country_name}`
          })
        }
      } else {
        throw new Error('No location data from IP service')
      }
    } catch (error) {
      console.error('IP location error:', error)
      throw error
    }
  }

  const handleQuickSearch = () => {
    if (!quickSearchCoords.trim()) return
    
    if (onQuickSearch) {
      onQuickSearch(quickSearchCoords)
    } else {
      const coords = quickSearchCoords.split(',').map(c => parseFloat(c.trim()))
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        onZoomTo?.({ lat: coords[0], lng: coords[1] }, 15)
        toast.success('Navigated to coordinates')
      } else {
        toast.error('Please enter valid coordinates (lat, lng)')
      }
    }
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            JSON.parse(e.target?.result as string)
            // Handle imported data
            onImportData?.()
            toast.success('Data imported successfully!')
          } catch {
            toast.error('Invalid file format')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Location',
        text: 'Check out this location!',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Location URL copied to clipboard!')
    }
    onShareLocation?.()
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Map Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Coordinate Search */}
        <div className="space-y-2">
          <Label htmlFor="quick-search">Quick Jump to Coordinates</Label>
          <div className="flex gap-2">
            <Input
              id="quick-search"
              placeholder="lat, lng (e.g., 40.7128, -74.006)"
              value={quickSearchCoords}
              onChange={(e) => setQuickSearchCoords(e.target.value)}
              className="text-sm"
            />
            <Button size="sm" onClick={handleQuickSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Map Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="map-type">Map Type</Label>
          <Select value={mapType} onValueChange={onMapTypeChange}>
            <SelectTrigger id="map-type">
              <SelectValue placeholder="Select map type" />
            </SelectTrigger>
            <SelectContent>
              {mapTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Map Style Selection */}
        <div className="space-y-2">
          <Label htmlFor="map-style">Map Style</Label>
          <Select value={mapStyle} onValueChange={handleMapStyleChange}>
            <SelectTrigger id="map-style">
              <SelectValue placeholder="Select map style" />
            </SelectTrigger>
            <SelectContent>
              {mapStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    {style.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Layer Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4" />
            <Label className="text-sm font-medium">Map Layers</Label>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="traffic-layer" className="text-sm">Traffic</Label>
              <Switch
                id="traffic-layer"
                checked={isTrafficEnabled}
                onCheckedChange={onTrafficToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="transit-layer" className="text-sm">Transit</Label>
              <Switch
                id="transit-layer"
                checked={isTransitEnabled}
                onCheckedChange={onTransitToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="bicycling-layer" className="text-sm">Bicycling</Label>
              <Switch
                id="bicycling-layer"
                checked={isBicyclingEnabled}
                onCheckedChange={onBicyclingToggle}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Drawing Tools */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="drawing-mode" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Distance Measurement
            </Label>
            <Switch
              id="drawing-mode"
              checked={isDrawingMode}
              onCheckedChange={onDrawingModeChange}
            />
          </div>
          
          {distance && (
            <div className="text-sm bg-blue-50 border border-blue-200 p-2 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="h-3 w-3" />
                <strong>Measured Distance:</strong>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{(distance / 1000).toFixed(2)} km</Badge>
                <Badge variant="outline">{distance.toFixed(0)} meters</Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="justify-start"
            >
              <Navigation className={`h-4 w-4 mr-1 ${isGettingLocation ? 'animate-spin' : ''}`} />
              {isGettingLocation ? 'Finding...' : 'My Location'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetView}
              className="justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCaptureMap}
              className="justify-start"
            >
              <Camera className="h-4 w-4 mr-1" />
              Capture
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLocation}
              className="justify-start"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="justify-start"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportData}
              className="justify-start"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-4 pt-2 border-t">
          <div className="flex flex-wrap gap-1">
            {isTrafficEnabled && (
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Traffic
              </Badge>
            )}
            {isTransitEnabled && (
              <Badge variant="secondary" className="text-xs">
                <Route className="h-3 w-3 mr-1" />
                Transit
              </Badge>
            )}
            {isBicyclingEnabled && (
              <Badge variant="secondary" className="text-xs">
                <Navigation className="h-3 w-3 mr-1" />
                Cycling
              </Badge>
            )}
            {isDrawingMode && (
              <Badge variant="default" className="text-xs">
                <Ruler className="h-3 w-3 mr-1" />
                Measuring
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
