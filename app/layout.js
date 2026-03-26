import './globals.css'

export const metadata = {
  title: 'Levion - Health Tracker',
  description: 'Track your medicines, water, exercise, coffee & mood',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
