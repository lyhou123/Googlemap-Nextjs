'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: string | null
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
})

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
}

interface GoogleMapsProviderProps {
  children: ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Google Maps is already loaded
    const isGoogleMapsLoaded = () => {
      return typeof window !== 'undefined' && 
             'google' in window &&
             typeof (window as unknown as { google: unknown }).google === 'object'
    }

    if (isGoogleMapsLoaded()) {
      setIsLoaded(true)
      return
    }

    // Load Google Maps script dynamically
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,drawing,geometry`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      console.log('Google Maps API loaded successfully')
      setIsLoaded(true)
      setLoadError(null)
    }
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API')
      setLoadError('Failed to load Google Maps API')
      setIsLoaded(false)
    }

    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}
