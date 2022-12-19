import { DndContext } from '@dnd-kit/core'
import { Table } from '@egodb/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { AddFieldButton } from '../table/add-field.button'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Thead } from './thead'
import { Tr } from './tr'

const fieldHelper = createColumnHelper<TData>()

export const EGOTable: React.FC<IProps> = ({ table, records }) => {
  const view = table.getOrCreateDefaultView()
  const columnVisibility = view.getVisibility()
  const columnOrder = table.getFieldsOrder().order

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
        id: ACTIONS_FIELD,
        header: () => <AddFieldButton />,
        cell: (props) => <RecordActions row={props.row} />,
      }),
    )

  const data = useMemo(() => records.map((r) => r.values), [records])
  const rt = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DndContext>
      <Table
        highlightOnHover
        withBorder
        withColumnBorders
        sx={{
          backgroundColor: 'white',
          width: rt.getCenterTotalSize(),
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
    </DndContext>
  )
}
