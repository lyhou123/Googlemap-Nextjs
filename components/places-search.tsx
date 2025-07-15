'use client'

import { useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from './google-maps-provider'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search, MapPin } from 'lucide-react'

interface Coordinates {
  lat: number
  lng: number
}

interface PlacesSearchProps {
  onPlaceSelect: (coordinates: Coordinates, address: string) => void
  placeholder?: string
}

export function PlacesSearch({ onPlaceSelect, placeholder = "Search for a place..." }: PlacesSearchProps) {
  const { isLoaded } = useGoogleMaps()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [lastSelectedPlace, setLastSelectedPlace] = useState<string>('')

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['geometry', 'formatted_address', 'name']
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          const address = place.formatted_address || place.name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          
          onPlaceSelect({ lat, lng }, address)
          setSearchValue(address)
          setLastSelectedPlace(address) // Mark this as a selected place
        }
      })

      autocompleteRef.current = autocomplete
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [isLoaded, onPlaceSelect])

  const performSearch = async () => {
    if (!searchValue.trim() || !geocoderRef.current) return

    // If the current search value is the same as the last selected place from autocomplete,
    // don't search again to avoid ZERO_RESULTS error
    if (searchValue === lastSelectedPlace) {
      return
    }

    try {
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoderRef.current!.geocode(
          { address: searchValue },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results)
            } else {
              reject(new Error(`Geocoding failed: ${status}`))
            }
          }
        )
      })

      if (results.length > 0) {
        const result = results[0]
        const lat = result.geometry.location.lat()
        const lng = result.geometry.location.lng()
        const address = result.formatted_address

        onPlaceSelect({ lat, lng }, address)
        setSearchValue(address)
        setLastSelectedPlace(address)
      }
    } catch (error) {
      console.error('Search failed:', error)
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('ZERO_RESULTS')) {
        console.warn('No results found for:', searchValue)
      }
    }
  }

  const handleSearch = () => {
    performSearch()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      performSearch()
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            // Reset last selected place when user manually types
            if (e.target.value !== lastSelectedPlace) {
              setLastSelectedPlace('')
            }
          }}
          onKeyPress={handleKeyPress}
          className="pl-10"
          disabled={!isLoaded}
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={!isLoaded || !searchValue}
        size="default"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
