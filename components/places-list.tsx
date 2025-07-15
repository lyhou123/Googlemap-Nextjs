'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  MapPin, 
  Star, 
  Navigation,
  Bookmark,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'
import { getPlaceTypeColor } from '@/lib/utils'

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

interface PlacesListProps {
  places: PlaceResult[]
  onPlaceSelect: (coordinates: Coordinates) => void
  onSavePlace: (place: PlaceResult) => void
}

export function PlacesList({ places, onPlaceSelect, onSavePlace }: PlacesListProps) {
  const copyCoordinates = (coordinates: Coordinates) => {
    const coordString = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    navigator.clipboard.writeText(coordString)
    toast.success('Coordinates copied to clipboard!', {
      description: coordString
    })
  }

  const getPlaceTypeColorFromUtils = (type: string) => {
    return getPlaceTypeColor(type)
  }

  if (places.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Places
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click on the map to discover nearby places</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Places ({places.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {places.map((place, index) => (
            <div
              key={place.placeId || index}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm line-clamp-1">{place.name}</h3>
                {place.rating && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs">{place.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {place.address}
              </p>
              
              {place.types && place.types.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {place.types.slice(0, 2).map((type, typeIndex) => (
                    <Badge
                      key={typeIndex}
                      variant="secondary"
                      className={`text-xs ${getPlaceTypeColor(type)}`}
                    >
                      {type.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPlaceSelect(place.coordinates)}
                  className="flex-1 text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  View
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSavePlace(place)}
                  className="flex-1 text-xs"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  Save
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCoordinates(place.coordinates)}
                  className="px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
