import type { ITreeViewField, Table } from '@egodb/core'
import { trpc } from '../../trpc'

interface IProps {
  table: Table
  field: ITreeViewField
}
export const TreeViewBoard: React.FC<IProps> = ({ table, field }) => {
  const listRecords = trpc.record.tree.list.useQuery({
    tableId: table.id.value,
    fieldId: field.id.value,
  })

  return <>hello1</>
}
