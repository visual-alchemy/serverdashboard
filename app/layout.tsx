import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🖥️ Server Monitoring',
  description: 'Created with love',
  generator: 'mind',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
