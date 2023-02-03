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
import { ActionIcon, IconColumnInsertRight, openContextModal, Table, Tooltip, useListState } from '@egodb/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useLayoutEffect, useMemo } from 'react'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { CREATE_FIELD_MODAL_ID } from '../../modals'
import { trpc } from '../../trpc'
import { RecordActions } from './actions'
import type { IProps, TData } from './interface'
import { Th } from './th'
import { Tr } from './tr'
import type { RecordAllValueType } from '@egodb/core'
import { FieldValueFactory } from '../field-value/field-value.factory'

const fieldHelper = createColumnHelper<TData>()

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
        },
        'tbody tr': {
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
          cursor: 'unset',
          backgroundColor: theme.white,
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
