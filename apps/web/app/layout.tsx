import RootStyleRegistry from './emotion'
import Trpc from './trpc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CH">
      <head />
      <body>
        <RootStyleRegistry>
          <Trpc>{children}</Trpc>
        </RootStyleRegistry>
      </body>
    </html>
  )
}
