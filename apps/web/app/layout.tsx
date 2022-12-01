'use client'
import { Aside, Box } from '@egodb/ui'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { TableNavList } from '../components/tables-list-nav/table-list-nav'
import RootStyleRegistry from './emotion'
import Trpc from './trpc'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CH">
      <head />
      <body>
        <RootStyleRegistry>
          <Trpc>
            <Box display="flex">
              <TableNavList />
              <Aside>{children}</Aside>
            </Box>
            <CreateTableFormDrawer />
          </Trpc>
        </RootStyleRegistry>
      </body>
    </html>
  )
}
