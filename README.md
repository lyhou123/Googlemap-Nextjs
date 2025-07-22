# Advanced Google Maps Explorer

A powerful, modern web application built with Next.js 15, TypeScript, and Google Maps API that provides rich mapping features with a clean, intuitive UI using Shadcn components.

![Google Maps Explorer](https://img.shields.io/badge/Next.js-15.4.1-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/Shadcn%2Fui-Components-black)

## ✨ Features

### 🗺️ Core Mapping
- **Interactive Google Maps** with multiple map types (roadmap, satellite, hybrid, terrain)
- **Click-to-place markers** with precise coordinates
- **Real-time location display** with coordinate formatting
- **Map controls** for zoom, street view, and fullscreen

### 🔍 Search & Discovery
- **Places Autocomplete** - Search for any location, business, or landmark
- **Nearby Places Detection** - Automatically discover points of interest around selected locations
- **Smart Filtering** - Places categorized by type (restaurants, hospitals, schools, etc.)
- **Rating Display** - See Google ratings for discovered places

### 📍 Location Management
- **Save Locations** - Bookmark interesting places with custom names and notes
- **Location Library** - Manage your saved locations with timestamps
- **Quick Navigation** - Jump to any saved location instantly
- **Export/Import** - Backup your saved locations as JSON

### 📏 Measurement Tools
- **Distance Measurement** - Draw lines to measure distances between points
- **Real-time Calculations** - See distances in both kilometers and meters
- **Drawing Tools** - Toggle drawing mode for precise measurements

### 🎨 Modern UI/UX
- **Clean Design** - Modern interface using Shadcn/ui components
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme Support** - Adaptable to user preferences
- **Toast Notifications** - Real-time feedback for all actions
- **Loading States** - Smooth loading indicators throughout the app

### 🚀 Advanced Features
- **Current Location** - Get your GPS coordinates with one click
- **Copy Coordinates** - Easily copy lat/lng to clipboard
- **Data Export** - Export all your data as JSON for backup
- **Error Handling** - Graceful error handling with user-friendly messages

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/ui
- **Maps**: Google Maps JavaScript API
- **State Management**: React Hooks
- **Notifications**: Sonner
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Maps API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/lyhou123/Googlemap-Nextjs.git
cd Googlemap-Nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Google Maps API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key (recommended for production)

## 📱 Usage Guide

### Basic Usage
1. **Search for places** using the search bar at the top
2. **Click on the map** to place markers and discover nearby places
3. **Use map controls** in the sidebar to change map types and enable drawing mode
4. **Save interesting locations** for future reference

### Advanced Features
- **Distance Measurement**: Toggle drawing mode and draw lines to measure distances
- **Location Management**: Use the "Saved" tab to manage your bookmarked locations
- **Data Export**: Click "Export Data" to download your saved locations
- **Current Location**: Use "Current Location" button to center map on your position


Made with ❤️ using Next.js and Google Maps API
