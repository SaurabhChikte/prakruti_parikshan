import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "પ્રકૃતિ પરીક્ષણ - Children's Research University",
  description: "Ayurvedic constitution assessment survey",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="gu">
      <body>{children}</body>
    </html>
  )
}
