'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { 
  MapPin, 
  Copy, 
  Navigation, 
  Share2,
  ExternalLink 
} from 'lucide-react'
import { toast } from 'sonner'

interface Coordinates {
  lat: number
  lng: number
}

interface CoordinatesDisplayProps {
  coordinates: Coordinates | null
  onGoToCoordinates?: (coordinates: Coordinates) => void
}

export function CoordinatesDisplay({ coordinates, onGoToCoordinates }: CoordinatesDisplayProps) {
  const [customLat, setCustomLat] = useState('')
  const [customLng, setCustomLng] = useState('')

  const copyCoordinates = () => {
    if (!coordinates) return
    
    const coordString = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    navigator.clipboard.writeText(coordString)
    toast.success('Coordinates copied to clipboard!')
  }

  const shareLocation = () => {
    if (!coordinates) return
    
    const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Location Coordinates',
        text: `Check out this location: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
        url: googleMapsUrl
      })
    } else {
      navigator.clipboard.writeText(googleMapsUrl)
      toast.success('Google Maps link copied to clipboard!')
    }
  }

  const openInGoogleMaps = () => {
    if (!coordinates) return
    
    const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    window.open(googleMapsUrl, '_blank')
  }

  const handleGoToCustomCoordinates = () => {
    const lat = parseFloat(customLat)
    const lng = parseFloat(customLng)
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid coordinates')
      return
    }
    
    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90')
      return
    }
    
    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180')
      return
    }
    
    onGoToCoordinates?.({ lat, lng })
    setCustomLat('')
    setCustomLng('')
    toast.success('Navigating to coordinates')
  }

  const formatCoordinate = (value: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S') 
      : (value >= 0 ? 'E' : 'W')
    return `${Math.abs(value).toFixed(6)}° ${direction}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Coordinates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selected Coordinates */}
        {coordinates ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Selected Location</Label>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Latitude:</span>
                  <span className="font-mono text-blue-800">
                    {formatCoordinate(coordinates.lat, 'lat')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Longitude:</span>
                  <span className="font-mono text-blue-800">
                    {formatCoordinate(coordinates.lng, 'lng')}
                  </span>
                </div>
              </div>
              
              <Separator className="bg-blue-200" />
              
              <div className="text-xs text-blue-600 font-mono text-center">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyCoordinates}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareLocation}
                className="justify-start"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openInGoogleMaps}
              className="w-full justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click anywhere on the map to see coordinates</p>
          </div>
        )}
        
        <Separator />
        
        {/* Manual Coordinate Input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Go to Coordinates</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="custom-lat" className="text-xs">Latitude</Label>
              <Input
                id="custom-lat"
                type="number"
                placeholder="40.7128"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="text-sm"
                step="any"
                min="-90"
                max="90"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="custom-lng" className="text-xs">Longitude</Label>
              <Input
                id="custom-lng"
                type="number"
                placeholder="-74.006"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="text-sm"
                step="any"
                min="-180"
                max="180"
              />
            </div>
          </div>
          
          <Button
            onClick={handleGoToCustomCoordinates}
            disabled={!customLat || !customLng}
            size="sm"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Go to Location
          </Button>
        </div>
        
        {/* Coordinate Format Help */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Coordinate Formats:</p>
          <p>• Decimal: 40.7128, -74.0060</p>
          <p>• Range: Lat (-90 to 90), Lng (-180 to 180)</p>
        </div>
      </CardContent>
    </Card>
  )
}
