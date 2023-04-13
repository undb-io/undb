import { Box, Table, useListState } from '@undb/ui'
import type { ColumnDef, ColumnPinningState, OnChangeFn, Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ACTIONS_FIELD, SELECTION_ID } from '../../constants/field.constants'
import { ActionsCell } from './actions-cell'
import type { IProps, TData } from './interface'
import { Th } from './th'
import {
  getTableSelectedRecordIds,
  setSelectedRecordId,
  setTableSelectedRecordIds,
  useSetPinnedFieldsMutation,
} from '@undb/store'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useVirtualizer } from '@tanstack/react-virtual'
import { SelectionCell } from './selection-cell'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { ActionsHeader } from './actions-header'
import { SelectionHeader } from './selection-header'
import type { ISetPinnedFieldsCommandInput } from '@undb/cqrs'
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
  header: (props) => <ActionsHeader table={props.table} />,
  cell: (props) => <ActionsCell row={props.row} table={props.table} />,
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
    dispatch(setTableSelectedRecordIds({ tableId: table.id.value, ids: rowSelection }))
  }, [rowSelection])

  const onColumnPinningChange: OnChangeFn<ColumnPinningState> = useCallback(
    (state) => {
      setColumnPinning(state)
      const next = typeof state === 'function' ? state(columnPinning) : state
      const { left: [, ...left] = [], right = [] } = next
      const pinned: ISetPinnedFieldsCommandInput['pinnedFields'] = {
        left,
        right,
      }
      setPinnedFields({ tableId: table.id.value, viewId: view.id.value, pinnedFields: pinned })
    },
    [columnPinning, setPinnedFields, table.id.value, view.id.value],
  )

  useEffect(() => {
    setRowSelection(selectedRecordIds)
  }, [selectedRecordIds])

  useLayoutEffect(() => {
    handlers.setState(initialFields)
  }, [table])

  const columns = useMemo(
    () => [
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
    ],
    [fields],
  )

  const data = useMemo(() => records.map((r) => r.valuesJSON), [records])
  const rt = useReactTable({
    data,
    meta: {
      tableId: table.id.value,
    },
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
    onColumnPinningChange,
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
    <Box ref={tableContainerRef} h="100%" sx={{ overflowY: 'scroll' }}>
      <Table
        withBorder
        highlightOnHover
        withColumnBorders
        verticalSpacing={5}
        w={rt.getTotalSize()}
        sx={[
          tableStyles,
          (theme) => ({ 'thead tr th': { borderBottom: rows.length ? '1px sold ' + theme.colors.gray[2] : 0 } }),
        ]}
      >
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
            return (
              <Record
                key={row.id}
                row={row}
                checked={row.getIsSelected()}
                columnLength={columns.length}
                tableId={table.id.value}
              />
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </Table>
    </Box>
  )
}

const Record: React.FC<{ row: Row<TData>; checked: boolean; columnLength: number; tableId: string }> = React.memo(
  ({ row }) => {
    const dispatch = useAppDispatch()

    return (
      <tr
        onClick={() => {
          dispatch(setSelectedRecordId(row.id))
        }}
      >
        {row.getVisibleCells().map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext()))}
      </tr>
    )
  },
)

export default EGOTable
