'use client'
import { createStore, PersistGate } from '@egodb/store'
import { AppShell, Stack } from '@egodb/ui'
import React from 'react'
import { Provider } from 'react-redux'
import { TableList } from '../features/table/table-list'
import { AtomsDevtools } from './atom-devtool'
import RootStyleRegistry from './emotion'
import dynamic from 'next/dynamic'
import { I18n } from '../i18n/i18n'

const CreateTableFormDrawer = dynamic(() =>
  import('../features/create-table-form').then((m) => m.CreateTableFormDrawer),
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { store, persist } = createStore()

  return (
    <html lang="zh-CN">
      <head />
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persist}>
            <I18n>
              <AtomsDevtools>
                <RootStyleRegistry>
                  <AppShell
                    padding={0}
                    // header={
                    //   <Header bg="blue" height={50} p="xs">
                    //     {/* Header content */}
                    //   </Header>
                    // }
                  >
                    <Stack h="100vh" spacing={0} sx={{ overflow: 'hidden' }}>
                      <TableList />
                      {children}
                    </Stack>

                    <CreateTableFormDrawer />
                  </AppShell>
                </RootStyleRegistry>
              </AtomsDevtools>
            </I18n>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}
