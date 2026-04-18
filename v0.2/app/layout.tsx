export const metadata = {
  title: 'AEM EDS Docs Bot',
  description: 'Ask questions about Adobe Edge Delivery Services docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#fafafa' }}>
        {children}
      </body>
    </html>
  )
}
