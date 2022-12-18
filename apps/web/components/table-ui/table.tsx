import { Table } from '@egodb/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Thead } from './thead'
import { Tr } from './tr'

const fieldHelper = createColumnHelper<TData>()

export const EGOTable: React.FC<IProps> = ({ table, records }) => {
  const view = table.getOrCreateDefaultView()

  const columns = table.schema.fields
    .map((c) =>
      fieldHelper.accessor(c.name.value, {
        id: c.name.value,
        enableResizing: true,
        size: view.getFieldWidth(c.name.value),
      }),
    )
    .concat(
      fieldHelper.display({
        id: 'actions',
        cell: (props) => <RecordActions row={props.row} />,
      }),
    )

  const data = useMemo(() => records.map((r) => r.values), [records])
  const rt = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <Table
        withBorder
        withColumnBorders
        highlightOnHover
        sx={{
          backgroundColor: 'white',
          width: rt.getCenterTotalSize(),
          'thead tr th': {
            padding: 0,
          },
        }}
      >
        <thead>
          {rt.getHeaderGroups().map((headerGroup) => (
            <Thead headerGroup={headerGroup} key={headerGroup.id} tableId={table.id.value} />
          ))}
        </thead>
        <tbody>
          {rt.getRowModel().rows.map((row) => (
            <Tr key={row.id} row={row} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
