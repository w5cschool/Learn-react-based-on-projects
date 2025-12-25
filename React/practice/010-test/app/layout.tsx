import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Testimonials - What Our Users Say',
  description: 'See what our users are saying about our product',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

