'use client'
import { createStore } from '@egodb/store'
import { AppShell } from '@egodb/ui'
import React from 'react'
import { Provider } from 'react-redux'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { TableList } from '../components/table/table-list'
import { AtomsDevtools } from './atom-devtool'
import RootStyleRegistry from './emotion'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const store = createStore()

  return (
    <html lang="zh-CH">
      <head />
      <body>
        <Provider store={store}>
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
                <TableList />
                {children}
                <CreateTableFormDrawer />
              </AppShell>
            </RootStyleRegistry>
          </AtomsDevtools>
        </Provider>
      </body>
    </html>
  )
}
