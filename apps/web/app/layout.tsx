import RootStyleRegistry from './emotion'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CH">
      <head />
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}
