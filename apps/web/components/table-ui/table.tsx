import { Checkbox, Table } from '@egodb/ui'
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
  const view = table.mustGetView()
  const columnVisibility = view.getVisibility()
  const columnOrder = table.getFieldsOrder(view).order

  const columns = table.schema.fields
    .map((f) =>
      fieldHelper.accessor(f.name.value, {
        id: f.name.value,
        enableResizing: true,
        size: view.getFieldWidth(f.name.value),
        cell: (props) => {
          if (f.type === 'select' && typeof props.getValue() === 'string') {
            return f.options.getById(props.getValue() as string).mapOr('', (o) => o.name.value)
          }
          if (f.type === 'bool') {
            return <Checkbox defaultChecked={props.getValue() as boolean} />
          }
          return props.getValue()?.toString()
        },
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
    <Table
      highlightOnHover
      withBorder
      withColumnBorders
      sx={{
        width: rt.getCenterTotalSize(),
        'thead th': {
          backgroundColor: 'white',
        },
      }}
    >
      <thead>
        {rt.getHeaderGroups().map((headerGroup) => (
          <Thead headerGroup={headerGroup} key={headerGroup.id} tableId={table.id.value} />
        ))}
      </thead>
      <tbody>
        {rt.getRowModel().rows.map((row, index) => (
          <Tr key={row.id} id={records[index].id} row={row} />
        ))}
      </tbody>
    </Table>
  )
}
