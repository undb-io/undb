import { AppShell, Stack } from '@undb/ui'
import { Outlet } from 'react-router-dom'
import { TableList } from '../features/table/table-list'
import { CreateTableFormDrawer } from '../features/create-table-form'
import { Header } from '../features/header/header'

export const Root = () => {
  return (
    <AppShell padding={0}>
      <Stack h="100vh" spacing={0} sx={{ overflow: 'hidden' }}>
        <Header />
        <TableList />
        <Outlet />
      </Stack>

      <CreateTableFormDrawer />
    </AppShell>
  )
}

export default Root
