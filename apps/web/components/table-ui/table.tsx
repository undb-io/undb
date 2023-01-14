import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { SelectFieldValue, BoolFieldValue } from '@egodb/core'
import type { DateFieldValue } from '@egodb/core'
import type { DateRangeFieldValue } from '@egodb/core'
import { ActionIcon, Checkbox, IconColumnInsertRight, openContextModal, Table, Tooltip, useListState } from '@egodb/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { format } from 'date-fns/fp'
import { useLayoutEffect, useMemo } from 'react'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { CREATE_FIELD_MODAL_ID } from '../../modals'
import { trpc } from '../../trpc'
import { Option } from '../option/option'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Th } from './th'
import { Tr } from './tr'

const fieldHelper = createColumnHelper<TData>()

const dateFormat = format('yyyy-MM-dd')

export const EGOTable: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const columnVisibility = view.getVisibility()
  const columnOrder = table.getFieldsOrder(view).order
  const [fields, handlers] = useListState(table.schema.fields)

  useLayoutEffect(() => {
    handlers.setState(table.schema.fields)
  }, [table])

  const utils = trpc.useContext()
  const moveField = trpc.table.view.field.move.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const items = fields.map((f) => f.id.value)
  const columns = fields
    .map((f) =>
      fieldHelper.accessor(f.id.value, {
        id: f.id.value,
        enableResizing: true,
        header: (props) => (
          <Th key={f.id.value} column={props.column} field={f} header={props.header} tableId={table.id.value} />
        ),
        size: view.getFieldWidth(f.id.value),
        cell: (props) => {
          if (f.type === 'select') {
            const option = (props.getValue() as SelectFieldValue)?.getOption(f).into()
            if (!option) return null
            return <Option name={option.name.value} colorName={option.color.name} shade={option.color.shade} />
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
        header: () => (
          <th style={{ borderBottom: '0' }}>
            <Tooltip label="Add New Field">
              <ActionIcon
                onClick={() =>
                  openContextModal({
                    title: 'Create New Field',
                    modal: CREATE_FIELD_MODAL_ID,
                    innerProps: { table },
                  })
                }
              >
                <IconColumnInsertRight />
              </ActionIcon>
            </Tooltip>
          </th>
        ),
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
      withBorder
      highlightOnHover
      withColumnBorders
      verticalSpacing={5}
      sx={(theme) => ({
        backgroundColor: theme.white,
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        borderBottom: '0',
        width: rt.getCenterTotalSize(),
        table: {
          border: '0',
        },
        'thead tr': {
          border: '0',
        },
        'thead tr th': {
          position: 'relative',
          userSelect: 'none',
          backgroundColor: theme.white,

          ':last-child': {
            border: '1px red solid',
          },
        },
        'tbody tr': {
          transition: '0.22s',
          cursor: 'pointer',
        },
        'tbody tr td': {
          borderRight: '1px solid ' + theme.colors.gray[2],
          borderBottom: '1px solid ' + theme.colors.gray[2],
          ':last-child': {
            border: '0',
          },
        },
        'tbody tr:hover td:last-child': {
          // backgroundColor: theme.white,
        },
      })}
    >
      <thead>
        {rt.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            <DndContext
              sensors={sensors}
              collisionDetection={rectIntersection}
              modifiers={[restrictToHorizontalAxis]}
              onDragEnd={({ over, active }) => {
                if (over) {
                  handlers.reorder({
                    from: active.data.current?.sortable?.index,
                    to: over?.data.current?.sortable?.index,
                  })
                  moveField.mutate({ tableId: table.id.value, from: active.id as string, to: over.id as string })
                }
              }}
            >
              <SortableContext items={items} strategy={horizontalListSortingStrategy}>
                {headerGroup.headers.map((header) => flexRender(header.column.columnDef.header, header.getContext()))}
              </SortableContext>
            </DndContext>
          </tr>
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
