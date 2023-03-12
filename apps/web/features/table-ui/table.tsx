import { Table, useListState } from '@egodb/ui'
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table'
import { flexRender, Row } from '@tanstack/react-table'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ACTIONS_FIELD, SELECTION_ID } from '../../constants/field.constants'
import { ActionsCell } from './actions-cell'
import type { IProps, TData } from './interface'
import { Th } from './th'
import {
  getTableSelectedRecordIds,
  setSelectedRecordId,
  setTableSelectedRecordIds,
  useSetPinnedFieldsMutation,
} from '@egodb/store'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useVirtualizer } from '@tanstack/react-virtual'
import { SelectionCell } from './selection-cell'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { ActionsHeader } from './actions-header'
import { SelectionHeader } from './selection-header'
import type { ISetPinnedFieldsCommandInput } from '@egodb/cqrs/dist'
import { Cell } from './cell'
import { tableStyles } from './styles'

const columnHelper = createColumnHelper<TData>()

const selection: ColumnDef<TData> = {
  enableResizing: false,
  id: SELECTION_ID,
  enablePinning: true,
  size: 40,
  header: (props) => <SelectionHeader table={props.table} />,
  cell: ({ row }) => <SelectionCell row={row} />,
}

const action = columnHelper.display({
  id: ACTIONS_FIELD,
  size: 50,
  header: () => <ActionsHeader />,
  cell: (props) => <ActionsCell row={props.row} />,
})

export const EGOTable: React.FC<IProps> = ({ records }) => {
  const table = useCurrentTable()

  const view = useCurrentView()
  const schema = table.schema.toIdMap()
  const columnVisibility = useMemo(() => view.getVisibility(), [view])
  const pinned = useMemo(() => view.pinnedFields?.toJSON() ?? { left: [], right: [] }, [view])
  const columnOrder = useMemo(() => table.getFieldsOrder(view), [table, view])
  const initialFields = useMemo(
    () => columnOrder.map((fieldId) => schema.get(fieldId)).filter(Boolean),
    [columnOrder, schema],
  )
  const [fields, handlers] = useListState(initialFields)
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [SELECTION_ID, ...pinned.left],
    right: pinned.right,
  })

  const dispatch = useAppDispatch()
  const selectedRecordIds = useAppSelector((state) => getTableSelectedRecordIds(state, table.id.value))
  const [rowSelection, setRowSelection] = useState(selectedRecordIds)

  const [setPinnedFields] = useSetPinnedFieldsMutation()

  useEffect(() => {
    const { left: [, ...left] = [], right = [] } = columnPinning
    const pinned: ISetPinnedFieldsCommandInput['pinnedFields'] = {
      left,
      right,
    }
    setPinnedFields({ tableId: table.id.value, viewId: view.id.value, pinnedFields: pinned })
  }, [columnPinning, setPinnedFields])

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
        enablePinning: true,
        header: (props) => (
          <Th key={f.id.value} column={props.column} field={f} header={props.header} index={props.header.index} />
        ),
        size: view.getFieldWidth(f.id.value),
        cell: (props) => <Cell cell={props} field={f} />,
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
      columnPinning,
      rowSelection,
    },
    getRowId: (r) => r.id,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    enableRowSelection: true,
    enablePinning: true,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
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
      <Table withBorder highlightOnHover withColumnBorders verticalSpacing={5} w={rt.getTotalSize()} sx={tableStyles}>
        <thead>
          {rt.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => flexRender(header.column.columnDef.header, header.getContext()))}
            </tr>
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
            return <Row key={row.id} row={row} checked={row.getIsSelected()} />
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

// eslint-disable-next-line react/display-name
const Row: React.FC<{ row: Row<TData>; checked: boolean }> = React.memo(({ row }) => {
  const dispatch = useAppDispatch()

  return (
    <tr
      key={row.id}
      onClick={() => {
        dispatch(setSelectedRecordId(row.id))
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return flexRender(cell.column.columnDef.cell, cell.getContext())
      })}
    </tr>
  )
})
