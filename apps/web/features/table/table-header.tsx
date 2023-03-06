import dynamic from 'next/dynamic'
import { TableList } from './table-list'

const UpdateTableFormDrawer = dynamic(() =>
  import('../update-table-form/update-table-form-drawer').then((m) => m.UpdateTableFormDrawer),
)

export const TableHaeder: React.FC = () => {
  return (
    <>
      <TableList />

      <UpdateTableFormDrawer />
    </>
  )
}
