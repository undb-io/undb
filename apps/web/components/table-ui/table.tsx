import type { SelectFieldValue, BoolFieldValue } from '@egodb/core'
import type { DateFieldValue } from '@egodb/core'
import type { DateRangeFieldValue } from '@egodb/core'
import { Checkbox, Table } from '@egodb/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { format } from 'date-fns/fp'
import { useMemo } from 'react'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { Option } from '../option/option'
import { AddFieldButton } from '../table/add-field.button'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Thead } from './thead'
import { Tr } from './tr'

const fieldHelper = createColumnHelper<TData>()

const dateFormat = format('yyyy-MM-dd')

export const EGOTable: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const columnVisibility = view.getVisibility()
  const columnOrder = table.getFieldsOrder(view).order

  const columns = table.schema.fields
    .map((f) =>
      fieldHelper.accessor(f.id.value, {
        id: f.id.value,
        enableResizing: true,
        size: view.getFieldWidth(f.id.value),
        cell: (props) => {
          if (f.type === 'select') {
            const option = (props.getValue() as SelectFieldValue)?.getOption(f).into()
            if (!option) return null
            return (
              <Option
                id={option.id.value}
                name={option.name.value}
                colorName={option.color.name}
                shade={option.color.shade}
              />
            )
          }
          if (f.type === 'bool') {
            return (
              <Checkbox h="100%" lh={1} readOnly checked={(props.getValue() as BoolFieldValue)?.unpack() ?? false} />
            )
          }
          if (f.type === 'date') {
            const date = (props.getValue() as DateFieldValue)?.unpack()
            return date && dateFormat(date)
          }
          if (f.type === 'date-range') {
            const date = (props.getValue() as DateRangeFieldValue)?.unpack()
            return date && `${dateFormat(date[0])} - ${dateFormat(date[1])}`
          }
          return props.getValue()?.unpack()?.toString()
        },
      }),
    )
    .concat(
      fieldHelper.display({
        id: ACTIONS_FIELD,
        header: () => <AddFieldButton />,
        cell: (props) => <RecordActions tableId={table.id.value} row={props.row} />,
      }),
    )

  const data = useMemo(() => records.map((r) => r.valuesJSON), [records])
  const rt = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
    },
    getRowId: (r) => r.id,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table
      highlightOnHover
      withBorder
      withColumnBorders
      verticalSpacing={5}
      sx={(theme) => ({
        backgroundColor: theme.white,
        borderTop: '0',
        borderLeft: '0',
        borderBottom: data.length ? '1px solid ' + theme.colors.gray[2] : '0',
        width: rt.getCenterTotalSize(),
        'thead th': {
          backgroundColor: theme.white,
        },
      })}
    >
      <thead>
        {rt.getHeaderGroups().map((headerGroup) => (
          <Thead headerGroup={headerGroup} key={headerGroup.id} tableId={table.id.value} />
        ))}
      </thead>
      <tbody>
        {rt.getRowModel().rows.map((row, index) => (
          <Tr key={row.id} id={records[index].id.value} row={row} />
        ))}
      </tbody>
    </Table>
  )
}
