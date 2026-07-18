export const metadata = {
  title: 'ILWAAD SMART SERVICES - Nidaamka Farsamada',
  description: 'Laptop & Printer Repair Center',
}

export default function RootLayout({ children }) {
  return (
    <html lang="so">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_#f8fafc_55%,_#eef2ff_100%)] font-sans">
        {children}
      </body>
    </html>
  )
}
