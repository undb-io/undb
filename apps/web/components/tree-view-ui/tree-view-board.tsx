import type { IQueryTreeRecord, ITreeViewField, Table } from '@egodb/core'
import Tree from 'react-d3-tree'
import type { RawNodeDatum } from 'react-d3-tree/lib/types/types/common'
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

  const traverse = (data: RawNodeDatum, r: IQueryTreeRecord) => {
    data.children = r.children.map((child) => {
      const nested: RawNodeDatum = { name: child.id }
      traverse(nested, child)
      return nested
    })
  }

  const data: RawNodeDatum = {
    name: 'root',
    children: listRecords.data?.records.map((record) => {
      const data: RawNodeDatum = { name: record.id }

      traverse(data, record as IQueryTreeRecord)

      return data
    }),
  }

  return <Tree data={data} translate={{ x: 100, y: 100 }} />
}
