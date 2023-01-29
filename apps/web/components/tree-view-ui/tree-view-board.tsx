import type { ITreeViewField, Table } from '@egodb/core'
import { trpc } from '../../trpc'
import { TreeView } from './tree-view'

interface IProps {
  table: Table
  field: ITreeViewField
  indentationWidth?: number
}

export const TreeViewBoard: React.FC<IProps> = ({ table, field, ...rest }) => {
  const listRecords = trpc.record.tree.list.useQuery({
    tableId: table.id.value,
    fieldId: field.id.value,
  })

  if (listRecords.isLoading) {
    // TODO: loading ui
    return null
  }

  return <TreeView table={table} field={field} records={listRecords.data?.records ?? []} {...rest} />
}
