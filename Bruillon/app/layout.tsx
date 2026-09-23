import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'FIFA26 / Control — World Cup 2026', description: 'Plateforme immersive de suivi de la Coupe du Monde FIFA 2026.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html> }
