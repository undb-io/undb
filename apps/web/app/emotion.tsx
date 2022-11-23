'use client'

import { CacheProvider, EgoUIProvider, ModalsProvider, useEmotionCache } from '@egodb/ui'
import { useServerInsertedHTML } from 'next/navigation'

export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache()

  cache.compat = true

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ))

  return (
    <CacheProvider value={cache}>
      <EgoUIProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>{children}</ModalsProvider>
      </EgoUIProvider>
    </CacheProvider>
  )
}
