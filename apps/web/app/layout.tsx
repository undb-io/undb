'use client'
import { AppShell, Button, IconPlus, Center } from '@egodb/ui'
import { useAtomValue, useSetAtom } from 'jotai'
import React from 'react'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { createTableFormDrawerOpened } from '../components/create-table-form/drawer-opened.atom'
import { tableListNumber } from '../components/tables-nav-list/table-list.atom'
import { TableNavList } from '../components/tables-nav-list/table-nav-list'
import { AtomsDevtools } from './atom-devtool'
import RootStyleRegistry from './emotion'
import Trpc from './trpc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const setOpened = useSetAtom(createTableFormDrawerOpened)
  const tableTotal = useAtomValue(tableListNumber)

  return (
    <html lang="zh-CH">
      <head />
      <body>
        <AtomsDevtools>
          <RootStyleRegistry>
            <Trpc>
              <AppShell
                padding={0}
                navbar={<TableNavList />}
                sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
              >
                {children}
                {!tableTotal && (
                  <Center style={{ height: '100%' }}>
                    <Button leftIcon={<IconPlus size={14} />} variant="outline" onClick={() => setOpened(true)}>
                      New table
                    </Button>
                  </Center>
                )}
                <CreateTableFormDrawer />
              </AppShell>
            </Trpc>
          </RootStyleRegistry>
        </AtomsDevtools>
      </body>
    </html>
  )
}
