"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 11.5564,
  lng: 104.9282,
};

export default function MapComponent() {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Keep map reference
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newMarker = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkers((prev) => [...prev, newMarker]);
    }
  }, []);

  const handleCurrentLocation = () => {
    console.log("handleCurrentLocation called");

    if (!navigator.geolocation) {
      console.log("Geolocation API not supported in this browser");
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Geolocation success:", pos);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentLocation(coords);

        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(15);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Error getting location: " + err.code + " - " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCurrentLocation}
        className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Show My Location
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={13}
        onClick={onMapClick}
        onLoad={onLoad}
      >
        {markers.map((m, i) => (
          <Marker key={i} position={m} />
        ))}
        {currentLocation && <Marker position={currentLocation} label="You" />}
      </GoogleMap>
    </div>
  );
}
