'use client'

import { CacheProvider, EgoUIProvider, modalStyles, useEmotionCache } from '@egodb/ui'
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
      <EgoUIProvider
        theme={{
          primaryColor: 'indigo',
          components: {
            Modal: {
              styles: modalStyles,
            },
            Drawer: {
              styles: modalStyles,
            },
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </EgoUIProvider>
    </CacheProvider>
  )
}
