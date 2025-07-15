'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin, Copy, X } from 'lucide-react'
import { toast } from 'sonner'

interface Coordinates {
  lat: number
  lng: number
}

interface FloatingCoordinateDisplayProps {
  coordinates: Coordinates | null
  onClose?: () => void
}

export function FloatingCoordinateDisplay({ coordinates, onClose }: FloatingCoordinateDisplayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (coordinates) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [coordinates])

  const copyCoordinates = () => {
    if (!coordinates) return
    
    const coordString = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    navigator.clipboard.writeText(coordString)
    toast.success('Coordinates copied!', {
      description: coordString
    })
  }

  const formatCoordinate = (value: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S') 
      : (value >= 0 ? 'E' : 'W')
    return `${Math.abs(value).toFixed(6)}° ${direction}`
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible || !coordinates) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
      <Card className="w-80 shadow-lg border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Location Selected</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Coordinates Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Latitude:</span>
                  <Badge variant="secondary" className="font-mono text-blue-800 bg-blue-100">
                    {formatCoordinate(coordinates.lat, 'lat')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Longitude:</span>
                  <Badge variant="secondary" className="font-mono text-blue-800 bg-blue-100">
                    {formatCoordinate(coordinates.lng, 'lng')}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="text-center">
                  <span className="text-xs text-blue-600 font-mono">
                    {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={copyCoordinates}
              className="w-full justify-center hover:bg-blue-50 border-blue-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Coordinates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
