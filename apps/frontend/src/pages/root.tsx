import { AppShell, Stack } from '@egodb/ui'
import { Outlet } from 'react-router-dom'
import { TableList } from '../features/table/table-list'
import { CreateTableFormDrawer } from '../features/create-table-form'

export const Root = () => {
  return (
    <AppShell padding={0}>
      <Stack h="100vh" spacing={0} sx={{ overflow: 'hidden' }}>
        <TableList />
        <Outlet />
      </Stack>

      <CreateTableFormDrawer />
    </AppShell>
  )
}
