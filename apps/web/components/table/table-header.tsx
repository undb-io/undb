import { EditTableFormDrawer } from '../edit-table-form/edit-table-form-drawer'
import { TableList } from './table-list'

export const TableHaeder: React.FC = () => {
  return (
    <>
      <TableList />

      <EditTableFormDrawer />
    </>
  )
}
