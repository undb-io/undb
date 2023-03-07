import { Checkbox, Table, useListState } from '@egodb/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ACTIONS_FIELD, SELECTION_ID } from '../../constants/field.constants'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Th } from './th'
import { Tr } from './tr'
import type { RecordAllValueType } from '@egodb/core'
import { FieldValueFactory } from '../field-value/field-value.factory'
import { getTableSelectedRecordIds, setTableSelectedRecordIds } from '@egodb/store'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useVirtualizer } from '@tanstack/react-virtual'
import { RecordSelection } from './selection'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { ActionHeader } from './action-header'
import { Thead } from './thead'

const columnHelper = createColumnHelper<TData>()

const selection: ColumnDef<TData> = {
  enableResizing: false,
  id: SELECTION_ID,
  size: 40,
  header: (props) => {
    return (
      <th key={SELECTION_ID} style={{ width: '40px' }}>
        <Checkbox
          size="xs"
          checked={props.table.getIsAllRowsSelected()}
          onChange={props.table.getToggleAllRowsSelectedHandler()}
          indeterminate={props.table.getIsSomeRowsSelected()}
        />
      </th>
    )
  },
  cell: ({ row }) => <RecordSelection row={row} />,
}

const action = columnHelper.display({
  id: ACTIONS_FIELD,
  size: 50,
  header: () => <ActionHeader />,
  cell: (props) => <RecordActions row={props.row} />,
})

export const EGOTable: React.FC<IProps> = ({ records }) => {
  const table = useCurrentTable()

  const view = useCurrentView()
  const schema = table.schema.toIdMap()
  const columnVisibility = useMemo(() => view.getVisibility(), [view])
  const columnOrder = useMemo(() => table.getFieldsOrder(view), [table, view])
  const initialFields = useMemo(
    () => columnOrder.map((fieldId) => schema.get(fieldId)).filter(Boolean),
    [columnOrder, schema],
  )
  const [fields, handlers] = useListState(initialFields)

  const dispatch = useAppDispatch()
  const selectedRecordIds = useAppSelector((state) => getTableSelectedRecordIds(state, table.id.value))
  const [rowSelection, setRowSelection] = useState(selectedRecordIds)

  useEffect(() => {
    dispatch(setTableSelectedRecordIds({ tableId: table.id.value, ids: rowSelection }))
  }, [rowSelection])

  useEffect(() => {
    setRowSelection(selectedRecordIds)
  }, [selectedRecordIds])

  useLayoutEffect(() => {
    handlers.setState(initialFields)
  }, [table])

  const columns = [
    selection,
    ...fields.map((f) =>
      columnHelper.accessor(f.id.value, {
        id: f.id.value,
        enableResizing: true,
        header: (props) => (
          <Th key={f.id.value} column={props.column} field={f} header={props.header} index={props.header.index} />
        ),
        size: view.getFieldWidth(f.id.value),
        cell: (props) => {
          let value: RecordAllValueType = undefined

          if (f.type === 'id') {
            value = props.row.original.id
          } else if (f.type === 'created-at') {
            value = props.row.original.created_at
          } else if (f.type === 'updated-at') {
            value = props.row.original.updated_at
          } else if (f.type === 'auto-increment') {
            value = props.row.original.auto_increment
          } else {
            value = props.getValue()
          }

          return <FieldValueFactory field={f} value={value} displayValues={props.row.original.display_values} />
        },
      }),
    ),
    action,
  ]

  const data = useMemo(() => records.map((r) => r.valuesJSON), [records])
  const rt = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder: [SELECTION_ID, ...columnOrder, ACTIONS_FIELD],
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (r) => r.id,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  })
  const { rows } = rt.getRowModel()

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 100,
  })

  const paddingTop = rowVirtualizer.getVirtualItems().length > 0 ? rowVirtualizer.getVirtualItems()?.[0]?.start || 0 : 0
  const paddingBottom =
    rowVirtualizer.getVirtualItems().length > 0
      ? rowVirtualizer.getTotalSize() -
        (rowVirtualizer.getVirtualItems()?.[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)
      : 0

  return (
    <div ref={tableContainerRef} style={{ height: '100%', overflow: 'auto' }}>
      <Table
        withBorder
        highlightOnHover
        withColumnBorders
        verticalSpacing={5}
        sx={(theme) => ({
          borderCollapse: 'collapse',
          borderSpacing: 0,
          tableLayout: 'fixed',
          backgroundColor: theme.white,
          borderTop: '0',
          borderLeft: '0',
          borderRight: '0',
          borderBottom: '0',
          width: rt.getCenterTotalSize(),
          table: {
            border: '0',
          },
          thead: {
            margin: 0,
            position: 'sticky',
            top: 0,
            border: 0,
            zIndex: 100,
            backgroundColor: theme.white,
          },
          'thead tr': {
            border: '0',
            outline: '1px solid ' + theme.colors.gray[2],
          },
          'thead tr th': {
            position: 'relative',
            userSelect: 'none',
            backgroundColor: theme.white,
          },
          'tbody tr': {
            cursor: 'pointer',
            height: 32,
          },
          'tbody tr td': {
            borderRight: '1px solid ' + theme.colors.gray[2],
            borderBottom: '1px solid ' + theme.colors.gray[2],
            ':last-child': {
              border: '0',
            },
          },
          'tbody tr:hover td:last-child': {
            cursor: 'unset',
            backgroundColor: theme.white,
          },
        })}
      >
        <thead>
          {rt.getHeaderGroups().map((headerGroup) => (
            <Thead key={headerGroup.id} headerGroup={headerGroup} />
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return <Tr key={row.id} id={row.id} row={row} />
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
