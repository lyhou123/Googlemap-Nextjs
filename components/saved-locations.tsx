'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Bookmark,
  Trash2,
  Navigation,
  Copy,
  Plus,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface Coordinates {
  lat: number
  lng: number
}

interface SavedLocation {
  id: string
  name: string
  coordinates: Coordinates
  timestamp: Date
  notes?: string
}

interface SavedLocationsProps {
  savedLocations: SavedLocation[]
  onLocationSelect: (coordinates: Coordinates) => void
  onSaveLocation: (location: Omit<SavedLocation, 'id' | 'timestamp'>) => void
  onDeleteLocation: (id: string) => void
  currentCoordinates?: Coordinates
}

export function SavedLocations({
  savedLocations,
  onLocationSelect,
  onSaveLocation,
  onDeleteLocation,
  currentCoordinates
}: SavedLocationsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [newLocationNotes, setNewLocationNotes] = useState('')

  const handleSaveCurrentLocation = () => {
    if (!currentCoordinates) {
      toast.error('No location selected')
      return
    }

    if (!newLocationName.trim()) {
      toast.error('Please enter a location name')
      return
    }

    onSaveLocation({
      name: newLocationName.trim(),
      coordinates: currentCoordinates,
      notes: newLocationNotes.trim() || undefined
    })

    setNewLocationName('')
    setNewLocationNotes('')
    setIsAdding(false)
    toast.success('Location saved successfully!')
  }

  const copyCoordinates = (coordinates: Coordinates) => {
    const coordString = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    navigator.clipboard.writeText(coordString)
    toast.success('Coordinates copied to clipboard!')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Locations ({savedLocations.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            disabled={!currentCoordinates}
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="border rounded-lg p-3 mb-4 bg-blue-50">
            <div className="space-y-3">
              <div>
                <Label htmlFor="location-name">Location Name</Label>
                <Input
                  id="location-name"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <Label htmlFor="location-notes">Notes (optional)</Label>
                <Input
                  id="location-notes"
                  value={newLocationNotes}
                  onChange={(e) => setNewLocationNotes(e.target.value)}
                  placeholder="Add notes about this location"
                />
              </div>
              {currentCoordinates && (
                <div className="text-xs text-muted-foreground">
                  Coordinates: {currentCoordinates.lat.toFixed(6)}, {currentCoordinates.lng.toFixed(6)}
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveCurrentLocation}>
                  Save Location
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {savedLocations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No saved locations yet</p>
            <p className="text-sm">Click on the map and save interesting places</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">{location.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(location.timestamp)}
                  </Badge>
                </div>
                
                {location.notes && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {location.notes}
                  </p>
                )}
                
                <div className="text-xs text-muted-foreground mb-3">
                  {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLocationSelect(location.coordinates)}
                    className="flex-1 text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Go To
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCoordinates(location.coordinates)}
                    className="px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteLocation(location.id)}
                    className="px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
