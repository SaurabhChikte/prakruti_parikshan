"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Redirect to the survey page
    window.location.href = "/survey"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">લોડ થઈ રહ્યું છે...</p>
        <p className="text-sm text-gray-500 mt-2">પ્રકૃતિ પરીક્ષણ</p>
      </div>
    </div>
  )
}
