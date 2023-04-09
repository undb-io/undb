import { AppShell, Box } from '@undb/ui'
import { Outlet } from 'react-router-dom'
import { TableList } from '../features/table/table-list'
import { CreateTableFormDrawer } from '../features/create-table-form'
import { Header } from '../features/header/header'

export const Root = () => {
  return (
    <AppShell padding={0}>
      <Box h="100vh" sx={{ overflow: 'hidden' }}>
        <Header />
        <TableList />
        <Outlet />
      </Box>

      <CreateTableFormDrawer />
    </AppShell>
  )
}

export default Root
