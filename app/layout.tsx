import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lie Detection',
  description: 'Created with Nextjs, Tailwind CSS, and TypeScript',
  generator: 'HJ',
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
