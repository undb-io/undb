'use client'

import { CacheProvider, EgoUIProvider, ModalsProvider, modalStyles, useEmotionCache } from '@egodb/ui'
import { useServerInsertedHTML } from 'next/navigation'
import { UDPATE_OPTION_MODAL_ID, UpdateOptionModal } from '../components/update-option-form/update-option-modal'

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
        <ModalsProvider modals={{ [UDPATE_OPTION_MODAL_ID]: UpdateOptionModal }}>{children}</ModalsProvider>
      </EgoUIProvider>
    </CacheProvider>
  )
}
