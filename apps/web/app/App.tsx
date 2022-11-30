'use client'

import { AppShell, Header } from '@egodb/ui'
import { EGOTable } from '@egodb/table-ui'
import { CreateTableFormDrawer } from '../components/create-table-form'
import { TableNavList } from '../components/tables-list-nav/table-list-nav'

export default function App() {
  return (
    <>
      <AppShell
        padding="md"
        navbar={<TableNavList />}
        header={
          <Header height={60} p="xs">
            {/* Header content */}
          </Header>
        }
      >
        <EGOTable />
      </AppShell>
      <CreateTableFormDrawer />
    </>
  )
}
