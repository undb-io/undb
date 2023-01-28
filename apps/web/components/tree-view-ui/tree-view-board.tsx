import type { IQueryTreeRecord, ITreeViewField, Table } from '@egodb/core'
import { Box } from '@egodb/ui'
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

  return (
    <Box
      h="100%"
      sx={{
        '.rd3t-tree-container .rd3t-svg .rd3t-g': {
          ' .node__root': {
            opacity: '0 !important',
          },
          'path:first-child': {
            opacity: '0 !important',
          },
        },
      }}
    >
      <Tree data={data} translate={{ x: 50, y: 200 }} rootNodeClassName="node__root" />
    </Box>
  )
}
