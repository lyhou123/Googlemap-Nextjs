import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { GoogleMapsProvider } from "@/components/google-maps-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Advanced Google Maps Explorer",
  description: "Rich mapping application with Google Maps API",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleMapsProvider>
          {children}
          <Toaster />
        </GoogleMapsProvider>
      </body>
    </html>
  )
}
