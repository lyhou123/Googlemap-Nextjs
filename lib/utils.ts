import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format coordinates for display
export function formatCoordinates(
  lat: number,
  lng: number,
  precision: number = 6
): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate coordinates
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Get place type color for badges
export function getPlaceTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    restaurant: "bg-orange-100 text-orange-800 border-orange-200",
    hospital: "bg-red-100 text-red-800 border-red-200",
    school: "bg-blue-100 text-blue-800 border-blue-200",
    bank: "bg-green-100 text-green-800 border-green-200",
    gas_station: "bg-yellow-100 text-yellow-800 border-yellow-200",
    shopping_mall: "bg-purple-100 text-purple-800 border-purple-200",
    tourist_attraction: "bg-pink-100 text-pink-800 border-pink-200",
    park: "bg-emerald-100 text-emerald-800 border-emerald-200",
    museum: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  return colorMap[type] || "bg-gray-100 text-gray-800 border-gray-200";
}
