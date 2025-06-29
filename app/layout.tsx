import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: '🖥️ Server Monitoring',
  description: 'Real-time server monitoring dashboard',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
          <img src="/ghst.png" alt="Watermark" width={32} height={32} />
        </div>
      </body>
    </html>
  )
}
