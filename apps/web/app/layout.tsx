'use client'
import { AppShell, Button, IconPlus, Center } from '@egodb/ui'
import { useAtom } from 'jotai'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { createTableFormDrawerOpened } from '../components/create-table-form/drawer-opened.atom'
import { TableNavList } from '../components/tables-nav-list/table-nav-list'
import { AtomsDevtools } from './atom-devtool'
import RootStyleRegistry from './emotion'
import Trpc from './trpc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [, setOpened] = useAtom(createTableFormDrawerOpened)
  debugger
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
                {!children?.props?.current && (
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
