'use client'
import { AppShell } from '@egodb/ui'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { TableNavList } from '../components/tables-list-nav/table-list-nav'
import { AtomsDevtools } from './atom-devtool'
import RootStyleRegistry from './emotion'
import Trpc from './trpc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <CreateTableFormDrawer />
              </AppShell>
            </Trpc>
          </RootStyleRegistry>
        </AtomsDevtools>
      </body>
    </html>
  )
}
